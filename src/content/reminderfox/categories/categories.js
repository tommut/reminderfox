
if(!reminderfox) var reminderfox={};
if(!reminderfox.category)		reminderfox.category = {};


	/**
	 * Add/delete  a category item  selected from pulldown menu and 
	 * modify the the "inputRmCategories" box;
	 * the 'inputRmCategories' box is read by 'addReminderDialog.js'
	 */
reminderfox.category.Set = function (event){
	var selectCat = event.label.replace(/,/g, "\\,");
	var inputCats = reminderfox.category.Clean(document.getElementById('inputRmCategories').value);

	// check if selected item in input string 
	if (!((',' + inputCats + ',').indexOf(',' + selectCat + ',') > -1)) {
		if (inputCats !== "") {
			newString = selectCat + ',' + inputCats; // *	add item
		} else {
			newString = selectCat;
		}
	}
	else { // * 	delete Item 
		var inputCatsArray = reminderfox.category.Array(inputCats);
		var cCount = inputCatsArray.length;
		
		var newString = "";
		for (i = 0; i < cCount; i++) {
			var curCat = (inputCatsArray[i]);
			if ((selectCat.toLowerCase() != reminderfox.util.escapeCommas(curCat.toLowerCase())) && (curCat != "")) {
				newString += reminderfox.util.escapeCommas(curCat) + ",";
			}
		}
	}
	document.getElementById('inputRmCategories').value = reminderfox.category.NoDup(newString);
};


	/**
	 * Add the current perfs-categories to the pull-down-menu
	 */
reminderfox.category.Setup = function (){
	var itemTextbox = document.getElementById('inputRmCategories');
	var itemCur = itemTextbox.value;
	
	var curCatArray = reminderfox.category.Array(itemCur)
	var cCount = curCatArray.length;
	
	/* first we delete all cat-items categories, hold the 'manage-menuitem' */
	
	var mList = document.getElementById('categories-menupopup');
	var count = mList.childNodes.length;
	
	while (count--) {
		var child = mList.childNodes[count];
		if (child.getAttribute("value") != 3) {
			mList.removeChild(mList.childNodes[count]);
		}
	}
	var m1 = document.createElement("menuseparator");
	(mList.insertBefore(m1, mList.childNodes[0]));
	
	/* now we read both categories 'user' and 'standard' from prefs */
	// -- first we add the 'standard' cat-items --
	var rmCategoriesStandard = reminderfox.core.readCategories2prefs();
	var catArray = reminderfox.category.Array(rmCategoriesStandard)
	var count2 = catArray.length
	var mCount = count2 + 1; /* rem the pos for 'user' items */
	while (count2--) {
		var m1 = document.createElement("menuitem");
		var newItem = reminderfox.util.trim(catArray[count2]);
		// apply parameters
		m1.setAttribute("type", "checkbox");
		m1.setAttribute("value", "2");
		m1.addEventListener("command", function() {reminderfox.category.Set(this);},false);
		m1.setAttribute("label", newItem);
		
		for (var i = 0; i < cCount; i++) {
			if (newItem.toLowerCase() == reminderfox.util.trim(curCatArray[i].toLowerCase())) {
				m1.setAttribute("checked", true);
			}
		}
		// insert the new element into the DOM before node 0
		(mList.insertBefore(m1, mList.childNodes[0]));
	}
	
	
	var m1 = document.createElement("menuseparator");
	(mList.insertBefore(m1, mList.childNodes[mCount]));
	
	// -- second we add the 'user' cat-items --
	catArray = reminderfox.category.GetUsers();
	
	var count2 = catArray.length
	
	while (count2--) {
		newItem = reminderfox.util.trim(catArray[count2]);
		if (newItem != "") {
			var checkCat = false;
			var m1 = document.createElement("menuitem");
			// apply parameters
			m1.setAttribute("type", "checkbox");
			m1.setAttribute("value", "1");
			m1.addEventListener("command", function() {reminderfox.category.Set(this);},false);
			m1.setAttribute("label", newItem);
			for (i = 0; i < cCount; i++) {
				if (newItem.toLowerCase() == reminderfox.util.trim(curCatArray[i].toLowerCase())) {
					m1.setAttribute("checked", true);
				}
			}
			// insert the new element into the DOM before node 0
			(mList.insertBefore(m1, mList.childNodes[mCount]));
		}
	}
};

/**
 *  go through all reminders and todos and get all referenced categories that are not defined
 *  in the standard categories
 */
reminderfox.category.GetUsers = function(){
	var reminders;
	var _todosArray;
	var reminderFoxListWindow = reminderfox.util.getWindow("window:reminderFoxEdit");
	// get reminders and todos model from the list window if possible - this allows you to get the latest categories even if not yet saved to 
	// the ics file yet
	if (reminderFoxListWindow) {
		reminders = reminderFoxListWindow.reminderfox.core.getReminderEvents();
		_todosArray = reminderFoxListWindow.reminderfox.core.getReminderTodos();
	}
	else {
		reminders = reminderfox.core.getReminderEvents();
		_todosArray = reminderfox.core.getReminderTodos();
	}
	
	var rmCategoriesStandard = reminderfox.core.readCategories2prefs();
	var rmCatMainArray = reminderfox.category.Array(rmCategoriesStandard)
	var userCategories = new Array();
	for (var i = 0; i < reminders.length; i++) {
		if (reminders[i].categories != null && reminders[i].categories != "") {
			var currentReminderCategories = reminderfox.category.Array(reminders[i].categories)
			for (var j = 0; j < currentReminderCategories.length; j++) {
				var category = currentReminderCategories[j];
				if (!reminderfox.category.ContainedInList(rmCatMainArray, category)) {
					// add unique category to list (but only if not it default categories)
					if (!reminderfox.category.ContainedInList(userCategories, category)) {
						userCategories[userCategories.length] = category;
					}
				}
			}
		}
	}
	// now search the todo's as well
	for (var n in _todosArray) {
		var reminderTodos = _todosArray[n];
		for (i = 0; i < reminderTodos.length; i++) {
			if (reminderTodos[i].categories != null && reminderTodos[i].categories != "") {
				var currentReminderCategories = reminderfox.category.Array(reminderTodos[i].categories)
				for (var j = 0; j < currentReminderCategories.length; j++) {
					var category = currentReminderCategories[j];
					if (!reminderfox.category.ContainedInList(rmCatMainArray, category)) {
						// add unique category to list (but only if not it default categories)
						if (!reminderfox.category.ContainedInList(userCategories, category)) {
							userCategories[userCategories.length] = category;
						}
					}
				}
			}
		}
	}
	return userCategories.sort();
};

/**
 * Checks a category item if part of a given list
 * @return {boolean}
 */
reminderfox.category.ContainedInList = function(existingList, userCategory){
	for (var j = 0; j < existingList.length; j++) {
		if (reminderfox.util.trim(existingList[j].toLowerCase()) == reminderfox.util.trim(userCategory.toLowerCase())) {
			return true;
		}
	}
	return false;
};


reminderfox.category.NoDup = function(catA){
	var catAA = reminderfox.category.Array(catA);
	var catB = ",";
	for (var n = 0; n < catAA.length; n++) {
		if (catB.toLowerCase().indexOf(',' + reminderfox.util.escapeCommas(catAA[n].toLowerCase()) + ',') == -1) {
			catB += reminderfox.util.escapeCommas(catAA[n]) + ',';
		}
	}
	return reminderfox.category.Clean(catB);
};


reminderfox.category.Clean =function(str){ // lead-/trailing comma, single comma/spc
	return str.replace(/ \s*/g,' ').replace(/,\,*/g,',').replace(/\s\ */g,'')
				 .replace(/[,]+$/, '').replace(/^[,]+/, '')
};


reminderfox.category.Array = function(categoriesString){
	if (!categoriesString) {
		return [];
	}
	// \u001A is the unicode "SUBSTITUTE" character
	function revertCommas(name){
		return name.replace(/\u001A/g, ",");
	}
	
	return categoriesString.replace(/\\,/g, "\u001A").split(",").map(revertCommas);
};


//================manageCategories=========================================

reminderfox.category.addOrEdit = null;

	/**
	 * Read 'main' and 'default' Categories , write to textboxes
	 * manageCategoriesOverlay.xul
	 * reminderFoxOptions.js
	 */
	 
reminderfox.category.readDefault = function(){
	/*read both categories 'user' and 'main' from prefs */
	var rmCategoriesStandard = reminderfox.core.readCategories2prefs();
	
	// --  'main' cat-items --
	var catList = document.getElementById('mainCatBox');
	var count = catList.childNodes.length;
	
	while (count--) {
		if (catList.childNodes[count].getAttribute("value") != 3) {
			catList.removeChild(catList.childNodes[count])
		}
	}
	var catArray = reminderfox.category.Array(rmCategoriesStandard);
	var count2 = catArray.length
	
	while (count2--) {
		var m1 = document.createElement("listitem");
		// apply parameters & insert before node 0
		m1.setAttribute("label", reminderfox.util.trim(catArray[count2]));
		if (catList.childNodes.length == 0) {
			catList.insertBefore(m1, null);
		}
		else {
			catList.insertBefore(m1, catList.childNodes[0]);
		}
	}
};


reminderfox.category.saveGroupsAndClose = function(){
	reminderfox.category.saveGroups();
	window.close();
};


reminderfox.category.saveGroups = function(mode){
	var catMainList = document.getElementById('mainCatBox');
	var count = catMainList.childNodes.length;
	
	var rmCategoriesStandard = "";
	for (var i = 0; i < count; i++) {
		if (catMainList.childNodes[i].label != "") {
			rmCategoriesStandard += reminderfox.util.escapeCommas(catMainList.childNodes[i].label) + ",";
		}
	}
	if (mode != null) {
		var catArray = reminderfox.category.Array(rmCategoriesStandard);
		if (mode == 'up') rmCategoriesStandard = catArray.sort().join(',');
		if (mode == 'down') rmCategoriesStandard = catArray.sort().reverse().join(',');
	}
	
	reminderfox.core.writeCategories2prefs(reminderfox.category.NoDup(rmCategoriesStandard));
	
	return rmCategoriesStandard;
};
