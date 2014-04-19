/* ***** BEGIN LICENSE BLOCK *****
 * Version: MPL 1.1/GPL 2.0/LGPL 2.1
 *
 * The contents of this file are subject to the Mozilla Public License Version
 * 1.1 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 * http://www.mozilla.org/MPL/
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the
 * License.
 *
 * The Original Code is mozilla.org code.
 *
 * The Initial Developer of the Original Code is
 * Netscape Communications Corporation.
 * Portions created by the Initial Developer are Copyright (C) 1998
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *   Scott MacGregor <mscott@netscape.com>
 *   Jens Bannmann <jens.b@web.de>
 *
 * Alternatively, the contents of this file may be used under the terms of
 * either the GNU General Public License Version 2 or later (the "GPL"), or
 * the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
 * in which case the provisions of the GPL or the LGPL are applicable instead
 * of those above. If you wish to allow use of your version of this file only
 * under the terms of either the GPL or the LGPL, and not to allow others to
 * use your version of this file under the terms of the MPL, indicate your
 * decision by deleting the provisions above and replace them with the notice
 * and other provisions required by the GPL or the LGPL. If you do not delete
 * the provisions above, a recipient may use your version of this file under
 * the terms of any one of the MPL, the GPL or the LGPL.
 *
 * ***** END LICENSE BLOCK ***** */

var gFinalHeight = 50;  
var gSlideIncrement = 1;
var gSlideTime = 10;
var gOpenTime = 5000; // total time the alert should stay up once we are done animating.
					  // 10/22/09: was 3 seconds, bumping it up a bit due to user requests;
					  // also, made a configurable option
var gAlertListener = null;
var gAlertTextClickable = false;
var gAlertCookie = "";

function prefillAlertInfo() {
  		var hideGayPaw = reminderfox.core.getPreferenceValue( reminderfox.consts.HIDE_FOX_PAW );
		if ( hideGayPaw ) {
			document.getElementById('reminderfox-foxpaw').setAttribute("hidden", "true");	
		}

		var todaysReminders = window.arguments[0].todaysreminders;
		var upcomingReminders = window.arguments[0].upcomingreminders;
		var alertType = window.arguments[0].alertTypeToShow;
		var lblparent = document.getElementById("reminderfox-todaysRemindersBox2");	
	
		var tooltipChildrenReminders, todayDescription, todayBox, spacer;
		// if no todays reminders, clear the description and today box
		if ( todaysReminders == null ) {
			//	remove old reminders box
			tooltipChildrenReminders = document.getElementById("reminderfox-tooltipChildrenReminders2");
			todayDescription = document.getElementById( "reminderfox-todayRemindersDescription2" );
			if ( todayDescription != null ) {
				tooltipChildrenReminders.removeChild( todayDescription );
			}
			
			todayBox = document.getElementById( "reminderfox-todaysRemindersBox2" );
			if ( todayBox != null ) {
				tooltipChildrenReminders.removeChild( todayBox );		
			}
			
		    spacer = document.getElementById( "reminderfox-reminderSpacer2" );
			if ( spacer != null ) {
				tooltipChildrenReminders.removeChild( spacer );		
			}	
		}
		else {
			// get the nodes from the tooltip
			var todaysReminderClone = 		window.arguments[0].todaysreminders.cloneNode( true );
			for ( var i = 0; i < todaysReminderClone.childNodes.length; i++ ) {	 	
				var node = document.importNode( todaysReminderClone.childNodes[i], true);
				var cloneNode = node.cloneNode( true );
				lblparent.appendChild(cloneNode);		 
			}		
		}
	
		// if no upcoming reminders, clear the description and upcoming box
		if ( upcomingReminders == null ) {
			tooltipChildrenReminders = document.getElementById("reminderfox-tooltipChildrenReminders2");	
			spacer = document.getElementById( "reminderfox-reminderSpacer2" );
			if ( spacer != null ) {
				tooltipChildrenReminders.removeChild( spacer );		
			}	
			
			upcomingDescription = document.getElementById( "reminderfox-upcomingRemindersDescription2" );
			if ( upcomingDescription != null ) {
				tooltipChildrenReminders.removeChild( upcomingDescription );
			}
			
			upcomingBox = document.getElementById( "reminderfox-upcomingRemindersBox2" );
			if ( upcomingBox != null ) {
				tooltipChildrenReminders.removeChild( upcomingBox );		
			}				
		}
		else {
			// get the nodes from the tooltip
			var lblparent2 = document.getElementById("reminderfox-upcomingRemindersBox2");	
			var upcomingReminderClone = 		window.arguments[0].upcomingreminders.cloneNode( true );
			
			for ( var i = 0; i < upcomingReminderClone.childNodes.length; i++ ) {	 	
				var node = document.importNode( upcomingReminderClone.childNodes[i], true);
				lblparent2.appendChild(node.cloneNode(true));
			}			
		}
}

function onAlertLoad()
{

  // read out our initial settings from prefs.
  try 
  {
    var prefService = Components.classes["@mozilla.org/preferences-service;1"].getService();
    prefService = prefService.QueryInterface(Components.interfaces.nsIPrefService);
    var prefBranch = prefService.getBranch(null);
    //gWXXX gSlideIncrement = prefBranch.getIntPref("alerts.slideIncrement");
    //gWXXX gSlideTime = prefBranch.getIntPref("alerts.slideIncrementTime");
   // gOpenTime = prefBranch.getIntPref("alerts.totalOpenTime");
	
  try {
		// get gOpenTime (it is specified in seconds - so multiply by 1000)
		gOpenTime = reminderfox._prefsBranch.getIntPref(reminderfox.consts.PREF_ALERTSLIDER_OPEN_TIME) * 1000;
	} catch(e) {		
      // alert( "ERROR: " + e );
		gOpenTime = 5000;  
	}	
  } catch (ex) {}

  sizeToContent();

  gFinalHeight = window.outerHeight;  //134  5 lines - 152 6 lines
  
  var alertSliderMaxHeight;
  try {
		alertSliderMaxHeight = reminderfox._prefsBranch.getIntPref(reminderfox.consts.PREF_ALERTSLIDER_MAX_HEIGHT);
	} catch(e) {		
		alertSliderMaxHeight = 134;  // default to 134
	}	
  	if ( alertSliderMaxHeight <= 0 ) {
  		alertSliderMaxHeight = 134;
  	}
  
  if ( gFinalHeight > alertSliderMaxHeight ) {
  	gFinalHeight = alertSliderMaxHeight;
  }

  window.outerHeight = 1;

  // be sure to offset the alert by 10 pixels from the far right edge of the screen
  window.moveTo( (screen.availLeft + screen.availWidth - window.outerWidth) - 10, screen.availTop + screen.availHeight - window.outerHeight);

  setTimeout(animateAlert, gSlideTime);
  

  
}

function playAlertSound() {
	// play a sound for notification (if the user elects to)
	try {
		var playSound = true;
		try {
			playSound = reminderfox._prefsBranch.getBoolPref( reminderfox.consts.ALERT_SOUND);
		}
		catch ( e) {
		}
		if ( playSound ) {
			reminderfox.core.playSound();
	  	} 
	}
	catch ( e ) {
	}
}


function onAlertClick() {
	if ( gOpenTime <= 0 &&  window.outerHeight >= gFinalHeight) {  // only close alert after it's opened
		gOpenTime = 1; // so next click will open dialog
		closeAlert();
		//window.close();  // this will close immediately, instead of slide-close
	}
	else {
		reminderfox.overlay.openMainDialog();
	}
}


function animateAlert() {
  if ( window.outerHeight == 1 ) {
  	  playAlertSound();
  }
  if (window.outerHeight < gFinalHeight)
  {
    window.screenY -= gSlideIncrement;
    window.outerHeight += gSlideIncrement;
    setTimeout(animateAlert, gSlideTime);
  }
  else
    if ( gOpenTime > 0 ) { 
  	  setTimeout(closeAlert, gOpenTime);
	}
	else { 
		// we will wait until alert is clicked
	}
}

function closeAlert()
{
  if (window.outerHeight > 1)
  {
    window.screenY += gSlideIncrement;
    window.outerHeight -= gSlideIncrement;
    setTimeout(closeAlert, gSlideTime);
  }
  else
  {
    if (gAlertListener)
      gAlertListener.observe(null, "alertfinished", gAlertCookie); 
    window.close(); 
  }
}
