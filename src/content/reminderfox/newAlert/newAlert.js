/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */


// Copied from nsILookAndFeel.h, see comments on eMetric_AlertNotificationOrigin
var NS_ALERT_HORIZONTAL = 1;
var NS_ALERT_LEFT = 2;
var NS_ALERT_TOP = 4;

var gOpenTime = 4000; // total time the alert should stay up once we are done animating.
var gAlertMaxHeight = 150;     //134  5 lines - 152 6 lines

var gUserInitiated = false;
var gOrigin = 0; // Default value: alert from bottom right.



function rmFX_prefillAlertInfo(todaysReminders, upcomingReminders) { //, hideGayPaw) {
		var hideGayPaw = reminderfox.core.getPreferenceValue( reminderfox.consts.HIDE_FOX_PAW );
		if ( hideGayPaw ) {
			document.getElementById('reminderfox-foxpaw').setAttribute("hidden", "true");	
		}

		//	remove old reminders boxes
		var todayDescription = document.getElementById( "reminderfox-todaysRemindersBox2" );
		while (todayDescription.firstChild) todayDescription.removeChild(todayDescription.firstChild);

		var upcomingBox = document.getElementById( "reminderfox-upcomingRemindersBox2" );
		while (upcomingBox.firstChild) upcomingBox.removeChild(upcomingBox.firstChild);

// console.log(" .......  rmFX_prefillAlertInfo    todaysReminders " ,todaysReminders)

		// get the nodes from the tooltip
		if (todaysReminders != null ) {
			var todaysReminderClone =  todaysReminders.cloneNode( true );
			for ( var i = 0; i < todaysReminderClone.childNodes.length; i++ ) {	 	
				var node = document.importNode( todaysReminderClone.childNodes[i], true);
				var cloneNode = node.cloneNode( true );
				todayDescription.appendChild(cloneNode);
			}
		}

		if (upcomingReminders != null ) {
			var upcomingReminderClone = upcomingReminders.cloneNode( true );
			for ( var i = 0; i < upcomingReminderClone.childNodes.length; i++ ) {	 	
				var node = document.importNode( upcomingReminderClone.childNodes[i], true);
				upcomingBox.appendChild(node.cloneNode(true));
			}
		}
}


function onAlertLoad() {
	var todaysReminders = window.arguments[0].todaysReminders;
	var upcomingReminders = window.arguments[0].upcomingReminders;
	var alertType = window.arguments[0].alertTypeToShow;

	rmFX_prefillAlertInfo(todaysReminders, upcomingReminders) // , hideGayPaw)

	// bogus call to make sure the window is moved offscreen until we are ready for it.
	resizeAlert(true);

	setTimeout(function() {showAlert();}, 0); 
}


function showAlert() {
	// resize the alert based on our current content
	resizeAlert(false);

	var alertContainer = document.getElementById("alertContainer");

	try {
		// get gOpenTime (it is specified in seconds - so multiply by 1000)
		gOpenTime = reminderfox._prefsBranch.getIntPref(reminderfox.consts.PREF_ALERTSLIDER_OPEN_TIME) * 1000;
	} catch(e) {
		// alert( "ERROR: " + e );
		gOpenTime = 5000;  
	}

	alertContainer.addEventListener("animationend", function hideAlert(event) {
		if (event.animationName == "fade-in") {
			alertContainer.removeEventListener("animationend", hideAlert, false);
			var remaining = Math.max(Math.round(gOpenTime - event.elapsedTime * 1000), 0);
			setTimeout(function() {fadeOutAlert();}, remaining);
		}
	}, false);
	alertContainer.setAttribute("fade-in", true);
}


function resizeAlert(aMoveOffScreen) {
	var alertTextBox = document.getElementById("tooltipChildrenReminders2");
	var alertImageBox = document.getElementById("reminderfox-foxpaw");
	alertImageBox.style.minHeight = alertTextBox.scrollHeight + "px";

	sizeToContent();

	// leftover hack to get the window properly hidden when we first open it
	if (aMoveOffScreen)
		window.outerHeight = 1;

	// Determine position
	var x = gOrigin & NS_ALERT_LEFT ? screen.availLeft :
		screen.availLeft + screen.availWidth - window.outerWidth;
	var y = gOrigin & NS_ALERT_TOP ? screen.availTop :
		screen.availTop + screen.availHeight - window.outerHeight;

	gFinalHeight = window.outerHeight;

	var alertSliderMaxHeight = gAlertMaxHeight;
	try {
		alertSliderMaxHeight = reminderfox._prefsBranch.getIntPref(reminderfox.consts.PREF_ALERTSLIDER_MAX_HEIGHT);
	} catch(e) {}

	if (alertSliderMaxHeight <= 0 ) {
		alertSliderMaxHeight = gAlertMaxHeight;
	}

	if (gFinalHeight > alertSliderMaxHeight ) {
		gFinalHeight = alertSliderMaxHeight;
	}

	if (window.outerHeight > gFinalHeight) {
		var reduce = window.outerHeight - gFinalHeight;
		y = y + reduce;
	}

	window.resizeTo(
		window.outerWidth,
		gFinalHeight
	);

	// Offset the alert by 20 / 30 pixels from the edge of the screen
	y += gOrigin & NS_ALERT_TOP ? 20 : -20;
	x += gOrigin & NS_ALERT_LEFT ? 30 : -30;
	window.moveTo(x, y);
}


function fadeOutAlert(goClose) {

//console.log ("XXXalert  fadeout  ****** ", gOpenTime)
	if ((gOpenTime != 0) || (goClose != null)) { 
		var alertContainer = document.getElementById("alertContainer");
		alertContainer.addEventListener("animationend", function fadeOut(event) {
			if (event.animationName == "fade-out") {
				alertContainer.removeEventListener("animationend", fadeOut, false);
				window.close();
			}
		}, false);
		alertContainer.setAttribute("fade-out", true);
	}
}

