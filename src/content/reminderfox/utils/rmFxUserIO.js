
if(!reminderfox)			var	reminderfox = {};
if(!reminderfox.userIO)		reminderfox.userIO = {};

	/**
	* DragNDrop
	* -----------------------------------------------
	* 	D&D was not working with FX due to old functions.
	* 	Changed to Gecko 1.9.2 concept
	* 
	* Test required    ??
	* Test passed      OK
	* 
	* 	Firefox / Thunderbird:
	* 	======================
	* ??	- Subscription:
	* ??	- Link:
	* ??		-- adds reminder with subject/notes/url
	* ??	- Text
	* ??		-- adds reminder with first 40chars to summary
	* 			   all text goes to notes
	* ??		-- a first 'http://' link will be parsed to reminder.url
	* 
	* ??	- OS file
	* ??	  -- adds reminder if file contains ICS data
	* 
	* 	Thunderbird Extras (other should work, tests required):
	* 	====================
	* ??	- Link:
	* ??		-- add reminder with subject/notes/url
	* ??		-- message header data used for reminder
	* ??		-- works with data from web page, msg header skipped
	* ??	- Message:
	* ??		-- works with d&d from 3pane,
	* ??		-- reads ICS from body and attachment(s)
	* ??	- Message Attachment:
	* ??		-- works with one or multiple selected attachments 
	* ??		-- PDF,JPG etc are skipped, a reminder is build like 'message' 
	* ??	- TB/AB contact
	* ??		-- adds reminder for a TB/AB card, allows to open contact from 
	* 			   Reminderfox contact
	* 
	* @param {Object} event
	*/
	reminderfox.userIO.go = function(event){

		reminderfox.util.JS.dispatch('iCalMail');
		reminderfox.util.JS.dispatch('mail');

		var logInfo = "";
		var eventData = "";

		var details = reminderfox.util.selectionDetails();

		logInfo = "OSfile  'Import iCal data' from external data source /applications";
		//-------------------------------------------------------
		if (event.dataTransfer.types.contains("text/x-moz-url") &&
			event.dataTransfer.getData("text/x-moz-url").indexOf('file://') == 0) {

			eventData = event.dataTransfer.getData("text/x-moz-url")

			var filePath = reminderfox.util.urlToPath(eventData);
			var icsData = reminderfox.util.readInFileContents(filePath)
			reminderfox.userIO.readICSdata (icsData, details) 
			return;
		}


		// --- messenger part ----------
		if (reminderfox.util.messenger()) {

			logInfo = "messenger/AB  'Add Reminder for card'";
			//-------------------------------------------------------
			if (event.dataTransfer.types.contains("moz/abcard")) {
				reminderfox.util.JS.dispatch('addReminder4Contact', "Reminder");
				return;
			}


			logInfo = " 'Add Reminder' for Message or Attachmment(s) (IMAP, POP/LOCAL, NEWS)";
			//-------------------------------------------------------
			if (event.dataTransfer.types.contains("text/x-moz-message") 
				||  event.dataTransfer.types.contains("application/x-moz-file-promise")) {

//event.dataTransfer.getData("application/x-moz-file-promise-url")
//$[1] = [string] "mailbox:///media/DATA/_Mozilla/TB_gW/mailFolder/local/Drafts.sbd/rmFX_UserIO? .. 
//           number=60466?fileName=MSG + 1(1*ICS).eml"
//$[0] =  .. number=78459?fileName=MSG_ICS.eml"
//$[0] =  .. number=60466&part=1.2&filename=BAHN_Fahrplan_20130719%281b%29.ics"
//$[0] =  .. number=86186&part=1.2&filename=TestEvent-a.ics"

				var fileName = event.dataTransfer.getData("application/x-moz-file-promise-url")

				var fileType = {}
				fileType.id = "reminderfox-mail-ICS_Msg"  // "reminderfox-mail-AddReminder"  //
				if (fileName.indexOf('part=') != -1) fileType.id = "reminderfox-mail-ICS_Item"

				reminderfox.iCal.addReminder4Message (fileType)
				return
			}
		}


		logInfo = "FX/TB LINK or 'Subscribe' from a URL with an .ics file containing iCal data";
		//-------------------------------------------------------
		if (event.dataTransfer.types.contains("text/uri-list")) {

			logInfo = "URL link  with .ics  or webcal (Subscription)";
			//-------------------------------------------------------
			if (event.dataTransfer.getData("text/x-moz-url")) {

				details.url         = event.dataTransfer.getData("text/x-moz-url-data")
				details.summary     = event.dataTransfer.getData("text/x-moz-url-desc")

		//		if ((((details.url.toLowerCase().indexOf('http') == 0)||(details.url.toLowerCase().indexOf('https') == 0)) && (details.url.toLowerCase().indexOf(".ics") == (details.url.length - 4))
		//			|| (details.url.toLowerCase().indexOf('webcal:') == 0))) {

					logInfo = logInfo + " ##### ICS/webcal " + details.summary
					reminderfox.userIO.addOrSubscribe(details, logInfo);
					return;
		//		}
			}

			logInfo = "FX/TB a 'normal' Link"
			//-------------------------------------------------------
				details.url = event.dataTransfer.getData("text/x-moz-url-data");
				details.summary = event.dataTransfer.getData("text/x-moz-url-desc");

				reminderfox.userIO.defaultMode(details, logInfo);
				return;
		}

		if (event.dataTransfer.types.contains("application/x-moz-file")) {
			details = {};
		}


		logInfo = "'Text' - check for http://  -- set first to 'reminder.url'"
		//-------------------------------------------------------
		var parser = new DOMParser(); var html = parser.parseFromString(eventData, "text/html");
		var htmlLinks = html.links

		if (htmlLinks.length > 0) {
	//		for (var n = 0; n < nLinks; n++) {
				details.url = htmlLinks[0].href;
				details.summary =  htmlLinks[0].text;

				if ((details.url.toLowerCase().indexOf(".ics") == (details.url.length - 4))) {
					setTimeout(function() {reminderfox.userIO.addOrSubscribe(details, logInfo);},0)
				} else {
					details.infos.notes = event.dataTransfer.getData("text/plain")
					reminderfox.userIO.defaultMode(details, logInfo);
				}
	//		}
			return;
		}
		details.infos.notes = event.dataTransfer.getData("text/plain");

		reminderfox.userIO.defaultMode(details, logInfo);
	};


/**
 * userIO.defaultMode
 * 
 * @param {Object} details
 */
reminderfox.userIO.defaultMode = function (details, logInfo) {
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	reminderfox.util.JS.dispatch('tag');
//reminderfox.util.Logger('ALERT', logInfo);

	var newDate = new Date();
	newDate.setDate(newDate.getDate());  // default to using today's date for reminder
	var reminderId =reminderfox.core.generateUniqueReminderId( newDate);

	var summary = (!details.summary) ? details.infos.subject : details.summary;
	var newReminderToBeAdded = new reminderfox.core.ReminderFoxEvent(reminderId, newDate, summary);


	if ((details.infos.text ) && (details.infos.text != "")) {
		newReminderToBeAdded.notes = details.infos.text;
	}
	if ((details.infos.messageId != "") && (details.infos.messageId )) {
		newReminderToBeAdded.messageID = details.infos.messageId;
	}
	if ((details.url != "") && (details.url)) {
		newReminderToBeAdded.url = details.url;
	}

	var rv = reminderfox.core.addReminderHeadlessly( newReminderToBeAdded);

	logInfo = " .userIO.defaultMode   return from core.addReminderHeadlessly    rv : " +rv
//	reminderfox.util.Logger('ALERT', logInfo)

	if (reminderfox.util.messenger()) {
		if (rv && details.infos.messageId != "") {reminderfox.tagging.msg("Reminderfox", true, "#993399")};
	}
	return rv;
};


/**
 * userIO.importReminder with categories
 * 
 * @param {Object} reminder array
 * @param {Object} todos array
 * @param {String} category/ies
 */
reminderfox.userIO.importReminderWithCategories = function (importReminders, importTodos, categories, newer) {
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	reminderfox.util.JS.dispatch('tag');

	var newDate = new Date();
	newDate.setDate( newDate.getDate());  // default to using today's date for reminder

	var existingEvents = reminderfox.core.getReminderEvents();
	var existingTodos = reminderfox.core.getReminderTodos();

	var imported = {};
	imported.events = reminderfox.core.mergeEvents(existingEvents, importReminders, categories, newer);
	imported.todos = reminderfox.core.mergeTodos(existingTodos, importTodos, categories, newer);

	reminderfox.core.reminderFoxEvents = existingEvents;
	reminderfox.core.reminderFoxTodosArray = existingTodos;

	reminderfox.core.importRemindersUpdateAll(false, null);

	// imported.events/imported.todos has the number of reminders imported, 
	// use them to show on the rmFxImportHandling dialog
	return imported;
};


/**
 *  Add/Subscribe reminder for current selected message
 * called from TB context menu
 * 
 * id="reminderfox-mail-AddReminder"
 * id="reminderfox-mail-thread_AddReminder"
 */
reminderfox.userIO.addReminder4Email = function (xthis) {
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	try {
		document.getElementById('threadPaneContext').hidePopup();
	} catch (e) {}
	try {
		document.getElementById('messagePaneContext').hidePopup();
	} catch (e) {}


	var contextMenusEnabled = true;
	try {
		contextMenusEnabled = reminderfox._prefsBranch.getBoolPref(reminderfox.consts.ENABLE_CONTEXT_MENUS);
	}
	catch (e) {}

	if (contextMenusEnabled == false) {
		var details = {};
		details.infos = {};
		details.infos.subject = "";
		details.summary = "";
	} else {

		var details = reminderfox.util.selectionDetails();

//0001: details.url  = [string] "http://sports.yahoo.com/nfl/teams/buf/ical.ics"
// webcal://www.tirol.fr/index.php?option=com_jevents&task=icals.export&format=ical&catids=0&years=0&k=254a061439c8e2a966a94aaa2683f74d

		if (details.url)  {
			var logInfo = " userIO.addReminder4Email   #1: subscribeOrAddReminder"
			reminderfox.userIO.addOrSubscribe(details, logInfo);
			return;
		}
	}
	var logInfo = " userIO.addReminder4Email   #2: contextMenusEnabled : " + contextMenusEnabled;
	reminderfox.userIO.defaultMode (details, logInfo);
}


/**
 *    Add Reminder w Context/Toolbar Menu
 * 2014-02  need to respect Options/FX setting not to use the page infos but
 * let the user open the "Add Event/Todo" dialog
 * 
 */
reminderfox.userIO.addReminder4WebPage = function(){
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	var contextMenusEnabled = true;
	try {
		contextMenusEnabled = reminderfox._prefsBranch.getBoolPref(reminderfox.consts.ENABLE_CONTEXT_MENUS);
	}
	catch (e) {}

	if (contextMenusEnabled == false) {
		var details = {};
		details.infos = {};
		details.infos.subject = "";
		details.summary = "";
	} else {
		var details = reminderfox.util.selectionDetails();

		if (details.url) {
			if ((details.url.indexOf(".ics") != -1)
			    || (details.url.indexOf("ical") != -1)
				|| (details.url.toLowerCase().indexOf('webcal:') == 0)) {
				var logInfo = "userIO.addReminder4WebPage --> subscribeOrAddReminder";
				reminderfox.userIO.addOrSubscribe(details, logInfo);
				return;
			}
		}
	}

	var logInfo = "userIO.addReminder4WebPage 2  --> defaultMode"
	reminderfox.userIO.defaultMode (details, logInfo);
}


//          *** Subscription / Add Reminder **** 
reminderfox.userIO.icsOrwebcalURL = null;
reminderfox.userIO.icsOrwebcalURLname = null;
reminderfox.userIO.details = null;


/**
 *  Support a URL download link (ICS/webcal) with context menu and D&D 
 *  to Foxy/bow to 'Subscribe' or 'add reminders', load ICS data async
 *  and passes to rmFxImportHandling dialog
 * Link examples:
 *    http://dl.erweiterungen.de/kalenderdateien/Feiertage_2006-2010_DE.ics
 *    webcal://sports.yahoo.com/nfl/teams/pit/ical.ics
 *
 *  @since	2013-07-15 rework (using http requester)
 *
 *  @param	{string}  details
 *  @param  {string}  logInfo string for tracing
  */
reminderfox.userIO.addOrSubscribe = function (details, logInfo) {
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	window.setCursor('wait')

	// reminderfox.util.Logger('userIO', logInfo)

	var url0 = details.url.toUpperCase();
	if (url0  && url0.length > 0) {
		var webcalIndex = url0.indexOf( "WEBCAL://");	// handle webcal address
		if ( webcalIndex != -1) {
			details.url = "http://" + details.url.substring(webcalIndex + 9);
		}
	}

	reminderfox.util.JS.dispatch('http');
		this.method       = "GET"
		this.urlstr       = details.url

		this.body         = '';
		this.contentType  = 'text/xml';
		this.headers      = null

		this.username     = null; // ""
		this.password     = ""

		this.timeout      = 30;
		this.id           = new Date().getTime();

		this.callback     = "getICS"
		this.onError      = "getICS"
		this.details      = details

	reminderfox.HTTP.request(this)
};

/**
 * HTTP Get request callback 
 */
reminderfox.userIO.getICS = function (status, xml, text, headers, statusText, call) {
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	window.setCursor('auto')

	if (status==0 || (status>=200 && status<300)) {
		var logInfo = ("reminderfox.userIO.callback   success  status:" + status + "  text \n" + text + "\n")
	//	reminderfox.util.Logger('userIO', logInfo)
		reminderfox.userIO.readICSdata (text, call)

	} else {  // ERROR Handling
		// do some formatting with 'text' .. expecting 'text' is http type 
		var parser = new DOMParser();
		var aText = parser.parseFromString(text, "text/html");
		var msg = aText.body.textContent.replace(/\n /g,'\n').replace(/\n \n/g,'\n').replace(/n\n/g,'\n').replace(/\n\n\n/g,'\n');
	
		reminderfox.util.PromptAlert ("[reminderfox.userIO.getICS] HTTP callback ERROR : " + status
		+ "\n " + msg)
	}
}


reminderfox.userIO.readICSdata = function (icsData, call) {
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	var reminderEvents = [];
	var reminderTodosArr = [];
	reminderfox.core.readInRemindersAndTodosICSFromString(reminderEvents, reminderTodosArr, icsData, false /*ignoreExtraInfo*/)

	if ((reminderEvents.length > 1) || (reminderTodosArr.length != 0)) {
		var xulData = {
			reminders      : reminderEvents,
			todos          : reminderTodosArr,
			details        : call.details
		}
		window.openDialog('chrome://reminderFox/content/utils/rmFxImportHandling.xul', 
			'reminderFox-importSubscribeReminders', 'modal, centerscreen', xulData);
	}
	else { // ('one or none event or has todos') 
		logInfo = " read in of   #reminderEvents : " + reminderEvents.length + "  #Todos : " + reminderTodosArr.length

		if ((reminderEvents.length == 1) && (reminderTodosArr.length == 0)) {
			reminderfox.core.addReminderHeadlessly( reminderEvents[0]);
		} else
		reminderfox.userIO.defaultMode(reminderfox.userIO.details, logInfo)
	}
}


/**
 * Pick an ICS file from fileManger and pass filePath to "Add/Subscribe" dialog
 * with disabled 'Subscribe'
 */
reminderfox.userIO.readICSfile = function () {
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	var file = reminderfox.util.pickFileLocationPicker(window, '*.ics')
	if(!file) return  // // cancel pressed -- no file selected
	var localFile = file.path;

	var call = {}
	call.details = {}
	call.details.url         = localFile
	call.details.summary     = 'Import from iCal/ICS file : ' + localFile
	call.details.noSubscribe = true

	var icsData = reminderfox.util.readInFileContents(localFile)
	reminderfox.userIO.readICSdata (icsData, call);
}
