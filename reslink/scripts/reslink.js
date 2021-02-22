var key, type, rev;

function load_data() {
	var word = $F('searchtext');
	var sdate = $F('sdatetext');
	new Ajax.Updater(
		{success: 'resultrec'},
		"php/reslink.php", 
		{
			method: 'get', 
			parameters: {key: key, type: type, rev: rev, sdate: sdate, word: word},
			onSuccess: function(transport) {
//				alert("Success"+"key="+key+"&type="+type+"&rev="+rev);
//				var res = transport.responseXML;
//				var msg = res.getElementsByTagName(’td');
//				alert(msg.);
			},
			onFailure: function(transport) {
				alert("Failure");
			},
			onException: function(transport, ex) {
				alert("Exception");
			}
		});
}

function toggle_rev() {
    if (rev == 1) {
		rev = 0;
	} else {
		rev = 1;
	}
}

function get_headobj(a) {
	switch (a) {
	case 'sdate':
		obj = $('dateheader');
		break;
	case 'name':
		obj = $('confheader');
		break;
	case 'location':
		obj = $('locatheader');
		break;
	case 'ddate':
		obj = $('deadheader');
		break;
	case 'remark':
		obj = $('remkheader');
		break;
	}
	return(obj);
}


function change_key(a) {
	if (key == a) {
		toggle_rev();
	} else {
		obj = get_headobj(key);
		obj.className = 'norm';
		key = a;
		rev = 0;
	}
	obj = get_headobj(key);
	if (rev == 1) {
		obj.className = 'up';
	} else {
		obj.className = 'down';
	}
}

function change_key_to_sdate() {
	change_key('sdate');
	load_data();
}

function change_key_to_name() {
	change_key('name');
	load_data();
}

function change_key_to_location() {
	change_key('location');
	load_data();
}

function change_key_to_ddate() {
	change_key('ddate');
	load_data();
}

function change_key_to_remark() {
	change_key('remark');
	load_data();
}

function change_type_to_intl() {
	type = 1;
	$('tbltitle').innerHTML = "International Conference";
	$('intl').innerHTML = "International Conference";
	$('dmst').innerHTML = "Domestic Conference";
	load_data();
}

function change_type_to_dmst() {
	type = 2;
	$('tbltitle').innerHTML = "国内研究集会";
	$('intl').innerHTML = "国際会議";
	$('dmst').innerHTML = "国内研究集会";
	load_data();
}

function add_underline(id) {
	$(id).className = 'underline';
}

function remove_underline(id) {
	$(id).className = 'nounderline';
}

function init() {
	$('dateheader').observe('click', change_key_to_sdate);
	$('confheader').observe('click', change_key_to_name);
	$('locatheader').observe('click', change_key_to_location);
	$('deadheader').observe('click', change_key_to_ddate);
	$('remkheader').observe('click', change_key_to_remark);
	$('datefooter').observe('click', change_key_to_sdate);
	$('conffooter').observe('click', change_key_to_name);
	$('locatfooter').observe('click', change_key_to_location);
	$('deadfooter').observe('click', change_key_to_ddate);
	$('remkfooter').observe('click', change_key_to_remark);
	$('searchtext').observe('keyup', load_data);
	$('sdatetext').observe('keyup', load_data);

	$('intl').onmouseover = new Function("add_underline(this.id);");
	$('intl').onmouseout = new Function("remove_underline(this.id);");
	$('intl').observe('click', change_type_to_intl);
	$('dmst').onmouseover = new Function("add_underline(this.id);");
	$('dmst').onmouseout = new Function("remove_underline(this.id);");
	$('dmst').observe('click', change_type_to_dmst);

	//init
	key = 'sdate';
	type = '1';
	rev = '0';
	load_data();
//        YahhoCal.loadYUI();
//        YahhoCal.locale = 'en';
//	$('sdatetext').onclick = new Function("YahhoCal.render(this.id);");
}

Event.observe(window, 'load', init);

