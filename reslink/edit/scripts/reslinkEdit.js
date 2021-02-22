var type

function load_data() {
	var word = $F('searchtext');
	new Ajax.Updater(
		{success: 'resultrec'},
		"php/reslinkEdit.php", 
		{
			method: 'post', 
			parameters: {mode: 'load', type: type, word: word},
			onSuccess: function(transport) {
			//	add_event_to_allrecords();
			},
			onFailure: function(transport) {
				alert("Failure: load_data");
			},
			onException: function(transport, ex) {
//				alert("Exception: load_data");
			},
			onComplete: function() {
				add_event_to_allrecords();
			}
		});
}

function make_input_form(id, value, func) {
	var str;
	str = "<input type=\"button\" value=\"" + value;
	str += "\" onclick=\"" + func + "('" + id + "')\"/>";
	return str;
}

function edit_query(id) {
	new Ajax.Updater(
		{success: id},
		"php/reslinkEdit.php", 
		{
			method: 'post', 
			parameters: {mode: 'editone', type: type, record: id},
			onSuccess: function(transport) {
			},
			onFailure: function(transport) {
				alert("Failure");
			},
			onException: function(transport, ex) {
				alert("Exception");
			},
			onComplete: function() {
				if (type != 3) {
					$(id).cells[0].innerHTML = make_input_form(id, 'update', 'update_record');
					$(id).cells[0].innerHTML += make_input_form(id, 'delete', 'trash_record');
					$(id).cells[0].innerHTML += make_input_form(id, 'cancel', 'load_one');
				} else {
					$(id).cells[0].innerHTML = make_input_form( 
							id, 'move to international', 'restore_to_intl');
					$(id).cells[0].innerHTML += make_input_form(
							id, 'move to domestic', 'restore_to_dmst');
					$(id).cells[0].innerHTML += make_input_form(id, 'delete', 'delete_record');
					$(id).cells[0].innerHTML += make_input_form(id, 'cancel', 'load_one');
				}
//				$(id+'sdateval').onclick = new Function("YahhoCal.render(this.id);");
//				$(id+'edateval').onclick = new Function("YahhoCal.render(this.id);");
//				$(id+'ddateval').onclick = new Function("YahhoCal.render(this.id);");
			}
		});
}

function load_one(id) {
	new Ajax.Updater(
		{success: id},
		"php/reslinkEdit.php", 
		{
			method: 'post', 
			parameters: {mode: 'loadone', type: type, record: id},
			onSuccess: function(transport) {
			},
			onFailure: function(transport) {
				alert("Failure");
			},
			onException: function(transport, ex) {
				alert("Exception");
			},
			onComplete: function() {
				$(id).className = "norm";
				$(id).onmouseover = new Function("select_record(this.id);");
				$(id).onmouseout = new Function("unselect_record(this.id);");
				$(id).onclick = new Function("edit_record(this.id);");
			}
		});
}

function update_field(id, field, val) {
	new Ajax.Request(
		"php/reslinkEdit.php", 
		{
			method: 'post', 
			parameters: {mode: 'update', type: type, record: id, field: field, value: val},
			onSuccess: function(transport) {
			},
			onFailure: function(transport) {
				alert("Failure");
			},
			onException: function(transport, ex) {
				alert("Exception");
			},
			onComplete: function() {
				load_one(id);
			}
		});
}

function add_event_to_allrecords() {
	var recs = $('resultrec').rows;
	for (var i=0; i<recs.length; i++) {
		recs[i].onmouseover = new Function("select_record(this.id);");
		recs[i].onmouseout = new Function("unselect_record(this.id);");
		recs[i].onclick = new Function("edit_record(this.id);");
	}	
}

function change_type_to_intl() {
	type = 1;
	$('searchtext').value = "";
	selectedrow = $('conftab');
	$('tbltitle').innerHTML = "International Conference (Edit)";
	load_data();
}

function change_type_to_dmst() {
	type = 2;
	$('searchtext').value = "";
	selectedrow = $('conftab');
	$('tbltitle').innerHTML = "国内研究集会（編集）";
	load_data();
}

function change_type_to_trash() {
	type = 3;
	$('searchtext').value = "";
	selectedrow = $('conftab');
	$('tbltitle').innerHTML = "ゴミ箱";
	load_data();
}

function restore_to_intl(id) {
	new Ajax.Request(
		"php/reslinkEdit.php", 
		{
			method: 'post', 
			parameters: {mode: 'update', type: type, record: id, field: 'Type', value: 1},
			onSuccess: function(transport) {
			},
			onFailure: function(transport) {
				alert("Failure");
			},
			onException: function(transport, ex) {
				alert("Exception");
			},
			onComplete: function() {
				load_data();
			}
		});
}

function restore_to_dmst(id) {
	new Ajax.Request(
		"php/reslinkEdit.php", 
		{
			method: 'post', 
			parameters: {mode: 'update', type: type, record: id, field: 'Type', value: 2},
			onSuccess: function(transport) {
			},
			onFailure: function(transport) {
				alert("Failure");
			},
			onException: function(transport, ex) {
				alert("Exception");
			},
			onComplete: function() {
				load_data();
			}
		});
}

function update_record(id) {
	var sdate = $F(id+'sdateval');
	var edate = $F(id+'edateval');
	var confname = $F(id+'confval');
	var url = $F(id+'urlval');
	var locat = $F(id+'locationval');
	var ddate = $F(id+'ddateval');
	var remk = $F(id+'remarkval');
	update_field(id, 'BeginDate', sdate);
	update_field(id, 'EndDate', edate);
	update_field(id, 'ConfName', confname);
	update_field(id, 'URL', url);
	update_field(id, 'Location', locat);
	update_field(id, 'Deadline', ddate);
	update_field(id, 'Remarks', remk);
}

function add_new_record() {
	$('searchtext').value = "";
	new Ajax.Request(
		"php/reslinkEdit.php", 
		{
			method: 'post', 
			parameters: {mode: 'new', type: type},
			onSuccess: function(transport) {
			},
			onFailure: function(transport) {
				alert("Failure");
			},
			onException: function(transport, ex) {
				alert("Exception");
			},
			onComplete: function() {
				load_data();
			}
		});
}

function trash_record(id) {
	// goto Trash
	new Ajax.Request(
		"php/reslinkEdit.php", 
		{
			method: 'post', 
			parameters: {mode: 'update', type: type, record: id, field: 'Type', value: 3},
			onSuccess: function(transport) {
			},
			onFailure: function(transport) {
				alert("Failure");
			},
			onException: function(transport, ex) {
				alert("Exception");
			},
			onComplete: function() {
				load_data();
			}
		});
}

function delete_record(id) {
	new Ajax.Request(
		"php/reslinkEdit.php", 
		{
			method: 'post', 
			parameters: {mode: 'delete', type: type, record: id},
			onSuccess: function(transport) {
			},
			onFailure: function(transport) {
				alert("Failure");
			},
			onException: function(transport, ex) {
				alert("Exception");
			},
			onComplete: function() {
				load_data();
			}
		});
}
function select_record(id) {
	$(id).className = 'selected';
}

function unselect_record(id) {
	$(id).className = 'norm';
}

function edit_record(id) {
	$(id).onclick = null;
	edit_query(id);
}

function add_underline(id) {
        $(id).className = 'underline';
}

function remove_underline(id) {
        $(id).className = 'nounderline';
}

function init() {
        $('searchtext').observe('keyup', load_data);
	$('add').observe('click', add_new_record);

        $('intl').onmouseover = new Function("add_underline(this.id);");
        $('intl').onmouseout = new Function("remove_underline(this.id);");
        $('intl').observe('click', change_type_to_intl);
        $('dmst').onmouseover = new Function("add_underline(this.id);");
        $('dmst').onmouseout = new Function("remove_underline(this.id);");
        $('dmst').observe('click', change_type_to_dmst);
        $('trash').onmouseover = new Function("add_underline(this.id);");
        $('trash').onmouseout = new Function("remove_underline(this.id);");
	$('trash').observe('click', change_type_to_trash);

	//init
	type = '1';
	load_data();
//	YahhoCal.loadYUI();
//	YahhoCal.locale = 'en';
}

Event.observe(window, 'load', init);

