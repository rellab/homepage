<?php

// function mysql_connect($host,$user,$pass){
// 	global $mysqli_connect;
// 	$mysqli_connect = mysqli_connect($host,$user,$pass);
// 	return $mysqli_connect;
// }
//
// function mysql_select_db($dbname,$con=""){
// 	global $mysqli_connect;
// 	return mysqli_select_db($mysqli_connect,$dbname);
// }
//
// function mysql_query($sql){
// 	global $mysqli_connect;
// 	return mysqli_query($mysqli_connect,$sql);
// }
//
// function mysql_real_escape_string($str){
// 	global $mysqli_connect;
// 	return mysqli_real_escape_string ($mysqli_connect,$str);
// }
//
// function mysql_num_rows($rst){
// 	return mysqli_num_rows($rst);
// }
//
// function mysql_result($rst,$row,$field){
// 	$rst->data_seek($row);
// 	$datarow = $rst->fetch_array();
// 	return $datarow[$field];
// }
//
// function mysql_fetch_row($rst){
// 	return mysqli_fetch_row($rst);
// }
//
// function mysql_fetch_assoc($rst){
// 	return mysqli_fetch_assoc($rst);
// }
//
// function mysql_insert_id(){
// 	global $mysqli_connect;
// 	return mysqli_insert_id($mysqli_connect);
// }
//
// function mysql_num_fields($rst){
// 	return mysqli_num_fields($rst);
// }
//
// function mysql_data_seek($rst,$i){
// 	return mysqli_data_seek($rst,$i);
// }
//
// function mysql_field_name($rst,$i){
// 	$finfo = mysqli_fetch_field_direct($rst,$i);
// 	return $finfo->name;
// }
//
// function mysql_affected_rows(){
// 	global $mysqli_connect;
// 	return mysqli_affected_rows($mysqli_connect);
// }
//
// function mysql_free_result($rst){
// 	return mysqli_free_result($rst);
// }
//
// function mysql_error(){
// 	global $mysqli_connect;
// 	return mysqli_error($mysqli_connect);
// }
//
// function mysql_close($mysqli_connect){
// 	return mysqli_close($mysqli_connect);
// }

function inputEscape($str) {
  $str = mb_convert_encoding($str, "UTF-8", "UTF-8");
  return htmlentities($str, ENT_QUOTES, "UTF-8");
}

function selectTableSQL($link, $tbl, $type, $sortkey, $startdate) {
  // send a select query
  $sql = "SELECT * FROM ".$tbl." WHERE EndDate >= '".$startdate."'";
  $sql .= " and Type = ".$type;
  $sql .= " ORDER BY ".$sortkey;
  $result = mysql_query($sql, $link)
  or die("Error: Fail to send a query.<br />SQL: ".$sql);
  return $result;
}

function selectLikeTableSQL($link, $tbl, $type, $sortkey, $startdate, $word) {
  // send a select query
  $sql = "SELECT * FROM ".$tbl." WHERE EndDate >= '".$startdate."'";
  $sql .= " and Type = ".$type." and (";
  $sql .= " ConfName LIKE '%".$word."%' or";
  $sql .= " Location LIKE '%".$word."%' or";
  $sql .= " Remarks LIKE '%".$word."%'";
  $sql .= ") ORDER BY ".$sortkey;
  $result = mysql_query($sql, $link)
  or die("Error: Fail to send a query.<br />SQL: ".$sql);
  return $result;
}

function changeDate($str) {
  $date = strptime($str, "%Y-%m-%d");
  $year = $date['tm_year'] + 1900;
  $month = $date['tm_mon'] + 1;
  $day = $date['tm_mday'];
  return array($year, $month, $day);
}

function makeConfDate($start, $end) {
  list ($byear, $bmonth, $bday) = changeDate($start);
  list ($eyear, $emonth, $eday) = changeDate($end);
  $result = "";
  if ($byear != 1900) {
    $result .= sprintf("%d/%d/%d", $byear, $bmonth, $bday);
    if ($eyear != 1900) {
      if ($byear != $eyear) {
        $result .= sprintf("-%d/%d/%d", $eyear, $emonth, $eday);
      } else if ($bmonth != $emonth) {
        $result .= sprintf("-%d/%d", $emonth, $eday);
      } else if ($bday != $eday) {
        $result .= sprintf("-%d", $eday);
      }
    }
  }
  return $result;
}

function formatTable($result) {
  // get the number of rows of the result
  $rows = mysql_num_rows($result);

  // print result
  $html = "";
  if($rows){
    while($row = mysql_fetch_assoc($result)) {
      // conference date
      $html .= "<tr id=\"".$row["ConfID"]."\" name=\"".$row["ConfID"]."\"><td>";
      $html .= makeConfDate($row["BeginDate"], $row["EndDate"])."</td>";
      // conference name
      $html .= "<td><a href=\"".$row["URL"]."\" target=\"_blank\">";
      $html .= $row["ConfName"]."</a></td>";
      // location
      $html .= "<td>".$row["Location"]."</td>";
      // deadline
      list ($dyear, $dmonth, $dday) = changeDate($row["Deadline"]);
      // deadline check
      if ($dyear != 1900) {
        $attr = "";
        if(mktime(23, 59, 59, $dmonth, $dday, $dyear) < time()) {
          // deadline pass
          $attr = " style=\"text-decoration:line-through;\"";
        } else if(mktime(23, 59, 59, $dmonth, $dday, $dyear)
        < time() + 60*60*24*30) {
          // 30 days left
          $attr = " style=\"color:red;\"";
        }
        $html .= "<td ".$attr.">";
        $html .= sprintf("%d/%d/%d</td>", $dyear, $dmonth, $dday);
      } else {
        $html .= "<td>&nbsp;</td>";
      }
      // remarks
      $html .= "<td>".$row["Remarks"]."</td>";
      $html .= "</tr>\n";
    }
  }
  return $html;
}

// main

require_once "DB.php";

if (isset($_GET['key'])) {
  $key = inputEscape($_GET['key']);
  if (strlen($key) == 0) {
    $key = "sdate";
  }
  $type = inputEscape($_GET['type']);
  if ($type != 1 and $type != 2) {
    exit;
  }
  $rev = inputEscape($_GET['rev']);
  $word = inputEscape($_GET['word']);
  $startdate = inputEscape($_GET['sdate']);
  if ($startdate === "") {
    $startdate = date("Y-m-d");
  }

  $keylist = array("sdate" => "BeginDate",
  "edate" => "EndDate",
  "name" => "ConfName",
  "location" => "Location",
  "ddate" => "Deadline",
  "remark" => "Remarks"
);

if ($rev == 1) {
  $desc = " DESC";
} else {
  $desc = "";
}

$sortkey = $keylist[$key].$desc;

// connect to MySQL
$link = mysql_connect($url, $user, $pass)
or die("Error: Fail to access MySQL.");
mysql_query('SET NAMES latin1', $link);
$sdb = mysql_select_db($db, $link)
or die("Error: Fail to access database.");

if ($word === "") {
  $result = selectTableSQL($link, $tbl, $type, $sortkey, $startdate);
} else {
  $result = selectLikeTableSQL($link, $tbl, $type, $sortkey, $startdate, $word);
}
$str = formatTable($result);

// free memory for the result
mysql_free_result($result);

// close MySQL connection
mysql_close($link)
or die("Error: Fail to close the connection");

print $str;
exit;
}
?>
