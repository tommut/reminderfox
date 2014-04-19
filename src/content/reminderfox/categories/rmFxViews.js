//gW 2010-02-17   'View'

/**
 *   viewitem = *(viewtyp ":" viewvalue *("," viewvalue) ;)
 *
 *      viewtyp = *("SUMMARY" / "CATEGORIES" / "NOTES" / "LOCATION") | ("DATE")
 *         Note:  "DESCRIPTION" has to be replaced with "summary"
 *
 *      'viewtyp' other than 'DATE' MAY occur more than once;
 *    for each 'viewtyp' one 'viewvalue' MUST occur at least once,
 *    but MAY occur more than once
 *
 *    For each reminder the items are checked against the 'viewitem'.
 *    If the condition is met, the reminder is included in the 'View' list.
 *
 *    For 'viewtyp' = "DATE"  valid entries to 'viewvalue' are:
 *       'viewvalue' = *('TODAY'/'CURRENT_WEEK'/'NEXT_WEEK'/'NEXT_2WEEKS'/'CURRENT_MONTH' ),
 *       the reminder date has to fall within the 'viewvalue' range; all date ranges
 *         are related to 'today'.
 *
 *    For 'viewtype' = *("SUMMARY" / "CATEGORIES" / "NOTES" / "LOCATION")
 *       the 'viewvalue' string MUST exist in the reminder item.
 *
 *       'viewvalue' with leading '#' character will invert the condition
 *          the 'viewvalue' string MUST NOT exist in the reminder item.
 *
 *    Multiple 'viewvalue' for one 'viewtyp' are handled as 'OR' connected,
 *    multiple 'viewtyp' for one 'viewitem' are handled as 'AND' function.
 *
 *        Example:  "DESCRIPTION:Mail,Send;CATEGORIES:business;categories:projectA;"
 *         read:  'mail' OR 'send' in 'DESCRIPTION' AND CATEGORIES='business' AND CATEGORIES='projectA'
 *
 *   'Criteria' descriptors
 *       The 'viewtyp' (called 'Criteria' at UI level) is stored to a preference:
 *          'extensions.reminderFox.views'
 *       with 'general' descriptors. At the UI those descriptors have 'local'
 *       equivalent stored with "reminderFox-bundle" / reminderfox.properties.
 *
 *       Example:  general: "LOCATION:Hamburg", local: "Ort:Hambug"
 *
 *
 *    For 'viewtyp' = "DATE"  valid entries to 'viewvalue' are:
 *      "DATE:viewvalue1 (","viewvalue2);)
 *
 *      The general 'viewvalueX' is:
 *      'viewvalueX' = {num}{D|M|Y}
 *          {num} is the count for days, months, or years,
 *              if positiv date is in future, negative in the past
 *          'D' is days, 'M' is month, 'Y' is year, only one value allowed
 *
 *          'viewvalue2' (optional)
 *          if 'viewvalue2' is obmitted 'viewvalue1' is related to 'today'
 *          if 'viewvalue1' > 'viewvalue2' the values are exchanged
 *
 *  Special case for 'viewvalue1'   (**compatibility with previous version**)
 *    if one of the following definition matches 'viewvalue2' is ignored
 *
 *    'viewvalue1' = *('TODAY'/'CURRENT_WEEK'/'CURRENT_MONTH'/'CURRENT_YEAR')
 *      and
 *    'viewvalue1' = *('NEXT_WEEK'/'NEXT_2WEEKS')
 *        these values are deprecated but supported to be compatible with
 *        prev version.
 *        Instead use new definition 'xD', eg.:
 *           'NEXT_WEEK' -->  '7D',   'NEXT_2WEEKS' -->  '14D'
 *        or 'NEXT_WEEK' -->  '-7D,7D'  which looks into past and furture
 *            7 days giving a span of 7days + today + 7days
 *
 * Examples with 'today' as of 'Jan 05 2010':
 *
 *  -90D    -->Wed Oct 07 2009 00:00:00 GMT+0200 Tue Jan 05 2010 13:11:51 GMT+0100
 *  10D,40D -->Fri Jan 15 2010 00:00:00 GMT+0100 Sun Feb 14 2010 00:00:00 GMT+0100
 *  -1M,2M  -->Sat Dec 05 2009 00:00:00 GMT+0100 Fri Mar 05 2010 00:00:00 GMT+0100
 *  3M      -->Tue Jan 05 2010 13:13:59 GMT+0100 Mon Apr 05 2010 00:00:00 GMT+0200
 *  120D,1M -->Fri Feb 05 2010 00:00:00 GMT+0100 Wed May 05 2010 00:00:00 GMT+0200
 *  TODAY   -->Tue Jan 05 2010 00:00:00 GMT+0100 Tue Jan 05 2010 00:00:00 GMT+0100
 *  CURRENT_MONTH -->Fri Jan 01 2010 00:00:00 GMT+0100 Sun Jan 31 2010 00:00:00 GMT+0100
 *
 */
// strings to hold 'locale' descriptors for 'Criteria' and 'Date'

if(!reminderfox.view)	reminderfox.view = {

		////// 'View'  parameter ///////////////////////////////////////////////////////

		LocalDesc : reminderfox.string("rf.html.heading.description"),
		LocalCat : reminderfox.string("rf.add.reminders.tooltip.categories"),
		LocalNotes : reminderfox.string("rf.add.mail.message.notes"),
		LocalLoc : reminderfox.string("rf.add.reminders.tooltip.locaton"),
		LocalDate : reminderfox.string("rf.html.heading.date"),

		Today : reminderfox.string("rf.views.heute"), //0: "Heute"         "TODAY"
		CurWeek : reminderfox.string("rf.views.currentweek"), //1: "Diese Woche"   "CURRENT_WEEK"
		CurMonth : reminderfox.string("rf.views.currentmonth"), //2: "Dieser Monat"  "CURRENT_MONTH"
		CurYear : reminderfox.string("rf.views.currentyear"), //3: "Dieses Jahr"   "CURRENT_YEAR"
		NextWeek : reminderfox.string("rf.views.nextweek.label"), // "Naechste Woche"  "NEXT_WEEK"
		Next2Weeks : reminderfox.string("rf.views.next2weeks"), // "2Wochen"        "NEXT_2WEEKS"
		SortUp : reminderfox.string("rf.views.sorter.viewUp"),
		SortDn : reminderfox.string("rf.views.sorter.viewDown"),
		CriteriaSortUp : reminderfox.string("rf.views.sorter.criteriaUp"),
		CriteriaSortDn : reminderfox.string("rf.views.sorter.criteriaDown"),
		ValidNameString : reminderfox.string("rf.views.criteria.notvalidString") + ":  ; : > <",

		DateAlreadydefined : reminderfox.string("rf.views.date.alreadydefined"),

		sNew : reminderfox.string("rf.views.new"), // new
		sNewTitel : reminderfox.string("rf.views.newView"), // New 'View'
		sNewInstruct : reminderfox.string("rf.views.enterName"), // Enter the new 'View' name:
		tttCriteria : reminderfox.string("rf.views.ttt.criteria"), // "Select a 'Criteria' to edit"
		tttEdit : reminderfox.string("rf.views.ttt.edit"), //  "Edit 'View's"
		tttEditor : reminderfox.string("rf.views.ttt.editor"),
		sExportSend : reminderfox.string("rf.views.editor.exportSend"),
		sName : reminderfox.string("rf.views.name"),

		sChange : reminderfox.string("rf.views.change"),
		sEdit : reminderfox.string("rf.views.edit"),
		sAdd : reminderfox.string("rf.views.add"),

		RmFxTitel : reminderfox.string("rf.title"), //use .properties

		views : {
			Pref : "",
			Label : {}, // .Label and .Items corresponded with each other and
			Items : {}, //    hold all View definitions
			cPrefs : "",
			cLabel : "", // .cXX  is the current
			cItems : "",
			filterIndex : "",
			filterTTT : "",
			filterLabel : "",
			filterLast : 0,		// last View item Editor worked with

			cDateSpan : {
				start : null,
				end : null
			}
		},

		editorChanged : false,
		editor2Save : false
	};


////// 'View'  functions ///////////////////////////////////////////////////////
/**
 *  main function to pre-select reminder based of 'VIEW' selection
 */
reminderfox.view.ViewThis= function(reminder) {
//------------------------------------------------------------------------------
	var filterIndexselected = reminderfox.search.filtersTypeGet();

	reminderfox.view.views.cDateSpan.start = null;
	reminderfox.view.views.cDateSpan.end = null;

	if(filterIndexselected < 8) return true;
	if (reminderfox.view.views.Pref == "") reminderfox.view.prefViewsLoad();
	if (reminderfox.view.views.Pref == "") return true;

	var nView = filterIndexselected - 8;
	reminderfox.view.views.cLabel = reminderfox.view.views.Label[nView];
	reminderfox.view.views.cItems = reminderfox.view.views.Items[nView];

	var statusString = true;
	var statusStringALL = true;

	//  if definition doesn't has DATE item, set it TRUE
	var statusDate = (reminderfox.view.views.cItems.search(/DATE:/) == -1) ? true : false;
	var viewArray = reminderfox.view.views.cItems.split(";")
	var len = viewArray.length
	for(var i = 0; i < len; i++) {
		var viewvalueInvert = false;
		// for checking "NOT" included string
		var viewtyp = viewArray[i].split(":")[0].toLowerCase();
		//  like Summary, Category, Date
		var viewvalue = viewArray[i].split(":")[1];
		// value: like "Birthday"
		// reminderfox.util.Logger('Alert', " .view.ViewThis  viewtyp: " + viewtyp+ "  viewvalue: " +viewvalue)

		if(!reminder[viewtyp]) {
			statusStringALL = false;
		} else {

			// tfm : this is way too complex to read/debug.  Should rewrite to make it readable, like:
			// if ( view.criteria.type == Summary ) { if ( reminder.summary == view.criteria.value ) ...
			if((viewtyp != null) || (viewtyp != "")) {

				if(viewtyp == 'date') {//  (" check the 'date' value of reminder");
					reminderfox.view.vDateSpan(viewvalue);

					var limitWeeklyReminders = false;
					var statusDate = (reminderfox.core.getAllRemindersInDateRange(reminder, 
						reminderfox.view.views.cDateSpan.start,
						reminderfox.view.views.cDateSpan.end, 
						limitWeeklyReminders).length > 0) ? true : false;
					/*----------
					//	reminderfox.util.Logger('Alert', " .view.ViewThis  reminder : " + reminder.summary 
							+ "  statusDate : " + statusDate
							+"\n    viewDates  start: " + reminderfox.view.views.cDateSpan.start 
							+ "  end: " + reminderfox.view.views.cDateSpan.end)
					----------*/
				}
				else { //  (" check string values");
					var statusString = false;

					var viewdetail = viewvalue.split(",")
					var vLen = viewdetail.length
					for(var j1 = 0; j1 < vLen; j1++) {

						var cViewDetail = viewdetail[j1];
						if(cViewDetail[0] == "#") {
							viewvalueInvert = true;
							cViewDetail = cViewDetail.substring(1, viewvalue.length)
						}
						if(viewvalueInvert == true) {//  if cViewDetail NOT included
							if(reminder[viewtyp].toLowerCase().indexOf(cViewDetail.toLowerCase()) == -1) {
								statusString = true;
							}
						} else {//  if cViewDetail IS  included
							if(reminder[viewtyp].toLowerCase().indexOf(cViewDetail.toLowerCase()) != -1) {
								statusString = true;
							}
						}
					}// for viewdetail
				}// string
				statusStringALL = statusStringALL && statusString;
			} //viewtype # null
		} // reminder[]
	}// viewarry

//reminderfox.util.Logger('Alert', " .view.ViewThis  return : " + (statusDate && statusStringALL && statusString) 
//	+ "   (statusDate | statusStringALL | statusString)" + statusDate +"|"+ statusStringALL  +"|"+ statusString)
	return (statusDate && statusStringALL && statusString);
};


//=== VIEW-EDITOR =========== select a 'View'  =============
/**
 * Sets the ReminderFox dialog titel including the selected Filter/View
 */
reminderfox.view.setFilterTitel = function(setFilter) {
//------------------------------------------------------------------------------
	if(!setFilter)
		setFilter = reminderfox.search.filtersTypeGet();

//var msg = " .view.setFilterTitel   Events|Lists : " + reminderfox.search.viewsFilterEvents + "|" + reminderfox.search.viewsFilterLists
//reminderfox.util.Logger('ALERT', msg)

	var titelFilter = "";
	var vPos = setFilter - 8;

	if(setFilter > 7) {
		// --- Views Handling ---
		//		reminderfox.view.views.Label[j]
		//		reminderfox.view.views.Items[j]
		titelFilter = " [" + reminderfox.view.views.Label[vPos] + "]";
	} else {
		// --- Standard Filter Handling ---
		var filterLabels = document.getElementById("rmFx-filters-labels");
		var t = (reminderfox_isReminderTabSelected() == true ? 1 : 8);
//var msg = '.view.setFilterTitel   filterLabels.attributes[setFilter + t]  setFilter|t : ' + setFilter +"|"+ t
//reminderfox.util.Logger('Alert', msg)
		
		titelFilter = " [" + filterLabels.attributes[setFilter + t].value + "]";
	}

	document.title = reminderfox.view.RmFxTitel + titelFilter;

	if(reminderfox.search.showFilters == true) {
		document.getElementById("rmFx-filters-type").selectedIndex = setFilter;
		if(setFilter > 7) {
			document.getElementById("rmFx-filters-type").setAttribute('tooltiptext', reminderfox.view.views.Items[vPos]);
		} else {
			document.getElementById("rmFx-filters-type").setAttribute('tooltiptext', '');
		}
	}
};


//=== VIEW-EDITOR =========== Manage the 'View's  ==========
/**
 *   call 'reminderfox.view.ManageLoad()' to load the defined 'View's from the pref
 */
reminderfox.view.Manage = function() {
//------------------------------------------------------------------------------
	var options = {
		viewNo: 0
	}
	window.openDialog("chrome://reminderfox/content/categories/rmFxViewEditor.xul", "reminderfox.view.ManageDialog", "chrome,resizable,modal", options);

	reminderfox.view.views.lastFilter = options.viewNo;
	var x=0;	
};


/**
 *  build the <menupopup id="criteria_Labels"> from .prefs entiry;
 *  'value'  is used to work on internal string as stored with the .views prefs
 */
reminderfox.view.ManageLoad = function(sortMode) {
//------------------------------------------------------------------------------
	var view_List = document.getElementById('view_List');
	var criteria_List = document.getElementById('criteria_List');
	var criteria_Labels = document.getElementById('criteria_Labels');

	/* delete all lists and menu   */
	reminderfox.view.clearThis(view_List);
	reminderfox.view.clearThis(criteria_List);
	reminderfox.view.clearThis(criteria_Labels);

	// add menuitems from .prop to ensure we use the same with XUL and js
	reminderfox.view.MenuItems(criteria_Labels, reminderfox.view.LocalDesc);
	//  "SUMMARY");
	reminderfox.view.MenuItems(criteria_Labels, reminderfox.view.LocalCat);
	//  "CATEGORIES");
	reminderfox.view.MenuItems(criteria_Labels, reminderfox.view.LocalNotes);
	//  "NOTES");
	reminderfox.view.MenuItems(criteria_Labels, reminderfox.view.LocalLoc);
	//  "LOCATION");
	reminderfox.view.MenuItems(criteria_Labels, reminderfox.view.LocalDate);
	//  "DATE");
	// ("--- load the 'View's from .prefs to 'view_List' ---");
	try {// gW UnicodePref
		reminderfox.view.views.Pref = reminderfox.core.getUnicodePref("views");
		var aViewsPref = reminderfox.view.views.Pref.split(";>,")

		var view_List = document.getElementById('view_List');

		var vCount = aViewsPref.length;
		while(vCount--) {
			var m1 = document.createElement("listitem");
			// apply parameters & insert before node 0
			if(aViewsPref[vCount] != "") {

				var xx = aViewsPref[vCount].split("=<");
				// ex: FoxInfo=<DATE:TODAY;>,
				m1.setAttribute("label", xx[0]);
				// FoxInfo
				m1.setAttribute("value", xx[1]);
				// DATE:TODAY
				//fx					m1.setAttribute("oncommand", "reminderfox.view.ViewFocus(this);");
				m1.addEventListener("command", function() {
					reminderfox.view.ViewFocus(this);
				}, false);
				m1.setAttribute("tooltiptext", reminderfox.view.CriteriaExchange(xx[1]));

				if(view_List.childNodes.length == 0) {
					view_List.insertBefore(m1, null);
				} else {
					view_List.insertBefore(m1, view_List.childNodes[0]);
				}
			}
		}
	} catch (s) {
	};
	reminderfox.view.Edit.Start(true /*vmRemove*/);
};


/**
 *  Select a 'View' on the 'view_List' and write it's
 *  'criteria's to the 'criteria_List'
 */
reminderfox.view.ViewFocus = function(mode) {
//------------------------------------------------------------------------------
	// for the sorting icon set focus and ttt
	if(mode == 'view') {
		document.getElementById('sorter_Box').setAttribute("type", mode);
		document.getElementById('view_SorterUp').tooltipText = reminderfox.view.SortUp;
		document.getElementById('view_SorterDown').tooltipText = reminderfox.view.SortDn;
	}
	if(mode == 'criteria') {
		document.getElementById('sorter_Box').setAttribute("type", mode);
		document.getElementById('view_SorterUp').tooltipText = reminderfox.view.CriteriaSortUp;
		document.getElementById('view_SorterDown').tooltipText = reminderfox.view.CriteriaSortDn;
	}

	// get the 'criteria' for selected 'view'
	var view_List = document.getElementById('view_List')

	reminderfox.view.views.lastFilter = view_List.selectedIndex + 8;

	var vLabel = view_List.selectedItem.label;
	// FoxInfo
	var vValue = view_List.selectedItem.value;
	// DATE:TODAY
	var aValues = vValue.split(";")

	// remove currently displayed 'criteria' and rebuild with new
	var criteria_List = document.getElementById('criteria_List');

	reminderfox.view.clearThis(criteria_List);
	for(var i = 0; i < aValues.length; i++) {
		var m1 = document.createElement("listitem");
		m1.setAttribute("label", reminderfox.view.CriteriaExchange(aValues[i]));
		m1.setAttribute("tooltiptext", reminderfox.view.tttCriteria);
		criteria_List.appendChild(m1);
	}

	reminderfox.view.Edit.Start(false /*vmRemove*/);
};


/**
 *   Add a new 'View' using the 'view_Add' button
 */
reminderfox.view.ViewAdd = function(mode) {
//------------------------------------------------------------------------------
	var prompts = Components.classes["@mozilla.org/embedcomp/prompt-service;1"].getService(Components.interfaces.nsIPromptService);

	var check = {
		value : false
	};
	// default the checkbox to false
	var input = {
		value : reminderfox.view.sNew
	};
	// default the edit field to 'new'
	if(prompts.prompt(null, reminderfox.view.sNewTitel, reminderfox.view.sNewInstruct, input, null, check) == false) {
		return;
	};

	// OK pressed, input.value holds the value
	reminderfox.view.editor2Save = true;
	// set to save any changes with close
	var view_List = document.getElementById('view_List');

	// add this new 'View' ... don't allow '=', ':', ',', ';', '>', '<' in name of viewList
	if(!reminderfox.view.vNameValid(input.value, view_List))
		return;
	// noDups
	var m1 = document.createElement("listitem");
	m1.setAttribute("label", input.value);
	m1.setAttribute("value", "SUMMARY:??");
	m1.setAttribute("tooltiptext", "SUMMARY:??");
	view_List.appendChild(m1);
	//gW #250123
	view_List.ensureElementIsVisible(m1);
	view_List.addItemToSelection(m1);

	view_List.selectedIndex = view_List.childNodes.length - 1;

	// add to Criteria_List
	var criteria_List = document.getElementById('criteria_List');
	reminderfox.view.clearThis(criteria_List);

	var m1 = document.createElement("listitem");
	m1.setAttribute("label", (reminderfox.view.LocalDesc + ":??"));
	m1.setAttribute("tooltiptext", reminderfox.view.tttCriteria);
	criteria_List.appendChild(m1);

	//gW #250123
	criteria_List.ensureElementIsVisible(m1);
	criteria_List.addItemToSelection(m1);

//	reminderfox.util.Logger('Views', "view_List.selectedIndex:" + (view_List.childNodes.length - 1));

	sizeToContent();
};



/**
 * Remove a 'View' from 'view_List' using 'view_Remove' button
 */
reminderfox.view.ViewRemove = function(mode) {
//------------------------------------------------------------------------------
	var view_List = document.getElementById('view_List');
	var i = view_List.selectedIndex
	if(i == -1) {
		return
	};

	var viewLabel = view_List.childNodes[i].label

	// prompt the user before Deleting
	var title = reminderfox.string("rf.views.ttt.viewremoveTitel");
	var msg = reminderfox.string("rf.views.ttt.viewremove1") + " \"" + viewLabel + "\" " + reminderfox.string("rf.views.ttt.viewremove2");

	var key0 = reminderfox.string("rf.button.ok");
	var key1 = reminderfox.string("rf.button.cancel");

	if(reminderfox.util.ConfirmEx(title, msg, key0, key1) == 1) {// cancel pressed
		return;
	}
	// buttonPressed  OK ... delete

	reminderfox.view.editor2Save = true;

	var criteria_List = document.getElementById('criteria_List');
	reminderfox.view.clearThis(criteria_List);

	view_List.removeChild(view_List.childNodes[i])

	reminderfox.view.views.lastFilter = -1;		//  indicates we have to renumber the filter settings
	reminderfox.view.Edit.Start(true /*vmRemove*/);
};


//=== VIEW-EDITOR =========== manage Criteria ====================
/**
 * Select 'criteria' in 'criteria_List' to store it to 'criteria_Vbox'
 */
reminderfox.view.CriteriaToEdit = function(mode) {
//------------------------------------------------------------------------------
	if(mode.selectedIndex == -1) {
		return
	};

	// set edit 'criteria'
	document.getElementById('sorter_Box').setAttribute("type", "criteria");

	document.getElementById('view_SorterUp').tooltipText = reminderfox.view.CriteriaSortUp;
	document.getElementById('view_SorterDown').tooltipText = reminderfox.view.CriteriaSortDn;

	var criteriaString = mode.selectedItem.label;
	var thisCritera = criteriaString.split(":")[0];
	var thisValue = criteriaString.split(":")[1];

	// select the menu item from pulldownmenu 'criteria_Typs'
	var criteria_Typs = document.getElementById('criteria_Typs');
	for(var i = 0; i < criteria_Typs.childNodes[0].childNodes.length; i++) {
		if(thisCritera.toLowerCase() == criteria_Typs.childNodes[0].childNodes[i].label.toLowerCase()) {
			criteria_Typs.selectedIndex = i;
		}
	}
	this.Edit.CriteriaEdit(thisCritera/*cType*/, thisValue /*cValue*/);
};


/**
 * Read the 'criteria_Vbox' string(s) and replace/add to 'criteria_List'
 *
 */
reminderfox.view.CriteriaEditEnter = function(){
//------------------------------------------------------------------------------
	var view_List = document.getElementById('view_List').selectedIndex;

	var criteria_Typs = document.getElementById('criteria_Typs').label
	var generalTyp = reminderfox.view.Criteria2General(criteria_Typs).toUpperCase();

//	reminderfox.util.Logger('Views', "CriteriaEditEnter  criteria_Typs::" + criteria_Typs + "   generalTyp:" + generalTyp);

	switch (generalTyp) {
		case "DATE":{
			reminderfox.view.editorChanged = true;

			// 'DATE' 
			var newString = "";
			var eStringBegin = document.getElementById('dateBoxBegin').value
			var eStringEnd = document.getElementById('dateBoxEnd').value;

			/* 'old'/deprecated strings not allow for second/end value
			 *   need the 'locale' strings,  check/convert  strings to 'general'
			 */
			eStringBegin = reminderfox.view.Criteria2General(eStringBegin);
			eStringEnd = reminderfox.view.Criteria2General(eStringEnd);

			if (eStringBegin.search(/NEXT_WEEK|NEXT_2WEEKS/) > -1) eStringEnd = "";

			// check second string, if empty or 0 (null)
			if ((eStringEnd == "") ||
			(parseInt(eStringEnd.substring(0, eStringEnd.length - 1)) == 0)) {
				newString = eStringBegin;
				eStringBegin = "";
				eStringEnd = "";
			}
			else {
				// if 'eStringBegin' has a zero value, set eStringBegin == eStringEnd and erase eStringBegin
				if (parseInt(eStringBegin.substring(0, eStringBegin.length - 1)) == 0) {
					newString = eStringEnd;
					eStringBegin = "";
					eStringEnd = "";
				}
				// begin & end (reminderfox.view.views.cDateSpan)  .. so sort it
				if (eStringEnd != "") {
					if (reminderfox.view.vDateSpanFromString(eStringBegin) > reminderfox.view.vDateSpanFromString(eStringEnd)) {
						var temp = eStringBegin;
						var eStringBegin = eStringEnd;
						eStringEnd = temp;
					}
					newString = eStringBegin + "," + eStringEnd;
				}
			}
			switch (newString) {
				case '0D':{
					newString = 'TODAY';
					break;
				}
				case '0W':{
					newString = 'CURRENT_WEEK';
					break;
				}
				case '0M':{
					newString = 'CURRENT_MONTH';
					break;
				}
				case '0Y':{
					newString = 'CURRENT_YEAR';
					break;
				}
			}
			var newCriteria = generalTyp + ":" + newString; // "Datum:-1M,10D" 
//			reminderfox.util.Logger('Views', "CriteriaEditEnter  DATE::" + newCriteria);
			break;
		} // case "DATE":

		default:
			{ // string op  
				if (generalTyp == 'CATEGORIES') {
					var newString = document.getElementById('inputRmCategories').value;
				}
				else {
					var newString = document.getElementById('criteria_Box').value;
				}
				if (newString != "") { // check for valid characters 
					if (!reminderfox.view.vNameValid(newString)) 						
						return; // noDups
					reminderfox.view.editorChanged = true;
					var newCriteria = generalTyp + ":" + newString; // "Notiz:xxyyxx"
				}
//				reminderfox.util.Logger('Views', "CriteriaEditEnter  generalSTRING::" + newCriteria);
				
			} // default string op  
	} // switch generalTyp

	if(!reminderfox.view.editorChanged) {
		this.Edit.CriteriaEnter("-");
		return;
	}

	// the 'criteria' changed, so store it to current 'view_List' item
	// and reload 'criteria_List' to get 'locale' values
	var criteria_List = document.getElementById('criteria_List');
	var sCriteria_List = criteria_List.selectedIndex;

	var m1 = document.createElement("listitem");
	m1.setAttribute("label", newCriteria);
	// 'local'
	m1.setAttribute("tooltiptext", reminderfox.view.tttCriteria);
	//   "Select a 'Criteria' to edit"
	if(sCriteria_List == -1) {// this is a ADD because no item was selected in 'criteria_List'
		criteria_List.appendChild(m1);

		//gW #250123
		criteria_List.ensureElementIsVisible(m1);
		criteria_List.addItemToSelection(m1);

		var xCount = criteria_List.childNodes.length
		if((xCount == 2) && (criteria_List.childNodes[0].label == "")) {
			criteria_List.removeItemAt(0);
			criteria_List.selectedIndex = 0;
		}
	} else {// replace the current item
		var oldNode = criteria_List.childNodes[sCriteria_List];
		criteria_List.replaceChild(m1, oldNode);
		//gW #250123
		criteria_List.ensureElementIsVisible(m1);
		criteria_List.addItemToSelection(m1);
	}

	// now change the 'value' of the 'View'
	for(var i = 0; i < criteria_List.childNodes.length; i++) {
		if(i == 0) {
			var criteria_ListString = criteria_List.childNodes[0].label;
		} else {
			criteria_ListString += ";" + criteria_List.childNodes[i].label;
		}
	}
	document.getElementById('view_List').childNodes[view_List].value = criteria_ListString;
	document.getElementById('view_List').childNodes[view_List].tooltipText = criteria_ListString;

//	reminderfox.util.Logger('Views', "CriteriaEditEnter  reminderfox.view.editorChanged::" + criteria_ListString);

	reminderfox.view.editorChanged = false;
	reminderfox.view.editor2Save = true;
	reminderfox.view.ViewFocus('criteria');
};



/**
 *   ADD a new 'criteria' to the 'criteria_List' for the selected 'View'
 */
reminderfox.view.CriteriaAdd = function(mode) {
//------------------------------------------------------------------------------
	document.getElementById("criteria_List").clearSelection();
	this.Edit.CriteriaAdd(mode);
};


/**
 *   REMOVE a 'criteria' in 'criteria_List' for the selected 'View'
 */
reminderfox.view.CriteriaRemove = function(mode) {
//------------------------------------------------------------------------------
	var aa = document.getElementById('criteria_List')
	try {
		aa.removeChild(aa.childNodes[aa.selectedIndex])
		document.getElementById('criteria_Box').value = "";

		// now change the 'value'
		var criteria_ListString = "";
		for(var i = 0; i < aa.childNodes.length; i++) {
			if(i == 0) {
				var criteria_ListString = aa.childNodes[0].label;
			} else {
				criteria_ListString += ";" + aa.childNodes[i].label;
			}
		}
		i = document.getElementById('view_List').selectedIndex
		document.getElementById('view_List').childNodes[i].value = criteria_ListString

		reminderfox.view.editorChanged = true;
		reminderfox.view.editor2Save = true;
	} catch (e) {
	}
	this.Edit.CriteriaEnter(mode);
};


/**
 *    With 'criteria_Typs' changed, check for double 'DATE'
 *    and change to 'ADD' mode
 */
reminderfox.view.CriteriaTypChanged = function(event) {
//------------------------------------------------------------------------------

	document.getElementById("criteria_List").clearSelection();

	var locType = event.target.label;
	var generalTyp = reminderfox.view.Criteria2General(locType);

	if(generalTyp == 'DATE') {//gWViewDATE
		// more than one 'DATE' item per 'view' doesn't makes sense
		var criteria_List = document.getElementById('criteria_List');
		for(var i = 0; i < criteria_List.childNodes.length; i++) {
			if(criteria_List.childNodes[i].label.search(reminderfox.view.LocalDate + ":") == 0) {
				document.getElementById('criteria_Typs').selectedIndex = 0;
				reminderfox.core.statusSet(reminderfox.view.DateAlreadydefined);
				return;
			}
		}
	}
	this.Edit.CriteriaAdd(generalTyp, "" /*cString*/);
};


//=== 'DATE' panel functions  ===================================  //gWViewDATE
/**
 * Open 'panel' to let the user change the 'Date' values
 *      for 'viewvalueX' = {num}{D|W|M|Y}
 *      and optional the old values like 'TODAY'
 *
 *   @param  {object} 		anchor:    object for pointing the panel to begin/end
 *   with anchor.value: a 'old' string or  'new' values ({num}{D|M|Y})
 *   @param  {string} 		spanText:  holds the title text for the opened panel
 */
reminderfox.view.CriteriaDatePanel = function(anchor, spanText){
//------------------------------------------------------------------------------
	var panel = document.getElementById("criteria_DateEdit");
	panel.hidePopup();

	var dateString = anchor.value;
	if((dateString == "") || (dateString == ""))
		dateString = "0D";
	// set 'today'
	var periode = dateString.substr(-1);
	if(periode.search(/D|W|M|Y/) == -1)
		return 0;

	var iValue = parseInt(dateString.substring(0, dateString.length - 1));
	var I = 0;
	switch (periode) {
		case 'D':
			I = 0;
			break;
		case 'W':
			I = 1;
			break;
		case 'M':
			I = 2;
			break;
		case 'Y':
			I = 3;
			break;
	}
	document.getElementById("spanPeriod").selectedIndex = I;
	document.getElementById("dateGroup").selectedIndex = (iValue < 0) ? 0 : 1;
	document.getElementById("dateValue").value = Math.abs(iValue);

	// 'anchor.id' holds a string for "begin/end" indication and set for an
	// attribute 'timeType' to have it with closing the panel
	document.getElementById("criteria_DateEdit_Titel").attributes["timeType"].value = anchor.id;
	document.getElementById("criteria_DateEdit_Titel").value = spanText;

	// use 'panel' for DATE entry/edit                                   //gWViewDATE

	panel.removeAttribute('hidden');
	panel.openPopup(anchor, 'overlap', -1, -1);
};


/**
 *   Read the panel 'criteria_DateEdit' settings and write back to the
 *   "timeType" textbox ('dateBoxBegin' or 'dateBoxEnd')
 */
reminderfox.view.CriteriaDatePanelClose = function(xEvent) {
//------------------------------------------------------------------------------
	// 'timeType'  is one of the two textboxes for DATE
	var timeType = document.getElementById("criteria_DateEdit_Titel").attributes["timeType"].value;

	var dValue = parseInt(document.getElementById("dateValue").value);
	var future = parseInt(document.getElementById("dateGroup").selectedIndex);
	var periode = document.getElementById("spanPeriod").selectedIndex;

	//    add 'W' for week
	var spanString = ((future == 0) ? "-" : "") + dValue + ((periode == 0) ? "D" : ((periode == 1) ? "W" : ((periode == 2) ? "M" : "Y")));

//	reminderfox.util.Logger('Views', "reminderfox.view.CriteriaDatePanelClose" + " future:" + future + " dValue:" + dValue + " period:" + periode + "\n spanString:" + spanString + "  timeType" + timeType + "\n" + reminderfox.date.localeDate(reminderfox.view.vDateSpanFromString(spanString)));

	document.getElementById(timeType).value = spanString;
	document.getElementById(timeType).tooltipText = 
		reminderfox.view.vDateSpanFromString(spanString).toDateString();

	document.getElementById("criteria_DateEdit").hidePopup();
};

// ===  Support functions   ====================================================

reminderfox.view.vNameValid = function(thisName, knowNames){
//------------------------------------------------------------------------------
	if (thisName.search(/(=|:|;|>|<)/g) != -1) {
		reminderfox.core.statusSet(reminderfox.view.ValidNameString);
		return false; // not allowed
	}
	// if 'knownNames' check
	if (knowNames) {
		for (var i = 0; i < knowNames.children.length; i++) {
			if (thisName == knowNames.children[i].label) {
				reminderfox.core.statusSet(reminderfox.view.ValidNameString);
				return false;
			}
		}
	}
	return true;
};


/**
 *   Load pref reminderfox.consts.REMINDER_FOX_PREF + "." + "views"
 *     holds the viewsLabel and viewsItems
 *   See also the globals reminderfox.view.views.Label, reminderfox.view.views.Items,
 *     reminderfox.view.views.cDateSpan, reminderfox.view.views.Pref
 */
reminderfox.view.prefViewsLoad = function(){
//------------------------------------------------------------------------------
	var aNewItem;
	reminderfox.view.views.Pref = "";
	reminderfox.view.views.Label = {};
	reminderfox.view.views.Items = {};

	try {
		reminderfox.view.views.Pref = reminderfox.core.getUnicodePref("views");
	} 
	catch (ex) {
	}

	if ((reminderfox.view.views.Pref != null) && (reminderfox.view.views.Pref != "")) {
		var aViewsPref = reminderfox.view.views.Pref.split(";>,");
		var vCount = aViewsPref.length;
		var j = 0;
		for (var i = 0; i < vCount; i++) {
			if ((aViewsPref[i] != "") && (aViewsPref[i] != null)) {
				aNewItem = aViewsPref[i].split("=<");
				reminderfox.view.views.Label[j] = aNewItem[0];
				reminderfox.view.views.Items[j] = aNewItem[1];
				j++;
			}
		}
	}
};


/**
 *   'gViewsPref' build with Views/Criteria
 *   also build 'reminderfox.view.views.Label' and 'reminderfox.view.views.Items'
 */
reminderfox.view.prefBuildStr = function(){
//------------------------------------------------------------------------------
	var view_List = document.getElementById('view_List');

	reminderfox.view.views.Pref = "";
	reminderfox.view.views.Label = {};
	reminderfox.view.views.Items = {};

	for (var i = 0; i < view_List.childNodes.length; i++) {
		reminderfox.view.views.Label[i] = view_List.childNodes[i].label;
		
		var iValues = view_List.childNodes[i].value.split(";");
		for (var j = 0; j < iValues.length; j++) {
			var thisLabel = reminderfox.view.Criteria2General(iValues[j].split(":")[0]);
			var thisValues = iValues[j].split(":")[1];
			iValues[j] = thisLabel + ":" + thisValues;
		}
		reminderfox.view.views.Items[i] = iValues.join(";");
		reminderfox.view.views.Pref += reminderfox.view.views.Label[i] + "=<" + reminderfox.view.views.Items[i] + ";>,";
	}
//	reminderfox.util.Logger('Views', "reminderfox.view.prefBuildStr  build:" + reminderfox.view.views.Pref);
	return reminderfox.view.views.Pref;
};


/**
 *  Convert 'reminderfox.view.views.cDateSpan' to global start/end date values
 */
reminderfox.view.vDateSpan = function(dateSpan){ //gWViewDATE
//------------------------------------------------------------------------------
	reminderfox.view.views.cDateSpan = {
		start: null,
		end: null
	};

	var dateSpanDetail = dateSpan.split(",");
	if (dateSpanDetail.length < 1) 		
		return; // no 'dateSpan', clear start/end dates
	// --- searchFor : see 'addReminderDialog.js  at function getStartAndEndDates
	var dateType = -1;
	switch (dateSpanDetail[0].toUpperCase()) {
		case 'TODAY':
		case '0D':{
			dateType = 3;
			break;
		}
		case 'CURRENT_WEEK':
		case '0W':{
			dateType = 2;
			break;
		}
		case 'CURRENT_MONTH':
		case '0M':{
			dateType = 1;
			break;
		}
		case 'CURRENT_YEAR':
		case '0Y':{
			dateType = 0;
			break;
		}
		
		case 'NEXT_WEEK':{
			dateType = 4;
			break;
		}
		case 'NEXT_2WEEKS':{
			dateType = 5;
			break;
		}
	}

	if (dateType > -1) { // 'DATE'  has 'old' strings 
		// .. use 'addReminderDialog' function  to get the dates 
		var theseDates = reminderFox_getStartAndEndDates(dateType, true);
	}
	else { //  'DATE'  has 'new' value(s)
		var theseDates = {
			start: null,
			end: null
		};

		theseDates.start = reminderfox.view.vDateSpanFromString(dateSpanDetail[0]);
		if (dateSpanDetail.length > 1) {
			theseDates.end = reminderfox.view.vDateSpanFromString(dateSpanDetail[1]);
		}
		else {
			theseDates.end = new Date(); //  'dateSpan2' obmitted  --> set 'today' 
		}
		// check for .start > .end --> exchange values !!
		if (theseDates.end < theseDates.start) {
			var temp = theseDates.start;
			theseDates.start = theseDates.end;
			theseDates.end = temp;
		}
	}
	reminderfox.view.views.cDateSpan.start = theseDates.start;
	reminderfox.view.views.cDateSpan.end = theseDates.end;
};


/**
 *   Convert 'dateString' string to Date() value relative to 'today'
 */
reminderfox.view.vDateSpanFromString = function(dateString){
//------------------------------------------------------------------------------
	var periode = dateString.substr(-1);
	if (periode.search(/D|W|M|Y/) == -1) 
		return 0;
	dateString = dateString.substring(0, dateString.length - 1);
	
	var numValue = parseInt(dateString);
	
	var dD = 0;
	var dM = 0;
	var dY = 0;
	switch (periode) {
		case 'D':
			dD = numValue;
			break;
		case 'M':
			dM = numValue;
			break;
		case 'Y':
			dY = numValue;
			break;
		case 'W':
			dD = numValue * 7;
			break;
	}
	var sday = new Date();
	return new Date(sday.getYear() + 1900 + dY, sday.getMonth() + dM, sday.getDate() + dD);
};


/**
 *    exchange  'local' and 'general' criteria descriptors
 */
reminderfox.view.CriteriaExchange = function(criteria){
//------------------------------------------------------------------------------
	var xCriteria = criteria.split(";");
	for (var j = 0; j < xCriteria.length; j++) {

		var labelString = xCriteria[j].split(":")[0];
		var valString = xCriteria[j].split(":")[1];

		if (xCriteria[j].split(":")[0] == "DATE") {

			// for 'DATE' change {num}{D|M|Y} values to strings if possible    
			if (valString.search(/,/) == -1) { // only one value
				if (valString == '0D') valString = reminderfox.view.Criteria2Locale('TODAY');
				if (valString == '0W') valString = reminderfox.view.Criteria2Locale('CURRENT_WEEK');
				if (valString == '0M') valString = reminderfox.view.Criteria2Locale('CURRENT_MONTH');
				if (valString == '0Y') valString = reminderfox.view.Criteria2Locale('CURRENT_YEAR');
			}
			valString = reminderfox.view.Criteria2Locale(valString);
		}

		xCriteria[j] = reminderfox.view.Criteria2Locale(labelString) +
		":" +
		valString;
	}
	return xCriteria.join(";");
};


reminderfox.view.Criteria2Locale = function(criteria){
//------------------------------------------------------------------------------
	switch (criteria) {
		case "SUMMARY":{
			return reminderfox.view.LocalDesc;
		}
		case "CATEGORIES":{
			return reminderfox.view.LocalCat;
		}
		case "LOCATION":{
			return reminderfox.view.LocalLoc;
		}
		case "NOTES":{
			return reminderfox.view.LocalNotes;
		}
		case "DATE":{
			return reminderfox.view.LocalDate;
		}
		
		case "TODAY":{
			return reminderfox.view.Today;
		} // :0
		case "CURRENT_WEEK":{
			return reminderfox.view.CurWeek;
		} // :1
		case "CURRENT_MONTH":{
			return reminderfox.view.CurMonth;
		} // :2
		case "CURRENT_YEAR":{
			return reminderfox.view.CurYear;
		} // :3
		case "NEXT_WEEK":{
			return reminderfox.view.NextWeek;
		} // :4
		case "NEXT_2WEEKS":{
			return reminderfox.view.Next2Weeks;
		} // :5
	}
	return criteria; // nothing matched, so return original criteria value
};


reminderfox.view.Criteria2General = function(criteria){
//------------------------------------------------------------------------------
	switch (criteria) {
		case reminderfox.view.LocalDesc:{
			return "SUMMARY";
		}
		case reminderfox.view.LocalCat:{
			return "CATEGORIES";
		}
		case reminderfox.view.LocalLoc:{
			return "LOCATION";
		}
		case reminderfox.view.LocalNotes:{
			return "NOTES";
		}
		case reminderfox.view.LocalDate:{
			return "DATE";
		}

		case reminderfox.view.Today:{
			return "TODAY";
		} // :0
		case reminderfox.view.CurWeek:{
			return "CURRENT_WEEK";
		} // :1
		case reminderfox.view.CurMonth:{
			return "CURRENT_MONTH";
		} // :2
		case reminderfox.view.CurYear:{
			return "CURRENT_YEAR";
		} // :3
		case reminderfox.view.NextWeek:{
			return "NEXT_WEEK";
		}
		case reminderfox.view.Next2Weeks:{
			return "NEXT_2WEEKS"
		};
	}
	return criteria; // nothing matched, so return original criteria value
};


reminderfox.view.vSaveAndClose = function(mode){
//------------------------------------------------------------------------------
	reminderfox.util.Logger('Views', "reminderfox.view.vSaveAndClose  changed:" + reminderfox.view.editorChanged);

	window.arguments[0].viewNo =this.views.lastFilter

	if (reminderfox.view.editor2Save == false) {
		window.arguments[0].viewNo = null
		window.close();
		return
	};

	var title = reminderfox.string("rf.views.closeTitel"); //'View' Editor - Closing";
	var msg = reminderfox.string("rf.views.closeWarning");
	var key0 = reminderfox.string("rf.views.discard"); //YES, discard";
	var key1 = reminderfox.string("rf.views.noGoBack"); //NO, go back to Editor";
	var key1s = reminderfox.string("rf.views.noSave"); //NO, save";
	if (mode == 'CANCEL') { // ("--- reminderfox.view.vSaveAndClose w 'CANCEL'---");
		if (reminderfox.util.ConfirmEx(title, msg, key0, key1) == 1) {
			return; // 'No' pressed .. return to XUL
		}
		window.arguments[0].viewNo = null
		window.close(); // buttonPressed  'OK' ... discard all changes!!
		return;
	}

	if (mode == 'X') { // ("--- the window 'X' at the header was used .. now handle the edited 'prefs' ---");
		if (reminderfox.util.ConfirmEx(title, msg, key0, key1s) == 0) {
			window.arguments[0].viewNo = null
			return; // buttonPressed  'OK' ... delete
		}
	}

	// 'views' prefs string saved    
	reminderfox.view.views.Pref = reminderfox.view.prefBuildStr();
	reminderfox.core.setUnicodePref("views", reminderfox.view.views.Pref);
	window.close();
};


reminderfox.view.clearThis = function(thisName){
//------------------------------------------------------------------------------
	while (thisName.hasChildNodes()) 
		thisName.removeChild(thisName.firstChild);
};


reminderfox.view.MenuItems = function(xList, Label){
//------------------------------------------------------------------------------
	var m1 = document.createElement("menuitem");
	m1.setAttribute("label", Label);
	xList.appendChild(m1);
};


// ==== Button, List/Textboxes control  ========================================

if(!reminderfox.view.Edit)		reminderfox.view.Edit = {};

reminderfox.view.Edit.Start = function(vmRemove){
//------------------------------------------------------------------------------
	this.View(false /*vmAdd*/, vmRemove /*vmRemove*/);
	this.Criteria(true /*cmAdd*/, true /*cmRemove*/);

	this.cEdit(false /*c_List*/, true /*c_Mode*/, reminderfox.view.sChange /*cmLabel*/, "-" /*cType*/, "" /*cString*/);

	// OKbutton
	document.getElementById('OK').removeAttribute("disabled");
};


/**
 * this.Edit.CriteriaEdit
 * @param  {string} cType
 * @param  {string} cString
 */
reminderfox.view.Edit.CriteriaEdit = function(cType, cString){
//------------------------------------------------------------------------------
	this.View(true /*vmAdd*/, true /*vmRemove*/);
	this.Criteria(false /*cmAdd*/, false /*cmRemove*/);

	this.cEdit(false /*c_List*/, false /*c_Mode*/, reminderfox.view.sEdit /*cmLabel*/, cType, cString);

	// OKbutton
	document.getElementById('OK').setAttribute("disabled", true);
};


reminderfox.view.Edit.CriteriaAdd = function(cType){
//------------------------------------------------------------------------------
	this.View(false /**vmAdd*/, false /**vmRemove*/);
	this.Criteria(false /**cmAdd*/, false /**cmRemove*/);

	this.cEdit(false /*c_List*/, false /*c_Mode*/, reminderfox.view.sAdd /*cmLabel*/, cType /*cType*/, "" /*cString*/);

	// OKbutton
	document.getElementById('OK').setAttribute("disabled", true);
};


reminderfox.view.Edit.CriteriaEnter = function(cType){
//------------------------------------------------------------------------------
	this.View(false /*vmAdd*/, false /*vmRemove*/);
	this.Criteria(false /*cmAdd*/, true /*cmRemove*/);

	this.cEdit(false /*c_List*/, true /*c_Mode*/, reminderfox.view.sChange /*cmLabel*/, cType, "" /*cString*/);

	// OKbutton      
	document.getElementById('OK').removeAttribute("disabled");
};


/**
 *    Control the 'View' buttons Add and Delete
 */
reminderfox.view.Edit.View = function(vmAdd, vmRemove){
//------------------------------------------------------------------------------
//	reminderfox.util.Logger('Views', "this.Edit.View   vmAdd:" +
//	vmAdd + " vmRemove:" + vmRemove);

	document.getElementById('view_Add').setAttribute("disabled", vmAdd);
	document.getElementById('view_Remove').setAttribute("disabled", vmRemove);
};


/**
 *    Control the 'Criteria' buttons Add and Delete
 */
reminderfox.view.Edit.Criteria = function(cmAdd, cmRemove){
//------------------------------------------------------------------------------
//	reminderfox.util.Logger('Views', "this.Edit.Criteria   cmAdd:" +
//	cmAdd + " cmRemove:" + cmRemove);

	document.getElementById('criteria_Add').setAttribute("disabled", cmAdd);
	document.getElementById('criteria_Remove').setAttribute("disabled", cmRemove);
};


/**
 *   Controls the "criteria_Edit"
 */
reminderfox.view.Edit.cEdit = function(c_List, c_Mode, cmLabel, locType, cString){
//------------------------------------------------------------------------------
//	reminderfox.util.Logger('Views', "this.Edit.cEdit   c_List:" +	c_List  +" c_Mode:"
//	 + c_Mode + " cmLabel:" + cmLabel + " locType:" + locType + " cString:" + 	cString + "\n-------------------------");

	document.getElementById('criteria_List').setAttribute("disabled", c_List);

	document.getElementById('criteria_Typs').setAttribute("disabled", c_Mode);
	document.getElementById('criteria_Mode').setAttribute("disabled", c_Mode);

	document.getElementById('criteria_Mode').label = cmLabel;

	// disable all 'criteria_VBox'es -- will be enabled based on 'cType'
	document.getElementById('criteria_Date').setAttribute('hidden', true);
	document.getElementById('catHbox').setAttribute('hidden', true);

	var cType = reminderfox.view.Criteria2General(locType);
	switch (cType.toUpperCase()) {
		case 'DATE':{ 
			// use DATE with PANEL
			document.getElementById('criteria_Box').setAttribute('hidden', 'true')
			document.getElementById('criteria_Date').removeAttribute('hidden')

			var dateDetail = cString.split(",");
			if (dateDetail.length < 1)
				return true; // no 'Date'
			dateDetail[0] = (dateDetail[0] == "") ? 'TODAY' : dateDetail[0];
			var eDateBegin = dateDetail[0].toUpperCase();
			var beginString = eDateBegin;
			
			if (eDateBegin == reminderfox.view.Criteria2Locale('TODAY').toUpperCase()) {
				beginString = "0D";
			}
			if (eDateBegin == reminderfox.view.Criteria2Locale('CURRENT_WEEK').toUpperCase()) {
				beginString = "0W";
			}
			if (eDateBegin == reminderfox.view.Criteria2Locale('CURRENT_MONTH').toUpperCase()) {
				beginString = "0M";
			}
			if (eDateBegin == reminderfox.view.Criteria2Locale('CURRENT_YEAR').toUpperCase()) {
				beginString = "0Y";
			}

			if (eDateBegin == reminderfox.view.Criteria2Locale('NEXT_WEEK').toUpperCase()) {
				beginString = dateDetail[0];
			}
			if (eDateBegin == reminderfox.view.Criteria2Locale('NEXT_2WEEKS').toUpperCase()) {
				beginString = dateDetail[0];
			}

			document.getElementById('dateBoxBegin').value = beginString;

			// tooltiptext:  
			if (beginString != eDateBegin) { // for begin (dateDetail[0]) use strings like 'TODAY' 
				document.getElementById('dateBoxBegin').tooltipText = eDateBegin
			}
			else { //   or take {num}{D|M|Y} for it
				document.getElementById('dateBoxBegin').tooltipText = 
					reminderfox.view.vDateSpanFromString(beginString).toDateString();
			}

			// tooltipText:  for end (dateDetail[1]) take {num}{D|M|Y} 
			if (dateDetail.length > 1) {
				document.getElementById('dateBoxEnd').tooltipText = 
					reminderfox.view.vDateSpanFromString(dateDetail[1]).toDateString();
				document.getElementById('dateBoxEnd').value = dateDetail[1]
			}
			else {
				document.getElementById('dateBoxEnd').value = "";
			}
			break;
		} // case DATE
		case 'CATEGORIES':{ // show the 'categories pull-down menu, delete the label
			document.getElementById('criteria_Box').setAttribute('hidden', true);
			document.getElementById('catHbox').removeAttribute('hidden');
			document.getElementById('catLabel').value = "";

			document.getElementById('inputRmCategories').value = cString;
			break;
		}

		case "-":{ // show the <textbox>, but 'disable' it
			var criteraTyps = document.getElementById('criteria_Typs');
			criteraTyps.selectedIndex = 0;

			document.getElementById('criteria_Box').removeAttribute('hidden');
			document.getElementById('criteria_Box').setAttribute("disabled", true);
			break;
		}

		case "+":{ // select first 'criteria_Typs' item
			// and fall thru to 'default' .. because no 'break'
			var criteraTyps = document.getElementById('criteria_Typs');
			criteraTyps.selectedIndex = 0;
		}
		default:
			{ // stringMode:  show the <textbox>, 'enable' it 
				document.getElementById('criteria_Box').removeAttribute('hidden');
				document.getElementById('criteria_Box').removeAttribute("disabled");
				document.getElementById('criteria_Box').value = cString;
			}
	}
};


// === Sorter View/Categories ==================================================

reminderfox.view.Edit.Sorter = function(mode){
//------------------------------------------------------------------------------
	var info = document.getElementById('sorter_Box').attributes["type"].value; /* 'view'|'criteria'*/
	var sortMode = mode.attributes["sorting"].value; /*sortMode 'up'|'down'*/
	var view_List = document.getElementById('view_List');
	var criteria_List = document.getElementById('criteria_List');

	if (info == 'view') {
		var prefStr = reminderfox.view.prefBuildStr();

		reminderfox.view.clearThis(view_List);
		reminderfox.view.clearThis(criteria_List);

		var cViews = prefStr.split(";>,")

		// sorting of 'view's 
		if (sortMode != null) {
			if (sortMode == 'up') cViews = cViews.sort();
			if (sortMode == 'down') cViews = cViews.sort().reverse();
			reminderfox.view.editor2Save = true;
		}

		var vCount = cViews.length;
		while (vCount--) {
			var m1 = document.createElement("listitem");
			// apply parameters & insert before node 0
			if (cViews[vCount] != "") {

				var xx = cViews[vCount].split("=<"); // ex: FoxInfo=<DATE:TODAY;>,
				m1.setAttribute("label", xx[0]); // FoxInfo
				m1.setAttribute("value", xx[1]); // DATE:TODAY   
				m1.setAttribute("tooltiptext", xx[1]);

				m1.addEventListener("command", function() {reminderfox.view.ViewFocus(this);},false);

				if (view_List.childNodes.length == 0) {
					view_List.insertBefore(m1, null);
				}
				else {
					view_List.insertBefore(m1, view_List.childNodes[0]);
				}
			}
		}
	}

	if (info == 'criteria') {
		var cView = view_List.selectedIndex;
//		reminderfox.util.Logger('Views', "Criteria sorting for:" + cView + "   sortMode:" + sortMode);
		var criteria_List = document.getElementById('criteria_List');
		var vCount = criteria_List.childNodes.length;
		
		var sList = new Array(vCount);
		while (vCount--) {
			sList[vCount] = criteria_List.childNodes[vCount].label;
		}

		// sorting of 'view's 
		if (sortMode != null) {
			if (sortMode == 'up') sList = sList.sort();
			if (sortMode == 'down') sList = sList.sort().reverse();
			reminderfox.view.editor2Save = true;
		}

		// write back to 'criteria_List'
		reminderfox.view.clearThis(criteria_List);

		for (var i = 0; i < sList.length; i++) {
			var m1 = document.createElement("listitem");
			m1.setAttribute("label", sList[i]);
			m1.setAttribute("tooltiptext", reminderfox.view.tttCriteria);
			criteria_List.appendChild(m1);
		}

		var aValues = sList.join(";");
		view_List.childNodes[view_List.selectedIndex].value = aValues;
		view_List.childNodes[view_List.selectedIndex].tooltipText = aValues;

//		reminderfox.util.Logger('Views', "Criteria sorting :" + aValues + "   sortMode:" + sortMode);

		this.CriteriaEnter('-');
	}
};
