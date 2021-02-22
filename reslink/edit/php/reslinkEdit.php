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

function selectAllRecordSQL($link, $tbl, $type) {
  // send a select query
  $sql = "SELECT * FROM ".$tbl." WHERE Type = ".$type;
  $sql .= " ORDER BY ConfID DESC LIMIT 100";
  $result = mysql_query($sql, $link)
    or die("Error: Fail to send a query.<br />SQL: ".$sql);
  return $result;
}

function selectLikeRecordSQL($link, $tbl, $type, $word) {
  // send a select query
  $sql = "SELECT * FROM ".$tbl." WHERE ";
  $sql .= " Type = ".$type." and (";
  $sql .= " ConfName LIKE '%".$word."%' or";
  $sql .= " Location LIKE '%".$word."%' or";
  $sql .= " Remarks LIKE '%".$word."%'";
  $sql .= ") ORDER BY ConfID DESC LIMIT 100";
  $result = mysql_query($sql, $link)
    or die("Error: Fail to send a query.<br />SQL: ".$sql);
  return $result;
}

function selectOneRecordSQL($link, $tbl, $id) {
  // send a select query
  $sql = "SELECT * FROM ".$tbl." WHERE ConfID = ".$id;
  $result = mysql_query($sql, $link)
    or die("Error: Fail to send a query.<br />SQL: ".$sql);
  return $result;
}

function makeID() {
  return time().mt_rand(0,99);
}

function insertNewRecordSQL($link, $tbl, $id, $type) {
  // send an insert query
  $sql = "INSERT INTO ".$tbl." (ConfID, Type) VALUES ('".$id."', '".$type."')";
  $result = mysql_query($sql, $link)
    or die("Error: Fail to send a query.<br />SQL: ".$sql);
  return $result;
}

function updateColumnSQL($link, $tbl, $id, $field, $value) {
  // send an update query
  $sql = "UPDATE ".$tbl." SET ".$field." = '".$value;
  $sql .= "' WHERE ConfID = ".$id;
  $result = mysql_query($sql, $link)
    or die("Error: Fail to send a query. SQL: ".$sql);
  return $result;
}

function deleteRecordSQL($link, $tbl, $id) {
  // send an update query
  $sql = "DELETE FROM ".$tbl;
  $sql .= " WHERE ConfID = ".$id;
  $result = mysql_query($sql, $link)
    or die("Error: Fail to send a query. SQL: ".$sql);
  return $result;
}

function changeDate($str) {
  $date = strptime($str, "%Y-%m-%d");
  $year = $date['tm_year'] + 1900;
  $month = $date['tm_mon'] + 1;
  $day = $date['tm_mday'];
  return array($year, $month, $day);
}

function makeFormattedDate($str) {
  list ($year, $month, $day) = changeDate($str);
  if ($year != 1900) {
    $result = sprintf("%d/%d/%d", $year, $month, $day);
  } else {
    $result = "";
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
      $html .= "<tr id=\"".$row["ConfID"]."\" name=\"".$row["ConfID"]."\" ";
//      $html .= "onclick=\"edit_record(this.id)";
//      $html .= "onfocus=\"\" ";
//      $html .= "onblur=\"\" ";
      $html .= " class=\"norm\">";
      $html .= "<td class=\"menu\"></td>";
      if (strlen($row["BeginDate"]) == 0) {
        $html .= "<td class=\"date\">&nbsp;</td>";
      } else {
        $html .= "<td class=\"date\">".makeFormattedDate($row["BeginDate"])."</td>";
      }
      $html .= "<td class=\"date\">".makeFormattedDate($row["EndDate"])."</td>";
      $html .= "<td class=\"text\">".$row["ConfName"]."</td>";
//      $html .= "<td class=\"text\">".inputEscape($row["URL"])."</td>";
      $html .= "<td class=\"text\">".$row["URL"]."</td>";
      $html .= "<td class=\"text\">".$row["Location"]."</td>";
      $html .= "<td class=\"date\">".makeFormattedDate($row["Deadline"])."</td>";
      $html .= "<td class=\"text\">".$row["Remarks"]."</td>";
      $html .= "</tr>\n";
    }
  }
  return $html;
}

function makeEditBox($id, $str, $type, $class) {
   $html = "<input type=\"".$type."\" id=\"".$id."\" name=\"".$id."\" ";
   $html .= "class=\"".$class."\"value=\"".$str."\" />";
   return $html;
}

function formatEditTable($id, $result) {
  // get the number of rows of the result
  $rows = mysql_num_rows($result);
  if ($rows != 1) {
	exit;
  }

  // print result
  $html = "";
  while($row = mysql_fetch_assoc($result)) {
//    $html .= "<td class=\"menu\"></td>";
//    $html .= "<td class=\"date\">".makeEditBox($id."sdateval", $row["BeginDate"], "text", "date")."</td>";
//    $html .= "<td class=\"date\">".makeEditBox($id."edateval", $row["EndDate"], "text", "date")."</td>";
//    $html .= "<td class=\"text\">".makeEditBox($id."confval", $row["ConfName"], "text", "text")."</td>";
//    $html .= "<td class=\"text\">".makeEditBox($id."urlval", $row["URL"], "text", "text")."</td>";
//    $html .= "<td class=\"text\">".makeEditBox($id."locationval", $row["Location"], "text", "text")."</td>";
//    $html .= "<td class=\"date\">".makeEditBox($id."ddateval", $row["Deadline"], "text", "date")."</td>";
//    $html .= "<td class=\"text\">".makeEditBox($id."remarkval", $row["Remarks"], "text", "text")."</td>";
    $html .= "<td class=\"menu\"></td>";
    $html .= "<td colspan=7 class=\"text\">";
    $html .= "Start Date: ".makeEditBox($id."sdateval", makeFormattedDate($row["BeginDate"]), "text", "date")."<br/>";
    $html .= "End Date: ".makeEditBox($id."edateval", makeFormattedDate($row["EndDate"]), "text", "date")."<br/>";
    $html .= "Conference Name: ".makeEditBox($id."confval", $row["ConfName"], "text", "text")."<br/>";
    $html .= "URL: ".makeEditBox($id."urlval", $row["URL"], "text", "text")."<br/>";
    $html .= "Location: ".makeEditBox($id."locationval", $row["Location"], "text", "text")."<br/>";
    $html .= "Deadline: ".makeEditBox($id."ddateval", makeFormattedDate($row["Deadline"]), "text", "date")."<br/>";
    $html .= "Remarks: ".makeEditBox($id."remarkval", $row["Remarks"], "text", "text")."</td>";
  }
  return $html;
}

function formatOneTable($result) {
  // get the number of rows of the result
  $rows = mysql_num_rows($result);
  if ($rows != 1) {
	exit;
  }

  // print result
  $html = "";
  while($row = mysql_fetch_assoc($result)) {
    $html .= "<td class=\"menu\"></td>";
   if (strlen($row["BeginDate"]) == 0) {
    $html .= "<td class=\"date\">&nbsp;</td>";
   } else {
    $html .= "<td class=\"date\">".makeFormattedDate($row["BeginDate"])."</td>";
   }
    $html .= "<td class=\"date\">".makeFormattedDate($row["EndDate"])."</td>";
    $html .= "<td class=\"text\">".$row["ConfName"]."</td>";
//    $html .= "<td class=\"text\">".inputEscape($row["URL"])."</td>";
    $html .= "<td class=\"text\">".$row["URL"]."</td>";
    $html .= "<td class=\"text\">".$row["Location"]."</td>";
    $html .= "<td class=\"date\">".makeFormattedDate($row["Deadline"])."</td>";
    $html .= "<td class=\"text\">".$row["Remarks"]."</td>";
  }
  return $html;
}

require_once "DB.php";

if (isset($_POST['mode'])) {
  $req_mode = inputEscape($_POST['mode']);
  if (strlen($req_mode) == 0) {
    exit;
  }
  $type = inputEscape($_POST['type']);
//  if ($type != 1 and $type != 2) {
//    exit;
//  }
  $word = inputEscape($_POST['word']);

  // connect to MySQL
  $link = mysql_connect($url, $user, $pass)
    or die("Error: Fail to access MySQL.");
  mysql_query('SET NAMES latin1', $link);
  $sdb = mysql_select_db($db, $link)
    or die("Error: Fail to access database.");

  switch ($req_mode) {
  case "load":
    if ($word === "") {
      $result = selectAllRecordSQL($link, $tbl, $type);
    } else {
      $result = selectLikeRecordSQL($link, $tbl, $type, $word);
    }
    //$result = selectAllRecordSQL($link, $tbl, $type);
    $str = formatTable($result);
    break;
  case "editone":
    $id = inputEscape($_POST['record']);
    $result = selectOneRecordSQL($link, $tbl, $id);
    $str = formatEditTable($id, $result);
    break;
  case "loadone":
    $id = inputEscape($_POST['record']);
    $result = selectOneRecordSQL($link, $tbl, $id);
    $str = formatOneTable($result);
    break;
  case "new":
    $id = makeID();
    $result = insertNewRecordSQL($link, $tbl, $id, $type);
    break;
  case "update":
    $id = inputEscape($_POST['record']);
    $field = inputEscape($_POST['field']);
    $value = inputEscape($_POST['value']);
    $result = updateColumnSQL($link, $tbl, $id, $field, $value);
    break;
  case "delete":
    $id = inputEscape($_POST['record']);
    $result = deleteRecordSQL($link, $tbl, $id);
    break;
  }

  // free memory for the result
  mysql_free_result($result);

  // close MySQL connection
  mysql_close($link)
    or die("Error: Fail to close the connection");

  print $str;
  exit;
}

?>
