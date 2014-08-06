
if (!reminderfoxX)     var reminderfoxX = {};
if (!reminderfox.calDAVcalls)  reminderfox.calDAVcalls = {

// ======================= call definitions ====================================
	getCTAG			: ['PROPFIND', 
							'<d:propfind xmlns:d=\"DAV:\" xmlns:cs=\"http://calendarserver.org/ns/\">\n'
							+'  <d:prop>\n'
							+'    <d:displayname />\n'
							+'    <cs:getctag />\n'
							+'  </d:prop>\n'
							+'</d:propfind>\n',
							'Depth:0'],

	reportALL		: ['REPORT',
							'<c:calendar-query xmlns:d=\"DAV:\" xmlns:c=\"urn:ietf:params:xml:ns:caldav\">\n'
							+'  <d:prop>\n'
							+'    <d:getetag />\n'
							+'    <c:calendar-data />\n'
							+'  </d:prop>\n'
							+'  <c:filter>\n'
							+'    <c:comp-filter name=\"VCALENDAR\"/>\n'
							+'  </c:filter>\n'
							+'</c:calendar-query>\n',
							'Depth:1'],

	reportVELEMENTS : ['REPORT',
							'<c:calendar-query xmlns:d="DAV:" xmlns:c="urn:ietf:params:xml:ns:caldav">\n'
							+'  <d:prop>\n'
							+'    <d:getetag />\n'
							+'    <c:calendar-data />\n'
							+'  </d:prop>\n'
							+'  <c:filter>\n'
							+'    <c:comp-filter name="VCALENDAR">\n'
							+'      <c:comp-filter name="%VELEMENTS%" />\n'	//exchange for VEVENTS/VTODOS etc
							+'    </c:comp-filter>\n'
							+'  </c:filter>\n'
							+'</c:calendar-query>\n',
							'Depth:1'],

	reportVETAGS	: ['REPORT',
							'<c:calendar-query xmlns:d="DAV:" xmlns:c="urn:ietf:params:xml:ns:caldav">\n'
							+'  <d:prop>\n'
							+'    <d:getetag />\n'
							+'  </d:prop>\n'
							+'  <c:filter>\n'
							+'    <c:comp-filter name="VCALENDAR">\n'
							+'      <c:comp-filter name="%VELEMENTS%" />\n'	//exchange for VEVENTS/VTODOS etc
							+'      </c:comp-filter>\n'
							+'  </c:filter>\n'
							+'</c:calendar-query>\n',
							'Depth:1'],

	deleteVELEMENT	: ['DELETE', 
							'',							// not required for delete
							'If-Match:%etag%'],		// If-Match: "2134-314"

	updateVELEMENT	: ['PUT',
							'',						// add the VCALENDAR to [1] 
							'If-Match:%etag%'],	// update [2] with currrent etag; etag can be a quoted string!

	newVELEMENT		: ['PUT',
							'',						// add the VCALENDAR to [1] 
							''],						// for new  [2] is empty! leave this empty

	multiget			: ['REPORT',
							'<c:calendar-multiget xmlns:d="DAV:" xmlns:c="urn:ietf:params:xml:ns:caldav">\n'
							+'		<d:prop>\n'
							+'			<d:getetag />\n'
							+'			<c:calendar-data />\n'
							+'		</d:prop>\n'
							+'		%<d:href/>%\n'
							+'</c:calendar-multiget>\n',
							'Depth:1'],

	listAllCalendars : ['PROPFIND',
							'<d:propfind xmlns:d="DAV:" xmlns:cs="http://calendarserver.org/ns/"'
							+' xmlns:c="urn:ietf:params:xml:ns:caldav">\n'
							+'  <d:prop>\n'
							+'    <d:resourcetype />\n'
							+'    <d:displayname />\n'
							+'    <cs:getctag />\n'
							+'    <c:supported-calendar-component-set />\n'
							+'  </d:prop>\n'
							+'</d:propfind>\n',
							'Depth:1'],

	findPRINCIPIAL  : ['PROPFIND', 
							'<d:propfind xmlns:d=\"DAV:" xmlns:cs=\"http://calendarserver.org/ns/\">\n'
							+'  <d:prop>\n'
							+'    <d:current-user-principal/>\n'
							+'    <d:displayname />\n'
							+'  </d:prop>\n'
							+'</d:propfind>\n',
							'Depth:1'],

	authorization_code : ['POST','code=%VELEMENTS%'
							+'&client_id=22822497261.apps.googleusercontent.com'
							+'&client_secret=BIzTsRJ9eHHwrwk3UArsmtnr'
							+'&grant_type=authorization_code'
							+'&redirect_uri=%redirect_uri%',
							'Depth:0'],

	refresh_token   : ['POST','refresh_token=%VELEMENTS%'
							+'&client_id=22822497261.apps.googleusercontent.com'
							+'&client_secret=BIzTsRJ9eHHwrwk3UArsmtnr'
							+'&grant_type=refresh_token',
							'Depth:0']
};



// ************ CalDAV Main UI functions ***********************
/**
 *  Generate a logger msg with account list / all valid account entries 
 *  A delete of invalid entries is optioal: see idStamp
 *  @param {char} account ID
 *  @param {msg1} passed message string to be appended to account list
 *  @param {number} idStamp controls the deletion of invalid reminders/events
 *    idStamp = null: no deletion
 *    idStamp = Date.getTime(), compared with account/events entries:
 *      idStamp > account[name]stamp will delete entries
 */
function rmFx_CalDAV_AccountListing (call) { 
// -----------------------------------------------------------------------
	var account, name, xreminder, uid, summary, msg, delMsg;

	if (!call.idStamp) {call.idStamp = 0;}
	var accountID = call.account.ID;

	account = reminderfox.calDAV.accounts[accountID];
	msg = "";
	for (name in account) {
		switch (name) {
			case 'ID':     msg += 'Account ' + name + '\t\t[' +account.ID + "]\n";break;
			case 'Typ':    msg += 'Account ' + name + '\t' +account.Typ + "\n";break;
			case 'Active': msg += 'Account ' + name + '\t' +account.Active + "\n";break;
			case 'Name':   msg += 'Account ' + name + '\t' +account.Name + "\n";break;
			case 'Url':    msg += 'Account ' + name + '\t' +account.Url + "\n";break;
			case 'Login':  msg += 'Account ' + name + '\t' +account.Login + "\n";break;
			case 'CTag':   msg += 'Account ' + name + '\t' +account.CTag + "\n";break;
			case 'Color':  msg += 'Account ' + name + '\t' +account.Color + "\n";break;

			default: {
				xreminder = (account.Typ == "VTODO") 
					? reminderfox.core.getTodosById(name, call.cTodos) : reminderfox.core.getRemindersById(name);

				if (!xreminder) { // it's NOT a reminder entry, check for indirect!

					if (account[name]) {		//NOT a reminder/ics entry
						uid = account[name].UID;
						xreminder = (account.Typ == "VTODO") 
							? xreminder = reminderfox.core.getTodosById(name, call.cTodos) : reminderfox.core.getRemindersById(name);

						if (!xreminder) {	// it's an indirect entry
								reminderfox.calDAV.accounts[accountID] = 
									reminderfox.util.removeObjectFromObject (reminderfox.calDAV.accounts[accountID], uid);
								reminderfox.calDAV.accounts[accountID] = 
									reminderfox.util.removeObjectFromObject (reminderfox.calDAV.accounts[accountID], name);
						}
					}

				} else {		// it's a reminder 
					xreminder.calDAVid = accountID;
					summary = "  Summary: " + xreminder.summary;

					if (account[name].etag) {		// this is the 'event.id' entry

						msg += 'Reminder ID \t' + name + summary 
							+ "\n\t\t  [ etag: " + account[name].etag
							+ "  status: " +  account[name].status  + " idStamp: " + call.idStamp
							+ ((call.idStamp === 0) ? '' : ('  *** del: '+ (call.idStamp > account[name].status)))
							+ " ]\n";

						// check to remove the event details from local account and reminders
						if ((call.idStamp !== 0) && (call.idStamp > account[name].status)) {
							reminderfox.calDAV.accounts[accountID] = 
								reminderfox.util.removeObjectFromObject (reminderfox.calDAV.accounts[accountID], name);
							try {		// skip if Main Dialog isn't open!
								removeUIListItemReminder(xreminder);
								modifiedReminders();
							} catch (ex) {}
							reminderfox.core.removeReminderFromDataModels(xreminder);
						}
					} else {   // this is the ics entry 

						msg += 'Reminder ID \t' + name  + summary 
							+ "\n\t\t  [ ics: " + account[name] 
							+  "  status: " +  account[account[name]].status
							+ '  del: '+ (call.idStamp > account[account[name]].status)
							+ " ]\n";

						if ((call.idStamp !== 0) && (call.idStamp > account[account[name]].status)) {
							uid = account[name];
							xreminder = (account.Typ == "VTODO") 
								? xreminder = reminderfox.core.getTodosById(name, call.cTodos) : reminderfox.core.getRemindersById(name);

							try {		// skip if Main Dialog isn't open!
								removeUIListItemReminder(xreminder);
								modifiedReminders();
							} catch (ex) {}
							reminderfox.core.removeReminderFromDataModels(xreminder);

							reminderfox.calDAV.accounts[accountID] = 
								reminderfox.util.removeObjectFromObject (reminderfox.calDAV.accounts[accountID], uid);
							reminderfox.calDAV.accounts[accountID] = 
								reminderfox.util.removeObjectFromObject (reminderfox.calDAV.accounts[accountID], name);
						}

					}
				}
			} //default
		} // switch
	} // account
	
	if (call.sMsg != null) call.msg = call.sMsg + call.msg
	reminderfox.util.Logger('calDAVaccount', msg + call.msg + "  call.idStamp: " + call.idStamp);
	if ((call.msg.indexOf("New Reminder") != -1) || (call.msg.indexOf("CTAG") != -1)){
		reminderfox.calDAV.accountsWriteOut (reminderfox.calDAV.accounts);
	}
}


/**
 * Build the menu with all defined CalDAV accounts
 * With selecting an account from the menu 
 * gets all new/changed 'events' from that CalDAV account/server
 */
function rmFx_CalDAV_AccountSelect () {
//------------------------------------------------------------------------------
	var calDAVaccounts = reminderfox.calDAV.accounts;

	var calDAV_accounts_popup = document.getElementById("calDAV_accounts_popup");
	while (calDAV_accounts_popup.hasChildNodes()) {
		if (calDAV_accounts_popup.lastChild.id == "calDAVaccountSeparator2") break;
		calDAV_accounts_popup.removeChild(calDAV_accounts_popup.lastChild);
	}

	//	<menuitem label="CalDAV Account 'P'"
	//		onclick="rmFx_getCalDAVdetails ('P' /*accountID*/); " type="radio" />
	for (var accountID in calDAVaccounts) {
		if (calDAVaccounts[accountID].Active && (calDAVaccounts[accountID].Typ == "VEVENT")) {
			var newAccount = document.createElement("menuitem");

			// for VEVENT
			newAccount.setAttribute("image", reminderfox.consts.SHAREW);

			newAccount.setAttribute("label", '[ ' + accountID + " ] " + calDAVaccounts[accountID].Name);
			newAccount.setAttribute("value", accountID);
			newAccount.setAttribute("tooltiptext", reminderfox.string('rf.caldav.syncAccount'));

			newAccount.addEventListener("command", function() {rmFx_CalDAV_SyncAccount(this.value);},false);

			calDAV_accounts_popup.appendChild(newAccount);
		}
	}

	var newSeparator = document.createElement("menuseparator");
		calDAV_accounts_popup.appendChild(newSeparator);

	for (var accountID in calDAVaccounts) {
		if (calDAVaccounts[accountID].Active  &&  (calDAVaccounts[accountID].Typ == "VTODO")) {
			var newAccount = document.createElement("menuitem");

			// for VTODO
			newAccount.setAttribute("style", "font-style:italic;");
			newAccount.setAttribute("image", reminderfox.consts.SHAREW);

			newAccount.setAttribute("label", '[ ' + accountID + " ] " + calDAVaccounts[accountID].Name);
			newAccount.setAttribute("value", accountID);
			newAccount.setAttribute("tooltiptext", reminderfox.string('rf.caldav.syncAccount'));

			newAccount.addEventListener("command", function() {rmFx_CalDAV_SyncAccount(this.value);},false);

			calDAV_accounts_popup.appendChild(newAccount);
		}
	}
}


/**
 * Sync all Reminders/Events from all 'Active' servers/accounts
 * Called from Foxy menu
 */
function  rmFx_CalDAV_SyncActiveAccounts(reload, trace) {
//------------------------------------------------------------------------------
reminderfox.util.Logger('checkData', "rmFx_CalDAV_SyncActiveAccounts  trace: " + trace)  //gWcheckData

	var _timeStamp = new Date().getTime();
	rmFx_CalDAV_ActiveAccountsList = "";
	rmFx_CalDAV_ActiveAccountsUpdate = false;

	var calDAVaccounts = JSON.parse(reminderfox.calDAV.accountsReadIn());
	for (var accountID in calDAVaccounts) {
		if (calDAVaccounts[accountID].Active === true) {
			rmFx_CalDAV_ActiveAccountsList += accountID;
		}
	}
	// without any accounts / remote calendars close the update.xul and do nothing
	if (rmFx_CalDAV_ActiveAccountsList === "") {
		var updateWindow = reminderfox.util.getWindow("window:rmFxCaldavUpdate");
		if (updateWindow) updateWindow.close();
		return;
	}
	rmFx_CalDAV_ActiveAccountsReload = reload;
	rmFx_CalDAV_SyncActiveAccountsNext(false);
}


		var rmFx_CalDAV_ActiveAccountsUpdate = null;	// flag if one of the calendars had updates
		var rmFx_CalDAV_ActiveAccountsReload = null;
		var rmFx_CalDAV_ActiveAccountsList = "";

		function rmFx_CalDAV_SyncActiveAccountsNext(update) {
		//---------------------------------------------------------------------------
			var updateWindow = reminderfox.util.getWindow("window:rmFxCaldavUpdate");

			if (update) rmFx_CalDAV_ActiveAccountsUpdate = true;

			if ((rmFx_CalDAV_ActiveAccountsList !== "")){  // check for more accounts 
				var accountID = rmFx_CalDAV_ActiveAccountsList[0];
				if (accountID) {
					rmFx_CalDAV_ActiveAccountsList = rmFx_CalDAV_ActiveAccountsList.substring(1);

					var myRequest = new reminderfoxX.XcalDAVrequest();
					myRequest.SyncAccount(accountID, myRequest);
				}

			} else { // no more accounts to sync/update
				// check to close the 'remote calendar update' xul
				if (updateWindow) updateWindow.close();

				reminderfox.core.importRemindersUpdateAll(true /*isNetworkImport*/);

				// if one remote calendar had a new/updated event--> reload the main list
				if (rmFx_CalDAV_ActiveAccountsUpdate) {

					var topWindow = reminderfox.util.getWindow("window:reminderFoxEdit"); 
					if (topWindow) {
						topWindow.focus();

						reminderfox.core.clearRemindersAndTodos();

						reminderfox.calendar.ui.selectDay();

						selectCalendarSync = false;
						// remove all of the calendar items and re-add them
						removeAllListItems(true, true);
						calendarReminderArray = null; // null out in case reminder columns are sorted
						calendarTodoArray = null;
						fillList(true, true);
						selectCalendarSync = true;

						reminderfox.core.statusSet("");

						reminderfoxModifyButtons (false);
						rmFx_CalDAV_ActiveAccountsReload = false;
						// need to focus the main dialog list to 'today'
						reminderfox.calendar.ui.selectDay('today');
					}
				}
				rmFX_calDAV_progressmeterOnMain();
				reminderfox.util.Logger('calDAV', " *** DONE ***  rmFx_CalDAV_SyncActiveAccounts ");
			}
		}


/**
 * Syncs one selected account or optional with right mouse update event(s)
 * Removes local entries with no representation on server/account
 * Generates a list of all local account entries
 */
function rmFx_CalDAV_SyncAccount (accountID) {
//------------------------------------------------------------------------------
	rmFx_CalDAV_ActiveAccountsUpdate = false;
	var myRequest = new reminderfoxX.XcalDAVrequest();
	myRequest.SyncAccount(accountID, myRequest);
}


/**
 *  Check selected calendar in pulldown menu with setup/login
 *    to get # of events
 *  Called with pulldown menu change or [Login]
 */
function rmFx_CalDAV_accountValidate (xthis, xAccounts) {
//------------------------------------------------------------------------------
//	http://localhost/owncloud/apps/calendar/caldav.php/calendars/{AccountLogin}/default calendar/
//	urlServer = "http://localhost/"
//	urlDav = "http://localhost:5232/"   // like with Radicale
//	GCal OAuth2  need the access_token  --> call.access_token

// set [Login] button, with GCal2 it's [Paste]
	document.getElementById('loginButton').label      = 'Login';
	document.getElementById('loginButton').disabled   = false;

	document.getElementById('loginButton').setAttribute('oncommand','rmFxCalDAVedit.accountValidate(this);');
	document.getElementById('loginButton').setAttribute('tooltiptext',"");

	var calDAVserver = document.getElementById('calDAVserver').selectedItem.getAttribute('urlDav');
	var accountURLlist = document.getElementById('accountURLlist');

	if (accountURLlist) {
		// do nothing if no 'calendar' is selected
		if (accountURLlist.selectedIndex === 0) return;

		var calendarUrl = document.getElementById('accountURLlist').selectedItem.getAttribute('url');
		var calendarTyp = document.getElementById('accountURLlist').selectedItem.getAttribute('typ');
		if (calDAVserver === "") {
			// "http://localhost/owncloud/apps/calendar/caldav.php/calendars/admin/"
			var a = (document.getElementById('accountURLtext').value).split("/");
			calDAVserver = a[0]+"//"+a[2];
		}
		document.getElementById('accountLogin').setAttribute('accountURL', calDAVserver + calendarUrl);
		document.getElementById('accountLogin').setAttribute('accountTyp', calendarTyp);

	// if this is an active account, change name/ID!
		var accountLabel = document.getElementById('accountURLlist').selectedItem.getAttribute('label');

		if(xthis.id === "accountURLpopup") { // only build name with Calendar menu selection
			var nam = document.getElementById('calDAVserver').label;
			var pos = nam.indexOf(' ');
			accountLabel += " (" + ((pos > -1) ? (nam.substring(0,pos)) : nam) + ")";
			document.getElementById('accountName').value     = accountLabel;
			document.getElementById('accountName').disabled  = false;
			document.getElementById('accountID').disabled    = false;
			document.getElementById('accountID').value       = "";
		}
		var aID = document.getElementById('accountID').value;
		if (aID === "") aID = accountLabel;
		aID = aID.charAt(0).toUpperCase();
		document.getElementById('accountStatus').value = "";

		if (!xAccounts[aID]) {
			document.getElementById('accountIDStatusLabel').value = "";
			document.getElementById('accountID').value = aID;
		} else {
			document.getElementById('accountIDStatusLabel').value = "Select a different Account ID, already used: [" + aID +"]";	//$$$_locale
			document.getElementById('accountID').value = "?";
		}
	//   enable next line and changing the "Select your Calendar" menu will not do directly an Login as well
	//	if(xthis.id == "accountURLpopup") return  // ???? only go with [Login] for AccountCheck

	} else {
		document.getElementById('accountURLtext').value = document.getElementById('accountLogin').getAttribute('accountURL');
	}

	var myRequest = new reminderfoxX.XcalDAVrequest();
	myRequest.AccountCheck(myRequest);
}


/**
 * Delete for a selected reminder/event/todo the 'local' account details 
 * and send REMOVE to server/account
 * Generates a list with valid account entries
 * called from Main Dialog or Calendar 
 */
function rmFx_CalDAV_ReminderDelete(reminder, caller, calDAVid2Delete) {
//------------------------------------------------------------------------------
	// removing a remote calendar ID for an reminder will have
	// reminder.calDAVid           $[0] = [string] ""
	// reminder.calDAVidOriginal   $[1] = [string] "V"

	if (((!reminder.calDAVid) || (reminder.calDAVid === "")) 
		&& (reminder.calDAVidOriginal))
	{
		calDAVid2Delete = reminder.calDAVidOriginal;
	} else {
		if ((!reminder.calDAVid) || (reminder.calDAVid === "") 
			|| (!reminderfox.calDAV.accounts[reminder.calDAVid].Active)){
			 return;
		}
		if (reminder.calDAVidOriginal && (reminder.calDAVid != reminder.calDAVidOriginal)) {
			calDAVid2Delete = reminder.calDAVidOriginal;
		} else {
			calDAVid2Delete = reminder.calDAVid;
		} 
	}

	var logMsg = " rmFx_CalDAV_ReminderDelete   go with  calDAVid2Delete >>" + calDAVid2Delete + "<<";
	//reminderfox.util.Logger('calDAV', logMsg);


	var cReminders = [];
	cReminders[0] = reminder;
	if (!caller) caller = this;
	caller.ID = new Date().getTime();
	var myRequest = new reminderfoxX.XcalDAVrequest();

	myRequest.DeleteReminder(calDAVid2Delete, cReminders, caller);
}

/**
 * Updates the remote entity of a reminder/event on server/account
 * The reminder/event has the accountId (.calDAVid), if not (it's a local event), just return 
 * Finally generates a list with valid account entries
 */
function rmFx_CalDAV_UpdateReminder (reminder) {
//------------------------------------------------------------------------------
// reminderfox.util.Logger("ALERT", " rmFx_CalDAV_UpdateReminder   " + reminder.summary + "   >>" + reminder.calDAVid + "<<");

	if ((!reminder.calDAVid) || (reminder.calDAVid === "")) return;

	var cReminders = [];
	cReminders[0] = reminder;

	var myRequest = new reminderfoxX.XcalDAVrequest();
	myRequest.multiple = null;
	myRequest.UpdateReminder(reminder.calDAVid, cReminders, myRequest);
}



/**
 * Update multiple events selected on the MainList;
 * The events should not have an accountID already --> error 409  //XXX ???
 * @param {char} account ID 
 */
function rmFx_CalDAV_UpdateReminderMultiple (accountID) {
//------------------------------------------------------------------------------
	// add or update the accountID for each of the slected events
	var reminders = getAllSelectedReminders(); // from 'reminder list' context menu
	var _reminders = [];
	for (var n =0; n < reminders.length; n++) {
		var thisReminder = reminders[n];
		if ((!thisReminder.calDAVid) || (thisReminder.calDAVid == accountID)) { 
			thisReminder.calDAVid = accountID;
			_reminders.push(thisReminder);
		}
	}

	rmFx_CalDAV_Reminders2Update = _reminders;
	rmFx_CalDAV_Reminders2UpdateIndex = -1;		// Start with index 0, increments with each call first!
	rmFx_CalDAV_UpdateReminderNext();
}

	var rmFx_CalDAV_Reminders2Update = null;
	var rmFx_CalDAV_Reminders2UpdateIndex = 0;


	function rmFx_CalDAV_UpdateReminderNext () {
	//------------------------------------------------------------------------------
	rmFx_CalDAV_Reminders2UpdateIndex++;
	var _reminder = rmFx_CalDAV_Reminders2Update[rmFx_CalDAV_Reminders2UpdateIndex];
	if (!_reminder) return;

	var cReminders = [];
	cReminders[0] = _reminder;

	var myRequest = new reminderfoxX.XcalDAVrequest();
	myRequest.multiple = (rmFx_CalDAV_Reminders2Update.length > rmFx_CalDAV_Reminders2UpdateIndex) ? true : false;
	myRequest.UpdateReminder(_reminder.calDAVid, cReminders, myRequest);
	}


/**
 * Deletes a reminder/event on one account and adds its copy to the other
 * The X-RmFx-calDAV-properties of the reminders used for del/add 
 */
function rmFx_CalDAV_ReminderMoved (reminder){
//------------------------------------------------------------------------------
	var msg = "Reminder moved from  [" + reminder.calDAVidOriginal + "]  to  [" + reminder.calDAVid + "]";
//	reminderfox.util.Logger('ALERT', msg);		//XXX  better dialog!

	var call = [];
	// if .calDAVid is given add the reminder as ".eventToAdd" for processing 
	// after deleting the original
	if (reminder.calDAVid !== "") call.eventToAdd = reminder;

	rmFx_CalDAV_ReminderDelete(reminder, call, reminder.calDAVidOriginal);
}


/**
 *  "Local" Reminders with CalDAV indicator but no equivalent on server will
 * be changed to 'local' event, but summary has leading '[?X]' with X the previous
 * assigned account ID 
 */
function rmFx_CalDAV_makeLostReminder(name) {
//------------------------------------------------------------------------------
	// if the 'lostEvent' is unknown, just return
	var lostReminder = reminderfox.core.getRemindersById(name);
	if (!lostReminder) return;

	// add to .summary the previous calDAVid // calDAVid remove element
	lostReminder.summary = "[?"+ lostReminder.calDAVid + "]  " +lostReminder.summary;
	lostReminder.calDAVid = null;

	var reminders = reminderfox.core.getReminderEvents();
	reminderfox.core.removeReminderFromDataModels(lostReminder);
	var sortedIndex = reminderfox.core.getSortedIndexOfNewReminder(reminders, lostReminder, false);
	reminderfox.core.insertIntoArray(reminders, lostReminder, sortedIndex);
}




/**
 * Get all defined calendars for an account on supported 'calendar server'
 */
function rmFx_CalDAV_accountsGet (xthis, xAccounts) {
//------------------------------------------------------------------------------
	var principal, myRequest, url, username, pw, serverID, accountURL;

	serverID =  xthis.getAttribute('serverID');
	if (serverID === "") return;

	username     = document.getElementById('accountLogin').value;
		if (username === "") {
		document.getElementById('accountStatus').value = "Enter user name!"; //$$$_locale  reminderfox.string
		document.getElementById('accountStatus').setAttribute('style', "font-weight:bold;color:red;");
		return false;
	}

	// **** Google Calendar with OAuth2 ****
	if (serverID == "GCal2") {
		url = "https://accounts.google.com/o/oauth2/auth?response_type=code&client_id=22822497261.apps.googleusercontent.com&redirect_uri=urn:ietf:wg:oauth:2.0:oob&scope=https://www.googleapis.com/auth/calendar"; 
		reminderfox.util.openURL(url);
		return;
	}

	pw = document.getElementById('accountPW').value;
		if (pw === "") {
		document.getElementById('accountStatus').value = "Enter user password!";  //$$$_locale  
		document.getElementById('accountStatus').setAttribute('style', "font-weight:bold;color:red;");
		return false;
	}


	// ******** fruux ***********
	//    /calendars/{AccountID}/calendar/
	if (serverID == "fruux") {
		principal="https://fruux.com/.well-known/caldav";
		myRequest = new reminderfoxX.XcalDAVrequest();
		myRequest.fruuxPrincipal(this, xAccounts, principal);
		return false;
	}


	// **** Google Calendar ****
	// https://www.google.com/calendar/dav/{AccountLogin}/
	if (serverID == "GCal") {

		accountURL = document.getElementById('calDAVserver').value;
		document.getElementById('accountLogin').setAttribute('accountURL',accountURL);

		principal = "https://www.google.com/calendar/dav/" + document.getElementById('accountLogin').value + "/";
	}


	// **** ownCloud (local) ****
	// "http://localhost/owncloud/apps/calendar/caldav.php/calendars/{AccountLogin}/"
	if (serverID == "OC_local") {

		accountURL = document.getElementById('calDAVserver').value;
		document.getElementById('accountLogin').setAttribute('accountURL',accountURL);

		principal = "http://localhost/owncloud/apps/calendar/caldav.php/calendars/" 
			+ document.getElementById('accountLogin').value + "/";
	}


	// **** Radicale ****
	// "http://localhost:5232/{AccountLogin}/"
	if (serverID == "Radicale"){
		principal = "http://localhost:5232/" + document.getElementById('accountLogin').value + "/";		//§§§Radicale ???
	}


	// **** General ****
	// url set by user
	// "http://localhost/owncloud/apps/calendar/caldav.php/calendars/{AccountLogin}/"
	if (serverID == "General"){
		principal = document.getElementById('accountURLtext').value;
}

		var self = this;
		self.serverID = serverID;
		myRequest = new reminderfoxX.XcalDAVrequest();
		myRequest.Accounts (this, xAccounts, principal);
}


/**
 * Build menuList for all calendars available
 * Buttons:  Disable [Request]; change [Paste] to [Login]
 */
function rmFx_CalDAV_accountMenu (calendars) {
//------------------------------------------------------------------------------
	var menuitem, menuList, menupopup, accountURLBox, calName, menuTitle;

	document.getElementById('requestGCal2Button').disabled = true;
	document.getElementById('loginButton').label           = 'Login';
	document.getElementById('loginButton').disabled        = true;		// enables after calendar selection with menu
	document.getElementById('loginButton').setAttribute('oncommand','rmFxCalDAVedit.accountValidate(this);');
	document.getElementById('loginButton').setAttribute('tooltiptext',"");

	accountURLBox = document.getElementById('accountURLBox');
	while (accountURLBox.hasChildNodes()) {
		if (accountURLBox.lastChild.id != "accountURLtext") accountURLBox.removeChild(accountURLBox.lastChild);
		if (accountURLBox.lastChild.id == "accountURLtext") break;
	}
	document.getElementById('accountURLtext').hidden = true;

	document.getElementById('accountIDStatusLabel').value = "";

	menuList = document.createElement("menulist");
		accountURLBox.appendChild(menuList);
			menuList.setAttribute("id", "accountURLlist");
			menuList.setAttribute("tooltiptext", "Select your calendar");

	menupopup = document.createElement("menupopup");
		menuList.appendChild(menupopup);
			menupopup.setAttribute("id", "accountURLpopup");
		// menu change will select calendar and enable [Login]
			menupopup.setAttribute("onpopuphiding", "rmFxCalDAVedit.accountValidate(this);");

		menuitem = document.createElement("menuitem");
			menupopup.appendChild(menuitem);
				menuitem.setAttribute("label", '-- Select Calendar/Tasks --');		//$$$_locale
				menuitem.setAttribute("url", "");
				menuitem.setAttribute("typ", "");
				menuitem.setAttribute("tooltiptext", "");



	for (calName in calendars) {
		if (calendars[calName].VEVENT) {
			menuitem = document.createElement("menuitem");
			menupopup.appendChild(menuitem);
			menuitem.setAttribute("label", calName);
			menuitem.setAttribute("url", calendars[calName].VEVENT);
			menuitem.setAttribute("typ", "VEVENT");
			menuitem.setAttribute("tooltiptext", calendars[calName].VEVENT);
		}
	}
	var vSeparator;

	for (calName in calendars) {
		if (calendars[calName].VTODO) {
			if (!vSeparator) {
				vSeparator = true;
				var newSeparator = document.createElement("menuseparator");
				menupopup.appendChild(newSeparator);
			}
			menuitem = document.createElement("menuitem");
			menupopup.appendChild(menuitem);
			menuitem.setAttribute("label", calName);
			menuitem.setAttribute("url", calendars[calName].VTODO);
			menuitem.setAttribute("typ", "VTODO");
			menuitem.setAttribute('style', "font-style:italic;");
			menuitem.setAttribute("tooltiptext", calendars[calName].VTODO);
		}
	}


	menupopup.parentElement.selectedIndex =0;
}


// ================ main function / parameters / objects =======================
reminderfoxX.XcalDAVrequest = function () {}

/*----   account definition ---
"R":{
	"Name":"Reminderfox Project",
	"ID":"R",
	"Typ":"VEVENT",
	"Active":true,
	"Url":"https://dav.fruux.com/calendars/a1234567890/calendar/",
	"Login":"abXXx@xyz.en",
	"CTag":79,   // entries for reminders on server with account[UID] /reminder.id
----------*/


// ======================== Requests ===========================================
		/**
		 * get the principal addresses for the user defined 'calendars' 
		 */
		reminderfoxX.XcalDAVrequest.prototype.gCalPrincipal = function (call) {
		// --------------------------------------------------------------------------
			call.request      = 'findPRINCIPIAL';
			call.callback     = 'gCalPrincipalFound';

			call.username     =  document.getElementById('accountLogin').value;
			call.password     = "";

			call.url          = "https://www.googleapis.com/caldav/v2/" + call.username;

			call.Typ          = "";

			call.contentType  = "application/xml";
			call.vCalendar    = "";

			call.href         = null;
			call.urlstr       = null;

			call.timeout      = 30;

			var myHTTP = new reminderfoxX.XcalDAVhttp();
			myHTTP.sendContentToURL(this, call);
		};


		reminderfoxX.XcalDAVrequest.prototype.gCalPrincipalFound = function(status, xml, text, headers, statusText, call) {
		// --------------------------------------------------------------------------
		var msg, _name, _href;
		var callMsg = rmFx_CalDAV_callMsg (status, statusText, call);

		if (status === 0 || (status >= 200 && status < 300)) {

			if (!xml) {
				msg = callMsg
					+  "  Principal: " + status + "\n" + text;
				reminderfox.util.Logger('calDAVprincipal', msg);
				return;
			}
			var jXml = new reminderfox.HTTP.JXONTree(xml); 
			var responses = reminderfox.HTTP.XMLobject (jXml, "response");

			msg = callMsg
				+  "  Principal: " + status + "\n" + text
				+  "  Response length: " + responses.length;

			var _calendars = [];
			for (var n=0; n < responses.length; n++) {

				if (responses[n].href.keyValue.search("/events/") != -1) {
					_name = reminderfox.HTTP.XMLobject (responses[n], "displayname").keyValue;
					_href = responses[n].href.keyValue;

					//Google Calendar V2 don't return 'comp' as the component type (VEVENT/VTODO)
					// so we hack it here   ugh ugh
					// that way it's compatible with other Calendar systems!
		//			_calendars[_name] = _href;
					_calendars[_name] = {};
					_calendars[_name]['VEVENT'] = _href;

					msg += "\n" + _name +  ": "  + _href;
				}
			}
			reminderfox.util.Logger('calDAV', msg);

			rmFx_CalDAV_accountMenu (_calendars);

		} else {  // ERROR Handling
			// check for GCal2 and refresh the access token 
			if ((call.url.search("https://www.googleapis.com/caldav/v2/") === 0) && (status == 401)) {
				rmFx_CalDAV_getGCALAccessToken (call.username);
				return;
			}

			rmFx_CalDAV_error(status, statusText, call);
		}};



		/**
		 * Check https://fruux.com/.well-known/caldav
		 *  to get the principal address which is required to get the
		 *  user defined 'calendars' 
		 */
		reminderfoxX.XcalDAVrequest.prototype.fruuxPrincipal = function (call, accounts, wellknown) {
		// --------------------------------------------------------------------------
			if (wellknown === "") return;

			document.getElementById('accountStatus').setAttribute('validated', false);
			document.getElementById('accountStatus').value = "";
			rmFX_calDAV_progressMeter(true);

			call.request      = 'findPRINCIPIAL';
			call.callback     = 'fruuxPrincipalFound';

			call.accounts     = accounts;

			call.account      = {};
			call.account.Name = "";
			call.account.ID   = "";

			call.url = wellknown;  // "https://fruux.com/.well-known/caldav"

			call.username     = document.getElementById('accountLogin').value;
			call.password     = document.getElementById('accountPW').value;
			call.Typ          = "";

			call.contentType  = "application/xml";
			call.vCalendar    = "";

			call.href         = null;
			call.urlstr       = null;

			call.timeout      = 30;

			var myHTTP = new reminderfoxX.XcalDAVhttp();
			myHTTP.sendContentToURL(this, call);
		};


		reminderfoxX.XcalDAVrequest.prototype.fruuxPrincipalFound = function(status, xml, text, headers, statusText, call) {
		// --------------------------------------------------------------------------
		var principal, p, href, href1;
		var callMsg = rmFx_CalDAV_callMsg (status, statusText, call);

		rmFX_calDAV_progressMeter();
		if (status === 0 || (status >= 200 && status < 300)) {

			var msg = callMsg
				+  "  Principal: " + status + "\n" + text;
			reminderfox.util.Logger('calDAVprincipal', msg);

			if (!xml)  return;

			principal = new reminderfox.HTTP.JXONTree(xml); 
			p = reminderfox.HTTP.XMLobject (principal, "current-user-principal");
			href = reminderfox.HTTP.XMLobject (p, "href");
			href1 = (href.keyValue).substring(15);

			principal = "https://dav.fruux.com/calendars"+ href1;

			reminderfoxX.XcalDAVrequest.prototype.Accounts (call, accounts, principal); 

		} else {  // ERROR Handling
			rmFx_CalDAV_error(status, statusText, call);
		}};




		reminderfoxX.XcalDAVrequest.prototype.Accounts = function (call, accounts, principal) {
		// --------------------------------------------------------------------------
			document.getElementById('accountStatus').setAttribute('validate',false);
			document.getElementById('accountStatus').value = "";
			rmFX_calDAV_progressMeter(true);

			document.getElementById('accountName').value = "{Calendar Name}";
			document.getElementById('accountID').value = "";
			document.getElementById('accountIDStatusLabel').value = "";

			call.request      = 'listAllCalendars';
			call.callback     = 'haveCalendars';

			call.account      = {};
			call.account.Name = "";
			call.account.ID   = "";

			call.url = principal;  // https://dav.fruux.com/calendars/a1234567890

			call.username     = document.getElementById('accountLogin').value;
			call.password     = document.getElementById('accountPW').value;

			call.contentType  = "application/xml";
			call.vCalendar    = "";

			call.href         = null;
			call.urlstr       = null;

			call.timeout      = 30;

			var myHTTP = new reminderfoxX.XcalDAVhttp();
			myHTTP.sendContentToURL(this, call);
		};

		/*
		 * get returned calendars for the menuList
		 */
		reminderfoxX.XcalDAVrequest.prototype.haveCalendars = function(status, xml, text, headers, statusText, call) {
		// --------------------------------------------------------------------------
		var msg, responses, xmlAll;
		var callMsg = rmFx_CalDAV_callMsg (status, statusText, call);

		rmFX_calDAV_progressMeter();
		if (status === 0 || (status >= 200 && status < 300)) {

			document.getElementById('accountStatus').setAttribute('validate',false);
			document.getElementById('accountStatus').value = "";

			msg = callMsg + "  " + call.username
				+ "  HaveCalendars: " + status + "\n" + text;
			reminderfox.util.Logger('calDAV', msg);

			// 'radicale' returns status=0 if not running
			//XXX
			if ((call.url == "http://localhost:5232/") && (status === 0)) {
				reminderfox.util.PromptAlert("Remote Calendar 'Radicale'\n\n Check Online status or Calendar(s) availability!");
				return;
			}

			if (!xml) {return;}

			xmlAll = new reminderfox.HTTP.JXONTree(xml); 
			responses = reminderfox.HTTP.XMLobject (xmlAll, "response");

			if (!responses) {
				document.getElementById('accountStatus').value = "Could not retrieve calendars components. Please try again.";
				return;
			}

	//		reminderfox.util.Logger('calDAV', "xml      type: " + (typeof xml));
	//		reminderfox.util.Logger('calDAV', "xmlAll   json: " + (typeof xmlAll) + " "+ JSON.stringify(xmlAll));

			msg = callMsg
				+ "\n   Response   length: " + responses.length
				+ "     JSON \n" + JSON.stringify(responses);
			reminderfox.util.Logger('calDAV', msg);

			var _calendars = [];
			var _Response = null;
			var keyAttributes = null;

			for (var i in responses) {
				_Response = responses[i];
				var _types = reminderfox.HTTP.XMLobject (_Response, 'resourcetype');
				if(_types.calendar) {

					var comp = reminderfox.HTTP.XMLobject (_Response, 'comp');
					for (var j in comp) {
						if (j == 'keyAttributes') 
							keyAttributes = comp[j];
						else
							keyAttributes = comp[j].keyAttributes;
						if ((keyAttributes) && (keyAttributes.name == 'VEVENT') || (keyAttributes.name == 'VTODO')) {

							var _href = responses[i].href.keyValue;
							var _name = reminderfox.HTTP.XMLobject (_Response, 'displayname').keyValue;

							if (!_name) {	// in case remote calendar (like Radicale) don't return a 'displaynamme'
								_name = _href.replace(new RegExp(/\/\//g), "/");
								var posIcs = _name.toLowerCase().lastIndexOf(".ics");
								if (posIcs > -1) {
									_name = _name.substring(0,posIcs)
								}
								var pos = _name.lastIndexOf("/");
								if (pos > 0) {
									_name = _name.substring(pos+1);
								}
							}

							if (keyAttributes.name == "VTODO")  _name = "t:" + _name;

							_calendars[_name] = {};
							_calendars[_name][keyAttributes.name] = _href;
	
							reminderfox.util.Logger('calDAV', i + ": " + _name + "  " + _href + "  " + keyAttributes.name);
						}
					}
				}
			}
			rmFx_CalDAV_accountMenu (_calendars);

		} else {  // ERROR Handling

			msg = "";
			if (call) {
				msg += "\n  url : " + call.url;
			}

			if (status == 404) { // check for fruux and owncloud error check for "Not found" .. just try again
				var xError = new reminderfox.HTTP.JXONTree(xml); 
				var sException = reminderfox.HTTP.XMLobject (xError, "exception");  //  xError["error"]["exception"]
				var sMessage = reminderfox.HTTP.XMLobject (xError, "message");

				if (sMessage) msg += "\n  " + sMessage.keyValue;
			}
			rmFx_CalDAV_error(status, statusText, call);
		}};


		/** 
		 * Check CalDAV setup against remote server
		 *  If success: store PW with FX/TB pw manager and set msg
		 *  otherwise set msg to 'Failed!'
		 * 
		 * Called from Options --> tab:Sync --> Setup/Edit Accounts (calDAVedit.xul)   [Check Account]
		 */
		reminderfoxX.XcalDAVrequest.prototype.AccountCheck = function (call) {
		// --------------------------------------------------------------------------
			document.getElementById('accountStatus').setAttribute('validate',false);
			document.getElementById('accountStatus').value = "";
			rmFX_calDAV_progressMeter(true);

			call.request      = 'getCTAG';
			call.callback     = 'validAccount';

			call.account      = {};
			call.account.Name = document.getElementById('accountName').value;
			call.account.ID   = document.getElementById('accountID').value;

			call.url          = document.getElementById('accountLogin').getAttribute('accountURL');
			call.Typ          = document.getElementById('accountLogin').getAttribute('accountTyp');		// VEVENT or VTODO
			call.username     = document.getElementById('accountLogin').value;
			call.password     = document.getElementById('accountPW').value;

			call.contentType  = "application/xml";

			call.href         = null;
			call.urlstr       = null;

			call.timeout      = 30;

			var myHTTP = new reminderfoxX.XcalDAVhttp();
			myHTTP.sendContentToURL(this, call);
		};


		reminderfoxX.XcalDAVrequest.prototype.validAccount = function(status, xml, text, headers, statusText, call) {
		// --------------------------------------------------------------------------
		var msg;
		var callMsg = rmFx_CalDAV_callMsg (status, statusText, call);

		rmFX_calDAV_progressMeter();
		if (status === 0 || (status >= 200 && status < 300)) {
			if (!xml) {
				msg = callMsg + " [" + call.account.ID + "]  " + call.account.Name;
				msg += "\n  url : " + call.url;
				reminderfox.util.PromptAlert("Check Remote Calendar Online status or Calendar(s) availability!");
				return;
			}

			var xCtag = new reminderfox.HTTP.JXONTree(xml); 
			var ctag = reminderfox.HTTP.XMLobject (xCtag, "getctag");
			if (ctag) {
				call.ctag = ctag.keyValue;
			} else {
				call.ctag = "null";
			}
			document.getElementById('accountStatus').setAttribute('validate',true);
			document.getElementById('accountStatus').value = "Validated! CalDAV account saved. ";		//$$$_locale
			document.getElementById('accountStatus').setAttribute('style', "font-weight:bold;color:black;");

			// OK to save username, PW, url to passwordManager
			reminderFox_savePassword({
				ljURL    : document.getElementById('accountLogin').getAttribute('accountURL'),
				username : document.getElementById('accountLogin').value,
				password : document.getElementById('accountPW').value,
				savePassword : true
			});

			rmFX_calDAV_progressMeter(true);
			call.request      = 'reportVETAGS';
			call.callback     = 'readEtag';

			var myHTTP = new reminderfoxX.XcalDAVhttp();
			myHTTP.sendContentToURL(this, call);

		} else {  // ERROR Handling
			if ((status == 401) && (call.url.search("https://www.googleapis.com/caldav/v2/") === 0)){
				msg = "  Refresh gcal2 access_token  (401)  "  + call.username;
				msg += "\n  [" + call.account.ID + "]  " + call.account.Name;
				msg += "\n" + callMsg;
				reminderfox.util.Logger('calDAVv2', msg);
				rmFx_CalDAV_getGCALAccessToken (call.username, call.account.ID);
				return;
			}
			rmFx_CalDAV_error(status, statusText, call);
		}};


		reminderfoxX.XcalDAVrequest.prototype.readEtag = function (status, xml, text, headers, statusText, call) {
		// -----------------------------------------------------------------------
		var msg, nEvents;
		var callMsg = rmFx_CalDAV_callMsg (status, statusText, call);

		rmFX_calDAV_progressMeter();

		if (status === 0 || (status >= 200 && status < 300)) {
			var etag = new reminderfox.HTTP.JXONTree(xml); 
			call.etag = reminderfox.HTTP.XMLobject (etag, "response");

			if (!call.etag) {
	//			nEvents = reminderfox.string('rf.caldav.noevents'); //"No Events!";
				nEvents = "0" ; //"No Events!";
			} else {
				nEvents = call.etag.length;
				nEvents = (!nEvents) ? 1 : nEvents;
			}

			var aID = document.getElementById('accountIDStatusLabel').value;
			if ((aID != "?") && (aID !== ""))
				document.getElementById('rmFxOK').disabled = true;
			else
				document.getElementById('rmFxOK').disabled = false;

			msg = reminderfox.string('rf.caldav.validated') + "    Remote ";
			msg += call.Typ == "VEVENT" ? reminderfox.string('rf.general.events') : reminderfox.string('rf.html.heading.todos');
			msg += " (" + nEvents + ")";
			document.getElementById('accountStatus').value = msg;

		} else {  // ERROR Handling
			// for GCal OAuth2 
			if ((status == 401) && (call.url.search("https://www.googleapis.com/caldav/v2/") === 0)){
				msg = "  Refresh gcal2 access_token  (401)  "  + call.username;
				msg += "\n  [" + call.account.ID + "]  " + call.account.Name;
				msg += "\n" + callMsg;
				reminderfox.util.Logger('calDAVv2', msg);
				rmFx_CalDAV_getGCALAccessToken (call.username, call.account.ID);
				return;
			}
			rmFx_CalDAV_error(status, statusText, call);
		}};

		/**
		 * Get all Reminders from a selected account
		 * 
		 * Called from Foxy menu with [Sync all 'Active' CalDAV Accounts]
		 * 
		 */
		reminderfoxX.XcalDAVrequest.prototype.SyncAccount = function(accountID, call) {
		// -----------------------------------------------------------------------
			rmFX_calDAV_progressmeterOnMain(accountID);

			call.request      = 'getCTAG';
			call.callback     = 'responseCTAG';

			call.cReminders   = reminderfox.core.reminderFoxEvents;
			var reminderFoxTodosArray =  reminderfox.core.getReminderTodos();
			call.cTodos       = reminderfox.core.reminderFoxTodosArray.Xtodo;

			call.account      = reminderfox.calDAV.accounts[accountID];
			call.account.ID   = accountID;

			call.idStamp      = new Date().getTime();   // DELETE invalid account entries
			call.url          = call.account.Url;
			call.username     = call.account.Login;
			call.password     = "";
			call.Typ          = call.account.Typ;

			call.contentType  = "application/xml";

			call.href         = null;
			call.urlstr       = null;

			call.timeout      = 30;

			call.ID           = new Date().getTime();

			var msg = "CalDAV   SyncAccount:  " + call.request +"|"+ call.callback + "  (" +call.ID + ")  "
				msg += (call.Typ != null) ? ("  Typ : " + call.Typ) : ""
				msg += "\n  Url: " + call.url + "   call.username: " + call.username;
			reminderfox.util.Logger('calDAV', msg);

			var myHTTP = new reminderfoxX.XcalDAVhttp();
			myHTTP.sendContentToURL(this, call);
		};


		reminderfoxX.XcalDAVrequest.prototype.responseCTAG = function(status, xml, text, headers, statusText, call) {
		// -----------------------------------------------------------------------
		var msg, response;
		var callMsg = rmFx_CalDAV_callMsg (status, statusText, call);

/*----------------
		if (status === 0) {
			msg = "CalDAV   Status: " + status + "  [" + call.account.ID + "] " + call.account.Name;
			msg += "\n" +"  Could not connect to 'Remote Calendar'" + "\n";		//$$$_locale   reminderfox.string('rf.caldav.noConnect');
			msg += "\n\n" + callMsg;
			reminderfox.util.PromptAlert (msg);		//XXX  better dialog!
			// after the user has read & ack we continue with the other remote calendars
				rmFX_calDAV_progressMeter (false);
				rmFX_calDAV_progressmeterOnMain();
				rmFx_CalDAV_SyncActiveAccountsNext(false);
			return;
		}
---------------*/
		if (status>=200 && status<300) {
			var xCtag = new reminderfox.HTTP.JXONTree(xml); 
			response  = reminderfox.HTTP.XMLobject (xCtag, "getctag");

			msg = callMsg + " [" + call.account.ID + "]  " + call.account.Name
				+ "\n  response: " + response.keyValue + "    call.account.CTag: " + call.account.CTag
				+ "\n  text(JSON)"
				+ "\n " + JSON.stringify(response);
			reminderfox.util.Logger('calDAV',  msg);

			// if response has the same value as CTag .. no change on remote calendar
//0001: response.keyValue		$[0] = [string] "http://sabredav.org/ns/sync/353"
//0001: call.account.CTag		$[1] = [string] "http://sabredav.org/ns/sync/353"

			if (response.keyValue == call.account.CTag) {
				// we are done!
				rmFX_calDAV_progressMeter (false);
				rmFX_calDAV_progressmeterOnMain();
				rmFx_CalDAV_SyncActiveAccountsNext(false);
				return;
			}

			call.sMsg          = "  CTAG updated  "
			call.account.CTag = response.keyValue;

			call.request      = 'reportVETAGS';
			call.callback     = 'responseETAG';

			call.contentType  = "application/xml";

			var myHTTP = new reminderfoxX.XcalDAVhttp();
			myHTTP.sendContentToURL(this, call);


		} else {  // ERROR Handling
			// for GCal OAuth2 
			if ((status == 401) && (call.url.search("https://www.googleapis.com/caldav/v2/") === 0)){
				msg += callMsg;
				msg += "\n  Refresh GCal2 access_token  (401)  "  + call.username;
				msg += "\n  [" + call.account.ID + "]  " + call.account.Name;
				reminderfox.util.Logger('calDAVv2', msg);
				rmFx_CalDAV_getGCALAccessToken (call.username, call.account.ID);
				return;
			}
			rmFx_CalDAV_error(status, statusText, call);
		}};


		// this returns all event's with "href:ICS file name" with "getetag" and "status" (eg HTTP/1.1 200 OK)
		reminderfoxX.XcalDAVrequest.prototype.responseETAG = function (status, xml, text, headers, statusText, call) {
		// -----------------------------------------------------------------------
		var msg;
		var callMsg = rmFx_CalDAV_callMsg (status, statusText, call);

		if ((status === 0) ||(status >= 200 && status < 300)) {
			var xEtag = new reminderfox.HTTP.JXONTree(xml); 
			var response = reminderfox.HTTP.XMLobject (xEtag, "response");

			msg = callMsg + " [" + call.account.ID + "] " + call.account.Name
				+ "\n  text(JSON)\n" 
				+ JSON.stringify(response).replace("},","},\n  ",'g').replace('{"href"','\n {"href"','g');
			reminderfox.util.Logger('calDAV',  msg);


			if ((!response)  // as fruux does 
				|| (reminderfox.HTTP.XMLobject (xEtag, "status").keyValue ==  "HTTP/1.1 404 Not Found")) { // as GCal does

				call.msg = "No Etag(s) returned!";
				rmFx_CalDAV_AccountListing (call);
				rmFx_CalDAV_SyncActiveAccountsNext(false);
				return;
			}

			if (!response.length) {
				var r = [];  r[0] = response;
				response = r;
			}

			// 'response' contains 'd:href' with the ics/file-name which should also be the event.id
			//		<d:href>/calendars/johndoe/home/1324567-62153245.ics</d:href>
			//		RFC allows ics-fileName != event.id  (like OwnCloud does!)
			var key = "href";
			call.href = "";

			for (var i=0; i < response.length; i++) {
				call.href += checkResponse (call.account, response[i], key);
			}


			if (call.href !== "") { // go on if event(s) found to be processed
				call.request      = 'multiget';
				call.callback     = 'responseMultiGet';

				call.contentType  = "text/xml";

				var myHTTP = new reminderfoxX.XcalDAVhttp();
				myHTTP.sendContentToURL(this, call);
			}

			else {
				call.msg = '   ' + reminderfox.string('rf.caldav.nonewevents');
				rmFx_CalDAV_AccountListing (call);
				rmFx_CalDAV_SyncActiveAccountsNext(false);
			}

		} else {  // ERROR Handling
			rmFx_CalDAV_error(status, statusText, call);
		}
		
			// check remote -vs- local etag
			function checkResponse (account, response, key) {

				var keyValue = reminderfox.HTTP.XMLobject (response, key).keyValue;
				keyValue = keyValue.replace(new RegExp(/\/\//g), "/");
				var pos = keyValue.lastIndexOf("/");
				var ics = keyValue.substring(pos+1);
				var posIcs = ics.toLowerCase().lastIndexOf(".ics");	//§§§Radicale Handling .ics extension ???
				if (posIcs > -1) {
					ics = ics.substring(0,posIcs)
				}
				ics = ics.replace('%40','@');	

				var etagRemote  = reminderfox.HTTP.XMLobject (response, "getetag").keyValue;

				var multigetKey = "";

				// add or update the event details to the account for '.dav' 
				if (!call.account[ics]) {
					call.account[ics] = {};
				}

				// check for event.id != {string}.ics Check_ownCloud 
				if (call.account[ics].etag != etagRemote) {
					call.account[ics].etag = etagRemote;
					call.account[ics].status = -33; // set to unknown/new
					multigetKey = '<d:href>' + (keyValue) + '</d:href>';

				} else {
					call.account[ics].status = call.ID;   // flag this to show 'remote' and 'local' are identical
				}

				var msg = "  check ___etag___  local -vs- remote"
					+ "\n  local  : " + call.account[ics].etag + "  ics: " + ics
					+ "\n  remote : " + etagRemote + "  status  ## " + call.account[ics].status + " ##";
	//			reminderfox.util.Logger('calDAV',  msg);

				return multigetKey;
			} // checkResponse

		};


		/**
		 * Retrieve the ICS data with the 'call.href' list
		 */
		reminderfoxX.XcalDAVrequest.prototype.responseMultiGet= function (status, xml, text, headers, statusText, call) {
		// -----------------------------------------------------------------------
		var msg, calDAVstring, sortedIndex, exists;
		var callMsg = rmFx_CalDAV_callMsg (status, statusText, call);

		if ((status === 0) ||(status >= 200 && status < 300)) {

			msg = callMsg + "  [" + call.account.ID + "] " + call.account.Name
					+ "\n text \n" + text;
			reminderfox.util.Logger('calDAV',  msg);

			var xMulti = new reminderfox.HTTP.JXONTree(xml); 
			var response = reminderfox.HTTP.XMLobject (xMulti, "response");

			if (!response.length) {
				var r = [];  r[0] = response;
				response = r;
			}

			// save all ICS data / "calendar-data" with requested .Typ 
			var typCount = 0;
			calDAVstring = "";
			for (var i=0; i < response.length; i++) {

				var statusString = reminderfox.HTTP.XMLobject (response[i], "status").keyValue;

				var keyValue = reminderfox.HTTP.XMLobject (response[i], 'href').keyValue;

				keyValue = keyValue.replace(new RegExp(/\/\//g), "/");
				var pos = keyValue.lastIndexOf("/");
				var ics = keyValue.substring(pos+1);
				var posIcs = ics.toLowerCase().lastIndexOf(".ics");	//§§§Radicale Handling .ics extension ???
				if (posIcs > -1) {
					ics = ics.substring(0,posIcs)
				}
				ics = ics.replace('%40','@');	

				if (statusString != 'HTTP/1.1 200 OK') {
					msg = callMsg + " [" + call.account.ID + "] " + call.account.Name
						+ "\n  Status: " + statusString + "  " + ics;
					reminderfox.util.Logger('calDAV',msg);
				} else {
					calDAVstring = reminderfox.HTTP.XMLobject (response[i], "calendar-data").keyValue;
					if ((calDAVstring !== "") && (calDAVstring)) {
						var cReminderEvents = [];
						var cReminderTodosArr = [];

						// expect only one event per "calendar-data"
						// add the account details to the imported event and store to other events,
						// overwrite if exist or add in sorted order
						reminderfox.core.readInRemindersAndTodosICSFromString (cReminderEvents, 
							cReminderTodosArr, calDAVstring, false /*ignoreExtraInfo*/);

						if ((cReminderEvents.length > 0) && (call.Typ == "VEVENT")) {
							typCount++;
							cReminderEvents[0].calDAVid = call.account.ID;		// [string] "R"

							// check_ownCloud
							// CalDAV server MAY use different strings for event.UID and file.ics  (like ownCloud)
							// if so, the .ics file name is 'hrefValue' and we need to expand the account object
							if (ics != cReminderEvents[0].id) {
								call.account[cReminderEvents[0].id] = ics;
								call.account[ics].UID =cReminderEvents[0].id;
							}
							call.account[ics].status = call.ID;  // flag this a new event

							exists = reminderfox.core.eventExists(call.cReminders, cReminderEvents[0]);
							if (exists == -1) {
								// add reminder in sorted order...
								sortedIndex = reminderfox.core.getSortedIndexOfNewReminder(call.cReminders, cReminderEvents[0], false);
								reminderfox.core.insertIntoArray(call.cReminders, cReminderEvents[0], sortedIndex);
							}
							else {
								call.cReminders[exists] = cReminderEvents[0];
							}
							reminderfox.core.reminderFoxEvents = call.cReminders;
						}

						if (cReminderTodosArr && (call.Typ == "VTODO")) {
							var taskList;
							for (taskList in cReminderTodosArr) {
								typCount++;

								var newTodo = cReminderTodosArr[taskList][0];
								newTodo.calDAVid = call.account.ID;		// [string] "T"
	
								if (ics != newTodo.id) {
									call.account[newTodo.id] = ics;
									call.account[ics].UID =newTodo.id;
								}
								call.account[ics].status = call.ID;  // flag this a new todo

								exists = reminderfox.core.eventExists(call.cTodos, newTodo);
								if (exists == -1) {
									sortedIndex = reminderfox.core.getSortedIndexOfNewTodo(call.cTodos, newTodo);
									reminderfox.core.insertIntoArray(call.cTodos, newTodo, sortedIndex);
									reminderfox.core.numDaysModelAdd (newTodo, 'numDaysTodos');
								}
								else {
									call.cTodos[exists] = newTodo;
								}
								reminderfox.core.reminderFoxTodosArray.Xtodo = call.cTodos;
							}
						}
					}
				}
			}

			reminderfox.calDAV.accountsWriteOut (reminderfox.calDAV.accounts);

			if (call.Typ == "VEVENT") {
				msg =  "   New Reminders: " + typCount;  //response.length
				msg += "\n   Reminders in List: " + call.cReminders.length;
			}
			if (call.Typ == "VTODO") {
				msg =  "   New Todos/Tasks: " + typCount;  //response.length
				msg += "\n   Todos/Tasks in List: " + call.cTodos.length;
			}
			call.msg = msg;
			rmFx_CalDAV_AccountListing (call);
			rmFx_CalDAV_SyncActiveAccountsNext(true);

		} else {  // ERROR Handling
			rmFx_CalDAV_error(status, statusText, call);
		}};


		/**
		 *  Delete a reminder on an CalDAV account
		 *    @param {char}  ID of the the account in accounts
		 *    @param {object}  event to be deleted  
		 *    @param {object}  object with event to replace the deleted event, normally called with moving account 
		 *
		 * DELETE /calendars/johndoe/home/132456762153245.ics HTTP/1.1
		 * If-Match: "2134-314"
		 */
		reminderfoxX.XcalDAVrequest.prototype.DeleteReminder= function (accountID, cReminders /*array*/, call) {
		//------------------------------------------------------------------------
			var msg ="CalDAV   DeleteReminder:  "  + "  (" +call.ID + ") ";
			msg += "  accountID:  [" + accountID + "]"
				+ "\n   Event : " + cReminders[0].summary + " [" + cReminders[0].id + "]"
				+ "\n   calDAVid : " + cReminders[0].calDAVid 
				+ (cReminders[0].calDAVidOriginal != null) ? (" org: " + cReminders[0].calDAVidOriginal) : "";
			reminderfox.util.Logger('calDAV',  msg);

			rmFX_calDAV_progressmeterOnMain(accountID);

			call.request      = 'deleteVELEMENT';
			call.callback     = 'deleteSuccess';

			call.account      = reminderfox.calDAV.accounts[accountID];
			call.account.ID   = accountID;

			call.idStamp      = null;   //  NO delete invalid account entries
			call.url          = call.account.Url;
			call.username     = call.account.Login;
			call.password     = "";
			call.Typ          = call.account.Typ;		//VEVENT

			// Check for (event.id not used for ics file storage)
			// If account[call.ics] is a string only, that string is the file
			// name for the ICS file on the server
//GCal:   "j69cjnmcnd4t112fph7n34kkd4@google.com":{"etag":"\"63496913111\"","status":1}},
//OC:
//  href  "owncloud-955fc1d0be1fd138b711ab3fc53d14cc":{"etag":"\"a56c7298483b09e6e9eb5b3d1b48741f\"","status":10,"UID":"8b1314d336"},
//  ics   "8b1314d336":"owncloud-955fc1d0be1fd138b711ab3fc53d14cc"}}
			call.ics = cReminders[0].id;
			if (typeof call.account[call.ics] == 'string') call.ics = call.account[call.ics];


			if (!call.account[call.ics]) {
				msg = " event with UID doesn't exist in '.dav' !" + call.ics;
				reminderfox.util.Logger("Alert", msg);
				rmFX_calDAV_progressmeterOnMain();
				return;
			}

			call.etag         = call.account[call.ics].etag;	// check if for cReminder[0].id 'etag' exists

			call.vCalendar    = "";  // need to set empty string for 'content'
			call.contentType  = "text/plain";

			call.urlstr       = call.url  + call.ics.replace('@','%40') + ".ics";   //§§§Radicale Handling .ics extension ???

			call.timeout      = 30;

			var myHTTP = new reminderfoxX.XcalDAVhttp();
			myHTTP.sendContentToURL(this, call);
		};


		reminderfoxX.XcalDAVrequest.prototype.deleteSuccess= function(status, xml, text, headers, statusText, call) {
		//------------------------------------------------------------------------
		var callMsg = rmFx_CalDAV_callMsg (status, statusText, call);

		rmFX_calDAV_progressMeter();

		if ((status === 0) ||(status >= 200 && status < 300)) {
			var uid = call.account[call.ics].UID;
			if (uid) {
					reminderfox.calDAV.accounts[call.account.ID] = 
						reminderfox.util.removeObjectFromObject (reminderfox.calDAV.accounts[call.account.ID], uid);
			}
			reminderfox.calDAV.accounts[call.account.ID] = 
				reminderfox.util.removeObjectFromObject (reminderfox.calDAV.accounts[call.account.ID], call.ics);

			var msg =callMsg + " [" + call.account.ID + "]"
				+ "\n Reminder Deleted from account [" + call.account.ID + "]  UID: "   + call.ics + "  'etag : ' " + call.etag;
			reminderfox.util.Logger('calDAV', msg);

			reminderfox.calDAV.accountsWriteOut (reminderfox.calDAV.accounts);
			rmFX_calDAV_progressmeterOnMain();

			// if 'Delete' was called with an replacement event that event will be 
			// processed after the delete is finished 
			if (call.eventToAdd) {
				rmFx_CalDAV_UpdateReminder (call.eventToAdd);

			} else {
				call.msg = msg;
				rmFx_CalDAV_AccountListing (call);
			}

		} else {  // ERROR Handling
			rmFx_CalDAV_error(status, statusText, call);
		}};



		/**
		 * Send a reminder to an CalDAV account
		 *  @param {char}    accountID of the calDAV account to be processed 
		 *  @param {object}  cReminders[0] has the reminder to be send
		 *  @param {object}  caller parameters
		 *
		 * PUT /calendars/johndoe/home/132456762153245.ics HTTP/1.1
		 * Content-Type: text/calendar; charset=utf-8 
		 * If-Match: "2134-314"      <<< the value is quoted !
		 * 
		 * BEGIN:VCALENDAR
		 * ....
		 * END:VCALENDAR
		 * 
		 *  + UID + ".ics"		tltq7gk74ou3omiurmvtq35vj0@google.com.ics
		 *    '@' needs to be replaced with '%40'
		 */
		reminderfoxX.XcalDAVrequest.prototype.UpdateReminder= function(accountID, cReminders /*array*/, call) {
		// -----------------------------------------------------------------------
		var msg;

			call.request      = 'multiget';
			call.callback     = 'getETAG4up';

			call.account      = reminderfox.calDAV.accounts[accountID];
			call.account.ID   = accountID;

			call.idStamp      = null;  // NO delete invalid account entries
			call.url          = call.account.Url;
			call.username     = call.account.Login;
			call.password     = "";
			if(call.account.Typ == "VEVENT") {
				call.vCalendar    = reminderfox.core.constructReminderOutput (cReminders, null /* _todosArray*/, 
						true /*isExport*/, false /*ignoreExtraInfo*/);
			}
			if(call.account.Typ == "VTODO") {
				var cTodo = [];
				cTodo[0] = cReminders;
				call.vCalendar    = reminderfox.core.constructReminderOutput (null, cTodo /* _todosArray*/, 
						true /*isExport*/, false /*ignoreExtraInfo*/);
			}

			call.UID = cReminders[0].id;

			call.contentType  = "application/xml";		// text/xml .. text/calendar .. "application/xml";
 
			// Check for (event.id not used for ics file storage)
			call.ics          = cReminders[0].id;
			if (typeof call.account[call.ics] == 'string') call.ics = call.account[call.ics];


// check if for the local event already calDAV account/server details are stored
// if so, go for PUT with the etag known. Conflict should show up with err 412
			if ((call.account[call.ics]) && (call.account[call.ics].etag)) {

				call.request   = 'updateVELEMENT';
				call.callback  = 'onETAG';

				call.etag      = call.account[call.ics].etag;
				call.urlstr    = call.url  + call.ics.replace('@','%40') + ".ics";		//§§§Radicale Handling .ics extension ???
				call.contentType  = "text/plain"; // "text/calendar";		// text/xml .. text/calendar .. "application/xml";

			} else {

				call.href         = '<d:href>' + call.url + call.ics.replace('@','%40') + ".ics" + '</d:href>'; //§§§Radicale Handling .ics extension ???
				call.urlstr       = null;
				call.timeout      = 30;
				msg = "New local reminder  " + call.url + call.ics + ".ics";
			}
			reminderfox.util.Logger('calDAV', msg);

			rmFX_calDAV_progressmeterOnMain(accountID);

			var myHTTP = new reminderfoxX.XcalDAVhttp();
			myHTTP.sendContentToURL(this, call);
		};


		reminderfoxX.XcalDAVrequest.prototype.getETAG4up= function (status, xml, text, headers, statusText, call) {
		// -----------------------------------------------------------------------
		var msg, myHTTP;
		var callMsg = rmFx_CalDAV_callMsg (status, statusText, call);
		reminderfox.util.Logger('calDAV',  callMsg);

		if ((status === 0) ||(status >= 200 && status < 300)) {
			msg = callMsg + "\n  Response:\n" + text;
			reminderfox.util.Logger('calDAV',  msg);

			call.callback     = 'onETAG';

			var etag = new reminderfox.HTTP.JXONTree(xml); 
			var etagRemote    = reminderfox.HTTP.XMLobject (etag, "getetag");
			var hrefRemote    = reminderfox.HTTP.XMLobject (etag, "href");

			if (!etagRemote) {
				call.request   = 'newVELEMENT';
				call.etag      = null;
				call.urlstr    = call.url  + call.ics.replace('@','%40') + ".ics";	//§§§Radicale Handling .ics extension ???

				msg = "New event  " + call.UID + "    call.etag: "+ "  NULL";
			}

			else {
				call.request   = 'updateVELEMENT';
				call.etag      = etagRemote.keyValue;
				call.urlstr    = call.url  + call.ics.replace('@','%40') + ".ics";	//§§§Radicale Handling .ics extension ???

				msg = "Update remote event  " + call.UID + "    call.etag: " + call.etag;
			}
			reminderfox.util.Logger('calDAV', msg);

	//		call.contentType  = "application/xml";		//would fail with GCal if event is new
			call.contentType = "text/calendar";
			call.href         = null;

			myHTTP = new reminderfoxX.XcalDAVhttp();
			myHTTP.sendContentToURL(this, call);

		} else {  // ERROR Handling

			if ((status == 400) || (status == 404)){ // request coming from GCal or fruux/owncloud

				call.request      = 'newVELEMENT';
				call.callback     = 'onETAG';

				call.etag         = null;

				call.vCalendar    = call.vCalendar;
				call.contentType  = "text/calendar";
	
				call.href = null;
				call.urlstr       = call.url  + call.ics.replace('@','%40') + ".ics";	//§§§Radicale Handling .ics extension ???

				msg += "\n  Account    [" + call.account.ID + "]  " + call.account.Name; 
				msg += "\n  ContentType: " + call.contentType;
				msg += "\n  call.urlstr: " + call.urlstr;
				msg += "\n\n" + callMsg;
				reminderfox.util.Logger('calDAV', msg);

				myHTTP = new reminderfoxX.XcalDAVhttp();
				myHTTP.sendContentToURL(this, call);
				return;
			}
			rmFx_CalDAV_error(status, statusText, call);
		}};


		reminderfoxX.XcalDAVrequest.prototype.onETAG= function (status, xml, text, headers, statusText, call) {
		// -----------------------------------------------------------------------
			// calDAV   need to get the new etag from the CalDAV server and ...
			// .. update the local account.etag and .status
		var callMsg = rmFx_CalDAV_callMsg (status, statusText, call);

			if (status >= 200 && status < 300) {

				call.href         = '<d:href>' + call.urlstr.replace('@','%40') + '</d:href>';

				var msg = callMsg + "\n   Response Text: \n>>" + text + "<<"
						+ "\n  get the new etag for \n" + call.href;
				reminderfox.util.Logger('calDAV', msg);

				call.urlstr       = null;
				call.contentType  = "text/xml";

				call.request      = 'multiget';
				call.callback     = 'etagNEW';

				var myHTTP = new reminderfoxX.XcalDAVhttp();
				myHTTP.sendContentToURL(this, call);
		}
		else {  // ERROR Handling
			rmFx_CalDAV_error(status, statusText, call);
		}};


		reminderfoxX.XcalDAVrequest.prototype.etagNEW= function(status, xml, text, headers, statusText, call) {
		// -----------------------------------------------------------------------
		var msg = rmFx_CalDAV_callMsg (status, statusText, call);

			msg += "\n   Response:\n" + text;
			msg += "\n   call.UID: " + call.UID + '   call.href: ' + call.href;
			reminderfox.util.Logger('calDAV', msg);
			if (status >= 200 && status < 300) {

				var etag = new reminderfox.HTTP.JXONTree(xml); 
				var etagRemote = reminderfox.HTTP.XMLobject (etag, "getetag").keyValue;


				// update account.UID.etag with etagRemote
				var _account = reminderfox.calDAV.accounts[call.account.ID];

				if (!_account[call.ics]) {
					_account[call.ics] = {};
				}
				// add/renew  'etag' to the account
				_account[call.ics].etag = etagRemote;
				_account[call.ics].status = call.ID;
				call.msg  = '   New Reminder with UID: '+ call.ics + '   etag: ' + etagRemote;

				// .multiple is used to update selected events on the RmFx Mail List with a specific server 
				if (call.multiple) {

					// because we use this function from MainDialog we need to write the reminders back 
					reminderfox.core.updateMainDialog(rmFx_CalDAV_Reminders2Update[rmFx_CalDAV_Reminders2UpdateIndex]);

					if (call.multiple) {
						rmFx_CalDAV_UpdateReminderNext ();
						return;
					} else {
						call.msg = '  Reminders updated for Account' + call.account.ID;
						rmFx_CalDAV_Reminders2Update = null;
						rmFx_CalDAV_Reminders2UpdateIndex = -1;
					}
				}

				rmFx_CalDAV_AccountListing (call);
				rmFX_calDAV_progressmeterOnMain();
			}
			else {  // ERROR Handling
				rmFx_CalDAV_error(status, statusText, call);
		}};


		reminderfoxX.XcalDAVrequest.prototype.gcal2Token = function (call, grant, token) {
		// --------------------------------------------------------------------------
			if ((token === "") || (grant === "")) return;

			call.request      = grant;
			call.callback     = 'havegcal2Token';

			call.url          = "https://accounts.google.com/o/oauth2/token";
			call.username     = document.getElementById('accountLogin').value;

			call.contentType  = 'application/x-www-form-urlencoded';
			call.Typ          = token;
			call.grant_type   = grant;
			call.redirect_uri = 'urn:ietf:wg:oauth:2.0:oob';

			call.account      = {};
			call.vCalendar    = "";
			call.href         = null;
			call.urlstr       = null;

			call.timeout      = 30;

			var myHTTP = new reminderfoxX.XcalDAVhttp();
			myHTTP.sendContentToURL(this, call);
		};


		reminderfoxX.XcalDAVrequest.prototype.havegcal2Token = function(status, xml, text, headers, statusText, call) {
		// --------------------------------------------------------------------------
		var msg;
		var callMsg = rmFx_CalDAV_callMsg (status, statusText, call);

		if (status === 0 || (status >= 200 && status < 300)) {

			msg = callMsg + "  url: " + call.url
				+ "\n text: " + text;
			reminderfox.util.Logger('calDAVv2', msg);

			var reply = JSON.parse(text);

			// refresh_token store to PWmanager and get user's calendar details
			if (reply.refresh_token) {

				reminderFox_savePassword({
					ljURL    : "https://apidata.googleusercontent.com/caldav/v2/" + call.username, // + "/events/",
					username : 'refresh_token',
					password : reply.refresh_token,
					savePassword : true
				});

				reminderFox_savePassword({
					ljURL    : "https://www.googleapis.com/caldav/v2/" + call.username, // + "/events/",
					username : 'access_token',
					password : reply.access_token,
					savePassword : true
				});

				call.access_token = reply.access_token;
				call.refresh_token = reply.refresh_token;

				reminderfox.util.Logger('calDAVv2', " rmFX_calDAV_gcalPrincipal  Token: "
					+ "\n  .refresh_token: " + call.refresh_token
					+ "\n  .access_token : " + call.access_token
					);

				reminderfoxX.XcalDAVrequest.prototype.gCalPrincipal (call);
			}

		} else {  // ERROR Handling
			if ((status == 404) && (call.url.search("https://www.googleapis.com/caldav/v2/") === 0)) {
				msg = "  Refresh gcal2 access_token  (404)  "  + call.username;
				msg += "\n  [" + call.account.ID + "]  " + call.account.Name;
				msg += "\n\n" + callMsg;
				reminderfox.util.Logger('calDAVv2', msg);
				rmFx_CalDAV_getGCALAccessToken (call.username, call.account.ID);
				return;
			}
			rmFx_CalDAV_error(status, statusText, call);
		}};



/**
 * Called for successive [Add] another calendar for a known account
 */
function rmFx_CalDAV_gGCALPrincipalRedo () {
//------------------------------------------------------------------------------
	var caller = this;

	var username = document.getElementById('accountLogin').value;

	var refresh_token = rmFX_calDAV_gcalOAuth2(username);
	var access_token = reminderFox_getPassword({
					ljURL    : "https://www.googleapis.com/caldav/v2/" + username,
					username : 'access_token',
					password : null,
					savePassword : true
				});

	caller.refresh_token = refresh_token;
	caller.access_token = access_token;

	caller.username = username;
	caller.password = "";
	caller.ID = new Date().getTime();

	if ((refresh_token) && (access_token)) {
		setTimeout( function() {reminderfoxX.XcalDAVrequest.prototype.gCalPrincipal(caller);},0);
		return true;
	}
	else {
		return false;
	}
}

function rmFx_CalDAV_getGCALAccessToken (user, previousAccountID) {
//------------------------------------------------------------------------------
	var caller = this;
	caller.username = user;
	caller.password = null;
	caller.ID = new Date().getTime();
	caller.previousAccountID = previousAccountID;
	var myRequest = new reminderfoxX.XcalDAVrequest();
	myRequest.getGCALAccessToken(caller);
}

		reminderfoxX.XcalDAVrequest.prototype.getGCALAccessToken = function (call) {
		// --------------------------------------------------------------------------
		var msg;

			call.request      = 'refresh_token';
			call.callback     = 'haveGCALAccessToken';

			call.url          = "https://accounts.google.com/o/oauth2/token";

			msg = "getGCALAccessToken (1)  " + (call.username);
			reminderfox.util.Logger('calDAVv2',  msg);


			call.contentType  = 'application/x-www-form-urlencoded';
			var login          = rmFX_calDAV_gcalOAuth2(call.username);
			if (!login) return;

			call.Typ          = login.password;
			call.grant_type   = 'refresh_token';
			call.redirect_uri = 'urn:ietf:wg:oauth:2.0:oob';

			call.account      = {};
			call.vCalendar    = "";
			call.href         = null;
			call.urlstr       = null;

			call.timeout      = 30;


			msg ="CalDAV   " + call.request + "|"+ call.callback + "  (" +call.ID + ")   Typ : " + call.Typ
			+  "\n  call.url: " + call.url + "  call.username: " + call.username
			+  "\n  call.previousAccountID >>"  + call.previousAccountID + "<<";
			reminderfox.util.Logger('calDAV',  msg);

			var myHTTP = new reminderfoxX.XcalDAVhttp();
			myHTTP.sendContentToURL(this, call);
		};


		reminderfoxX.XcalDAVrequest.prototype.haveGCALAccessToken = function(status, xml, text, headers, statusText, call) {
		// --------------------------------------------------------------------------
		var msg;
		var callMsg = rmFx_CalDAV_callMsg (status, statusText, call);

		if (status === 0 || (status >= 200 && status < 300)) {

			msg = callMsg
				+ "\n  Status: " + status + "  url: " + call.url
				+ "\n  call.username: " + call.username
				+ "\n  Text: " + text
				+ "\n  call.previousAccountID >>"  + call.previousAccountID + "<<";
			reminderfox.util.Logger('calDAV', msg);

			var reply = JSON.parse(text);

			reminderFox_savePassword({
				ljURL    : "https://www.googleapis.com/caldav/v2/" + call.username,
				username : 'access_token',
				password : reply.access_token,
				savePassword : true
			});

			if (call.previousAccountID) {
				msg =callMsg
					+ "\n  Status: " + status + "  " + statusText
					+ "\n  Have access_token .. go to update calendar: " + call.previousAccountID;
		//		reminderfox.util.Logger('calDAVv2', msg);

				rmFx_CalDAV_SyncAccount (call.previousAccountID);
			} else {
				document.getElementById('accountStatus').value = "Authorization refreshed. Repeat [Request]";
				document.getElementById('accountStatus').setAttribute('style', "font-weight:bold;color:blue;");
			}

		} else {  // ERROR Handling
			rmFx_CalDAV_error(status, statusText, call);
		}};



function rmFX_calDAV_gcalOAuth2 (username) {
// -----------------------------------------------------------------------
	return reminderFox_getPassword({
			ljURL    : "https://apidata.googleusercontent.com/caldav/v2/" + username,
			username : 'refresh_token',
			password : '',
			savePassword : true
		});
}


function rmFX_calDAV_progressMeter (mode) {
// -----------------------------------------------------------------------
	var progressMeter = document.getElementById('rmFx_progressmeter');
	if (progressMeter) progressMeter.hidden = !mode;
}


function rmFX_calDAV_progressmeterOnMain (accountID){
// -----------------------------------------------------------------------
	var progessPanel = document.getElementById("rmFx_progress-panel");
	if (!progessPanel) return;

	if (accountID) {
		var sLabel = 'Sync ' + accountID;
		document.getElementById("rmFx_progressmeterLabel").value = sLabel;
		var progressMeter = document.getElementById('rmFx_progressmeter');
		if (progressMeter) progressMeter.hidden = false;

		var anchor = document.getElementById("panel-Anchor");
		progessPanel.removeAttribute('hidden');
		progessPanel.openPopup(anchor, 'after_end', -3, -24);
	} else {
		progessPanel.hidePopup();
	}
}


/*
 * Remove all X-REMINDERFOX-CALDAV  items for a given CalendarID from all events
 */
function rmFx_CalDAV_removeCalDAVentries(calendarID, calDAVaccounts){
// -----------------------------------------------------------------------
	calDAVaccounts = reminderfox.util.removeObjectFromObject (calDAVaccounts, calendarID);
	reminderfox.calDAV.accountsWriteOut (calDAVaccounts);

	var cReminder = reminderfox.core.getReminderEvents();
	for (var n=0; n < cReminder.length; n++) {
		var cEvent = cReminder[n];
		if ((cReminder[n].calDAVid ) && (cReminder[n].calDAVid == calendarID)){ 
			cReminder[n] = reminderfox.util.removeObjectFromObject (cReminder[n], 'calDAVid');
		}
	}
	reminderfox.core.reminderFoxEvents = cReminder;
	reminderfox.core.importRemindersUpdateAll(true /*isNetworkImport*/);

	// reload the main dialog
	var topWindow = reminderfox.util.getWindow("window:reminderFoxEdit");
	if(topWindow) {
		topWindow.rmFx_mainDialogLoadReload();
	}
}


function rmFx_CalDAV_error(status, statusText, call) {
//-----------------------------------------------------------------
	rmFX_calDAV_progressMeter (false);
	rmFX_calDAV_progressmeterOnMain();

	var sMsg = "CalDAV   ERROR   Status: " + status + "  " + statusText;

	var uMsg =""; var aMsg ="";
	if (call) {
		aMsg = "  Account:  [" + call.account.ID + "]  " + call.account.Name;
		uMsg = "  Url : " + call.url;
	}
	var calls = "CalDAV   calls  " + call.request + "|" + call.callback;
	var msg = sMsg + "\n" + aMsg+ "\n" + uMsg + "\n\n" + calls;
//	reminderfox.util.Logger('ALERT', "*** ERROR ***" + msg);		// with long stack list
	reminderfox.util.Logger('alert', "*** ERROR ***" + msg);		// without stack list

	//'red' status line and write to console with Edit/Configure dialog
	if (document.getElementById('accountStatus')) {
		document.getElementById('accountStatus').value = sMsg;
		document.getElementById('accountStatus').setAttribute('style', "font-weight:bold;color:red;");
		reminderfox.util.Logger('alert', msg);
		return;
	}

	// Status dialog for FX/TB startup and with open Main Dialog
	var updateWindow = reminderfox.util.getWindow("window:rmFxCaldavUpdate");
	if (!updateWindow) {
		var callOptions = {
			sMsg: sMsg,
			aMsg: aMsg,
			uMsg: uMsg,
			calls: calls
		};
		window.openDialog('chrome://reminderFox/content/caldav/calDAVupdate.xul', 'rmFxCaldavUpdate',
			'chrome', callOptions);
	}
}


function rmFx_CalDAV_callMsg (status, statusText, call){
// -----------------------------------------------------------------------
		var callMsg ="CalDAV   " + call.request + "|"+ call.callback + "  (" +call.ID + ") "
			callMsg += (call.Typ != null) ? ("  Typ : " + call.Typ) : ""
			callMsg += "  status: " + status + " " + statusText;

		return callMsg;
}


/* 
 *  added to update CTag after add/delete event/todo
 * 
 * gw: TODO  This isn't working correct!
 * some errors thrown like with deleting one that one event --> HTTP.js error
*/

function XXXXXrmFx_CalDAV_AccountListing (call) { 
// -----------------------------------------------------------------------
 
	// call.ID = new Date().getTime();
	var myRequest = new reminderfoxX.XcalDAVrequest();
	myRequest.checkCTag(call);
}

		reminderfoxX.XcalDAVrequest.prototype.checkCTag = function (call) {
		// --------------------------------------------------------------------------
		var msg;

			call.request      = 'getCTAG';
			call.callback     = 'currentCTAG';

			call.contentType  = "application/xml";

			call.href         = null;
			call.urlstr       = null;

			call.timeout      = 30;

			call.ID           = new Date().getTime();

			var msg = "CalDAV   Account Listing/CTag update:  " + call.request +"|"+ call.callback + "  (" +call.ID + ")  ";
			reminderfox.util.Logger('calDAV', msg);

			var myHTTP = new reminderfoxX.XcalDAVhttp();
			myHTTP.sendContentToURL(this, call);
		};


		reminderfoxX.XcalDAVrequest.prototype.currentCTAG = function(status, xml, text, headers, statusText, call) {
		// -----------------------------------------------------------------------
		var msg, response;
		var callMsg = rmFx_CalDAV_callMsg (status, statusText, call);

		if (status>=200 && status<300) {
			var xCtag = new reminderfox.HTTP.JXONTree(xml); 
			response  = reminderfox.HTTP.XMLobject (xCtag, "getctag");

			msg = callMsg + " [" + call.account.ID + "]  " + call.account.Name
				+ "\n  response: " + response.keyValue + "    call.account.CTag: " + call.account.CTag
				+ "\n  text(JSON)"
				+ "\n " + JSON.stringify(response);
			reminderfox.util.Logger('calDAV',  msg);

			call.account.CTag = response.keyValue
			rmFx_CalDAV_AccountListing2 (call)

		} else {
			msg = callMsg + "CalDAV   Error with CTag:   [" + call.account.ID + "]  " + call.account.Name
			reminderfox.util.Logger('calDAV',  msg);
		}
		}