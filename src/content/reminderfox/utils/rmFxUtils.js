if (Cu === undefined)		var Cu = Components.utils;

if (!reminderfox)     var reminderfox = {};
if (!reminderfox.date)    reminderfox.date = {};
if (!reminderfox.util)    reminderfox.util = {};
if (!reminderfox.calDAV)    reminderfox.calDAV = {};

reminderfox.calDAV.colorMap = [];
reminderfox.calDAV.pendingReminders = false;


if(!reminderfox.msgnr) reminderfox.msgnr = {};
if (!reminderfox.msgnr.name) reminderfox.msgnr.name = "";


// ***************** Reminderfox date functions    .date.  <<<<<<<<<<<<<<<<<<<<<

reminderfox.date.num2= function (val){
		if (val < 10) 
			val = "0" + val;
		return val;
};


reminderfox.date.localeDate= function(dateandtime){
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	var locDate = dateandtime.toLocaleString();
	return locDate.substring(0, locDate.lastIndexOf(" "));
};


/**
 *   build different date/time formats used with normal mail messages
 *    @param [object]  Date
 *    @param [string]  "mailDate"   -->  Fri, 06 Jun 2008 23:47:53 +0200
 *                     "mailHeader" -->  Fri Jun 13 20:37:33 2008
 */
reminderfox.date.mailDateTime= function(thisdate, format){
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	var s;
	var sDaysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
	var sMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
	var offset = thisdate.getTimezoneOffset();
	
	function dVal(val){
		if (val < 10) 
			val = "0" + val;
		return val;
	}

	if (format == "mailDate") { //Fri, 06 Jun 2008 23:47:53 +0200
		s = sDaysOfWeek[thisdate.getDay()] + ", ";
		s += thisdate.getDate() + " ";
		s += sMonths[thisdate.getMonth()] + " ";
		s += thisdate.getFullYear() + " ";
		
		s += dVal(thisdate.getHours()) + ":";
		s += dVal(thisdate.getMinutes()) + ":";
		s += dVal(thisdate.getSeconds()) + " ";
		if (offset < 0) {
			offset *= -1;
			s += "+";
		}
		else 
			s += "-";
		
		s += dVal(Math.floor(offset / 60));
		s += dVal(Math.floor(offset % 60));
	}

	if (format == "mailHeader") { //Fri Jun 13 20:37:33 2008
		s = sDaysOfWeek[thisdate.getDay()] + " ";
		s += sMonths[thisdate.getMonth()] + " ";
		s += thisdate.getDate() + " ";
		
		s += dVal(thisdate.getHours()) + ":";
		s += dVal(thisdate.getMinutes()) + ":";
		s += dVal(thisdate.getSeconds()) + " ";

		s += thisdate.getFullYear() + " ";
	}
	return s;
};


/**
 *   Format Time for ReminderFox based on Options setting 
 * @param  [object]  date
 * @return [string]  time string based on reminderfox.consts.USE_24_HOUR_TIME)
  */
reminderfox.date.getTimeString= function (date){
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	var timeString = null;
	try {
		var hours = date.getHours();
		var AMorPM;

		var use24HourTime;
		try {
			use24HourTime = reminderfox._prefsBranch.getBoolPref(reminderfox.consts.USE_24_HOUR_TIME);
		} 
		catch (e) {
		}
		if (use24HourTime) {
			AMorPM = "";
			if (hours < 10) {
				hours = "0" + hours;
			}
		}
		else {
			AMorPM = reminderfox.string("rf.add.time.PM");
			if (AMorPM !== "") {
				if (hours < 12) {
					AMorPM = reminderfox.string("rf.add.time.AM");
				}
				if (hours === 0) {
					hours = 12;
				}
				if (hours >= 13) {
					hours = hours - 12;
				}
			}
		}
		var minutes = date.getMinutes();
		if (minutes < 10) {
			minutes = "0" + minutes;
		}
		
		timeString = hours + reminderfox.string("rf.add.time.delimiter") + minutes;
		if (AMorPM !== "") {
			timeString = timeString + " " + AMorPM;
		}
	} 
	catch (e) {
	}
	return timeString;
};


/**
 * Adjust a date/time string to local timezone
 * @param {Object} eventDateString
 * @param {Object} fullDateString
 * @param {Object} reminderDate
 */
reminderfox.date.adjustTimeZones= function (eventDateString, fullDateString, reminderDate){
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	// if event is stored in UTC time (20051208T224616Z), then take into account UTC offset for the
	// current time
	if (eventDateString.length > 15 && eventDateString.charAt(15) == "Z") {
		var tzOffset = new Date(reminderDate.getFullYear(), reminderDate.getMonth(), reminderDate.getDate()).getTimezoneOffset();
		reminderDate.setMinutes(reminderDate.getMinutes() - tzOffset);
	}
	else {
		// if date contains a Timezone in its specification, handle it :
		// DTSTART;TZID=US/Pacific:20071007T100000
		// With importing we have parsed from VTIMEZONE block and stored 
		// the actual offset (with respect to Standard and Daylight settings).

		var timezoneIndex = fullDateString.indexOf(";TZID=");
		if (timezoneIndex != -1) {
			var endIndex = fullDateString.indexOf(':', timezoneIndex);
			var timezone = fullDateString.substring(timezoneIndex + ";TZID=".length, endIndex);
			timezone = reminderfox.util.trim(timezone.toUpperCase());
			var offset = reminderfox.core.reminderFox_timezones[timezone];

			// adjust for actual time
			// if don't have the 'timezone' stored before .. bad luck, do nothing.
			if (offset) {
				var tzOffset = new Date().getTimezoneOffset();
				reminderDate.setMinutes(reminderDate.getMinutes() - (tzOffset + offset));
			}
		}
	}
};


 function offsetDST(t) { //t is the date object to check, returns true if daylight saving time is in effect.
	var jan = new Date(t.getFullYear(),0,1);
	var jul = new Date(t.getFullYear(),6,1);

	var offset = 0;
	if (Math.min(jan.getTimezoneOffset(),jul.getTimezoneOffset()) == t.getTimezoneOffset()) {
		offset = jan.getTimezoneOffset() - jul.getTimezoneOffset()
	}
	return offset;
}



/**
 * Converts a date string to a Date object
 * @param {string} eventDate
 * @return {object} Date
 */
reminderfox.date.getDateTimeFromString= function (eventDate){
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	var date = null;
	var timeIndex = eventDate.indexOf("T");
	var month = eventDate.substring(4, 6);
	if (month.indexOf("0") === 0) {
		month = month.substring(1);
	}
	var monthInt = parseInt(month, 10) - 1;
	if (timeIndex == -1) {
		// all day event
		date = new Date(eventDate.substring(0, 4), monthInt, eventDate.substring(6, 8));
	}
	else {
		// event with specific hourly time
		date = new Date(eventDate.substring(0, 4), monthInt, eventDate.substring(6, 8));
		
		var hoursInt = parseInt(eventDate.substring(9, 11), 10);
		var minutsInt = parseInt(eventDate.substring(11, 13), 10);
		date.setHours(hoursInt);
		date.setMinutes(minutsInt);
	}
	return date;
};


/**
 * Converts a date string to a Date object, if UTC string with respect to timezone
 * @param {string} dateString  YYYYMMDDThhmmss{Z}
 * @return {object} Date
 */
reminderfox.date.getStringAsDate= function (dateString){
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	var date;

	if (dateString  && dateString.length > 0) {
		var timeIndex = dateString.indexOf("T");
		var month = dateString.substring(4, 6);
		if (month.indexOf("0") === 0) {
			month = month.substring(1);
		}
		var monthInt = parseInt(month, 10) - 1;
		// event with specific hourly time
		date = new Date(dateString.substring(0, 4), monthInt, dateString.substring(6, 8));
		date.setHours(dateString.substring(9, 11), dateString.substring(11, 13), dateString.substring(13, 15));
		
		// if event is stored in UTC time (20051208T224616Z), then take into account UTC offset for the
		// current time
		reminderfox.date.adjustTimeZones(dateString, dateString, date);
	}
	return date;
};


/**
 * Generates a date/time string based on a Date object
 * @param {Object} current Date
 * @param {object} control format
 * @return {string}  YYYYMMDDThhmmss  if format null
 * @return {string}  YYYY-MM--DD_hhmm
 */
reminderfox.date.getDateAsString= function (currentDate, format){
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	var dateString = "";
	var year = currentDate.getFullYear();
	var month = currentDate.getMonth() + 1;
	var day = currentDate.getDate();
	if (month < 10) 
		month = "0" + month;
	if (day < 10) 
		day = "0" + day;

	var hours = currentDate.getHours();
	var minutes = currentDate.getMinutes();
	var seconds = currentDate.getSeconds();
	if (hours < 10) 
		hours = "0" + hours;
	if (minutes < 10) 
		minutes = "0" + minutes;
	if (seconds < 10) 
		seconds = "0" + seconds;

	if (!format) 
		return year + "" + month + "" + "" + day + "T" + hours + "" + minutes + "" + seconds;

		return year + "-" + month + "-" + day + "_" + hours + "" + minutes;
};


/**
 *   Generate current UTC date/time string
 *   @return  {string}  UTC string
 */
reminderfox.date.getDateTimeZ= function(currentDate) {
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	if (!currentDate) currentDate = new Date();
	
	var tzOffset = new Date().getTimezoneOffset();
	currentDate.setMinutes( currentDate.getMinutes() + tzOffset);
	return  reminderfox.date.getDateAsString(currentDate)+ "Z";
};


/**
 * Get a Date with valid day, if calling 'date' isn't valid, sets day to last 
 * valid day.
 * @param {number} year
 * @param {number} month
 * @param {number} date
 * @return {object} Date
 */
reminderfox.date.getValidDateForMonth= function (year, month, date){
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	var lastValidDate = date;
	
	var lastDayOfMonth = reminderfox.date.getLastDayOfMonth(year, month);
	if (date > lastDayOfMonth) {
		lastValidDate = lastDayOfMonth;
	}
	return lastValidDate;
};


/**
 *   Calculate the last day of a month
 *   @param   [integer] year
 *   @param   [integer] month
 *   @return  [integer] day of month
 */
reminderfox.date.getLastDayOfMonth= function( year, month) {
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	var pastLastDate = new Date( year, month, 32);
	return 32 - pastLastDate.getDate();
};


/**
 *   Check Leap year
 *   @param [integer]  year
 *   @return [boolean]	leap year == true
 */
reminderfox.date.isLeapYear= function (year){
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	return (((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0)) ? true : false;
};


/**
 * Calculate the weeknumber for a given date
 * @param {Object} currentDate
 * @return {number} weeknumber (1 .. 4, -1) Week of Month !!
 */
reminderfox.date.getWeekNumber= function (currentDate){
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	var reminderDate = currentDate.getDate();
	var numberOfDay = reminderDate / 7;
	var intvalue = parseInt(numberOfDay, 10);
	if (reminderDate % 7 === 0) {
		intvalue--;
	}
	var weekNumber = intvalue + 1; // 0-based index
	if (weekNumber == 5) {
		weekNumber = -1; // set to last week of month
	}
	return weekNumber;
};


/**
 *   Calculate the date of specific day in a week
 * 
 * @param {Object} currentDate
 * @param {Object} dayNumber
 * @param {Object} weekNumber
 * @return  {object}  date
 */
reminderfox.date.getDateForSpecifiedWeekNumber= function (currentDate, dayNumber, weekNumber){
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	var weekNumberCalculation;

	var firstDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
	var firstDayOfMonth = firstDate.getDay();
	
	// calculate the date that the first day-of-week falls on (using the day of the first of the month)
	var compareCurrentDay = dayNumber + 1;
	var compareFirstDay = firstDayOfMonth + 1;
	if (compareCurrentDay < compareFirstDay) {
		compareCurrentDay = compareCurrentDay + 7;
	}
	var firstWeekDateVal = (compareCurrentDay - compareFirstDay) + 1;
	var finalDate;
	
	// we have the date that the first day-of-week falls on.  Now let's calculate the Nth day of week
	if (weekNumber == -1) { // last day of week of the month
		weekNumberCalculation = 5 - 1;
		finalDate = firstWeekDateVal + (weekNumberCalculation * 7);
		var lastDayOfMonth = reminderfox.date.getLastDayOfMonth(currentDate.getFullYear(), currentDate.getMonth());
		if (finalDate > lastDayOfMonth) {
			finalDate = finalDate - 7; // previous (4th) week must be the last week of this month
		}
	}
	else {
		weekNumberCalculation = weekNumber - 1;
		finalDate = firstWeekDateVal + (weekNumberCalculation * 7);
	}
	return finalDate;
};

/**
 *   Get 'locale' month string 
 *   @param {number}  0 ..11
 *   @return {string}  month string from 'locale' bundle
 */
reminderfox.date.getMonthAsText= function (integerValue){
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	return reminderfox.string("rf.options.month." + integerValue + ".name");
};


/**
 *  Format a date using the RF prefs: "extensions.reminderFox.listDateLabel"
 * 
 *   @param {object}	
 *     null: use current date/time
 *     number:  as with msgHdr 
 *     string:  yyyymmddTHHMMSS  or UTC  (ex: 20051208T224616  or  20051208T224616Z = UTC)
 *     object:  Date
 *   @return  [string]
 */
reminderfox.date.parseDateTimes= function (pDate, noTime) {
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	var thisDate = new Date();
	
	if (typeof(pDate) == "number") thisDate.setTime(pDate);
	if (typeof(pDate) == "object") thisDate = pDate;
	if (typeof(pDate) == "string") thisDate = reminderfox.date.getStringAsDate(pDate);

	var timeString = "";
	if (!noTime) timeString =  "  " + reminderfox.date.getTimeString(thisDate);

	var _dateVariableString;
	try {
		_dateVariableString = reminderfox.core.getUnicodePref(reminderfox.consts.LIST_DATE_LABEL);
	} catch(e) {}
	return reminderfox.date.getDateVariable( null, thisDate, _dateVariableString)
			+ timeString;
};


reminderfox.date.getDateVariableString= function(reminder, date) {
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	return reminderfox.date.getDateVariable(reminder, date, reminderfox.date.dateVariableString());
};


reminderfox.date.dateVariableString= function (){
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	try {
		dateVariableString = reminderfox.core.getUnicodePref(reminderfox.consts.LIST_DATE_LABEL);
		if (dateVariableString != reminderfox.consts.LIST_DATE_LABEL_DEFAULT) {
			useDefaultDate = false;
		}
	}
	catch (e) {
		dateVariableString = reminderfox.consts.LIST_DATE_LABEL_DEFAULT;
	}
	return dateVariableString;
};


reminderfox.date.getDateVariable= function(reminder, date, variableDateString){
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	var reminderLabel = variableDateString;
	
	// Replace the [variables]
	var startBracketIndex = reminderLabel.indexOf("[");
	while (startBracketIndex != -1) {
		var endBracketIndex = reminderLabel.indexOf("]", startBracketIndex);
		if (endBracketIndex != -1) {
			// Check for a fishy [
			if (endBracketIndex - startBracketIndex < 3) {
				startBracketIndex = reminderLabel.indexOf("[", ++startBracketIndex);
			}
			else {
				var variable = reminderLabel.substring(startBracketIndex + 1, endBracketIndex);
				var decodedVariable = reminderfox.overlay.decodeReminderLabelVariable(reminder, variable, date);
				var decodedVariableLength = decodedVariable.length;
				var startTrim = startBracketIndex;
				var endTrim = endBracketIndex;
				if (variable == "time" && decodedVariableLength === 0) {
					// trim the () from around time if the time is empty (all-day event)
					if (reminderLabel.charAt(startBracketIndex - 1) == "(" &&
					reminderLabel.charAt(endBracketIndex + 1) == ")") {
						startTrim = startTrim - 1;
						endTrim = endTrim + 1;
					}
				}
				reminderLabel = reminderLabel.substring(0, startTrim) + decodedVariable + reminderLabel.substring(endTrim + 1, reminderLabel.length);
				startBracketIndex = reminderLabel.indexOf("[", startBracketIndex + decodedVariableLength);
			}
		}
	}
	
	return reminderLabel;
};
// ***************** Reminderfox date functions    .date.  >>>>>>>>>>>>>>>>>>>>>

/**
 *   Get Alarm String form reminder with snooze if relevant;
 */
reminderfox.date.alarmInfo= function(reminder){
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	var dateString, timeString;

	var tooltipText = "";
	if (reminder.snoozeTime) {
		var snoozeAlarmTime = reminder.snoozeTime;
		var index = snoozeAlarmTime.indexOf(';');
		if (index != -1) {
			snoozeAlarmTime = snoozeAlarmTime.substring(0, index);
		}
		var snoozedate = new Date(parseInt(snoozeAlarmTime, 10));
		dateString = reminderFox_getDateVariableString(reminder, snoozedate);
		timeString = reminderfox.date.getTimeString(snoozedate);

		tooltipText =  reminderfox.string("rf.alarm.list.tooltip.snooze") 
			+ " " + dateString + ", " + timeString + "\n";
	}
	else {
		// otherwise show when the next alarm is scheduled for...

		var newDate = new Date(reminder.date.getFullYear(), reminder.date.getMonth(), 
			reminder.date.getDate(), reminder.date.getHours(), reminder.date.getMinutes());
		if (reminder.allDayEvent) {
			newDate.setHours(0, 0);
		}
		var mins = newDate.getMinutes();
		var alarmMinutes = reminderfox.core.getAlarmInMinutes(reminder, reminder.date);
		if (alarmMinutes) {
			newDate.setMinutes(mins - alarmMinutes);

			dateString = reminderFox_getDateVariableString(reminder, newDate);
			timeString = reminderfox.date.getTimeString(newDate);
			tooltipText =  reminderfox.string("rf.alarm.tooltip.text") 
					+ " " + dateString + ", " + timeString + "\n";
		}
	}
	if (reminder.alarm.charAt(reminder.alarm.length-1) != "Z")  {
		tooltipText += getAlarmTooltipText(reminder.alarm);
	}
	return tooltipText;
};


/**
 *   Get RRule String for reminder instance
 */
reminderfox.date.recurrenceString= function (reminder, currentDate) {
	var repeat = document.getElementById("reminderFox-repeat");
	if(repeat) {
		if(repeat.getAttribute("checked") !== true && repeat.getAttribute("checked") != "true") {
			return; // exit - no repeating option is selected
		}
	}

	var startingParens = "    (";
	var closingParens = ")";

	var reminderDay = reminder.date.getDay();
	var weekNumber = reminderfox.date.getWeekNumber(reminder.date);

	var val = "";

	// yearly
	if(reminder.recurrence.type == reminderfox.consts.RECURRENCE_YEARLY
			&& (reminder.recurrence.byDay  
			|| (reminder.recurrence.interval  && reminder.recurrence.interval > 0) 
			|| reminder.recurrence.endDate)) {
		val = "Yearly";
		if (reminder.recurrence.interval > 1) val = startingParens + "Repeat every " + reminder.recurrence.interval + " year" + closingParens;
	}


	// yearly by day
	if(reminder.recurrence.type == reminderfox.consts.RECURRENCE_YEARLY_DAY 
			&& (reminder.recurrence.byDay  
			|| (reminder.recurrence.interval  && reminder.recurrence.interval > 0) 
			|| reminder.recurrence.endDate)) {
		val = "Yearly";
		if (reminder.recurrence.interval > 1) val = "Repeat every " + reminder.recurrence.interval + " years";

		val += startingParens + getWeekName(weekNumber) 
			+ " " + getDayNames(reminder.recurrence.byDay, reminderDay) + " " + reminderfox.string("rf.options.weekof.name") 
			+ " " + reminderfox.string('rf.options.month.'+ reminder.date.getMonth() + '.name') + closingParens;
	}


	// monthly by date
	var dateStr = reminderfox.string("rf.options.dateshort." + reminder.date.getDate() + ".name");

	if( reminder.recurrence.type == reminderfox.consts.RECURRENCE_MONTHLY_DATE 
			&& (reminder.recurrence.byDay  
			|| (reminder.recurrence.interval  && reminder.recurrence.interval > 0) 
			|| reminder.recurrence.endDate)) {
		val = "Monthly";
		if (reminder.recurrence.interval > 1) {
			val = "Repeat every " + reminder.recurrence.interval + " months";
			val += startingParens + dateStr + " " + reminderfox.string("rf.options.weekofmonth.name") + closingParens;
		}
	}


	// monthly by day
	if(reminder.recurrence.type == reminderfox.consts.RECURRENCE_MONTHLY_DAY 
			&& (reminder.recurrence.byDay  
			|| (reminder.recurrence.interval  && reminder.recurrence.interval > 0) 
			|| reminder.recurrence.endDate)) {
		val = "Monthly";
		if (reminder.recurrence.interval > 1) val = "Repeat every " + reminder.recurrence.interval + " months";

		val +=  startingParens + getWeekName(weekNumber) 
			+ " " + getDayNames(reminder.recurrence.byDay, reminderDay) 
			+ " " + reminderfox.string("rf.options.weekofmonth.name") + closingParens;
	}


	// weekly
	if(reminder.recurrence.type == reminderfox.consts.RECURRENCE_WEEKLY 
			&& reminder.recurrence.interval) {// change label if it's a bi-weekly
		val = "Weekly";
		if (reminder.recurrence.interval > 2) val = "Repeat every " + reminder.recurrence.interval + " weeks";
		if (reminder.recurrence.interval == 2) val = "Bi-weekly";

		val += startingParens + ("On ") + " " + getDayNames(reminder.recurrence.byDay, reminderDay) + closingParens;
	}


	// daily
	if(reminder.recurrence.type == reminderfox.consts.RECURRENCE_DAILY 
			&& (reminder.recurrence.byDay  
			|| (reminder.recurrence.interval  && reminder.recurrence.interval > 1) 
			|| reminder.recurrence.endDate)) {
		val = "Daily";
		if (reminder.recurrence.interval > 1) val = startingParens + " On " + reminder.recurrence.interval + " day" + closingParens;
	}


	if (reminder.recurrence.endDate) val += "\nRepeat until: " + reminder.recurrence.endDate.toLocaleDateString();	//$$$_locale
	if (reminder.recurrence.count)   val += "\nRepeat occurrences: " + reminder.recurrence.count;		//$$$_locale
	return val;


		function getDayNames(byday, dayNum) {
			if (!byday) return reminderfox.string("rf.options.day." + dayNum + ".name");

			var days = "";
			var sDay = "";
			var rfcWeekdays   = "SUMOTUWETHFRSA";

			var aByDay = byday.split(',');
			for (var n=0; n < aByDay.length; n++){
				var pos = rfcWeekdays.indexOf(aByDay[n]);
				if (pos === 0) {
					sDay = reminderfox.string('rf.options.day.0.name.Mmm');
				} else {
					sDay = reminderfox.string("rf.options.day." + (pos/2) + ".name.Mmm");
				}
				if (days === "") days = sDay;
				else
					days += ", " + sDay;
			}
			return days;
		}

		function getWeekName(weekNum) {
			if(weekNum == -1) {
				return reminderfox.string("rf.options.week.occurrence.5.name");
			} else {
				return reminderfox.string("rf.options.week.occurrence." + weekNum + ".name");
			}
		}
};



// *****************************************************************************
// ****************** Reminderfox Utilities    .util.    ***********************


/**
 * Remove an object2 from an object1 by name of object1
 * @param {object}  object1 .. the initial object
 * @param {string}  the name of the object to be removed
 * @return {object} 
 */
reminderfox.util.removeObjectFromObject= function (allObjects, objName){
	var newObj = {};
	for (var obj in allObjects) {
		if (obj !== objName) {
			newObj[obj] = {};
			newObj[obj] =  allObjects[obj];
		}
	}
	return newObj;
};


/**
 * replace escaped commas with regular commas:
 * "Raleigh\, NC" --> "Raleigh, NC"
 */
reminderfox.util.unEscapeCommas= function(stringValue){
	return stringValue.replace(/\\,/g, ",");
};

/**
 * escape commas
 */
reminderfox.util.escapeCommas= function (stringValue){
	return (!stringValue) ? null : stringValue.replace(/,/g, "\\,");
};

reminderfox.util.escapeSemi= function (stringValue){
	return (!stringValue) ? null : stringValue.replace(/;/g, "\\;");
};


/**
 *   break for long lines   RFC 2445 sec 4.1
 */
reminderfox.util.foldLines= function(line, newline){
	// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	var result = null;
	var LINE_LENGTH = 75;
	if (line.length <= LINE_LENGTH) {
		result = line + newline;
	}
	else {
		result = line.substring(0, LINE_LENGTH) + newline;
		var index = LINE_LENGTH;
		while ((index + LINE_LENGTH) < line.length) {
			result = result + " " + line.substring(index, index + LINE_LENGTH - 1) + newline; // -1, to account for prepended space
			index = index + LINE_LENGTH - 1;
		}
		result = result + " " + line.substring(index, line.length) + newline;
	}
	return result;
};


/**
 *  Pattern for folded lines: start with a whitespace character
 */
reminderfox.util.FOLDED = /^\s(.*)$/;


/**
 *  ICS lines are split so the max length is no more than 75.
 *  Splitted lines start with a whitespace character.
 *    @param   [string]  content the original ICS lines
 *    @return  [string]  the restored ICS data  (include 'null' lines !)
 */
reminderfox.util.unfoldLines= function (xcontent) {
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	var lines = xcontent.replace(/\r\n/g, '\n').split('\n');
	var len = lines.length;
	for (var i = len - 1; i > 0; i--) {
		var matches = reminderfox.util.FOLDED.exec(lines[i]);
		if (matches) {
			lines[i - 1] += matches[1];
			lines[i] = '';
		}
	}
	return lines;
};


/**
 *   Remove blank lines from string array
 */
reminderfox.util.noBlankLines= function (s) {	// Remove blank lines
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	var r = [];
	var l = s.length;
	for(var i=0;i<l;i++)
	if (s[i] !== "") {r.push(s[i]);}
	return r;
};


/** 
 *   Split a string at newlines:   \n (Mac, *nix) or \r\n  (windows)
 *   and unfold lines for no loanger than 75 chars
 */
reminderfox.util.splitOnAllNewlinesAndUnfoldLines= function(input){
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	var uLines = reminderfox.util.unfoldLines(input);
	return reminderfox.util.noBlankLines(uLines);
};


reminderfox.util.findParentById= function (node, name1, name2){
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	var parentNode = node;
	while (parentNode) {
		if (parentNode.id == name1 || parentNode.id == name2) {
			return parentNode;
		}

		parentNode = parentNode.parentNode;
	}
	return parentNode;
};


// http://surf11.com/entry/157/javascript-isinteger-function
reminderfox.util.isInteger= function (s){
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	return (s.toString().search(/^-?[0-9]+$/) === 0);
};
reminderfox.util.isUnsignedInteger= function (s){
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	return (s.toString().search(/^[0-9]+$/) === 0);
};


reminderfox.util.mod= function (divisee, base){
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	return Math.round(divisee - (Math.floor(divisee / base) * base));
};

/**
 *   Trim functions:
 *    .trim      delete leading/trailing white spaces
 *    .trimAll   delete also multiple spaces in string
 */
reminderfox.util.trim= function (s){
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	return (!s) ? "" : (s.replace(/\s+$/,"").replace(/^\s+/,""));
};
reminderfox.util.trimAll= function (s){
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	return (!s) ? "" : (s.replace(/\s+/g," ").replace(/\s+$/,"").replace(/^\s+/,""));
};

/**
 *   Trim string to delete leading/trailing LF, 
 *   replace other LF and white space with space
 */
reminderfox.util.cleanString= function (aString) {
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	return aString.replace(/\n+$/,"").replace(/^\n+/,"").replace(/\xA0|\n/g, ' ');
};


/**
 * Convert a URL to a file path string
 * 
 *  @param  {string}  url
 *  @return {string}  path for url 
 */
reminderfox.util.urlToPath= function (aPath) {
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	var rv = null;
	if (!aPath || !/^file:/.test(aPath))
		return rv;
	var ph = Components.classes["@mozilla.org/network/protocol;1?name=file"]
		.createInstance(Components.interfaces.nsIFileProtocolHandler);
	rv = ph.getFileFromURLSpec(aPath).path;
	return rv;
};


reminderfox.util.escapeHtml= function(s) {
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	return s
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/'/g, '&#039;')
		.replace(/"/g, '&quot;')
		.replace(/\n/g, '<br />');
};

reminderfox.util.unEscapeHtml= function(s) {
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	return s
		.replace(/&amp;/g, '&')
		/*--------------------------
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/'/g, '&#039;')
		.replace(/"/g, '&quot;')
		.replace(/\n/g, '<br />')
		----------*/
		;
};


/**
 *   Get the most recent window by it's 'id'
 *  @param {string}  getThisWindow
 *  @return {object} the window
 */
reminderfox.util.getWindow= function(getThisWindow){
	var windowManager = Components.classes['@mozilla.org/appshell/window-mediator;1'].getService();
	var windowManagerInterface = windowManager.QueryInterface(Components.interfaces.nsIWindowMediator);
	return windowManagerInterface.getMostRecentWindow(getThisWindow);
};


/**
 *    Lunches a URL link
 *    if not valid link then go with Google maps
 */
reminderfox.util.launchLink= function(urlText) {
	if (urlText  && urlText.value !== "") {
		var url = urlText;
		// if urlText starts with URL, use that
		if (url.indexOf( "http") !== 0)  {
			// otherwise use google maps
			url =  "http://maps.google.com/maps?q=" + url;
		}
		reminderfox.util.openURL(url);
	}
};


/*
 * Firefox           {ec8030f7-c20a-464f-9b0e-13a3a9e97384}
 * SeaMonkey         {92650c4d-4b8e-4d2a-b7eb-24ecf4f6b63a}
 * Thunderbird       {3550f703-e582-4d05-9a08-453d09bdfdc6}
 *
 * Sunbird           {718e30fb-e89b-41dd-9da7-e25a45638b28}
 *
 * Nvu               {136c295a-4a5a-41cf-bf24-5cee526720d5}
 * Mozilla Suite     {86c18b42-e466-45a9-ae7a-9b95ba6f5640}
 * Netscape Browser  {3db10fab-e461-4c80-8b97-957ad5f8ea47}
 * Flock Browser     {a463f10c-3994-11da-9945-000d60ca027b}
 */
reminderfox.util.FIREFOX_ID     = "{ec8030f7-c20a-464f-9b0e-13a3a9e97384}";
reminderfox.util.SEAMONKEY_ID   = "{92650c4d-4b8e-4d2a-b7eb-24ecf4f6b63a}";
reminderfox.util.THUNDERBIRD_ID = "{3550f703-e582-4d05-9a08-453d09bdfdc6}";
reminderfox.util.SUNBIRD_ID     = "{718e30fb-e89b-41dd-9da7-e25a45638b28}";
reminderfox.util.LIGHTNING_ID   = "{e2fda1a4-762b-4020-b5ad-a41df1933103}";

/**
 *   Get the nsIXULAppInfo of the underlaying application
 *  @return {string}  appId 
 */
reminderfox.util.appId= function(){
	var aID;
	if ("@mozilla.org/xre/app-info;1" in Components.classes) {
		// running under Mozilla 1.8 or later
		aID = Components.classes["@mozilla.org/xre/app-info;1"]
				.getService(Components.interfaces.nsIXULAppInfo).ID;
	}
	else {
		try {
			aID = Components.classes["@mozilla.org/preferences-service;1"]
					.getService(Components.interfaces.nsIPrefBranch).getCharPref("app.id");
		} 
		catch (e) {
		}
	}
	return aID;
};


/**
 *   Check if a 'messenger' is the underlaying application
 *   @return {Boolean} 
 */
reminderfox.util.messenger= function(){
	return (Components.classes["@mozilla.org/messenger/account-manager;1"]);
};


/**
 *   "Browse" for 'mail app' path and set in DOM
 *
 **/
reminderfox.util.mailAppStringBrowse= function(){
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	reminderfox._prefsBranch.setCharPref(reminderfox.consts.MAIL_PATH, "");
	document.getElementById('mailApp.location.input').value = reminderfox.util.messengerApp().path;
};


// --------- functions for TB,SM ... and 'non' mail (like FX)  ---------
/**
 * Get the  messenger apps location   <br>
 *  - first check prefs if already set   <br>
 *  
 *  - if host app isn't a messenger (TB/PB/SM) like FX     <br>
 *    lets the user browse for a valid messenger app    <br>
 *  
 *    @return  [object]  file for location of 'messenger' application
 */
reminderfox.util.messengerApp= function(){
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	var fileValid = true;
	var mFile = null;
	var mailApp = "";

	var mFileServ = Components.classes["@mozilla.org/file/directory_service;1"].getService(Components.interfaces.nsIProperties);

	var file = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsIFile);
	// sets the default location for messenger app
	var appNameX = Components.classes["@mozilla.org/xre/app-info;1"];
	var appName = appNameX.getService(Components.interfaces.nsIXULAppInfo).name;
	var appID = appNameX.getService(Components.interfaces.nsIXULAppInfo).ID;

	var osInfo = reminderfox.core.opSystemInfo();

	if (reminderfox.util.messenger()) {
		mFile = mFileServ.get("CurProcD", Components.interfaces.nsIFile);
		
		if (osInfo.indexOf("WINNT") != -1) {
			mFile.append(appName + ".exe");
		}
		if (osInfo.indexOf("Linux") != -1) {
			mFile.append(appName.toLowerCase());
		}
		if (osInfo.indexOf("Darwin") != -1) {
			mFile = mFileServ.get("LocApp", Components.interfaces.nsIFile);
			mFile.append(appName + ".app");
		}
	}

	try {
		mailApp = reminderfox._prefsBranch.getCharPref(reminderfox.consts.MAIL_PATH);
	}
	catch (ex) {
	}


	try {
		file.initWithPath(mailApp);
		fileValid = file.exists();
	}
	catch (ex) {
		fileValid = false;
	}

	if ((fileValid === false) && (mFile)) {
		mailApp = mFile.path;
		file.initWithPath(mailApp);
		fileValid = true;
	}

	if (fileValid === false) { // mailApp / OS not valid, ask user
		//gW appPicker	2009-10-03  +++2do  change for application menu (see FX --> Options --> Applications)

		var fp = Components.classes["@mozilla.org/filepicker;1"].createInstance(Components.interfaces.nsIFilePicker);
		var winTitle = "Select Mail/Messenger Application"; // this._prefsBundle.getString("fpTitleChooseApp");
		fp.init(window, winTitle, Components.interfaces.nsIFilePicker.modeOpen);
		fp.appendFilters(Components.interfaces.nsIFilePicker.filterApps);

		// Prompt the user to pick an app.  If they pick one, and it's a valid
		// selection, then set it for 'mailto' / 'messenger'

		if (fp.show() == Components.interfaces.nsIFilePicker.returnOK &&
			fp.file && reminderfox.util.isValidHandlerExecutable(fp.file)) {
			var handlerApp = reminderfox.util.getLocalHandlerApp(fp.file);
		}
		else {
			reminderfox._prefsBranch.setCharPref(reminderfox.consts.MAIL_PATH, "");
			return ""; // return file object
		}

		mailApp = fp.file.path;
		reminderfox._prefsBranch.setCharPref(reminderfox.consts.MAIL_PATH, mailApp);
		file.initWithPath(mailApp);
	}

	if (osInfo.indexOf("Darwin") != -1) {

		if (mailApp.toLowerCase().indexOf("-bin") == -1) {
			file.initWithPath(mailApp);

			file.append("Contents");
			file.append("MacOS");

			if (mailApp.toLowerCase().indexOf("thunderbird") != -1)
				file.append("thunderbird-bin");
			if (mailApp.toLowerCase().indexOf("seamonkey") != -1)
				file.append("seamonkey-bin");
			fileValid = true;
		}
	}

	reminderfox._prefsBranch.setCharPref(reminderfox.consts.MAIL_PATH, mailApp);
	return file; // return file object
};


/**
 *    setup 'mail-app' and 'myAccounts' ---- (for NON msngr app  -- like FX) ----
 **/
reminderfox.util.mailAppSetup= function(){
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	var results = {
		organizer: null,
		attendees: null,
		mode: 'mailApp',
		selectedTyp: 'info',
		schComment: ''
	};
	window.openDialog("chrome://reminderfox/content/mail/invitation.xul", "reminderFox-set-invitationmailAppString", "chrome,resizable,modal", results);

	if (results.mode == 'CANCEL') {
		return 'CANCEL';
	} // user pressed 'CANCEL'
	return reminderfox._prefsBranch.getCharPref(reminderfox.consts.MAIL_SENDER);
};



//SM / browser: document.documentURI $[2] = [string] "chrome://navigator/content/navigator.xul"
//SM / messngr: document.documentURI $[1] = [string] "chrome://messenger/content/messenger.xul"
//TB            document.documentURI $[1] = [string] "chrome://messenger/content/messenger.xul"
//FX            document.documentURI $[1] = [string] "chrome://browser/content/browser.xul"


/**
 *   Collect details from selection (text, or in msngr from header)       <br>
 *
 * @param {Object}   (only with messenger!) msgHdr; if in msngr builds return object with msgHeader data
 * @return {Object}  collected info as object; if non-msngr just builds object
 */
reminderfox.util.selectionDetails= function (msgHdr) {
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	var rv    = {};
	rv.url    = null;
	rv.infos  = {};
	var selectedText = "";

	// browser or naviagtor
	if (document.documentURI != "chrome://messenger/content/messenger.xul") {

		rv.url  = gBrowser.currentURI.spec;
		rv.summary = gBrowser.selectedTab.label
		rv.infos.subject = rv.summary;

		// get text without leading / trailing LF chars
		var selection = document.commandDispatcher.focusedWindow.getSelection();
		rv.infos.text       = reminderfox.util.cleanString(selection.toString());

		var nodes = document.popupNode;
		if (nodes) {
			for (var i=0; i < nodes.children.length; i++) {
				if (nodes.children[i].href != null) {
					rv.url = nodes.children[i].href;
					break;
				}
			}
		}

		if (gContextMenu) {
			if (gContextMenu.onLink) {
				rv.url= gContextMenu.link.href;
			}
		}
		return rv;
	}


	// messenger
	try {   // needed: if no message selected ==> would fail !!!
	if (document.documentURI == "chrome://messenger/content/messenger.xul") {
			// --- get msgHeader Infos ------
			msgHdr  = (msgHdr) ? msgHdr : gDBView.hdrForFirstSelectedMessage;

			rv.infos.fromMailadr	= msgHdr.mime2DecodedAuthor;	// need for processing eg REPLY

			var recipients = "";
			if (msgHdr.mime2DecodedRecipients)		// mime2DecodedRecipients will be removed with TB25
				recipients	= msgHdr.mime2DecodedRecipients;

			if (msgHdr.mime2DecodedTo) recipients  += msgHdr.mime2DecodedTo;
			if (msgHdr.mime2DecodedCC) recipients  += msgHdr.mime2DecodedCC;
			if (msgHdr.mime2DecodedBCC) recipients += msgHdr.mime2DecodedBCC;

			// PRIORITY definition for  RmFx and  TB
			// reminderfox.consts.PRIORITY_NORMAL = null;  // default
			// reminderfox.consts.PRIORITY_IMPORTANT = 1;
			// TB header.priority:  6= very high;  5=high;  1=normal;  3=low;  2=very low

			if (msgHdr.priority >= 5) {		// for TB 'very high' and 'high'
				rv.infos.priority = 1;	// set RmFx 'Important'
			}

			rv.infos.subject = reminderfox.string("rf.add.mail.message.mail.identifier") + " " + msgHdr.mime2DecodedSubject;
			rv.infos.date =      "    " + reminderfox.string("rf.add.mail.message.date") + ": " + reminderfox.date.parseDateTimes(msgHdr.date/1000);
			rv.infos.author =    "    " + reminderfox.string("rf.add.mail.message.sender") + ": " + msgHdr.mime2DecodedAuthor;
			rv.infos.recipients ="    " + reminderfox.string("rf.add.mail.message.recipients") + ": " + recipients;
			rv.infos.messageId = "<" + msgHdr.messageId.replace(new RegExp(/\"/g),"") + ">";

			// preformat message header for the Notes section
			rv.infos.notes = rv.infos.date
				+ "\n" + rv.infos.author
				+ "\n" + rv.infos.recipients
				+ "\n" + "    " + rv.infos.messageId;

			// if url(s) found, use the first to add to reminders URL
			var nodes = document.popupNode;
			if (nodes) {
				for (var i=0; i < nodes.children.length; i++) {
					if (nodes.children[i].href != null) {
						rv.url = nodes.children[i].href;
						break;
					}
				}
				if (nodes.href) rv.url = nodes.href;
			}

			// if text selected add it to reminders Notes
			var selection = document.commandDispatcher.focusedWindow.getSelection();
			selectedText  = reminderfox.util.cleanString(selection.toString());

			if (selectedText.length > 0) {
				selectedText = "\n\n" + reminderfox.string("rf.add.mail.message.details") + "\n" + selectedText;
			}
			rv.infos.text = rv.infos.notes + selectedText;
	}
	} catch (ex) {}
	return rv;
};


/**
 *   Convert a character stream from Unicode to UTF8 and replace CR --> CRLF
 *   @param  {string}  aSource  source stream
 *   @return {string}  resulting UTF8 string
 */
reminderfox.util.encodeUTF8= function(aSource){
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	return reminderfox.util.convertFromUnicode("UTF-8", aSource).replace(/(\r\n)|\n/g, "\r\n");
};


/**
 *   Convert a character stream from Unicode to other based on definition
 *   @param {string}  aCharset  character set name to convert to
 *   @param {string}  aSource  source stream
 */
reminderfox.util.convertFromUnicode= function(aCharset, aSource){
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	var unicodeConverter = Components.classes["@mozilla.org/intl/scriptableunicodeconverter"]
		.createInstance(Components.interfaces.nsIScriptableUnicodeConverter);
	unicodeConverter.charset = aCharset;
	return unicodeConverter.ConvertFromUnicode(aSource);
};


reminderfox.util.getIOService= function(){
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	if (reminderfox.util.getIOService.mObject === undefined) {
		reminderfox.util.getIOService.mObject = Components.classes["@mozilla.org/network/io-service;1"]
		.getService(Components.interfaces.nsIIOService2);
	}
	return reminderfox.util.getIOService.mObject;
};


/**
 * Check if fileName is a valid file, not a directory
 * @param {string | object}  filepath or nsIFile object
 * @return {integer}  1 = valid fileName; 0 = file doesn't exist
 *                   -1 = directory
 *                   -2 = parent directory isn't valid
 */
reminderfox.util.fileCheck= function (filepath) {
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	var sfile;
	if (typeof(filepath) == "string") {
		sfile = Components.classes["@mozilla.org/file/local;1"]
			.createInstance(Components.interfaces.nsIFile);
	}
	//reminderfox.util.Logger('calDAV', " .util.fileCheck: >>" + filepath + '<<')   //XXXgW
	try {
		sfile.initWithPath(filepath);
	} catch (ex){
		return -2 // serious error with filepath, ev. wrong dir from old profile!
	}

	if (sfile.exists() === false) {
		// check if parent directory exists
		var sdir = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsIFile);
		sdir.initWithPath(sfile.parent.path);
		try {
			sdir.isDirectory()
			// dir is OK but file isn't
			return 0;
		}
		catch (e) {
			return -2;
		}
	}
	if (sfile.isDirectory() === true) return -1;
	return 1;
};





reminderfox.util.reminderFox_filePickerExport= function  (aOpen, aWindow, defaultFileName) {
	var reminderFox_nsIFilePicker = Components.interfaces.nsIFilePicker;
	var picker = Components.classes["@mozilla.org/filepicker;1"].createInstance(reminderFox_nsIFilePicker);

	picker.defaultExtension = "ics";
	var filterCalendar    = reminderfox.string("rf.options.filepicker.filter.calendar");
	var extensionCalendar = ".ics";

	picker.appendFilter( filterCalendar, "*" + extensionCalendar );
	if (defaultFileName != null) picker.defaultString = defaultFileName;

	switch (aOpen) {
		case 0:
			picker.init(aWindow, reminderfox.string("rf.options.export.filepicker.title"),
				reminderFox_nsIFilePicker.modeSave);
			break
		case 1:
			picker.init(aWindow, reminderfox.string("rf.options.import.filepicker.title"),
				reminderFox_nsIFilePicker.modeOpen);
			break;
	};


	// get the file and its contents
	var res = picker.show();
	if(res == reminderFox_nsIFilePicker.returnCancel)
		return null;
	else
		return picker.file;
}

/*
 * Export (Backup) the current reminders/events
 * @param {object} backup - if passed store to file with date/time stamp
 */
reminderfox.util.exportReminders= function (backup) {

	var i;

	var _reminderEvents = reminderfox.core.getReminderEvents();
	var _todosArray = reminderfox.core.getReminderTodos();
	//  ALL todos
	var outputStr = reminderfox.core.constructReminderOutput(_reminderEvents, _todosArray, true);


	//get file
	if (backup) {
		//get current store file name
		var icsFile = reminderfox.core.getReminderStoreFile().leafName.replace(".ics", "")

		var date = new Date()
		var dateString = reminderfox.date.getDateAsString (date, 'format')
		var file = reminderfox.util.reminderFox_filePickerExport(0, window, (icsFile + "_" + dateString + ".ics"));
	} else {
		var file = reminderfox.util.reminderFox_filePickerExport(0, window, reminderfox.core.getReminderStoreFile().leafName);
	}
	if(!file)
		return;

	if(file.exists() == false) {
		file.create(Components.interfaces.nsIFile.NORMAL_FILE_TYPE, 420);
	}

	reminderfox.core.writeStringToFile(outputStr, file, true);

	// show success message
	var promptService = Components.classes["@mozilla.org/embedcomp/prompt-service;1"].getService(Components.interfaces.nsIPromptService);
	promptService.alert(window, reminderfox.string("rf.options.export.success.title"), reminderfox.string("rf.options.export.success.description"));
}


reminderfox.util.pickFileICSfile= function (extension, xthis) {
//------------------------------------------------------------------------------
	if(xthis && xthis.disabled) return;

	var promptService = Components.classes["@mozilla.org/embedcomp/prompt-service;1"]
		.getService(Components.interfaces.nsIPromptService);

	var title = null;
	if ( xthis ) {
		title = xthis.getAttribute("value")
	}
	var file = reminderfox.util.pickFileLocationFile(extension, title /*title*/);
	if (!file) return;  // cancel pressed -- no file selected

	// var msg = ("New file location selected")
	if (xthis && xthis.id == 'reminderFox_file_location_browse') {
		document.getElementById("reminderFox-file-location").value = file.path;
		document.getElementById("reminderFox-apply").removeAttribute("disabled");
	}
	else {
		reminderfox.core.logMessageLevel("filebrowse1: ", reminderfox.consts.LOG_LEVEL_INFO);
	//if (!xthis || xthis.id == 'reminderFox_file_recover_browse') {
		reminderfox.core.logMessageLevel("filebrowse2: ", reminderfox.consts.LOG_LEVEL_INFO)
		// make sure they REAAAAALY want to overwrite
		var msg = reminderfox.string("rf.options.import.overwrite.description") 
			+ "\n\n File to restore: " + file.path;		//$$$_locale

		flags = promptService.BUTTON_TITLE_IS_STRING * promptService.BUTTON_POS_0 
			+ promptService.BUTTON_TITLE_IS_STRING * promptService.BUTTON_POS_1
			+ promptService.BUTTON_POS_1_DEFAULT;	//  set default button;

		var buttonPressed = promptService.confirmEx(window, reminderfox.string("rf.options.import.overwrite.title"), 
			msg, flags, 
			reminderfox.string("rf.options.import.overwritebutton.title"), 
			reminderfox.string("rf.button.cancel"), null, null, {});

		if(buttonPressed == 1) return;	// cancel pressed



		var reminderEvents = new Array();
		var reminderTodos = new Array();
		reminderfox.core.readInRemindersAndTodosICSFromFile(reminderEvents, reminderTodos, file, false /*ignoreExtraInfo IfImportingAdditionalEvents*/);

		// With CalDAV enabled, each event/todo connected to a CalDAV account will 
		// be traced in  'reminderfox.calDAV.accounts' 
		reminderfox.calDAV.getAccounts();

		// check if we've successfully imported any reminders or todo events
		var importedSuccess = reminderEvents.length !== 0;
		var numTodos = 0;
		for(var n in reminderTodos) {
			var importedTodos = reminderTodos[n];
			if(importedTodos.length > 0) {
				importedSuccess = true;
				numTodos += importedTodos.length;
				//break;
			}
		}
		var numEvents = reminderEvents.length/*numEvents*/;

		reminderfox.util.PromptAlert("Imported  Reminders: " + numEvents  +  "  ToDo's:" + numTodos);

		reminderfox.core.reminderFoxEvents = reminderEvents;
		reminderfox.core.reminderFoxTodosArray = reminderTodos;
		reminderfox.core.importRemindersUpdateAll(false, null);
	}
};


reminderfox.util.pickFileLocationFile= function (extension, title) {
//------------------------------------------------------------------------------
	// check if unsaved events pending
	if(reminderfox.core.checkModified()) return;

	//get file
	var file = reminderfox.util.pickFileLocationPicker(window, extension, title); //reminderFox_fileLocationPicker(window);
	if(!file)
		return null;
	var fileLocation = file.path;
	if(reminderfox.util.fileCheck(fileLocation) == -1) {
			reminderfox.util.PromptAlert(reminderfox.string("rf.options.isfilelocation.valid"));
		return null;
	}
	return file;
};



reminderfox.util.pickFileLocationPicker= function (aWindow, extension, title) {
//------------------------------------------------------------------------------
	var cDir = Components.classes["@mozilla.org/file/local;1"]
		.createInstance(Components.interfaces.nsIFile);

	// if we're in options dialog, get current file value
	var cLocation = document.getElementById("reminderFox-file-location");
	if ( cLocation ) {
		cDir.initWithPath(cLocation.value);
	}
	// otherwise, get stored reminder value
	else {
		var rmFx_icsFileLocationCurrent = reminderfox.core.getReminderStoreFile().path;
		cDir.initWithPath( rmFx_icsFileLocationCurrent );
	}
	var reminderFox_nsIFilePicker = Components.interfaces.nsIFilePicker;
	var filterCalendar    = reminderfox.string("rf.options.filepicker.filter.calendar");
	var extensionCalendar = extension;

	var picker = Components.classes["@mozilla.org/filepicker;1"].createInstance(reminderFox_nsIFilePicker);
	picker.init(aWindow, title||reminderfox.string("rf.options.filelocation.filepicker.title"),
		reminderFox_nsIFilePicker.modeOpen);
//		reminderFox_nsIFilePicker.modeGetFolder);
	picker.appendFilters(reminderFox_nsIFilePicker.filterAll);
	picker.appendFilter(filterCalendar, extensionCalendar);
	picker.filterIndex=1;
	picker.defaultExtension = extension;
	picker.displayDirectory = cDir.parent;

	// get the file and its contents
	var res = picker.show();
	if (res == reminderFox_nsIFilePicker.returnCancel)
	return null;
		else
	return picker.file;
};


/**
 *   Build a temporary file using the ICS UID name
 *   @param  {string}  rmFx_UID
 *   @return {string}  tmp file path in OS tmp dir
 */
reminderfox.util.buildUIDFile= function(rmFx_UID){
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	var tempDir = Components.classes["@mozilla.org/file/directory_service;1"]
		.getService(Components.interfaces.nsIProperties).get("TmpD", Components.interfaces.nsIFile);

	tempDir.append("tempMsg" + rmFx_UID);

	return tempDir.path;
};


/**
 *  Create file.path for a file located in same dir as the current
 *  ReminderFox ICS file location
 *  @param   {string}  fileName
 *  @return  {string}  file path 
 */
reminderfox.util.filePath4storePath= function(fileName){
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	// set 'path' to same dir as 'reminderfox.ics' file      
	var sfile = Components.classes["@mozilla.org/file/local;1"]
		.createInstance(Components.interfaces.nsIFile);
	
	sfile.initWithPath(reminderfox.core.getReminderStoreFile().parent.path);
	sfile.append(fileName);

	return sfile.path;

};

reminderfox.util.ProfD_extend= function(dirName){
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
		var xFile = Components.classes["@mozilla.org/file/directory_service;1"]
			.getService(Components.interfaces.nsIProperties)
			.get("ProfD", Components.interfaces.nsIFile);
		xFile.append(dirName);
		return xFile;
};


/**
 *   Read character file and convert to UTF8 string
 *   @param  {string}  file name
 *    @return {string}  UTF8 character string
 */
reminderfox.util.readInFileContents= function(tmpFile){
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	var sfile = Components.classes["@mozilla.org/file/local;1"]
		.createInstance(Components.interfaces.nsIFile);
	sfile.initWithPath(tmpFile);

	var is = Components.classes["@mozilla.org/network/file-input-stream;1"]
		.createInstance(Components.interfaces.nsIFileInputStream);
	try {
		is.init(sfile, 0x01, 00004, null);
	}
	catch (e) {
		reminderfox.util.PromptAlert("Could not read reminder file: " + e.name + " -- " + e.message);
		return null;
	}

	// Now, read from the stream
	var scriptableStream = Components.classes["@mozilla.org/scriptableinputstream;1"]
		.createInstance(Components.interfaces.nsIScriptableInputStream);
	scriptableStream.init(is);

	var converter = Components.classes["@mozilla.org/intl/scriptableunicodeconverter"]
			.createInstance(Components.interfaces.nsIScriptableUnicodeConverter);
	converter.charset = "UTF-8"; // The character encoding you want, using UTF-8 here
	var chunk = scriptableStream.read(scriptableStream.available());
	scriptableStream.close();
	var input = null;
	try {
		input = converter.ConvertToUnicode(chunk);
	} 
	catch (e) {
		input = chunk;
	}
	return input;
};


reminderfox.util.makeMsgFile= function(xcontent, tempFile){
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	var sfile = Components.classes["@mozilla.org/file/local;1"]
		.createInstance(Components.interfaces.nsIFile);
	try {
		sfile.initWithPath(tempFile);
	}
	catch (ex) {
		return null;
	}
	if (sfile.exists()) {
		sfile.remove(true);
	}
	sfile.create(sfile.NORMAL_FILE_TYPE, 0600);
	var outputStream = Components.classes['@mozilla.org/network/file-output-stream;1']
		.createInstance(Components.interfaces.nsIFileOutputStream);
	outputStream.init(sfile, 2, 0x200, false); // open as "write only"
	outputStream.write(xcontent, xcontent.length);
	outputStream.close();
	return sfile;
};


reminderfox.util.makeFile8= function(outputStr, file){
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	var sfile = Components.classes["@mozilla.org/file/local;1"]
		.createInstance(Components.interfaces.nsIFile);
	sfile.initWithPath(file);

	var outputStream = Components.classes["@mozilla.org/network/file-output-stream;1"]
		.createInstance(Components.interfaces.nsIFileOutputStream);
	outputStream.init(sfile, 0x04 | 0x08 | 0x20, 420, 0);

	var converter = Components.classes["@mozilla.org/intl/scriptableunicodeconverter"]
		.createInstance(Components.interfaces.nsIScriptableUnicodeConverter);
	converter.charset = "UTF-8";

	var chunk = null;
	try {
		chunk = converter.ConvertFromUnicode(outputStr);
	}
	catch (e) {
		chunk = outputStr;
	}
	outputStream.write(chunk, chunk.length);

	var fin = converter.Finish();
	if (fin.length > 0) 
		outputStream.write(fin, fin.length);
	outputStream.close();
	return sfile;
};


/**
 *     Debugging support, prompts an Alert and writes it to console
 */
reminderfox.util.PromptAlert= function(msgErr, noAlert){
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	var promptService = Components.classes["@mozilla.org/embedcomp/prompt-service;1"]
		.getService(Components.interfaces.nsIPromptService);

	promptService.alert(window, "ReminderFox Alert : \n\n", msgErr);
	if (!noAlert)
		reminderfox.util.Logger('ALERT', msgErr);		// 'ALERT'  adds the stack to the console output
	else
		reminderfox.util.LogToConsole(msgErr);		//   no stack to the console output	
};


reminderfox.util.PromptUser= function (msg, title, button0, button1, defaultButton){
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	var promptService = Components.classes["@mozilla.org/embedcomp/prompt-service;1"]
		.getService(Components.interfaces.nsIPromptService);

	var flags = promptService.BUTTON_TITLE_IS_STRING * promptService.BUTTON_POS_0 +
		promptService.BUTTON_TITLE_IS_STRING * promptService.BUTTON_POS_1 + defaultButton;

	return promptService.confirmEx(window, title, msg, flags, button0, button1, null, null, {});
};


/**
 * Returns a string describing the current js-stack with filename and line
 * numbers.
 *
 * @param aDepth (optional) The number of frames to include. Defaults to 10.
 */
reminderfox.util.STACK= function (aDepth) {
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	var depth = aDepth || 10;

	var frame = Components.stack.caller.caller;
	var stack = frame.filename + " # " + frame.lineNumber + "\n";
	var frame = Components.stack.caller.caller.caller;
	if (aDepth === 0) return stack;

	for (var i = 1; i <= depth && frame; i++) {

		var x = (frame.filename != null) ? frame.filename : ""
		if (x.search("reminderfox") == -1) break		//gW2015 to clean the log from not relevant lines
		stack += (i + ": [" + frame.filename + " # " +
			frame.lineNumber + "] " + frame.name + "\n");
		if (!frame.filename) break;
		frame = frame.caller;
	}
	return stack;
};


/**
 * Logs passes a message string  to console output. 
 * Optional the stack and filename/line number can be appended.
 * 
 * Prefs is used to configure the output:      "extensions.reminderFox.loggers"
 * it's a JSON string with  {"Reminderfox": level, SubLogger : level},
 * multiple Subloggers can be defined.
 *
 * 'Reminderfox' is the root name with a user selected level.
 * SubLoggers are defined also with name/level:
 *   Examples:
 *     {"Reminderfox":"Error","calDAV":"Info"}
 *     {"Reminderfox":"Trace","calDAV":"Info"}
 *
 * "level" values can be any of
 * 'Fatal', 'Error', 'Warn', 'Info', 'Config', 'Debug', 'Trace', 'All'.
 * (Fatal is highest, All is lowest level).
 *
 * Logger will send to console if 'SubLogger' has same or higher "level" than
 * 'Reminderfox'.
 *   ad Examples above:  first   will NOT send the message,
 *                       second  will send.
 *
 * To use the Logger a function call has to be added to the JS code:
 *   reminderfox.util.Logger('calDAV', msg);

 * Call to Logger will not send anything to the console with
 *  -- prefs string not defined
 *  -- prefs string without 'Reminderfox' and 'level'
 *  -- call with unknown 'level' for 'subLogger'
 *
 * Using a call for the Logger with 'Alert' will write to console indepened 
 * of 'Reminderfox' settings!
 * 
 * Additional console output
 *   -- for 'Fatal', 'Error', 'Warn': the calling STACK will be appended to the normal log message
 *   -- with 'Info' or higher: the calling filename and line number is appended. 
 *
 * @param {string}  'Log' name
 * @param {string}  'msg' message 
*/
reminderfox.util.Logger = function (Log, msg) {
//------------------------------------------------------------------------------
	var logMsg;

	var _LogLevel = {
		FATAL:  70,
		ERROR:  60,
		WARN:   50,
		INFO:   40,
		CONFIG: 30,
		DEBUG:  20,
		TRACE:  10,
		ALL:    0
		};

	if (Log.toLowerCase().search('alert') > -1){
		var date = new Date();
		logMsg = "\nReminderfox  ** Alert **    " + date.toLocaleFormat("%Y-%m-%d %H:%M:%S") + "\n" + msg;
		if (Log == 'ALERT') logMsg += "\n" + reminderfox.util.STACK();
		if (Log == 'Alert') logMsg += "\n" + reminderfox.util.STACK(1);
		if (Log == 'alert') logMsg += "\n";
		reminderfox.util.LogToConsole(logMsg, Components.stack.caller.filename, "", Components.stack.caller.lineNumber);
		return;
	}

	var prefLoggers ;
	try {
		var _prefs = Components.classes["@mozilla.org/preferences-service;1"]
			.getService(Components.interfaces.nsIPrefBranch);
		prefLoggers = JSON.parse(_prefs.getCharPref("extensions.reminderFox.loggers").toUpperCase());
	} catch (ex) {}
	if (!prefLoggers) return;

	// if prefs don't have a 'Reminderfox' logger, do nothing .. just return
	var rootID = prefLoggers['REMINDERFOX'];
	var rootNum = _LogLevel[rootID];
	var logId   = prefLoggers[Log.toUpperCase()];
	var logNum  = _LogLevel[logId];

	// if the requested 'Log' is unknown or rootLog is higher than 'Log' just return; 
	if ((!rootNum) || (!logNum)) return;
	if (logNum < rootNum) return;


	var date = new Date();
	logMsg = "\nReminderfox Logger : "+ rootID + "  [" + Log + " : " + logId + "]      "
		+ date.toLocaleFormat("%Y-%m-%d %H:%M:%S") + "\n" + msg;

	if (logNum >= 50 /* 'Warn', 'Error', 'Fatal' */) {
		logMsg += "\n" + reminderfox.util.STACK();
	} else {
		logMsg += "\n" + reminderfox.util.STACK(1);
	}

	reminderfox.util.LogToConsole(logMsg, Components.stack.caller.filename, "", Components.stack.caller.lineNumber);
};


reminderfox.util.LogToConsole= function (aMessage, aSourceName, aSourceLine, aLineNumber,
		aColumnNumber) {
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	var consoleService = Components.classes["@mozilla.org/consoleservice;1"]
		.getService(Components.interfaces.nsIConsoleService);
	var scriptError = Components.classes["@mozilla.org/scripterror;1"]
		.createInstance(Components.interfaces.nsIScriptError);

	scriptError.init(aMessage, aSourceName, aSourceLine, aLineNumber,
		aColumnNumber, 
		Components.interfaces.nsIScriptError.warningFlag, "component javascript");

	consoleService.logMessage(scriptError);
};


/**
 *    Generic function to copy the data to Clipboard
 */
reminderfox.util.copytoClipboard= function(data){
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	// Generic function to copy the data to Clipboard 
	var clipboard = Components.classes["@mozilla.org/widget/clipboardhelper;1"];
	clipboard = clipboard.getService(Components.interfaces.nsIClipboardHelper);
	clipboard.copyString("");	// make it's empty !
	clipboard.copyString(data);
};


/**
 *    Generic function to get the text from Clipboard
 */
reminderfox.util.copyTextfromClipboard= function(){ //gW_AddEvent
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	var clip = Components.classes["@mozilla.org/widget/clipboard;1"]
		.getService(Components.interfaces.nsIClipboard);
	if (!clip) return null;

	var trans = Components.classes["@mozilla.org/widget/transferable;1"]
		.createInstance(Components.interfaces.nsITransferable);
	if (!trans) return null;

	// init() was added to nsITransferable in FF16 for Private Browsing Mode
	// see https://bugzilla.mozilla.org/show_bug.cgi?id=722872 for more info
	if ('init' in trans) {
		var privacyContext = document.commandDispatcher.focusedWindow.
			QueryInterface(Components.interfaces.nsIInterfaceRequestor).
			getInterface(Components.interfaces.nsIWebNavigation).
			QueryInterface(Components.interfaces.nsILoadContext);
		trans.init(privacyContext);
	}

	trans.addDataFlavor("text/unicode");

	clip.getData(trans, clip.kGlobalClipboard);

	var str = new Object();
	var strLength = new Object();
	var pastetext;

	try { // 'try' to prevent error with empty or non-text clipboard content
		trans.getTransferData("text/unicode", str, strLength);
		if (str)
			str = str.value.QueryInterface(Components.interfaces.nsISupportsString);
		if (str)
			pastetext = str.data.substring(0, strLength.value / 2);

		if (pastetext !== "")
			return pastetext;
	}
	catch (ex) {
	}
	return null;
};


/**
 *   rmFxUtil Dialog Confirm Service to support 2 or 3 key choice
 *
 *      [key0] [key1]
 *       or   [key0] [key2] [key1]
 *
 *   @param	title, the headline of dialog
 *   @param	msg, typically a question
 *   @param	key0
 *   @param	key1
 *   @param	key2, optional, decides if 2 or 3 buttons
 *    @return  index of button pressed;  returns 1 if the user closes the window using the close button in the titlebar
 */
reminderfox.util.ConfirmEx= function(title, msg, key0, key1, key2){
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	var promptService = Components.classes["@mozilla.org/embedcomp/prompt-service;1"].getService(Components.interfaces.nsIPromptService);

	var flags = promptService.BUTTON_TITLE_IS_STRING * promptService.BUTTON_POS_0 +
	promptService.BUTTON_TITLE_IS_STRING * promptService.BUTTON_POS_1; // flags = [integer] 32639
	if (!!key2) {
		flags = promptService.BUTTON_TITLE_IS_STRING * promptService.BUTTON_POS_0 +
		promptService.BUTTON_TITLE_IS_STRING * promptService.BUTTON_POS_1 +
		promptService.BUTTON_TITLE_IS_STRING * promptService.BUTTON_POS_2; // flags = [integer] 8355711
	}
	return promptService.confirmEx(window, title, msg, flags, key0, key1, key2, null, {});
};


// Utilities  from \mail\components\preferences\applications.js

reminderfox.util.getDisplayNameForFile= function(aFile){ // +++2do gW_OSspecfic ???
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	//@line 85 "e:\buildbot\win32_build\build\mail\components\preferences\applications.js"
	if (aFile instanceof Components.interfaces.nsILocalFileWin) {
		try {
			return aFile.getVersionInfoField("FileDescription");
		}
		catch (ex) { // fall through to the file name
		}
	}
	return aFile.leafName;
};


reminderfox.util.getLocalHandlerApp= function(aFile){ // +++2do gW_OSspecfic ???
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	var localHandlerApp = Components.classes["@mozilla.org/uriloader/local-handler-app;1"].createInstance(Components.interfaces.nsILocalHandlerApp);
	localHandlerApp.name = reminderfox.util.getDisplayNameForFile(aFile);
	localHandlerApp.executable = aFile;
	return localHandlerApp;
};


reminderfox.util.isValidHandlerExecutable= function(aExecutable){ // +++2do gW_OSspecfic ???
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	return aExecutable &&
	aExecutable.exists() &&
	aExecutable.isExecutable() &&
	//@line 905 "e:\buildbot\win32_build\build\mail\components\preferences\applications.js"
	aExecutable.leafName != ".exe";
	//@line 913 "e:\buildbot\win32_build\build\mail\components\preferences\applications.js"
};


/**
 *    Add CATEGORIES item to reminder, no dups
 */
reminderfox.util.addCategory4Import= function(reminder, categoryItem){
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	var categoryItemLC = categoryItem.toLowerCase(); //   "invitation";
	if (reminder.categories  && reminder.categories.length > 0) {
		if (reminder.categories.toLowerCase().indexOf(categoryItemLC) == -1) {
			reminder.categories = reminder.categories + ", " + categoryItem;
		}
	}
	else {
		reminder.categories = categoryItem;
	}
	return reminder;
};


/**
 *    Add Events/Todos to existed and write result to ReminderFox 'statusline'
 *   @param {object} newEvents
 *   @param {object} newTodos
 */
reminderfox.util.addMultipleEvents= function (newEvents, newTodos) {
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	// merge
	var existingEvents = reminderfox.core.getReminderEvents();
	var existingTodos = reminderfox.core.getReminderTodos();  //  ALL  todos
	var rvEvent = reminderfox.core.mergeEvents(existingEvents, newEvents);
	var rvTodo = reminderfox.core.mergeTodos( existingTodos, newTodos);

	reminderfox.core.reminderFoxEvents = existingEvents;
	reminderfox.core.reminderFoxTodosArray = existingTodos;

	reminderfox.core.importRemindersUpdateAll(false, null);// (isNetworkImport, lastModifiedTime)

	// write to status !!
	var xEvents= reminderfox.string("rf.html.heading.reminders");
	var xToDos = reminderfox.string("rf.html.heading.todos");
	var xImported  = reminderfox.string("rf.reminders.imported");	//"imported";
	var xExists  = reminderfox.string("rf.reminders.exists");		//"already exists";

	var msgText =  xEvents + " : " + rvEvent.importNo + " " + xImported
			+ ",  " + rvEvent.existNo + " " + xExists +"."
			+ "\n" + xToDos + " : " + rvTodo.importNo  + " " + xImported
			+ ",  " + rvTodo.existNo + " " + xExists + "." ;

	reminderfox.core.statusSet (msgText, false);
	return true;
};


// *****************************************************************************
reminderfox.util.openURL= function(UrlToGoTo, pageIdentifier){
//------------------------------------------------------------------------------
	if ("@mozilla.org/messenger;1" in Components.classes) {
		var messenger = Components.classes["@mozilla.org/messenger;1"].createInstance()
			.QueryInterface(Components.interfaces.nsIMessenger);
		var url = reminderfox.util.encodeUTF8 (UrlToGoTo);

//gWXXX //gWTEST throws error !??		url = url.replace("\x","%");

		try {
			messenger.launchExternalURL(url);
		} catch (ex) {
			var msgString = "Check Messenger settings for opening web pages."
				+ "\n (Called: " + url;
			reminderfox.util.PromptAlert (msgString);
		}
	} 
	else {  // --- Firefox part ---
		// display on browser tab, if it's known reuse it 
		if ( pageIdentifier == null ) { 
			pageIdentifier = 'reminderfox_infoPage';
		}
		reminderfox.util.openAndReuseOneTabPerAttribute(pageIdentifier, UrlToGoTo);
	}
};


//rf.faqURL= http://www.reminderfox.org/documentation
//rf.printingUser=http://www.reminderfox.org/printing/

//rf.faqURL=http://www.reminderfox.org/documentation-german/
//rf.printingUser=http://www.reminderfox.org/printing-de/


reminderfox.util.launchHelp= function(whichHelp){

	if ((whichHelp === "") || (!whichHelp)) {
		reminderfox.util.docRmFX(reminderfox.string("rf.faqURL"));
	} else {
		reminderfox.util.docRmFX(reminderfox.string(whichHelp));
	}
};

reminderfox.util.launchForum= function(whichHelp){
	
}


reminderfox.util.docRmFX= function(UrlToGoTo){
//------------------------------------------------------------------------------
//reminderfox.util.Logger('ALERT', "  .util.docRmFX  UrlToGoTo  >" + UrlToGoTo + "<");

	if ((UrlToGoTo === "") || (!UrlToGoTo)) {
		UrlToGoTo = (reminderfox.consts.REMINDER_FOX_PAGE_URL + "/");
	}
	
	if (UrlToGoTo == "forum") {
		UrlToGoTo = "https://groups.google.com/forum/#!forum/reminderfox"
	} else {
	if (UrlToGoTo.indexOf(reminderfox.consts.REMINDER_FOX_PAGE_URL) == -1) 
		UrlToGoTo = reminderfox.consts.REMINDER_FOX_PAGE_URL +"/" + UrlToGoTo;
	}

	if ("@mozilla.org/messenger;1" in Components.classes) { 

	//	var url = reminderfox.util.encodeUTF8 (UrlToGoTo);
		var url = (UrlToGoTo);

		var tabmail = document.getElementById("tabmail");
		if (!tabmail) {
			// Try opening new tabs in an existing 3pane window
			var mail3PaneWindow = Components.classes["@mozilla.org/appshell/window-mediator;1"]
					.getService(Components.interfaces.nsIWindowMediator)
					.getMostRecentWindow("mail:3pane");
			if (mail3PaneWindow) {
				tabmail = mail3PaneWindow.document.getElementById("tabmail");
				mail3PaneWindow.focus();
			}
		}

		if (tabmail) {
			// because we want the "reuse" the same tab, but tabmail hasn't (???) 
			// a reuse mode, the 'contentTab' will be closed before open with the new url 
			tabmail.selectTabByMode('contentTab');
			var tIndex = tabmail.tabContainer.selectedIndex;
			var tType = tabmail.tabContainer.selectedItem.getAttribute('type');		// = [string] "folder"

			if (tType != "contentTab")
				tabmail.openTab("contentTab", {contentPage: url, clickHandler: "http://www.reminderfox.org/"});

			else {
				var aTab = tabmail.tabInfo[tIndex].browser.contentDocument.location;
				aTab.href = url;
			}
		}
		else {
			window.openDialog("chrome://messenger/content/", "_blank", "chrome,dialog=no,all", null,
				{ tabType: "contentTab", tabParams: {contentPage: url} });
		}
		return;
	}
	else {  // --- Firefox part ---
		// display on browser tab, if it's known reuse it 
		reminderfox.util.openAndReuseOneTabPerAttribute('reminderfox_infoPage', UrlToGoTo);
	}
};

reminderfox.util.openAndReuseOneTabPerAttribute= function(attrName, url) {
//------------------------------------------------------------------------------
	var tabbrowser;

	var wm = Components.classes["@mozilla.org/appshell/window-mediator;1"]
					.getService(Components.interfaces.nsIWindowMediator);
	for (var found = false, index = 0, tabbrowser = wm.getEnumerator('navigator:browser').getNext().gBrowser;
		index < tabbrowser.tabContainer.childNodes.length && !found;
		index++) {

		// Get the next tab
		var currentTab = tabbrowser.tabContainer.childNodes[index];

		// Does this tab contain our custom attribute?
		if (currentTab.hasAttribute(attrName)) {

		// Yes--select and focus it.
			tabbrowser.selectedTab = currentTab;

			// Focus *this* browser window in case another one is currently focused
			tabbrowser.ownerDocument.defaultView.focus();
			tabbrowser.ownerDocument.defaultView.openUILink(url);
			found = true;
		}
	}

	if (!found) {
		var browserEnumerator = wm.getEnumerator("navigator:browser");
		tabbrowser = browserEnumerator.getNext().gBrowser;

		// Create tab
		var newTab = tabbrowser.addTab(url);
		newTab.setAttribute(attrName, "xyz");

		// Focus tab
		tabbrowser.selectedTab = newTab;

		// Focus *this* browser window in case another one is currently focused
		tabbrowser.ownerDocument.defaultView.focus();
	}
};


// *****************************************************************************
/**
 * Dispatcher
 * Used as 'chrome' Loader for specific usecases.
 * Loading will only executed if the '.JS' isn't loaded already,
 * checked with an object expected to be loaded with .JS file;
 * ex "reminderfox.iCal"  defined in "rmFxIcalMail.js"
 *
 * @param  id    name of a package with one or more 'chrome' files and
 *  (optional a function to be called after loading; this is added to
 *   simplify definition in XUL)
 * @param  arg   argument(s) to be passed to the optional call
 *
 */
reminderfox.util.JS = {
// *****************************************************************************
	mail:      "chrome://reminderfox/content/mail/rmFxMail.js",
	iCal:      "chrome://reminderfox/content/mail/rmFxIcalMail.js",
	iSchedule: "chrome://reminderfox/content/mail/schedule.js",
	abCard:    "chrome://reminderfox/content/mail/addContact2Reminder.js",
	sendPlus:  "chrome://reminderfox/content/mail/rmFxSendwReminder.js",
	tagging:   "chrome://reminderfox/content/mail/rmFxMsgTagging.js",
	userIO:    "chrome://reminderfox/content/utils/rmFxUserIO.js",
	addDialog: "chrome://reminderfox/content/addReminderDialog.js",
	http:      "chrome://reminderfox/content/utils/HTTP.js",


	"network.download":  "chrome://reminderfox/content/network/download.js",
	"network.upload":    "chrome://reminderfox/content/network/upload.js",
	"network.services":  "chrome://reminderfox/content/network/networkService.js",
	"network.password":  "chrome://reminderfox/content/network/passwordManagerUtils.js",


	dispatcher: function(object){
		var status = true;
		
		// for multi-package (network.upload), check if first segment is defined; if so,
		// check for second segment as well
		if( object.indexOf( ".") != -1) { 
			var index = object.indexOf( ".");
			var segment1 = object.substring( 0, index);
			var segment2 = object.substring( index + 1);
			status = typeof reminderfox[segment1] == 'undefined';
			if ( !status) {
				status = typeof reminderfox[segment1][segment2] == 'undefined';
			}
		}
		else { 
			status = typeof reminderfox[object] == 'undefined';
		}
		if (status) {
			Components.classes["@mozilla.org/moz/jssubscript-loader;1"]
			.getService(Components.interfaces.mozIJSSubScriptLoader)
			.loadSubScript(this[object]);
		}

		var consoleService = Components.classes["@mozilla.org/consoleservice;1"]
			.getService(Components.interfaces.nsIConsoleService);

	//%%	consoleService.logStringMessage("ReminderFox     {dispatch: " +
	//%%	object + "=" + status + "}\n" + this.loggedAt);
	},


	/**
	 *  for multi-package (like 'jcalendar,jquery,icalendar'), check if a package is defined 
	 *  for the first string (eg: 'jcalendar'),    <br>
	 *  -- if so return, do nothing;   <br>
	 *  -- if NOT, load  all packages without further checking
	 *  
	 * @param {string} object
	 */
	dispatcher2: function(packages){
		var status = null;
		var allPackages = packages.split(",");

		var pLength = allPackages.length;
		var aPackage = reminderfox.util.trim(allPackages[0]);

		status = typeof reminderfox[aPackage] == 'undefined';
		this.loader (aPackage, status);

		if (status) {   // if first has been loaded go for the rest
			for (var i= 1; i < pLength; i++) {
				aPackage = reminderfox.util.trim(allPackages[i]);
				this.loader (aPackage, "force");
			}
		}
	},


	loader : function (object, status) {
		
		var consoleService = Components.classes["@mozilla.org/consoleservice;1"]
			.getService(Components.interfaces.nsIConsoleService);

		consoleService.logStringMessage("ReminderFox     {dispatch: " +
		object + "=" + status + "}\n" + this.loggedAt);

		if (status == true) {
			Components.classes["@mozilla.org/moz/jssubscript-loader;1"]
			.getService(Components.interfaces.mozIJSSubScriptLoader)
			.loadSubScript(this[object]);
		}
	},


	loggedAt: '',

	dispatch: function(id, arg){
		this.loggedAt = "[[" + Components.stack.caller.filename + "  # " +
		Components.stack.caller.lineNumber + "]]";

		switch (id) {	// *** XUL calls for dispachting and optional  fct call ***
			case 'getiCalMailed':{
				this.dispatcher('iCal');
				this.dispatcher('mail');
				reminderfox.iCal.addReminder4Message(arg);
				break;
			}
			case 'addReminder4Contact':{
				this.dispatcher('abCard');
				this.dispatcher('mail');
				reminderfox.abCard.addReminder4Contact(arg);
				break;
			}
			case 'msgSendwReminder':{
				this.dispatcher('sendPlus');
				this.dispatcher('calDAV');
				reminderfox.sendPlus.reminder();
				break;
			}


			// *** just loading ****
			case 'mail':{
				this.dispatcher('mail');
				this.dispatcher('tagging');
				break;
			}
			case 'iCalMail':{
				this.dispatcher('mail');
				this.dispatcher('iCal');
				break;
			}
			case 'sendPlus':{
				this.dispatcher('sendPlus');
				this.dispatcher('tagging');
				this.dispatcher('mail');
				this.dispatcher('calDAV');
				break;
			}
			case 'tagging':{
				this.dispatcher('tagging');
				this.dispatcher('sendPlus');
				break;
			}
			case 'tag':{
				this.dispatcher('tagging');
				break;
			}

			case 'network':{
				this.dispatcher('network.upload');
				this.dispatcher('network.download');
				this.dispatcher('network.services');
				this.dispatcher('network.password');
				break;
			}
			case 'userIO':{
				this.dispatcher('userIO');
				reminderfox.userIO.go(arg);
				break;
			}
			case 'addDialog':{
				this.dispatcher('addDialog');
				this.dispatcher('iCal');
				break;
			}

			case 'addDialog0':{
				this.dispatcher('addDialog');
				break;
			}

			case 'http':{
				this.dispatcher('http');
				break;
			}
		}
	}
};


// ***************** .date.  based on 1.1.1900 *********************************
// *****************************************************************************

	/**
	 *  calculate Date Object from numDays
	 *     @param	numDays  (number as with Excel, starting with 1.Jan.1900)
	 *     @return	Date() object
	 */
	reminderfox.date.getDate= function(numDays) {
	//--------------------------------------------------------------------------
		return new Date(1900, 0, numDays - 1);
	};

	reminderfox.date.m1900 = Date.UTC(1899, 11, 30) / 86400000; /*
														 * 'Day one' -1 for
														 * calculations
														 */
	reminderfox.date.m1900Day = 1;  /* this a Monday */


	/**
	 *  Convert a Date Object to numDays 
	 *     @param   Date()
	 *     @return	numDay  (number as with Excel, but starting with 1.1.1900)
	 *        null if not a valid date
	 */
	reminderfox.date.getDate1900= function(aDate) {
	//--------------------------------------------------------------------------
	//	var m1900 = Date.UTC(1899, 11, 30) / 86400000; /*
	//													 * 'Day one' -1 for
	//													 * calculations
	//													 */
		// 86400000 // 24 * 60 * 60 * 1000 = 1 day in ms
		if (!aDate) 
			reminderfox.util.Logger('ALERT', " ****  aDate is NULL !  *****");		//§§§

		var numDay = Date.UTC(aDate.getFullYear(), aDate.getMonth(), aDate
				.getDate())
				/ 86400000 - reminderfox.date.m1900;
		return numDay;
	};


	/**
	 * Converts a date object to numDays (based on 1900) and vice versa
	 *    @param {integer} | {date object}
	 *    @return {date object} | {integer}
	 */
	reminderfox.date.convertDate= function (xDate) {
	var aDate;

	if (!xDate) reminderfox.util.Logger('ALERT'," reminderfox.date.convertDate  is null ");

		if (typeof(xDate) == "object") {
			aDate = this.getDate1900(xDate);
		} else {
			aDate = this.getDate(xDate);
		}
		return aDate;
	};

	reminderfox.date.getDateObject= function (xDate) {
		if (typeof(xDate) == "object") return xDate;
		return reminderfox.date.getDate(xDate);
	};

	reminderfox.date.getDateNum= function (xDate) {
		if (typeof(xDate) != "object") return xDate;
		return reminderfox.date.getDate1900(xDate);
	};


	/**  Get week number of Year for a Date Object or numDate1900
	 *     @param {Date() || integer}
	 *     @param {integer} start od week day; Sunday = 0;
	 */
reminderfox.date.getWeekOfYear= function(aDate, dowOffset) {
	//--------------------------------------------------------------------------
	if (typeof(aDate) != "object") {
		aDate = this.getDate(aDate);
	}
	var weekNumShow = reminderfox.core
			.getPreferenceValue(reminderfox.consts.SHOW_WEEK_NUMS_PREF);
			// Week Numbering:
			// 0 (none),
			// 1 (default),
			// 2 (ISO 8601)

		var newYear = new Date(aDate.getFullYear(), 0, 1);
		var day = newYear.getDay() - dowOffset; // the day of week the year begins on
		day = (day >= 0 ? day : day + 7);
		var daynum = Math
				.floor((aDate.getTime() - newYear.getTime() - (aDate
						.getTimezoneOffset() - newYear.getTimezoneOffset()) * 60000) / 86400000) + 1;
		var weeknum = Math.floor((daynum + day - 1) / 7);
		var useISO = weekNumShow == 2;
		if (!useISO || day < 4) { // if using ISO standard, first week w/ day starting after Wed are 0-week; 
			weeknum = weeknum + 1; // otherwise, weeks start at 1
		}
	//	reminderfox.util.Logger('ISOtimeDate',"   ISO:" + useISO + "  " + aDate.toString() +  "  week#:" + weeknum);
		return weeknum;
	};


	/**
	 * Calculate number of days for a given month; correct for leap years
	 * @param {integer} month
	 * @param {integer} year
	 * @return {integer} no.of days
	 */
	reminderfox.date.getDaysInMonth= function(month, year) {
	//--------------------------------------------------------------------------
		var daysInMonth = [ 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ];
		if ((month == 1) && (year % 4 === 0)
				&& ((year % 100 !== 0) || (year % 400 === 0))) {
			return 29;
		} else {
			return daysInMonth[month];
		}
	};



// *****************************************************************************
reminderfox.about= function() {
//--------------------------------------------------------------------------
	document.getElementById('rmFx_Version').setAttribute( "value",
		reminderfox.consts.MIGRATED_PREF_VERSION);

	if (reminderfox.consts.SPECIAL_VERSION_DETAIL && (reminderfox.consts.SPECIAL_VERSION_DETAIL != 'release')) {
		document.getElementById('versionDetailLink').setAttribute( "hidden", false);

		document.getElementById('versionDetail').setAttribute( "value",
			reminderfox.consts.SPECIAL_VERSION_DETAIL);
	}


	var msg = reminderfox.aboutXPI(); //		+ "\n  " + navigator.userAgent + " (" + navigator.language + ")";
	reminderfox.util.copytoClipboard(msg);

	if (document.getElementById('logoText')) 
		document.getElementById('logoText').setAttribute( "tooltiptext", msg);

	document.getElementById('supportPage').setAttribute('value', reminderfox.consts.SUPPORT);
	sizeToContent();
};


function rmFxTDate(i) {
   if (i == null) return new Date().toLocaleString()
	return new Date(+i).toLocaleString()
}


/**
 * Query a remote system (Dropbox) to get a file with version details
 * If available, calls dialog for updating
 * 
 * Typical File content:
 *   Reminderfox  [2.0.2] CalDAV
 *     as of:    Di, 15 Jan 2013 19:11:36 +0100 (MEZ)
 *     'reminderfox2.0.2.CalDAV_20130115_1911.xpi'   <'20130115_1911'>
 */
reminderfox.versionCompare = {
//--------------------------------------------------------------------------
	get : function () {

		if ((!reminderfox.consts.DROPBOX) || (reminderfox.consts.DROPBOX === "")) return;

			this.method       = 'GET';
			this.urlstr       = reminderfox.consts.DROPBOX + "version.log";

			this.body      = '';
			this.contentType  = 'text/xml';
			this.headers      = null;

			this.username     = "";
			this.password     = "";

			this.timeout      = 30;

			this.callback     = 'onResult';
			this.onError      = 'onResult';

		reminderfox.HTTP.request(this);
	},

	onResult : function (status, xml, text, headers, statusText) {
		if (status === 0 || (status >= 200 && status < 300)) {

			var localText = reminderfox.aboutXPI();
			var versions = {
				localText: localText,
				remoteText: text,
			};
			window.openDialog("chrome://reminderfox/content/utils/rmFxUpdateXPI.xul",
				"reminderFox-versionControl", "chrome,resizable,modal", versions);

		} else {  // ERROR Handling
			var msg = ("Local XPI version is:\n\n"
				+ reminderfox.aboutXPI());
	
			var parser = new DOMParser();
			var aText = parser.parseFromString(text, "text/html");
			atext = aText.body.textContent.replace(/\n /g,'\n').replace(/\n \n/g,'\n').replace(/n\n/g,'\n').replace(/\n\n\n/g,'\n');
	
			alert (msg + "\nDropbox system message: \n" + atext);
		}
	}
};


reminderfox.aboutXPI= function () {
//--------------------------------------------------------------------------
		var xFile = reminderfox.util.ProfD_extend('extensions');
		var profD = xFile.parent.path;

		xFile.append( "{ada4b710-8346-4b82-8199-5de2b400a6ae}");
		xFile.append( "version.log");

		var stamp = "";

		var logFile = reminderfox.util.readInFileContents(xFile.path);
		var logLines = logFile.split("\n");
		logFile = "";
		for (var a=0; a <5;a++){
			logFile += logLines[a] + "\n";
			var p = logLines[a].search("<'");
			if (p > -1) stamp = logLines[a].substring(p-2,99);
		}

	return "ReminderFox  [" + reminderfox.consts.MIGRATED_PREF_VERSION + "]   "
			+ ((reminderfox.consts.SPECIAL_VERSION_DETAIL) ? reminderfox.consts.SPECIAL_VERSION_DETAIL : "")
			+ "  " + stamp
			+ "\n  Profile directory: " + profD
			+ "\n  " + navigator.userAgent + " (" + navigator.language + ")";

};


/**
 * Get the file object for the colorMap
 * read it from ProfD/reminder/calDAVmap.css
 * if not exsist, copy a default definition from extDir
 * return {object}  calDAVmap.css
 */
if (!reminderfox.colorMap)   reminderfox.colorMap = {};
reminderfox.colorMap.cssFileGet= function(){
//-------------------------------------------------------------
	var cssfile = reminderfox.util.ProfD_extend("reminderfox");
	cssfile.append("calDAVmap.css");

	if (cssfile.exists() === false) {
		var cssOrg = reminderfox.util.ProfD_extend("extensions")
		cssOrg.append("{ada4b710-8346-4b82-8199-5de2b400a6ae}");
		cssOrg.append("defaults");
		cssOrg.append("preferences");
		cssOrg.append("calDAVmap.css");
		var cssfileParent = cssfile.parent;
		cssOrg.copyTo(cssfileParent, "calDAVmap.css");
	}
	return cssfile;
};


/**
 * Read the calDAV account color map 
 */
reminderfox.colorMap.cssFileRead= function() {
//-------------------------------------------------------------
	var cssString = reminderfox.core.readInFileContents (reminderfox.colorMap.cssFileGet());
	var colorCode;
	var pos = 0;
	var num = 0;
	reminderfox.calDAV.colorMap = [];
	var saturation = reminderfox.core.getPreferenceValue(reminderfox.consts.CALDAV_SATURATION, reminderfox.consts.CALDAV_SATURATION_DEFAULT);
	if (saturation < 5) saturation = 5;
	var msg = "sat:" + saturation;

	while (num != 999) {
		pos = cssString.indexOf('caldav', pos + 6);
		if (pos == -1) break;
		num = +cssString.charAt(pos + 6);

		//treechildren::-moz-tree-row(caldav0) {background-color:#F9AFFA !important;} /* HSL(299,30,98) */
		var colorPos = cssString.indexOf('#',pos + 7) + 1;
		var colorCode0 = cssString.substring(colorPos, colorPos + 6);

		var HSL = reminderfox.colorUtil.getHsvByRgbCode(colorCode0);

		if (!reminderfox.calDAV.colorMap[num]) {
			reminderfox.calDAV.colorMap[num] = {};
			colorCode = reminderfox.colorUtil.getRgbCodeByHsv(HSL.hue, saturation, 98 /*B*/);
			reminderfox.calDAV.colorMap[num][0] = colorCode;
		} else {
			colorCode = reminderfox.colorUtil.getRgbCodeByHsv(HSL.hue, saturation, 40 /*B*/);
			reminderfox.calDAV.colorMap[num][1] = colorCode;
		}
		msg += '\n' + num + ':' + colorCode0 + ',' + colorCode;
	}
	// reminderfox.util.Logger('calDAV',  ".calDAVmapReadIn " + msg);

	reminderfox.colorMap.cssFileWrite();
};


reminderfox.colorMap.cssFileWrite= function () {
//-----------------------------------------------------
	var out = '/*-- tree color selectors --*/\n';

	var colorMapLength = reminderfox.calDAV.colorMap.length;

	for (var n = 0; n < colorMapLength; n++) {
		var colorCode = reminderfox.calDAV.colorMap[n][0];
		var HSL = reminderfox.colorUtil.getHsvByRgbCode(colorCode);
//treechildren::-moz-tree-row(caldav0) {background-color:#F4C8FA !important;} /* HSL(292,20,98) */
		out += 'treechildren::-moz-tree-row(caldav' + n + ') {background-color:#';
		out +=  colorCode + ' !important;}';
		out += ' /* HSL(';
		out +=       parseInt(HSL.hue, 10);
		out += ',' + parseInt(HSL.saturation*100, 10);
		out += ',' + parseInt(HSL.brightness*100, 10);
		out += ') */\n';

//treechildren::-moz-tree-row(caldav0, selected) {background-color:#635266 !important;}
		out += 'treechildren::-moz-tree-row(caldav' + n + ', selected) {background-color:#'; 
		out +=  reminderfox.calDAV.colorMap[n][1] + ' !important;}\n';
	}

// add the "spectrum" bar definition, 
//   saturation is set with prefs, brightness is fixed = 98
	out +=  '\n#rmFx-calDAV-color-selector-hue {';
	out +=  '\nwidth:256px; height: 20px;';
	out +=  '\nbackground-image: -moz-linear-gradient(left center,';
	
	out +=  '#' + hsl(0)   + ' 1%,';     //'#ff0000 1%,'
	out +=  '#' + hsl(328) + ' 8%,';     //'#ff0088 8%,'
	out +=  '#' + hsl(300) + ' 16%,';     //'#ff00ff 16%,'
	out +=  '#' + hsl(272) + ' 24%,';     //'#8800ff 24%,'
	out +=  '#' + hsl(240) + ' 32%,';     //'#0000ff 32%,'
	out +=  '#' + hsl(208) + ' 40%,';     //'#0088ff 40%,'
	out +=  '#' + hsl(180) + ' 48%,';     //'#00ffff 48%,'
	out +=  '#' + hsl(152) + ' 56%,';     //'#00ff88 56%,'
	out +=  '#' + hsl(120) + ' 64%,';     //'#00ff00 64%,'
	out +=  '#' + hsl(88)  + ' 72%,';     //'#88ff00 72%,'
	out +=  '#' + hsl(60)  + ' 80%,';     //'#ffff00 80%,'
	out +=  '#' + hsl(32)  + ' 88%,';     //'#ff8800 88%,'
	out +=  '#' + hsl(0)   + ' 99%';     //'#ff0000 99%'
	out +=  ');\n}\n';

// add some links for CSS supporting 
	out +=  '\n/* http://indeziner.com/design/css/how-to-create-a-color-spectrum-with-css3-gradients/ */';
	out +=  '\n/* http://www.colorpicker.com */';
	out +=  '\ncolorpicker {color: #626262;}';

	var cssFile = reminderfox.colorMap.cssFileGet();
	reminderfox.util.makeFile8(out, cssFile.path)

		function hsl(colorHue) {
			var saturation = reminderfox.core.getPreferenceValue(reminderfox.consts.CALDAV_SATURATION, 40);
			return reminderfox.colorUtil.getRgbCodeByHsv(colorHue, saturation, 98 /*B*/);
		}
};

/*
* load calDAVcolorMap and set the CSS file to respect prefs saturation  --------
*/
reminderfox.colorMap.setup= function () {
//-----------------------------------------------------
	reminderfox.colorMap.cssFileRead();

	var cssfile = reminderfox.colorMap.cssFileGet();
	var sss = Components.classes["@mozilla.org/content/style-sheet-service;1"]
						.getService(Components.interfaces.nsIStyleSheetService);
	var ios = Components.classes["@mozilla.org/network/io-service;1"].getService(Components.interfaces.nsIIOService);

	var uri = ios.newURI("file:" + cssfile.path, null, null);
	try {
		sss.loadAndRegisterSheet(uri, sss.USER_SHEET);
	} catch (ex) {
		Components.utils.reportError(ex);
	}
};


/**
 *  Check reminderfox.calDAV.accounts. If accounts found, just return, if not read
 *  from file stored parallel to the current 'reminderfox.ics' with extension .ics.dav
 *  @param {string}  ics fileName
 */
reminderfox.calDAV.getAccounts = function () {
//-----------------------------------------------------
	var calDAVfile;
	var icsFile = reminderfox.core.getReminderStoreFile().path;

	var msg = "  ....  calDAV.getAccounts  "

	// no calDAV accounts? Or a file is given? --> read file
	if ((reminderfox.calDAV.accounts != null) && (Object.keys(reminderfox.calDAV.accounts ).length === 0)){

//reminderfox.util.Logger('calDAV', " .calDAV.getAccounts   dir/file check: " + icsFile)

		calDAVfile = reminderfox.calDAV.accountsFile(icsFile);
		try {
			reminderfox.calDAV.accounts = JSON.parse(reminderfox.core.readInFileContents (calDAVfile));
			msg += "   read from file: " + calDAVfile.path
		} catch(ex) {
			reminderfox.calDAV.accounts = {};
			msg += "   new array!"
		}

		var calDAVstatus = reminderfox.calDAV.accountsStatus()
		msg += "  .... on windowtype  >>" + document.documentElement.getAttribute('windowtype') 
			+ "\n  count#:" + calDAVstatus.count + "  active#: " + calDAVstatus.active 
			+ "  .pendingReminders: " + calDAVstatus.pendingReminders
			+ "\n  snap: " + calDAVstatus.snap
		reminderfox.util.Logger('calDAVaccount', msg)

	} else {
		// "   already loaded!"
	}

	return reminderfox.calDAV.accounts
}


reminderfox.calDAV.accountsStatus = function (calDAVaccounts) {
//-----------------------------------------------------
	if (calDAVaccounts == null) {
		calDAVaccounts = reminderfox.calDAV.accounts
	} 
	var calDAVstatus = [];

	calDAVstatus.count = 0;
	calDAVstatus.active = 0;
	calDAVstatus.snap=""
	for (var account in calDAVaccounts) {
		if (calDAVaccounts[account].Active === true) calDAVstatus.active++;
		calDAVstatus.snap += "["+calDAVaccounts[account].ID + "] CTag:" + calDAVaccounts[account].CTag + ";  "

		calDAVstatus.count++;
	}

	var sCalDAVaccounts = JSON.stringify (calDAVaccounts);

	calDAVstatus.pendingReminders = false
	if ((sCalDAVaccounts.search('"status":"0"') != -1) 			//Add
		|| (sCalDAVaccounts.search('"status":"-1"') != -1)		//Delete
		|| (sCalDAVaccounts.search('"status":"-2"') != -1)){	//Edit/Update
		calDAVstatus.pendingReminders = true;
	}

	return calDAVstatus;
};


/**
 *  Write the reminderfox.calDAV.accounts to 'reminderfox.ics.dav' 
 *  in same dir as 'reminderfox.ics'
 *  @param {object} the CalDAVaccounts definition objects
 */
reminderfox.calDAV.accountsWrite= function (calDAVaccounts) {
//-------------------------------------------------------------
	var msg = "  ....  calDAV.accountsWrite   .. "
	reminderfox.calDAV.accountsStatus (msg, calDAVaccounts) 

	if (!calDAVaccounts) calDAVaccounts = {};

	var xulWin =
			"window:reminderFoxEdit,window:reminderFoxOptions"
		+ ",window:reminderFoxAlarmDialog,window:reminderFoxReminderOptionsDialog"
		+ ",window:rmFxCaldavUpdate,navigator:browser"
		+ ",mail:3pane,mail:messageWindow"
		//+ ",calendarMainWindow"
	var xWin = xulWin.split(",")

    var windowManager = Components.classes["@mozilla.org/appshell/window-mediator;1"].getService();
    var windowManagerInterface = windowManager.QueryInterface(Components.interfaces.nsIWindowMediator);

	msg = " ....  enum xulWindows"

	for (var aWin in xWin) {
		var windowEnumerator = windowManagerInterface.getEnumerator(xWin[aWin]);
		while (windowEnumerator.hasMoreElements()) {

			msg += "   >> " + xWin[aWin] 
			var currentWindow = windowEnumerator.getNext();
			currentWindow.reminderfox.calDAV.accounts = calDAVaccounts
		}
	}

	var calDAVaccountsNo = 0;
	for (var account in calDAVaccounts) {
		calDAVaccountsNo++;
	}

	var outputStr = JSON.stringify (calDAVaccounts);
	var file = reminderfox.calDAV.accountsFile();

	var mssg = " .... WriteOut calDAVaccounts to file: " + file.path + "\n" + msg;
	reminderfox.util.Logger('calDAVaccount',  mssg);

	reminderfox.util.makeFile8(outputStr, file.path)
	return calDAVaccountsNo;
};


/**
 * Build file for CalDAV accounts in same location as 'reminderfox.ics' with
 * extension .dav
 * accounts file for 'reminderfox.ics' will be 'reminderfox.ics.dav'
 */
reminderfox.calDAV.accountsFile= function (currentFilePath) {
//-------------------------------------------------------------
	if (!currentFilePath) {
		currentFilePath = reminderfox.core.getReminderStoreFile().path;
	}
	var file = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsIFile);
	file.initWithPath(currentFilePath + ".dav");
	return file;
};


/**
 *  Clear all reminder details from all accounts in "reminderfox.calDAV.accounts"
 *  @param  {object} calDAVaccouts objects with all accouts and it's definitios and reminder relations
 */
reminderfox.calDAV.accountsClearReminderDetails= function (calDAVaccounts) {
//-------------------------------------------------------------
	// make a new accounts list
	var newAccounts = {};
	for (var account in calDAVaccounts) {

		newAccounts[account] = {};
		for (var name in calDAVaccounts[account]) {
			switch (name) {
				case 'ID'     : newAccounts[account][name] = calDAVaccounts[account][name]; break;
				case 'Typ'    : newAccounts[account][name] = calDAVaccounts[account][name]; break;
				case 'Active' : newAccounts[account][name] = calDAVaccounts[account][name]; break;
				case 'Name'   : newAccounts[account][name] = calDAVaccounts[account][name]; break;
				case 'Url'    : newAccounts[account][name] = calDAVaccounts[account][name]; break;
				case 'Login'  : newAccounts[account][name] = calDAVaccounts[account][name]; break;
				case 'Ctag'   : newAccounts[account][name] = calDAVaccounts[account][name]; break;
				case 'Color'  : newAccounts[account][name] = calDAVaccounts[account][name]; break;
			}
		}
	}
	return newAccounts;
};


/**
 * This color util is based on colorpicker.com JS routines 
 */
reminderfox.colorUtil = {
//--------------------------------------------------------------------
		getRgbCodeByRgbColors : function(red, green, blue) {
			red = parseInt(red, 10).toString(16);
			green =  parseInt(green, 10).toString(16);
			blue =  parseInt(blue, 10).toString(16);
			red = red + "";
			green = green + "";
			blue = blue + "";
			while(red.length < 2) {
				red = "0" + red;
			}
			while(green.length < 2) {
				green = "0" + green;
			}
			while(blue.length < 2) {
				blue = "0" + "" + blue;
			}
			var rgbColor = red + "" + green + "" + blue;
			return rgbColor.toUpperCase();
		},

		getRgbColorsByHsv : function(hue, saturation, valueBrightness) {
			var Hi = Math.floor(hue / 60);
			var red; var green; var blue;
			if(hue == 360)
				hue = 0;
			var f = hue / 60 - Hi;
			if(saturation > 1)
				saturation /= 100;
			if(valueBrightness > 1)
				valueBrightness /= 100;
			var p = (valueBrightness * (1 - saturation));
			var q = (valueBrightness * (1 - (f * saturation)));
			var t = (valueBrightness * (1 - ((1 - f) * saturation)));
			switch(Hi) {
				case 0:
					red = valueBrightness;
					green = t;
					blue = p;
					break;
				case 1:
					red = q;
					green = valueBrightness;
					blue = p;
					break;
				case 2:
					red = p;
					green = valueBrightness;
					blue = t;
					break;
				case 3:
					red = p;
					green = q;
					blue = valueBrightness;
					break;
				case 4:
					red = t;
					green = p;
					blue = valueBrightness;
					break;
				default:
					red = valueBrightness;
					green = p;
					blue = q;
					break;
			}
			if(saturation === 0) {
				red = valueBrightness;
				green = valueBrightness;
				blue = valueBrightness;
			}
			red *= 255;
			green *= 255;
			blue *= 255;
			red = Math.round(red);
			green = Math.round(green);
			blue = Math.round(blue);
			return {
				red : red,
				green : green,
				blue : blue
			};
		},

		getRgbCodeByHsv : function(hue, saturation, valueBrightness) {
			while(hue >= 360)
			hue -= 360;
			var colors = this.getRgbColorsByHsv(hue, saturation, valueBrightness);
			return this.getRgbCodeByRgbColors(colors.red, colors.green, colors.blue);
		},

		getHsvByRgbCode : function(rgbColor) {
			rgbColor = rgbColor.replace('#', '');
			var red = this.baseConverter(rgbColor.substr(0, 2), 16, 10);
			var green = this.baseConverter(rgbColor.substr(2, 2), 16, 10);
			var blue = this.baseConverter(rgbColor.substr(4, 2), 16, 10);
			if(red === 0 && green === 0 && blue === 0) {
				var returnArray = {};
				returnArray.hue = 0;
				returnArray.saturation = 0;
				returnArray.brightness = 0;
				return returnArray;
			}
			red = red / 255;
			green = green / 255;
			blue = blue / 255;
			var maxValue = Math.max(red, green, blue);
			var minValue = Math.min(red, green, blue);
			var hue = 0;
			var saturation = 0;
			if(maxValue == minValue) {
				hue = 0;
			} else {
				if(red == maxValue) {
					hue = (green - blue) / (maxValue - minValue) / 1;
				} else if(green == maxValue) {
					hue = 2 + (blue - red) / 1 / (maxValue - minValue) / 1;
				} else if(blue == maxValue) {
					hue = 4 + (red - green) / (maxValue - minValue) / 1;
				}
				saturation = (maxValue - minValue) / maxValue;
			}
			hue = hue * 60;
			var valueBrightness = maxValue;
			if(hue < 0)
				hue += 360;
			var returnArray = {};
			returnArray.hue = hue;
			returnArray.saturation = saturation;
			returnArray.brightness = valueBrightness;
			return returnArray;
		},

		baseConverter : function(numberToConvert, oldBase, newBase) {
			if(newBase == 10) {
				return parseInt(numberToConvert, 16);
			}
			if(newBase == 16) {
				return parseInt(numberToConvert, 10).toString(16);
			}
			numberToConvert = numberToConvert + "";
			numberToConvert = numberToConvert.toUpperCase();
			var listOfCharacters = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
			var dec = 0;
			for(var i = 0; i <= numberToConvert.length; i++) {
				dec += (listOfCharacters.indexOf(numberToConvert.charAt(i))) * (Math.pow(oldBase, (numberToConvert.length - i - 1)));
			}
			numberToConvert = "";
			var magnitude = Math.floor((Math.log(dec)) / (Math.log(newBase)));
			for(var i = magnitude; i >= 0; i--) {
				var amount = Math.floor(dec / Math.pow(newBase, i));
				numberToConvert = numberToConvert + listOfCharacters.charAt(amount);
				dec -= amount * (Math.pow(newBase, i));
			}
			if(numberToConvert.length === 0)
				numberToConvertToConvert = 0;
			if(!numberToConvert)
				numberToConvert = 0;
			return numberToConvert;
		},
	};




function reminderfox_isReminderTabSelected(){
	var isReminder = false;
	if (reminderfox.tabInfo.tabIndex === 0) {
		isReminder = true;
	}
	else {
		if (reminderfox_isSubscribedCalendarTabSelected()) {
			isReminder = true;
		}
	}
	return isReminder;
}


reminderfox.util.layoutStatus= function () {
//-----------------------------------------
	var status = -1;
	var mainDialog  = reminderfox.util.getWindow("window:reminderFoxEdit");
	if (mainDialog) {
		mainDialog.focus();
		status = +mainDialog.reminderfox.calendar.layout.status;
	}
	return status;
};


/*
 * Open a panel with a picture with hovering over a image/thumb picture.
 * The image DOM definition 'tooltipText' and 'src' are used for title and real picture name.
 * 'src' for the thumb picture has '.thumb.' in the name, for the real picture name that is stripped off. 
 * example:
 *   <image class="rmFx_pic" id="rmFx_pic0" tooltiptext="Google Authorisation Request -- Requires [Accept]"
 *    src='https://dl.dropboxusercontent.com/u/35444930/rmFXxpiPictures/gCal_AuthPermission.thumb.png'
 *    onmouseover="reminderfox.util.picturePanel(this)" />
 *
 * @param  'anchor'  dom element
 *  */
reminderfox.util.picturePanel = function showPicture(anchor) {
//-----------------------------------------
	var srcName = anchor.src.replace(".thumb.",".");
	document.getElementById("rmFx_picture_src").src = srcName;
	document.getElementById("rmFx_picture_label").value = anchor.tooltipText;

	var picPanel = document.getElementById("rmFx_pic_panel");
	picPanel.hidePopup();
	picPanel.removeAttribute('hidden');
	picPanel.openPopup(anchor, 'end_before', -1, -1);
};


/**
 * //XXX   reminderfox_isSubscribedCalendarTabSelected() this is called repeatively 
 * //XXX       -- with each reminder on the whole list!
 * //XXX   and always reading the prefs! 
 * //XXX   How to just check reminderfox.tabInfo.XX ??  If there is a ID for subscription
 * 
 * Check if the current tab is a Subscription List
 * @return {boolean} 
 */
function reminderfox_isSubscribedCalendarTabSelected(){
	var subscribedCalendarTabSelected = false;

	try {
		var subscriptions = reminderfox.core.getSubscriptions();
		var url = subscriptions[reminderfox.tabInfo.tabName];
		if (url  && url.length > 0) {
			subscribedCalendarTabSelected = true;
		}
	} catch (ex) {}
	return subscribedCalendarTabSelected;
}


		/**
		 * Reorder the 'Sync' Option tabs for Remote / CalDAV,
		 * if CalDAV accounts are defined, set the CalDAV tab as first.
		 */
		function rmFx_calDAV_syncTABreorder(calDAVaccounts, networkSync) {
		//-------------------------------------------
	//	reminderfox.util.Logger('Alert', "  _syncTABreorder  calDAVaccounts.active, networkSync : "
	//		+ calDAVaccounts.active +"|" + networkSync) 

			if (calDAVaccounts.active) {
				reorder(1,2,0);		// changing the tab order: CalDAV, Remote, About
			} else  if (networkSync){
				reorder(2,1,0);		// changing the tab order: Remote, CalDAV, About
			} else {
				reorder(0,1,2);		// changing the tab order: About, CalDAV, Remote
			}

			function reorder (sOrder1, sOrder2, sOrder3) {
				var sLabel = [reminderfox.string("rf.caldav.sync.about"), 
								reminderfox.string("rf.caldav.calendars"),
								document.getElementById("rServer").getAttribute("value1")];
	
				var sLink  = ['infoPanel', 'calDAV_calendars', 'reminderFoxVbox4'];
	
				var panel1 = document.getElementById("panel1");
				var panel2 = document.getElementById("panel2");
				var panel3 = document.getElementById("panel3");
	
				panel1.setAttribute('label', sLabel[sOrder1]);
				panel1.setAttribute('linkedpanel', sLink[sOrder1]);
	
				panel2.setAttribute('label', sLabel[sOrder2]);
				panel2.setAttribute('linkedpanel', sLink[sOrder2]);
	
				panel3.setAttribute('label', sLabel[sOrder3]);
				panel3.setAttribute('linkedpanel', sLink[sOrder3]);
	
				var tabbox = document.getElementById('content-tabs');
				tabbox.selectedIndex = tabbox.selectedIndex;
			}
		}


/**
 * Query a remote system (Mozilla)  to check on/offline
 */
reminderfox.online = {
//--------------------------------------------------------------------------
	status : function () {

			var foxy = document.getElementById("rmFx-foxy-icon-small");
			var msg = "  System status"

			if (navigator.onLine) {
				if (foxy != null) 
					foxy.setAttribute('mode', 'online');

				msg += " +++ ONLINE +++"
				reminderfox.util.Logger('calDAV',msg)

				rmFx_CalDAV_updatePending();

			} else {
				if (foxy != null) 
					foxy.setAttribute('mode', 'offline');

				msg += " --- OFFINE ---"
				reminderfox.util.Logger('calDAV',msg)
				reminderfox.core.statusSet(msg, true)

			}
	}

};

// ========= was in /network/passwordManagerUtils.js ================= begin === 
/* ---------------------
if(!reminderfox)              var reminderfox = {};
if(!reminderfox.network)          reminderfox.network = {};
if(!reminderfox.network.password) reminderfox.network.password = {};

var REMINDERFOX_PASSWORD_CID = "@mozilla.org/passwordmanager;1";

var gReminderFox_PasswordManager;
var gReminderFox_PasswordManagerInternal;

function reminderFox_getPasswordManager() {
	if(!gReminderFox_PasswordManager) {
		try {
			gReminderFox_PasswordManager = Components.classes[REMINDERFOX_PASSWORD_CID].getService();
			gReminderFox_PasswordManager = gReminderFox_PasswordManager.QueryInterface(Components.interfaces.nsIPasswordManager);
		} catch (e) {
			reminderfox.core.logMessageLevel("reminderFox_getPasswordManager() failed: " + e.name + " -- " + e.message, reminderfox.consts.LOG_LEVEL_INFO);

		}
	}
	return gReminderFox_PasswordManager;
}

function reminderFox_getPasswordManagerInternal() {
	try {
		gReminderFox_PasswordManagerInternal = Components.classes[REMINDERFOX_PASSWORD_CID].getService();
		gReminderFox_PasswordManagerInternal = gReminderFox_PasswordManagerInternal.QueryInterface(Components.interfaces.nsIPasswordManagerInternal);
	} catch (e) {
		reminderfox.core.logMessageLevel("reminderFox_getPasswordManagerInternal() failed: " + e.name + " -- " + e.message, reminderfox.consts.LOG_LEVEL_INFO);
	}

	return gReminderFox_PasswordManagerInternal;
}

function reminderFox_getPassword(loginData) {
	if(!loginData) {
		return null;
	}

	if("@mozilla.org/passwordmanager;1" in Components.classes) {
		var pmInternal = reminderFox_getPasswordManagerInternal();
		if(!pmInternal) {
			return null;
		}

		var host = {
			value : ''
		};
		var user = {
			value : ''
		};
		var password = {
			value : ''
		};

		try {
			pmInternal.findPasswordEntry(loginData.ljURL, '', '', host, user, password);
			loginData.username = user.value;
			loginData.password = password.value;
			return loginData;
		} catch(e) {
			reminderfox.core.logMessageLevel("findPasswordEntry() failed: " + e.name + " -- " + e.message, reminderfox.consts.LOG_LEVEL_INFO);
		}


	} else if("@mozilla.org/login-manager;1" in Components.classes) {
		// Login Manager exists so this is Firefox 3
		// Login Manager code
		try {
			// Get Login Manager
			var myLoginManager = Components.classes["@mozilla.org/login-manager;1"].getService(Components.interfaces.nsILoginManager);

			// Find users for the given parameters
			// var logins = myLoginManager.findLogins({}, hostname, formSubmitURL, httprealm);

			// Find users for the given parameters
			if (loginData.httpRealm != null) {
				var logins = myLoginManager.findLogins({}, loginData.ljURL, null, loginData.httpRealm);
			} else {
				var logins = myLoginManager.findLogins({}, loginData.ljURL, "User login", null);
			}

			// Find user from returned array of nsILoginInfo objects
			for(var i = 0; i < logins.length; i++) {
				if(logins[i].username == loginData.username) {
					loginData.password = logins[i].password;
					return loginData;
				}
			}
		} catch(ex) {
			// This will only happen if there is no nsILoginManager component class
		}

	}
	return null;
}

function reminderFox_savePassword(loginData) {
	if(!loginData || !loginData.ljURL || !loginData.username)
		return false;

	if("@mozilla.org/passwordmanager;1" in Components.classes) {
		// Password Manager exists so this is not Firefox 3 (could be Firefox 2, Netscape, SeaMonkey, etc).
		// Password Manager code
		var pm = reminderFox_getPasswordManager();

		if(!pm)
			return false;

		try {
			pm.removeUser(loginData.ljURL, loginData.username);
		} catch(e) {
			reminderfox.core.logMessageLevel("removeUser() failed: " + e.name + " -- " + e.message, reminderfox.consts.LOG_LEVEL_INFO);
		}

		if(loginData.savePassword) {
			try {
				pm.addUser(loginData.ljURL, loginData.username, loginData.password);
			} catch(e) {
				reminderfox.core.logMessageLevel("addUser failed: " + e.name + " -- " + e.message, reminderfox.consts.LOG_LEVEL_INFO);
			}
			return true;
		}
	} else if("@mozilla.org/login-manager;1" in Components.classes) {
		// Login Manager exists so this is Firefox 3
		// Login Manager code

		// Get Login Manager
		var myLoginManager = Components.classes["@mozilla.org/login-manager;1"].getService(Components.interfaces.nsILoginManager);

		var nsLoginInfo = new Components.Constructor("@mozilla.org/login-manager/loginInfo;1", Components.interfaces.nsILoginInfo, "init");

		// remove existing user
		// Find users for this extension
		var logins = myLoginManager.findLogins({}, loginData.ljURL, "User login", null);
		// Find user from returned array of nsILoginInfo objects
		for(var i = 0; i < logins.length; i++) {
			if(logins[i].username == loginData.username) {
				myLoginManager.removeLogin(logins[i]);
				break;
			}
		}
		if(loginData.savePassword) {
			if(loginData.password != null && loginData.password.length > 0) {// check: can't save null/empty password
				var login_info = new nsLoginInfo(loginData.ljURL, "User login", null, loginData.username, loginData.password, "", "");
				myLoginManager.addLogin(login_info);
			}
		}
	}

	return false;
}

function reminderFox_deleteAccount(loginData) {
	if(!loginData || !loginData.ljURL || !loginData.username)
		return false;

	try {
		// Get Login Manager
		var passwordManager = Components.classes["@mozilla.org/login-manager;1"].
				getService(Components.interfaces.nsILoginManager);

		// Find users for this extension
		var logins = passwordManager.findLogins({}, loginData.ljURL,  "User login" / *formSubmitURL* /, null / *httprealm* /);

		for (var i = 0; i < logins.length; i++) {
			if (logins[i].username == loginData.username) {
				passwordManager.removeLogin(logins[i]);
				break;
			}
		}
	}
	catch(ex) {
		// This will only happen if there is no nsILoginManager component class
	}
};
// ========= was in /network/passwordManagerUtils.js =================== end === 
------------------------*/


//go4news   functions to support a "Reminderfox News"  on the Main Dialog -----
if (!reminderfox.go4news)    reminderfox.go4news = {};

// in /defaults/preferences/reminderfox.js
//pref("extensions.reminderFox.news", true);   // last news status, set after reading to false
//pref("extensions.reminderFox.newsStamp", <2015-10-01);   // last news date
//pref("extensions.reminderFox.newsLink", "https://dl.dropbox.com/u/35444930/rmFX/XPI/");

// in reminderFoxCore.js
//reminderfox.consts.NEWS
//reminderfox.consts.NEWSSTAMP
//reminderfox.consts.NEWSLINK


reminderfox.go4news = {
//------------------------------------------------------------------------------
	currentNews : "--",


	setButton : function () {
		var newsStatus = reminderfox.core.getPreferenceValue(reminderfox.consts.NEWS, false)
		if (newsStatus == true) {
			document.getElementById('reminderfox-News-box').removeAttribute("hidden");
		}
	},


	status : function () {  // this run *only* at FX/TB startup !
		this.get('go4_news', 'status2')
	},

	status2 : function () {

		var nLines = this.currentNews
		var n1 = nLines.search('<')
		var n2 = nLines.search('>') +1
		var newsStampRemote = nLines.substring(n1,n2)

		var newsStatus = reminderfox.core.getPreferenceValue(reminderfox.consts.NEWS, false)
		var newsStamp = reminderfox.core.getPreferenceValue(reminderfox.consts.NEWSSTAMP, "")
		var newsLink = reminderfox.core.getPreferenceValue(reminderfox.consts.NEWSLINK, "")

		//reminderfox.util.Logger('ALERT'," Reminderfox News    #1 stamps ::" +n1 + " " + n2
		//		+ " \n" + newsStatus + "  >"  + newsLink + "<  " 
		//		+ newsStampRemote + "::" + newsStamp + " "  + (newsStampRemote > newsStamp))

		if ((newsLink != "") && (newsStampRemote >= newsStamp)){ 
			// there is NEWS available, update items to let button shown with MainDialog

			reminderfox.core.setPreferenceValue(reminderfox.consts.NEWSSTAMP, newsStampRemote)
			reminderfox.core.setPreferenceValue(reminderfox.consts.NEWS, true)
		}

		else {
			// no NEWS, disable the button/icon on RmFX Main List
			reminderfox.core.getPreferenceValue(reminderfox.consts.NEWS, false)
		}

		return
	},


	get : function (callback, callnext) {

			this.method       = 'GET';
			this.urlstr       = reminderfox.core.getPreferenceValue(reminderfox.consts.NEWSLINK, "")

			this.body         = '';
			this.contentType  = 'text/xml';
			this.headers      = null;

			this.username     = "";
			this.password     = "";

			this.timeout      = 30;

			this.callback     = callback;
			this.onError      = callback;
			this.callnext     = callnext

		reminderfox.HTTP.request(this);
	},

	go4_news : function (status, xml, text, headers, statusText, call) {

		var parser = new DOMParser();

		var aText = parser.parseFromString(text, "text/html");
		atext = aText.body.textContent.replace(/\n /g,'\n').replace(/\n \n/g,'\n').replace(/n\n/g,'\n').replace(/\n\n\n/g,'\n');

		if (status === 0 || (status >= 200 && status < 300)) {

			this.currentNews = atext;

			if (call.callnext != null) {
				call[call.callnext]()
				return
			}

			reminderfox.util.PromptAlert (atext);

		} else {  // ERROR Handling

			reminderfox.util.PromptAlert ("\n Reminderfox News missing!" + atext);
		}

		// set for 'News has been read' and hide button
		reminderfox.core.setPreferenceValue(reminderfox.consts.NEWS, false)
		document.getElementById('newsButton').setAttribute( "hidden", true);
	}
};