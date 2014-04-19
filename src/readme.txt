ReminderFox:

ReminderFox is an extension for Firefox and Thunderbird that displays and manages lists of date-based 
reminders and ToDo's.  ReminderFox does not seek to be a full-fledged calendar system. In fact, the target
audience is anybody that simply wants to remember important dates (birthdays, anniversaries, etc) without
having to run an entire calendar application.

ReminderFox changelog

1.9.9.6
------------------------------------
New Layout
Flexible Printing

------------------------------------
1.9.9.5.1:
Bug fix:
 - Fixed: if the Foxy icon had been hidden, the ribbon icon was not showing and the tooltip had no entries

1.9.9.5:

Improvements:
- When suspending alerts or alarms, you now have the option to have the alerts/alarms automatically resume after a specified period of time
- Mac: alert sliders now work on Mac
- Updated version compatibility for SeaMonkey and PostBox
- Fixed: menu icon was showing for all submenu items in Firefox ReminderFox tools menu (Mac)
- House Keeping: refactored all global UI identifiers;  help avoids namespace pollution and potential conflicts with other Add-ons


1.9.9.4.5:
Improvements:
- Mac: alert sliders now work on Mac
- Updated version compatibility for SeaMonkey and PostBox
- Fixed: menu icon was showing for all submenu items in Firefox ReminderFox tools menu (Mac)
- House Keeping: refactored all global UI identifiers; should help avoid namespace pollution and potential conflicts with other Add-ons


1.9.9.4.3:
Bug Fix: 
- Fixed issues with Thunderbird where Adding Reminder to an email was not working.  (Thanks to Guenter Wahl)
- Fixed issue where welcome page was continuously displaying after update for some users

1.9.9.4.2:
Bug Fix: 
- Fixed problem where it was not possible to Add New Categories
- Fixed issue where exporting reminders to a file would allow you to select a directory instead of a file


1.9.9.4:
Improvements:
- Many refactorings to improve startup performance and best practices.  HUGE thanks to Guenter Wahl!
- The quick alarm toolbar icon now has a context menu to allow you to remove any quick alarm. 
- Pressing quick search hot key (default: CTRL-Q) will now show the Quick Search bar if it is not shown.  This can be done even if the sidebar is not shown.	

Bug fix:
FF4: show Foxy window icon again 
Fixed: Delete key now deletes ToDo on Mac


1.9.9.3.1:
Fix to ensure addonsbar is showing for FF4 for existing ReminderFox users

1.9.9.3
Bug fix:
- Fix for version 1.9.9.2 issue where alarms were not showing in some cases
- Fix for version 1.9.9.2 issue where ToDos were not respecting View filtering
- Fix for long-standing issue where after acknowledging an alarm it would re-appear 15-20 minutes later (Finally!  Thanks to Dennis and Bernie for helping debug this one)
- Fixed: if snoozed an an alarm for more than 24 days, the alarm would re-pop up immediately
- Better alarm handling; now only set alarms when necessary, instead of setting them all in advance
- Can now Drag & Drop calendar files onto the Foxy toolbar icon in order to import them (just like on the status icon)


<b> Version 1.9.9.2 <ul></ul>
Bug Fixes</b>
<ul>
<li>Fix for version 1.9.9.2 issue where alarms were not showing in some cases
<li>Fix for long-standing issue where after acknowledging an alarm it would re-appear 15-20 minutes later (Finally!  Thanks to Dennis and Bernie for helping debug this one)
<li>Fixed: if snoozed an an alarm for more than 24 days, the alarm would re-pop up immediately
<li>Can now Drag & Drop calendar files onto the Foxy toolbar icon in order to import them (just like on the status icon)
</ul>

<li>Fixed issue some were seeing where new reminders were not being saved when Reminder list was closed
<li>Fixed: Deleting reminders from alarm popup was not working for non-repeating reminders
<li>Fixed: improved startup time
<li>Fixed selecting row in list to not scroll off at the end of the year	
<li>Fixed: filters for Reminders tab were not being respected when opening to ToDo's tab by default
<li>Fixed: Reading in calendars with specified TimeZones would not persist timezones properly
<li>Fixed: When deleting past recurring reminders, the End Date was not being updated for later instances
<li>Fixed: Quick Alarm display would not update properly if another upcoming reminder tab was open
<li>Added additional debugging mechanisms: preference extensions.reminderFox.debug.file can be set to a file (example: "c:\reminderfox_log.txt" ) to have debug output to a file for better support during defect investigation
</ul>




1.9.9.2:
Improvements:
Can now set the default filters to be the last selected Stored View in the preferences.  So if you have a custom
View that you like to use, you can have the Reminder list always open to that.
- When importing reminders/ToDos, there is a more detailed dialog detailing how many events are to be imported, and how
many succeeded. (Thanks to Guenter Wahl)
-You can now entirely remove the status bar "ribbon" icon by setting Display Placement toolbar to "none".  You might want to do this
if you prefer to have the "Foxy" toolbar icon exclusively (right-click on Firefox toolbar, click "Customize" and drag the Foxy
icon to any toolbar you wish)
-Added new: "All Reminders (All Years)" default view for new installs
-Added context menu to "Foxy" toolbar icon  (right-click on Foxy to get the same context menu as the status bar icon)

Bug fixes:
Fixed issue some were seeing where new reminders were not being saved when Reminder list was closed
Fixed: Deleting reminders from alarm popup was not working for non-repeating reminders
Fixed: improved startup time
Fixed selecting row in list to not scroll off at the end of the year	
Fixed: filters for Reminders tab were not being respected when opening to ToDo's tab by default
Fixed: Reading in calendars with specified TimeZones would not persist timezones properly
Fixed: When deleting past recurring reminders, the End Date was not being updated for later instances
Fixed: Quick Alarm display would not update properly if another upcoming reminder tab was open
Added additional debugging mechanisms: preference extensions.reminderFox.debug.file can be set to a file (example: "c:\\reminderfox_log.txt" ) to have debug output to a file for better support during defect investigation

<b> Version 1.9.9 <ul></ul>
Improvements:</b>
<ul>
<li>Introducing Foxy!  As we approach version 2.0 it felt like it was time for a bit of an icon refresh, so our  mascot Foxy is now 
featured in the UI.  Tip: Don't like Foxy?  You can hide him in the Reminder List (and status tooltip) by right-clicking and selecting Hide Foxy.
<li>UI improvements have been made to declutter the Reminder List UI a bit and make for a better first-run experience.  
<ul>
  <li>The Options and Calendar buttons have been replaced by links in the calendar sidebar
  <li>The Filters and search dropdowns are hidden by default.  They can be shown by clicking the Show Filters link in the sidebar.  This preference will be remembered across sessions.
</ul>
<li> Integrated Filter/View bar.  The separate View dropdown has been removed, and Views are now integrated into the existing Filter dropdown (the one with Selected Year, Selected Month, etc).  Select the sub-menu item 
 for 'More Views' to see existing views and add new views.   (Thanks to Guenter Wahl).
<li> User request: when select to delete a recurring reminder from an alarm, you will be prompted to delete that instance or all instances
<li> User request: added default options alarms.  You can set the initial snooze alarm value, and the initial alarm action (Acknowledge, Mark as Complete, etc)
<li>Added listener for Backspace (Delete on Mac) to remove a reminder from the list
<ul>
Bug fixes:</b>
<ul>
<li> Fixed issue where files with Timezones could get corrupted (causing the Reminder List window to open with no events)
<li> Fixed bug from 1.9.8.4 where Defaults were not being honored when Adding a Reminder from the status bar context menu
<li> Fixed: No "12:00AM" time was being shown for Spanish locale
<li>Fixed bug where calendar tooltip would show events lasting multiple days as occurring for one extra day
<li>Added some safe-checking code around alarm parsing to gracefully handle invalid alarm blocks (ReminderFox list was not displaying properly in that case)
<li>Fixes for Drag&Drop of links onto the status ribbon (thanks to Guenter Wahl)
</ul>

1.9.9.1:
Fixed locales

1.9.9:
Improvements:

- Icon refresh for Foxy.   As we approach version 2.0 it felt like it was time for a bit of a refresh.  Our new mascot Foxy is now 
shown in the UI.  Tip: Don't like Foxy?  You can hide him in the Reminder List (and status tooltip) by right-clicking and selecting Hide Foxy.
- UI improvements, to declutter the UI a bit and make for a better first-run experience.  
 - The Options and Calendar buttons have been replaced by links in the calendar sidebar
 - Filters are hidden by default.  They can be shown by clicking the Show Filters link in the sidebar.  This preference will be remembered across sessions.
 -  Integrated Filter/View bar  (Thanks to Guenter Wahl).   The View dropdown has been removed; the Views are now integrated into the existing Filter dropdown (the one with Selected Year, Selected Month, etc).  Select the sub-menu item 
 for 'More Views' to see existing views and add new views. 
- User request: when select to delete a recurring reminder from an alarm, you will be prompted to delete that instance or all instances
- User request: added default options alarms.  You can set the initial snooze alarm value, and the initial alarm action (Acknowledge, Mark as Complete, etc)
- Added listener for Backspace (Delete on Mac) to remove a reminder from the list


Bug fixes:
Fixed bug from 1.9.8.4 where Defaults were not being honored when Adding a Reminder from the status bar context menu
Fixed: No "12:00AM" time in Spanish locale
Fixed issue where files with Timezones could get corrupted (causing the Reminder List window to open with no events)
Fixed bug where calendar tooltip would show events lasting multiple days as occurring for one extra day
Added some safe-checking code around alarm parsing to gracefully handle invalid alarm blocks (ReminderFox list was not displaying properly in that case)
- D&D fixes (thanks to Guenter Wahl)

1.9.8.4:
Improvements:
- now handles timezones (can properly import calendars like the pittsburgh steelers:
http://www.southendzone.com/ics/
- now emboldens the current month in the calendar widget (just like today's date is emboldened) 
- When alarms/alerts are suspended from the status icon context menu, the status icon and status text will turn grey to indicate that alarms have been disabled
- Reminder list and alarm windows now use ReminderFox icon to better differentiate them from other Mozilla windows
- Can now add a reminder based on an ICS event copied to your clipboard (thanks to Guenter Wahl)

Bug fixes:
- Fixed issue where clicking Launch URL was opening up a separate browser window
- Updated menus for Firefox 4 compatibility
- A bunch of fixes to ensure alarms always occur when they should:
  - Fixed issue with alarms where some repeating ToDos's were not showing some alarms; if a previous instance was Completed,
  	or if a previous instance originated more than 3 months in the past
  - Fixed: if there was a previous instance of a repeating reminder in the alarm window, 
  	you would not be reminded at the time of the next instance.  Now, the old instance will be replaced with the latest occurrence of the alarm.
  - Fixed: if there was a snoozed alarm, repeating instances would sometimes not display
- Fixed: status messages in Reminder List windows would sometimes not be cleared immediately when downloading subscribed reminders 



1.9.8.4:
Improvements:
- now handles timezones (can properly import calendars like the pittsburgh steelers:
http://www.southendzone.com/ics/
- now emboldens the current month in the calendar widget (just like today's date is emboldened) 
- When alarms/alerts are suspended from the status icon context menu, the status icon and status text will turn grey to indicate that alarms have been disabled
- Reminder list and alarm windows now use ReminderFox icon to better differentiate them from other Mozilla windows
- Can now add a reminder based on an ICS event copied to your clipboard (thanks to Guenter Wahl)

Bug fixes:
- Fixed issue where clicking Launch URL was opening up a separate browser window
- Updated menus for Firefox 4 compatibility
- A bunch of fixes to ensure alarms always occur when they should:
  - Fixed issue with alarms where some repeating ToDos's were not showing some alarms; if a previous instance was Completed,
  	or if a previous instance originated more than 3 months in the past
  - Fixed: if there was a previous instance of a repeating reminder in the alarm window, 
  	you would not be reminded at the time of the next instance.  Now, the old instance will be replaced with the latest occurrence of the alarm.
  - Fixed: if there was a snoozed alarm, repeating instances would sometimes not display
- Fixed: status messages in Reminder List windows would sometimes not be cleared immediately when downloading subscribed reminders 

1.9.8.3:
Improvements: 
- User request - description text in alarm can now be copied to your clipboard
- Added 'Go To Today' button on calendar widget
- When opening reminder list, the calendar will highlight today's date (instead of the date of next upcoming reminder)
- Added support for additional web-based mail sites
- For overdue reminders that are marked Remind Daily Until Completed, the list display will now show their original
	dates in the description
- Updated for Firefox 4 beta 2

Bug Fixes:
- If the description of an alarm text or a URL is really long, the alarm window will no longer expand infinitely to contain the text.

1.9.8.2
Improvements:
- User request - removed column labels for Time label for "all day" and the Repeat label of "none", as they simply cluttered the list and made it 
more difficult to see the actual information you were interested in.

Bug Fixes:
- Fixed issue with older versions of Firefox and Thunderbird; was not able to delete existing reminders.
- Fixed: when events spanned month boundaries by more than 4 days, they were not showing up on the calendar
 for the next month

1.9.8.1:
Bug fixes:  
 - Fixed nl localization issues
 - Fixed issue where View list would not refresh in some cases


1.9.8
New Features:
 - Support for web-mail to allow viewing web-based mails from a reminder.  Now if you add a reminder while viewing a Gmail or Yahoo mail message, 
 	the reminder will be seen as a mail reminder, and will show up marked as a mail reminder in your reminder list, and when viewing
 	the reminder the mail icon will show which will let you jump to that message in Gmail/Yahoo mail.

Improvements: 
 - There is a new filter for "All Upcoming Reminders/ToDo's", which will only show upcoming events, and hide all of the previous events.
 - New quicksearch filter option for "Anywhere" which allows you to filter events where the search text occurs in 
 	any of the description, notes, category, notes, or location fields.
 - Toolbar tooltip for ReminderFox icon now shows Upcoming Reminders/Todo's - just like the status bar icon.
 - new Toolbar tooltip for QuickAlarm icon - now shows all quick alarms  
 - Made Open ReminderFox toolbar icon not look like crap
 - When displaying quick alarm list (in context menu or toolbar icon), the quick alarms will be sorted by next alarm time.
 - Added a button in the Reminder List window to bring up the Options dialog 
 - Added ReminderFox to the Tools file menu for accessibility and ease of access (Menu items: Open ReminderFox, Add Reminder,
 	Add Quick Alarm, Options..., Help)
 - Usability: For setting a Custom repeat option, changed label in drop down from "Custom..." to "Click here for more repeating
 	options".  Also, when adding new reminder and Custom repeat is selected, the default Custom Repeat recurrence is set to weekly, 
	as that is the most oft-requested repeat options ("How do I set up a weekday repeating event?") 
 - Usability: Added a "cursor pointer" in the calendar when hovering over the next and previous year/month arrows  (Thanks to G�nter Wahl)
 - When importing events from the file system or emails to the ReminderFox status bar icon via Drag & Drop, you can now
 specify a category to set for each of the imported events / todos (Thanks to G�nter Wahl)
 - Usability: the dialog for managing 'Default' categories can now be sorted (Thanks to G�nter Wahl) 
 - View improvements:  (Thanks to G�nter Wahl)
    - There are now a few Reminder Views by default to show some example views (Upcoming Birthdays). 
    - 'DATE' has a wider definition for day, week, month, year.  TimeSpan definition can go into past and future;
      Used together with 'Export'/'Delete' it can be used for backup and deletion of all past events
    - 'Category' has popup menu as with "Add/Edit Reminder/Todo"
    -  Sorting: View Editor has added up/down icons for sorting the 'view' and 'criteria'
    - Changes (edit/sort) will be saved with all actions
 - Mail improvements: (Thanks to G�nter Wahl)
   - Send++: For a better overview which messages have a association to reminders the
   Send++ now directly tags the 'send' copy stored to the 'Send' folder
   with the 'ReminderFox' tag. 
   - reminders with 'mailto:' in the URL field (like contact reminders) will fill the mailto: directly into the 'To:' 
   field of the compose window
   - Thunderbird AddressBook - when adding a reminder for a contact, the address book name is added to the Notes; the 
   	contact 'Birthday' is also added to the reminder(with <year> to subject and day&month to start date)   
   
Bug fixes:
- Fixed: When playing a custom sound for alerts/alarms, only the first few seconds would be played
- Update for all the haters out there!!  Added preference to remove the "stupid fox paw icon" in the tooltip/alert slider; set extensions.reminderFox.hideThatRidiculousFoxPaw=true
- Fixed: The default value for Show In Tooltip was not being honored.
- Fixed: When viewing quick alarms from the context menu, would sometimes show additional implementation text.
- Fixed: quick alarms would sometimes pop back up immediately when snoozed
- Added defensive code to prevent the status icon from not showing in some situations
- Fixed: Importing pure iCalandar files with only TODOs didn't work

1.9.7:
Improvements: 
 - Added a Next Month and Previous Month buttons on the calendar header, that will advance or go back one month
 - When you select a quick alarm from the status bar context menu, it will now display any associated notes as well
 - Updated ReminderFox toolbar icon - now uses the fox paw instead of duplicated ribbon icon; it was too confusing
  to tell which icon did what

Bug fixes:
- Fixed: The "Go To Today" context menu on the calendar was not repopulating the reminder list with 
	the current reminders if the calendar was showing a different year
- Fixed: calendar widget would sometimes advance an extra month when clicking "blank" days to move it forward
- Fixed: was not able to download a calendar from the Network options when not setting a user or password
- Fixed "No password" error message for upload/download.  It was instead saying an uninformative "Unexpected Error".


1.9.6: 
New Features:
 - Copy Reminders - there is now a new option in the Reminder List context menu to Copy Reminder
 	and Copy ToDo.  This will create a copy of the selected reminder and open up the Add Reminder
 	window with the pre-populated information.

Improvements: 
 - By popular demand, added back the Biweekly (fortnightly) repeat option in the Add Reminder repeat dropdown
 - Added context menu item on calendar for "Go to Today" which will reset the calendar back to Today's date.	
 - Added option to show alarms in separate tabs or separate windows (as was the behavior in earlier versions).  
  To disable separate tabs, go to the ReminderFox options Notifications tab, and in the Alarms
  section you can change the dropdown for "Show multiple alarms using" to "a separate window for each alarm" 
- You can now specify how long the alert slider will stay open.  You can also set it so the alert slider stays
	open until you click it.   The preference is in the ReminderFox options in the Notifications tab; the
	option is "Keep alert slider open".  The default is "for 5 seconds", but you can change this to any length 
	of time you wish.  If you instead select "until clicked" then once the alert slider is opened, it will stay 
	open until you click on it with your mouse.	
- Added UI preferences for:
 1) Limiting status text length to a set number of characters (in the RemindeFox options Display tab; default: 40)  
 2) Maximum alert slider height, in pixels (in the ReminderFox options Notifications tab; default: 134)

Bug fixes:
- Was focusing Firefox window when alarm went off
- alarm tab wasn't showing years properly (was showing "<1975>" )
- calendar from toolbar wasn't redrawing "Today's" date; would keep original date emboldened, even after it was no longer
  the current date
-Remind Until Complete status was not being properly saved when events were processed hourly;
- Fixed: Multiple alarm dialogs could still open even when using Tabbed window option
- Fixed: Repeating reminders will no longer show multiple alarms for different occurrences of the same reminder
- Fixed: When importing reminders and choosing to Overwrite, was not displaying a Success message.

1.9.5:
 - Tabbed alarms - alarms and quick alarms now show up in a single window as separate tabs, so they are
 	now easier to manage in a single location.
 - You can now add notes on quick alarms
 - When adding a quick alarm or snoozing an alarm, you can select the calendar icon to add a specific day/time of
 	when to show the alarm, versus just the "show X minutes/days from now" method
 - The calendar launched by the calendar toolbar button (right click on the Firefox toolbar and select Customize... 
 	to add it) has been updated - it now shows dates with reminders (in yellow), you can hover over the dates 
 	to get the reminder tooltips just like in the normal calendar, and clicking on a date allows 
 	you to quick-add a reminder for that date
 	
Improvements: 	
 - Clicking on blank square in the calendar widget will move the calendar forward or backwards to that date
 - The 'Add reminder' dialog has been reordered to be consistent with Add ToDo/Event dialog
 - Context menu for Firefox - changed the postion of Add Reminder to come after Copy (as suggested by user
 	K. Jason)
 - Updated to support Postbox email application - http://postbox-inc.com/extensions/ (Thanks to G�nter Wahl)
 - Updated for latest versions of Firefox, Thunderbird, and Seamonkey
 - 'Send reminder'/'Send todo's' now also supports 'Export' (Thanks to G�nter Wahl)
 
Bug fixes:
 - Bug 21772 - thanks to Philippe for fixing this one!
 - Bug 21565 -  Search function does not work at first time (Thanks to G�nter Wahl)
 - Added slight delay when starting Firefox before showing alert slider, as it could result in a jerky sliding
 	motion if loading a lot of tabs were open

1.9.1:
New Features:

- Views. Events selected with a 'View' setting can now be sent with an ICS data
  file/attachment (via the View dropdown menu).   Each exported event will have
  the View label added as a category item.
  
- Send ToDo's/List.  Selected ToDos'/List now can be sent with an ICS data
  file/attachment. Each exported event will have its 'List' name added.

- Open associated event (Thunderbird).  You can now open the event stored for a 
  message. It's now also possible to do this for events stored or moved to 'ToDo's/Lists'  
  [as requested by Agnes Perrot and our good friend jake ;-) ]
      
Improvements:
- Tagging (Thunderbird).    Reminderfox uses different 'tags' for messages
  eg.: 'Reminderfox' to show 'there is a Reminderfox event for this message',
  or 'iCal-REQUEST' to show 'this is an invitation request'.
  These tags now can use upper/lowercase letters.
  The ReminderFox tags don't stack at the top of the list anymore.
  The 'normal' keys are not changed anymore.  The color of each tag set by Reminderfox 
  can be set to another color with normal TB dialog.

- Icon size on toolbar buttons now scales with 'normal/small' settings for the
  'toolbar customize'

- Todo events now can be imported from message/file (was silently skipped).

- 'Open message' with events pointing to Draft/Templates will not open the
  message but only point to the folder.  Those opened messages failed to
  support the [Edit] button.
 
Bug Fixes:
- 'List' name check for "ToDo's", "Reminders" or characters ':'  ','; 
	was causing problems with other functions

- TB3.x compatibility for popup-menus

- Seamonkey compatibility with SM 1.1.14 (Should do also for SB 0.9)
 [Thanks to Boothby-Smith for reporting]

- MAC OSX bugs fixed for empty ToDo list, and alert slider. 

Thanks to G�nter Wahl for these many contributions.

1.9:

New Features:
 - Views.  You can now add Views in the Reminder List window.  To add or switch a view,
 click the Magnifying Glass List icon.  You can create views to show reminders that match 
 a set of criteria (Description contains "birthday", Categories contains "Work", date falls
 within the current week, etc).  This allows you to quickly get a specialized View on any 
 list of reminders. (Big thanks to G�nter Wahl)
 
 - Added new option to show the Week Numbers on the calendar.  You'll find this in the Options->List display.
 	You can select None, Default week numbering, or ISO 8601-style numbering.  
 
Improvements:
 - Clicking the status or toolbar icon when the Reminder list window is open will now close the window.
 	This makes it easy to quickly open the Reminder list, scan what you're looking for, and then 
 	easily close the window (as suggested by reader Travis).
 
 - New keyboard shortcuts: Ctrl-Shift-O -> Opens ReminderFox.  Ctrl-Shift-Y -> Opens Add Event window.  
 	From the Reminder List window, Ctrl-A opens either the Add Reminder/Add Todo window.  
 	Ctrl-T will advance the next tab.	(Type about:config and modify the preferences
 	extensions.reminderFox.keyboard.shortcut.openReminderFox and 
 	extensions.reminderFox.keyboard.shortcut.addEvent
 	to change the shortcut combination -- or leave it blank to have no shortcut)
 	
 - For the stylesheet used by the View/Print as HTML option, you can specify your own stylesheet or none at 
 	all using an advanced preference.  Type about:config and modify the preference 
 	extensions.reminderFox.html.stylesheet to any stylesheet of your choosing (eg: to use a local 
 	stylesheet: file://c:/stylesheets/project.css).  If you specify no value at all for this 
 	preference, then no stylesheet will be used.
 	
 - You can now add a reminder for all Thunderbird email messages currently selected 
 	(Thanks to G�nter Wahl)
 	
 - Thunderbird improvements - mail body includes more information when seding an invite; priority 
 	now added to mail message; change of Location reschedules the invitation (Thanks to G�nter Wahl)
 	
 - OS Switching support - the reminderfox ICS file is stored separately depending on OS; 
 	this allows you	to point to the same file in a duel-boot scenario
 	(Thanks to G�nter Wahl)
 
  - Updated for Firefox 3.1 compatibility (and Thunderbird 3 preliminary work)

Bug Fixes:
 - Fixed erroneous 'Custom' option in Custom repeat window.
 
 - removed white font in View As HTML style
 
 - Sending mail messages from a Schedule reminder sends it directly (it no longer opens Thunderbird 
 	Compose window).  (Thanks to G�nter Wahl)
 
1.8:
New features:
 - There is a new calendar popup button that can be added to the toolbar; this is nice for a one-click
 	calendar if you just quickly need to see a date. The calendar is closed by clicking outside of the 
 	calendar, or selecting a date.   Add this to your toolbar by right-clicking on 	a toolbar and selecting 
 	Customize...  and then dragging the icon onto the desired location.
 - There is a new ReminderFox preference to be able to have alarm popups re-sound the alarm sound every specified
 	number of minutes.  This allows you better ensure that you'll notice an alarm, or make it so an alarm will be so annoying
 	that you'll eventually have to acknowledge it  :)
 - There is now an option to Disable context menus if you do not want the Add Reminder menu items to show for web 
 	pages and emails
 - Added an End Date column in the Reminder List window.  This allows you to sort by end date.  This can be useful if 
 	using the end date 	as a "due date" for ToDos when you want to sort by most pressing issues)  You can add this 
 	column by clicking the column picker icon to the right of the column headers and selecting the desired column. 

Improvements:
 - There is a new preference (found in the List Display tab) to set the size of the calendar (small, normal, large).
 - The Add/Edit Reminder and Todo windows now display the date (using the date string 
 	in the preferences) which will show the day of the week to make it easier to quickly tell
 	which day you have set an event date for.
 - On the calendar widget, it now displays full tooltips when you hover over calendar dates  
 	(showing all available information, instead of just the description)	
 - There is a new variable for the status tooltips: [timeUntil] - this tells you the time remaining until the event 
 	occurs.  Depending on how close the event is, it will use the shortest amount of time units, eg:
 	"30 minutes",  or "4 hours"  or "1 day".  Thanks to Kunal Singh for contributing this code.
 - Added scrollbars to reminder tabs in the Reminder List window; this enables you to scroll through your tabs
 	if you get too many to show in the window
 - In the Reminders List, it now shows when next alarm is scheduled in the tooltip when you hover over the alarm icon 
 	(example: "Alarm set for Jun 1st, 4:15pm")
 - Alarm popup now also shows the time until the actual event occurs, if the alarm occurs prior to the event.  This value 
 	is updated whenever the alarm gets focus; so if you have it minimized and then open it, it will show you the correct 
 	time until the event occurs.
 - On the alarm window, moved Description to the top of the window, to better match how it is displayed in the Reminder
 	List events
 - All alarms now display the calculated date and/or time for when the specified snooze will occur
 - You can control how many characters are displayed on the status bar text that shows today's reminders.  
   The maximum number of characters to display can be configured via about:config by editing 
   	the preference: extensions.reminderFox.statusTextMaxLength.  (default: 40)
 - Reminders now handle multiple comma-separated categories  (Thanks to G�nter Wahl)
 - Resized icons on context menus to fit smaller 16x16 size; they were taking up more space than typical
 - On new installs, the calendar widget now shows by default in the Reminder List window
 - In Firefox, you can now open emails attached to reminders; this will open them in Thunderbird; if Thunderbird is closed,
 	it will be started first.   (Thanks to G�nter Wahl)
 
 Bug fixes:
  - Fixed bug 19605:  Now properly sort Reminders by time in tooltips and in the Reminder List when sorting by date
 - if you snoozed an alarm for a long time (like 28 days) it would pop up immediately
  - alarms only show Missed if the schedule event time has already occurred, instead of just if the  
  	original alarm time had passed.  (My mom started using ReminderFox - uh oh! - and she was 
  	getting scared when she saw 'Missed' on her alarms thinking that she had missed her appointments)
  - Fixed: alarms for repeating events would show wrong date (the original date of the reminder) 
 - Fixed bug 19203: Editing a todo from an alarm wasn't saving changes.
 - Calendar now properly shows events that span months
 - Fixed bug 19176: Cannot select June 1. 2008 from pop-up calendar.  
 - Thunderbird: when using the Send++ to attach a reminder when sending an Email, the reminder is 
  now properly associated with the email and vice-versa.  (non-IMAP accounts only; thanks to G�nter Wahl)


1.7.2  
Bug fixes:
 - Fixed bug 19144: Exporting reminders via the file export or network export wasn't working.

1.7.1
New features:
 - Better experience for new users.  Based on user feedback, on a brand new install of ReminderFox, 
 	there is now an initial reminder that will show in the status bar as "Welcome to ReminderFox!".  
 	This reminder will contain some welcome information and a link to the FAQ pages.  

Improvements:
 - You are now able to view all Quick Alarms that you have set.  When there are available quick alarms,
 	there will be a new menu in the status bar context menu for Quick Alarms.  This will show all the quick
 	alarms and when they are scheduled to occur.   By selecting one of the quick alarms in the menu list,
 	you are then given the option to remove the alarm.
 - Calling 'Open' from alarm now headlessly opens the reminder for viewing/editing without opening the 
 	entire Reminder List window
 - You can now view which reminders you have snoozed and the current snooze alarm time.  To do this 
 	go to the Reminders List window and make sure the alarm column is showing; an alarm that is snoozed
 	will have a red alarm icon to indicate that it is snoozed; hovering over the icon will show the time that 
 	the snoozed alarm will go off.

Bug fixes:
 - Fixed 19000, 19048:  ReminderFox was causing problems with some Thunderbird context menu items (copy, 
 	Move Again To...)
 - mozilla QA bug fixed:  https://bugzilla.mozilla.org/show_bug.cgi?id=431527 
 - Fixed: Open Associated Reminder on a Thunderbird email now properly opens the Edit reminder window 
 	(instead of the Add Event dialog)
- Fixed 19078: some events with commas were adding a slash in the calendar file:  /,
- Fixed: wasn't saving quick alarms and preferences immediately; if FF crashed/terminated, changes 
	were lost
- Fixed 18857: now properly writing out alarms  (for use with other reminder services)
- Fixed: Firefox could crash if you had your list columns sorted and then completed a reminder using
	the spacebar keyboard shortcut
- Resized the ribbon icons to be a little smaller (16px height) to better conform to the typical FireFox icon
	size (they were adding a bit more space on the toolbars than other icons)

1.7: 
New features:
 - There is a new preference in the Defaults options tab to allow you to customize the items that 
 	you want to hide behind the More>> button by default in the Add/Edit Reminder window.  This is useful
 	if there are certain properties that you are not interested in seeing by default (Categories, Repeat, etc)
 - Drag & drop support - You can now drag URLs, Firefox address bar text, links, email/web page text, 
 	emails, invitations, iCal (ICS) files, ICS links (subscribe) onto the ReminderFox statusbar to perform 
 	the associated ReminderFox action (adding reminder, importing events, etc).  Thanks to G�nter Wahl.
 - ThunderBird: There is a new context menu item "Open the associated Reminderfox event" in the message
 	pane and thread pane.  This menu item will be activated if an email has a reminder associated with it, 
 	and will allow you to go directly to the associated reminder.  This now gives a complete, round-trip story
 	for being able to go from a reminder to its associated email and back.   (Thanks to G�nter Wahl.)
 - Send++ (Thunderbird).  You can add a new Send++ button onto the Compose Mail window (choose Customize
 	on the Compose toolbar).  Clicking this will send the email and add a new reminder tied to that email.  This is 
 	useful for following up on an email thread.  The sent message and any replies to your message will cause the
 	context menu for "Open Associated ReminderFox event" to be activated and you can open up the associated 
 	reminder.  (Thanks to G�nter Wahl.)
 
Improvements:
 - Alert slider height can be configured via about:config by editing the preference:
 		extensions.reminderFox.alertSliderMaxHeight
   This sets the maximum number of pixels that the alert slider will take up; change it to a large 
   value if you want more lines to show when your alert slider shows (Enhancement Request 18008)
 - If you hover over date-related description labels in Add Reminder dialog ("Date:", "Start", "End"), a tooltip will y
 	display the day the date falls on (this helps with the "is March 11th a Thursday or a Friday??" questions when 
 	picking a date)
 - Added value of "1" for all other time-based drop-downs (as it is frequently used for setting alarms 
 	"1 day before", etc)
 - Updated to work with Firefox 3.0 Beta
 - Corrected some default loading problems when opening the Reminder List window as a web page.  
 	You can do this by entering the url of the reminder dialog into the url bar:  
 	  chrome://reminderfox/content/addreminder-dialog.xul   
  	You could bookmark this url or make it part of your starting homepage, if you wanted to view your list in a webpage.  You 
  	can also set this as your start page in Thunderbird, which gives a nice startup view (thanks to reader OIK for the tip!)
 - Message Priority is now taken into account when adding a reminder for a Thunderbird email; it uses the 
 	priorities 'very high' and 'high' to set ReminderFox item "Important"
  - Context menu items now have icons
  - Thunderbird scheduling - attendee can now receive and process event cancellations sent by the event Organizer
 
Bug fixes:
 - General performance improvements (on date compare, clone).  Thanks to G�nter Wahl
 - Performance improvements in Add Reminder dialog
 - Fixed problem - wasn't always updating reminders (showing alerts, etc) if network connection errors, especially
 	if resuming from suspend.  This would cause alarms to be delayed until ReminderFox was opened.
 - Fixed bug 18159: snoozing reminders was not working; alarms were never showing again
 - Fixed bug 18793: some repeating reminders were not showing alarms on certain days  
 - Fixed bug: adding ToDos with no dates was causing the calendar to screw up (showing NaN for the year)
 - Firefox 3: Fixed FF3-specific bugs:: dialogs had bad formatting, improper sizing, network passwords weren't 
 	being saved, download/uploading wasn't working
 - Fixed bug with French locale that was causing problems in Seamonkey
 - Tried to eliminate potential alarm timing issues (where alarms would not show up) by shortening the hourly 
 	thread to occur more frequently (30 mins) instead
  - Fixed bug: alert slider was showing each time a new window was opened, regardless of the user-specified interval
  
 	
1.6.3:
Improvements:
- Updated to work with Firefox 3.0 Beta 3
 	
1.6.2:
Bug fixes:
 - Fixed localization problems in Romanian where new reminders could not be added
 - Fixed UI elements that were broken due to changes in FF3.0 (time menu list, alert slider)
 - Fixed bug: 18364 - Pop up reminders stopped working
 - Fixed Bug 18363 - Move Todo Up/Down does not work
 - Fixed problem with tagging emails when adding a reminder (Thunderbird 1.5)
 - Updated working version for Seamonkey 2.0a1
 
1.6.1:
Bug fixes:
 - Fixed localization problems 
 - Fixed - ToDo's tooltips can have newlines in them, just like regular reminders

1.6:
New features:
 - In addition to the starting time of an event, you now can specify the end date and time as well.  The list display tooltip will
 	show both the start and end times, and the calendar display will show the entire span of the reminder's dates.
 - Events can be used for invitation/schedule following the iCalendar/iTIP definition with REQUEST, REPLY (accept/decline) and reschedule.
   So a reminder can be sent by an organizer as an invitation/schedule, and the attendee(s) are now able to Accept or Decline
   the invitation.  Doing so will update the reminder status and set up an email to be send to the attendees or back to the
   organizer with the response status. The organizer can easily track the status of all attendees.  (Thanks to G�nter Wahl) 
 - Reschedule/changing some invitation/schedule items (date/time, location, recurrence, description) by the organizer will
   now send an update to all attendees on the list. The attendees are not allowed to modified those items. (Thanks to G�nter Wahl) 
 - A date/time stamp can be easily added into the notes field, place the cursor at the required position and 
    press [F8].   [as suggested by Michael Bierman]

Improvements:
 - When selecting event times from the dropdown, there are now submenu items for other common times 
 	(eg: 9:00, 9:15, 9:30, 9:45).  Of course, you can still click on the toplevel times as before, or manually enter
 	in any specific time.
 - Added toolbar icons to launch ReminderFox and Add a reminder.  You can add these to your toolbars by right-clicking on
 	a toolbar and selecting Customize...  and then dragging the icons onto their desired location.
 - When using a year calculation in a reminder, you can use a new notation to get just the year value.  
 	eg: "My birthday was <1978#> years ago" will give you "My birthday was 29 years ago".   And "My <1978> birthday"
 	still gives you "My 29th birthday".  You can now also calculate future years in combination with the new notation:
 	"Mortgage will be paid off in <2037#> years"  --> "Mortgage will be paid off in 30 years".
 - The ReminderFox list window and the pop-up alarms are now treated like normal Windows (and not dialogs.)  
 	These windows can be minimized/maximized, and alarms now properly notify the OS when requesting focus 
 	(flash in the taskbar) so they are not as easy to be missed.
 - Alarms now contain the alarm text in the window title so you can more easily detect different alarms in your 
 	status bar.
 - In the Alarm action menu, when you select "Open" it immediately goes to the reminder, instead of having to 
 	hit the Okay button.
 - The variables for List Display->Date Appearance no longer need to be separated by a character.  You can now
 	use something like "[longYear][longMonth][date]" and things should work fine. 
 - You can now add newlines in your status bar tooltip labels.  For example an Upcoming Reminders Label of:
 	[shortDay] [shortMonth] [date] [longYear]:\n[reminderDesc] ([time])\nCategory:  [category]\nOccurs in [daysUntil] days\n
 	would give you:
 		Wed Jan 11 2008:
 		Lost is on! (9:00 PM)
 		Category: Television
 		Occurs in 4 days 	  	
 - Better integration with Sunbird/Lightning.  If you have your reminderfox calendar file shared as a visible
 	calendar of Sunbird, whenever you make changes with ReminderFox, they will be reflected inside of 
 	Sunbird.  (You don't have to manually do a Refresh Remote Calendars to see the updates.) 
 - Added '1' in the snooze time values in the alarm popups (useful for when snoozing for "1 day" for example)
 - Updated to work with Sunbird 0.7 and Firefox 3.0b1
 - Added DTSTAMP to all ICS events for better inter-calendar support (as mentioned in the ICS spec).  


Bug fixes:
 - bug 17788: URI-encode network passwords
 - bug 15123: allow for multiple calculated years defined in a single reminder: "Tom's <1978> birthday and Dan's <1980> birthday" 
 - Now generate the same UID format for both reminders and ToDo's.
 - bug 17983 - default to today's date when adding reminders from the Add Reminder context menu and the Add Reminder button
 - bug 17708: replaced overloaded "Done" label on the Reminder List window with standard "OK"
 - Fixed the common problem where a user specifies the protocol as part of the address string in the network settings
 	preferences.  If this occurs, the protocol is trimmed from the address and the protocol specified in the drop-down is
 	used 
  - Fixed "Unresponsive script" hang when adding repeat reminders of Monthly By Day with a specified interval
  	(Thanks to J�rgen P.)

1.5:
New features:
- Subscriptions.  You can now subscribe to a remote calendar (such as http://sports.yahoo.com/nfl/teams/pit/ical.ics). 
	This lets you subscribe to the many 'live' calendars, such as those found at sports.yahoo.com, www.icalworld.com, 
	www.icalshare.com, google's public calendar search, etc.  You can easily subscribe to a calendar by
	right-clicking on a link to a calendar and selecting Subscribe With ReminderFox (webcal:// and regular ics file links are 
	supported).  You can also add and edit subscriptions by going to the Options and adding/editing a custom list with a URL.  
- Filters - in the Reminder List window, there is now a drop-down control that lets you filter what items the list shows; you 
	can show all events or only those events for the selected month, week, or day (based on what you have selected in the 
	calendar).  You can also show just the events that are coming in the next week or the next two weeks.  The filter 
	lets you have even more control over what is displayed in the list, so you can see only what you're interested in.  You can
	set the default filter in the options.   
- Quickly add a reminder from the status bar!  There is now an action off of the status bar icon's context menu for Add Reminder. 
	This brings up the Add Reminder window without having to go to the Reminder List first.  This lets you quickly and easily 
	add reminders.   
- Custom Repeat Options.  Finally, you can set up your own custom repeat intervals.  You can now set repeat intervals for 
	days, weeks, months, years (eg: repeat every 6 weeks; repeat every 2 months), and specific days for weekly reminders
	(every 2 weeks on Monday, Wednesday, and Friday).  You can also set a Repeat Until date 
	for your repeat reminders, which is a date that the reminders will repeat until and then stop  This could be used to set 
	up a block of dates for when you are on vacation, etc. 
- Repeating todo's.  You can now set repeat options on ToDo items.  This can be used for the alarm popups to show at 
	repeat intervals (daily, weekly, etc).   Note that unlike reminders, by default you will only see one instance in your list 
	with the original date that you set, because a ToDo list is more of a static list.  However, if you filter the list (selected 
	month, week, day, upcoming week, upcoming two weeks), it will show you the individual repeating instances. 
- When sending a reminder, you are now given the option to send as an Invitation, which allows you to
	set the Organizer and Attendees of the event..  This can be used to send meeting invitations via email
	to other	participants which they can then easily add to their calendar client (if it supports ical) 	
- Add Reminder From Contacts - For Thunderbird contacts, you can now add a Reminder for that contact which will contain
	all of their pertinent information.  From your address book, right-click on the contact and select Add Reminder from the
	context menu.  (Thanks to G�nter Wahl  [as suggested by Denis])
- Properly display scheduling events.  For events that were sent as invitations or schedules, the ReminderFox reminder window
	will now show extra details showing the Organizer and Attendees.  It will also show their current status (required, etc), as
	well as your current status.  (Thanks to G�nter Wahl)

Improvements:
 - The standalone Add Reminder window now has a drop-down list for selecting which list to add a reminder to.  So when
 	adding a reminder, you can quickly choose from your reminder or any of your custom ToDo lists.
 - Map Location - the Location field now has a launch button beside it that will bring up a Google Maps page of the location. 
 - You can now rename custom lists (select your custom list in the options and click Edit).  
 - When removing a custom list, you are now prompted that all associated reminders will be deleted as well, and
 	they are automatically removed for you.
 - You can now import/download events that are specified using other US Timezones (such as Yahoo! Sports 
 	calendars, which use US/Pacific) and they will show up with the correct times.
 - Closing alarms with ESC or 'X' no longer acknowledges the alarm by default.  Now the alarm
  	is simply dismissed for this event.  (Thanks to Corey W.)
 - Added category/location to variables, so you can now use those in your tooltips.
 - Added location to quick-search, so you could search for all events happening in Raleigh for instance
 
Bug fixes:  
  - Fixed: removing custom list wouldn't always properly remove it 
  - Fixed: Bug 17143 - wasn't removing Remind Until Complete status when completing reminders from alarm popup
  	window
  - Importing reminders from ICS attachments would not recognize some attachments as calendar events
  - Fixed: Wasn't showing URL or location on alarms for ToDos  


Complete Version History 

1.4.1:
Bug fixes:  
  - Fixed: sorting ToDo's my date was not working

1.4:
New features:
  - Import/export preferences.  From the Options, you can now export your ReminderFox preferences in order
  	to save them or transfer them to other profiles. 
  - New repeat option: weekday  (Mon, Tues, Wed, Thurs, Fri).  
  - New properties:  location and URL.  You can now add a location and URL to any reminders or ToDo's.  These options 
  	are available by clicking the MORE>> button to expand the Add Reminder window.   Clicking on the Launch URL button
  	next to the URL field will bring up that page in your browser.   
  - Add Reminder for a web page.  You can now right-click on a web page and select Add a Reminder...  from the context
  	menu.  This adds a new reminder with the current web page set in the URL field.  You can also select any text in the web
  	page and then select Add a Reminder; this will add the selected text in the Notes field.  This is useful when you need 
  	to remember particular web addresses as part of your reminder or ToDo.
  - Send and receive iCal-based Calendar events via email.  From ThunderBird, you can now accept any invitations sent by
  	any iCal-based calendar (google calendar, Outlook with Internet Calendar enabled, etc).  From inside of the message pane
  	for any emails that contain an iCal attachment (or embedded in the text body), you can select "Import Reminders from iCal"   
  	to add them to ReminderFox.  Conversely, from ReminderFox, you can select reminders and choose Send Reminder... from the 
   	reminder list context menu.  This will open up ThunderBird composed message containing those events as an ical attachment.
   	This is useful for inviting others to an event in your list, and for sharing reminders via email.  (Big thanks to G�nter Wahl)

Improvements:    	
  - Alarms remember snooze time.  Now when you snooze an alarm dialog, it gets stored inside of the calendar file.  This means that 
  	the snooze time is now remembered even if your restart Firefox, and now works better if you are synchronizing your calendar
  	to other computers.  
  - Quick alarms persisted.  Now when you add a quick alarm via the status bar context menu, it will be remembered even if you restart
  	Firefox. 
  - Tooltip now shows list items sorted in the order that they are ordered in the list (you can stop asking me about this now, Jake :)
  - Added ability to reorder your list of default Category items in the Options
  
Bug fixes:  
  - Fixed: Calendar wasn't showing some completed reminders as greyed out
  - Fixed: When resuming from Hibernation/Standby and hovering over the tooltip, it would sometimes
  		continue to show events from the previous day
  - Fixed bug where ReminderFox could not start if using a network password and you cleared all your passwords from Firefox
  - Corrected order of tabbing through items on the Add Reminder dialog
  - Fixed: was sometimes getting the wrong upcoming date for repeating reminders in the tooltip
  - Fixed: when importing events from other calendar files, was sometimes adding superfluous information to the ReminderFox calendar 
  		ICS file

1.3:
New features:
  - Categories.  You can now add Categories to reminders and ToDo's.  You can add a category from your 
  	default list of categories such as "Birthday".  You can add any number of categories, such as:
  	 "Project, Personal, ReminderFox".   The list of default categories can be configured in the options.   
  	 You can also quickly tag any reminder with a category by simply typing any text in the category field. 
  	 (Thanks to G�nter Wahl)
  - Quick search filters.  You can now quickly enter search text to filter your list of Reminders and Todo's based
  	on the text you enter.  You can search and filter on Description, Notes, or Categories.  For instance, this can 
  	be useful to quickly see just the list of reminders belonging to the Birthdays category, or any reminders with
  	"mom" in the description.  (Thanks to G�nter Wahl)

Improvements:    	
  - Better list tooltips - the tooltips in the reminder list window have been improved a bit to show the date, 
  	categories, and completed date (if applicable)
  - From the status bar context menu, the Show Alerts option has been changed to Suspend Alerts and Alarms.  This now handles alarm notifications
  	as well.   Now you can enable this if you want to temporarily suspend all notifications.  Also, if you use both Thunderbird and Firefox, 
  	you could suspend alerts/alarms in one application so as not to receive multiple notifications in both programs.
  - Now tested, verified, and working on Flock (Thanks to Jane Ocean).
  
Bug fixes:  
  - Fixed: You can now use Unicode characters in the Date Appearance, Today's Reminders Label, and Upcoming
  		Reminders Label options.  
  - Fixed: Thunderbird - some users could not delete reminders
  - Fixed: Thunderbird - Calendar was sometimes initially showing up blank 
  - Fixed Bug 16717: If you had multiple alarms occur at the same time, only the first alarm would show and the rest would appear
  		blank
  - Fixed Bug 16855: Adding a Reminder to an email was failing if you had the time showing as part of your list date string
  - Fixed: ReminderFox was not functioning properly when using Cz locale
  - Fixed: List dates weren't handled correctly if Date Appearance option had text before the date
  - Fixed: Marking non-repeating reminders as complete was not using the current date for the Completed Date
  - Fixed: ReminderFox was overwriting some ICS fields used by other calendar programs (such as FinchSync)

1.2.1:
Improvements:    	
  - calendar tooltip now shows completed reminders with a strikethrough (like on the list)
  
Bug fixes:  
  - Fixed: if reminders were sorted, updates to repeating reminders were not always showing in the list
  - Fixed: was not working with German localization
  
1.2:
New features:
   - There is now a new List Display option to show today's reminders in bold font in the list.  This makes today's 
   reminders stand out a little more in the list.  This option is enabled by default and can be turned off via the Options.
   - You can now show and utilize the calendar widget for ToDo's and custom list items as well
   - When setting the date for reminders and ToDo's, there is a new button that can be used to display a calendar 
   	widget for setting the date. 
  
Improvements:    	
  - View as HTML will now show only the selected reminders or ToDo's if you have multiple items selected
  - statusbar tooltip now displays custom list items under their own category
  - Now compatible with Sunbird.  You can even share the same data file between Sunbird and ReminderFox
  	using a bit of a workaround (see ReminderFox FAQ for details). 
 
Bug fixes:  
  - Fixed: Sorting ToDo's wasn't always remembering order (when using Move ToDo Down)
  - Fixed: if sorting by date, wasn't taking time into consideration
  - Fixed: modifying a repeating reminder would switch focus to the earliest instance in your list
  - Fixed: 15677.  Network sync was still attempting to connect even if no network address specified
  - Fixed: When deleting multiple reminders with repeating instances, ReminderFox would stop after deleting the first reminder
   - When marking the most recent occurrence of a repeating reminder as completed, it  will now 
   		use today's date for the completed date (instead of the reminder's instance date)

1.1.1:
Bug fixes:  
  - fixed bug 16133: remote reminders weren't being downloaded if there were no ToDo's in the remote
  	file  
  - fixed: reminder list wasn't always being updated if the list was sorted
   
1.1:
New features:
   - Column sorting.  You can now sort any columns in the Reminder list, including ToDo's and custom lists. 
   	The column sorting is persisted for each list, and will stay sorted the next time you open the list window.
   
 Improvements:    	
  - Quick Alarms now show the targeted hourly time in parentheses for people who are bad at 
  	math (*ahem* Dan Lee)
  - Calendar now highlights dates with completed reminders in light-grey.  
  - You can now select minutes, hours, and days when electing to Snooze a reminder (though the snooze 
  	time is not remembered on restarting of Firefox)
  - Added some Help links which launches the language-specific FAQ
  - ReminderFox is now compatible with FinchSync; this allows you to sync your events and ToDo's
  	with PDA's and SmartPhones.   (Thanks to G�nter Wahl)
  - Thunderbird: mail icon now shows in alarms and edit window, so you can quickly jump to related 
  	emails.   (Thanks to G�nter Wahl)
  - Thunderbird: TB 2.0 now properly changes the label color when adding a reminder.  (Thanks to G�nter Wahl)
  	In Thunderbird 2.0, ReminderFox utilizes the new tag system.  When you add a reminder to an email, the email
  	gets tagged as 'reminderfox'.  You can use the Thunderbird capability to edit that tag to be any color you want.
  - New web site layout and redesign by <a href="http://jojaba.free.fr/">Jojaba</a>.  Huge thanks to Jojaba!
  - View As HTML now uses new web style as well

 Bug fixes:  
  - fixed: when using automatic network synchronization with some providers (like icalx.com), it was possible for an empty 
  		remote file to overwrite your local reminders.  There is now a check in place to prevent this from happening.
  - fixed: couldn't delete reminders attached to emails that had since been deleted
  - now you can enter in various separators besides the current default when adding times
  	for events (such as '.'  and ':' and 'h')  
  - fixed problem where completing repeating reminders was clearing the Remind Daily Until Completed flag
  - marking non-repeating reminders as Remind Daily Until Completed was not working if the reminder date 
  	had already passed
  
1.0.1:
 Bug fixes:  
  - fixed: localization - Quick Alarms weren't working with some localizations

1.0:
 New features:
   - Quick Alarms - you can now create a Quick Alarm via the status bar icon's context menu.  This allows you to 
   		quickly set an alarm to be reminded of something that will happen shortly.  Example:  "check pot roast" in 20 minutes.  
   		Note that these are just quick temporary alarms, and are not added to your reminders.  
   - Alarm actions - You can now more easily interact with reminders from the alarm dialogs.  There are now options
   		to mark the reminder/ToDo as complete, delete it, view it, or simply acknowledge it.  This way, once you receive
   		an alarm notification, you can quickly complete/delete it if you no longer need it.

  Improvements:    	
   - You can now select multiple items when performing most operations in your lists
   	 (deleting, marking as complete, reordering ToDo's, etc). 
   - When deleting a repeating reminder, you are now given the option to delete all instances, or just delete the
   		selected (and previous) occurrence.  
   - New column for Alarms in the reminder/ToDo list.  This column shows an icon for any reminders that have alarms
   		set for them; hovering over the icon will show you the details of what the alarm is set for.
   - Calendar no longer highlights reminders that are marked as complete   
   - Automatic backups of reminder files are now kept in your profile's reminderfox directory (snapshots for today 
   		and yesterday)
   - Thunderbird: You can now select text inside of an email and when you select Add a Reminder from the context menu, the highlighted
   		text will be included as part of the reminders notes.  This is useful for quickly grabbing dates, times, and places from 
   		an email.  (Thanks to G�nter Wahl)
   	- Thunderbird: When a reminder is created from a reminder, the email's label (color) is changed to signify a reminder is associated with it.  
   		Now when the reminder is deleted or completed, the email's label is cleared back to the original state.  (Thanks to G�nter Wahl)
  
  Bug fixes:  
  - fixed: localization - View as HTML wasn't showing some character sets properly
  - fixed: importing from other calendar systems could erroneously show alarm data in the notes field
  - fixed: wasn't always setting a repeating Remind Until Completed reminders to today's date.
  - bug 15266 - repeating reminders BYMONTH was stored incorrectly, which could cause problems
  		with other calendars
  - fixed: incorrectly setting some recent past reminders set for Remind Until Complete to today's date
  - fixed: moving ToDo's up or down would not reorder properly when Hiding Completed Items
  - made calendar font size a bit larger as it could be difficult to read with some fonts
  		
0.9.9.3:
 - Version number synchronization for Firefox 2.0  		
  		   

0.9.9.2:
 Improvements:    	
  - View As HTML now works from Thunderbird
  - View as HTML now shows dates, times, and notes for reminders and ToDo's, as well as
 	indicating completed status  
  - ToDo's and List items now handle years in their descriptions just like reminders
   ( "get gift for our <2000> anniversary" shows up as "get gift for our 6th anniversary")
 	
  Bug fixes:  
  - localization: fixed Options dialog sizing problem
  - localization: fixed problems with moving reminders to ToDo's list
  - localization: fixed problems where Adding a Reminder in Thunderbird would not use the 
  	proper character set for some languages such as Hebrew.  (Thanks to G�nter Wahl)
  - Fixed problem where synchronizing to some calendar services would cause 
  	problems with reminders that had descriptions containing commas 
  - Fixed problem where synchronizing to some calendar services (such as memotoo)  would not properly 
  	download remote changes 
  - Fixed problem where synchronizing to some calendar services (such as iCal Exchange) would 
  	show "201" error dialog when uploading
  - Fixed View Mail with certain msg-IDs that contained quotes  	
  - Fixed problem where could no longer View ToDo's or Lists as HTML page  
  - Fixed problem where password couldn't be cleared out in the Options
  
0.9.9.1:
  Bug fixes:  
    - Fixed problem where Add a Reminder wasn't working for Thunderbird 

0.9.9:
  New features:
  	- New Lists!  In addition to reminders and ToDo's, you can add additional lists that will show up as separate tabs. 
		You could keep lists like: Movies (for upcoming movie releases), Albums (for upcoming music releases), 
		Groceries (to keep track of items you need), or anything else that you can use a list for.  This is good for list-oriented
		people like myself :)  You can add/reorder your lists from within the Options.
   	- There is a new preference option to hide completed items.  In addition, there is also a context menu in the 
   		edit window to temporary show or hide completed items.
   	- You can now set dates on ToDo and List items.  ToDo's with Dates will show up in your tooltip just like Upcoming
   		Reminders.   You can also now set alarms for ToDo and List items.  (The    		Date column is hidden by default 
   		for ToDo's)
   	- Reminders and ToDos now store the date that you completed the item.  (The Date Completed column is hidden
   		by default)
   	- You can now move reminders to any list via the Move to List context menu item.  Also, you can move any ToDos or
   		List items (that have dates) to the Reminders list.
   	
  Improvements:    	
  	- Automatically Synchronizing to a network has been greatly improved.  Synchronization now happens in the 
  		background; when you bring up the Edit Reminders window, the synchronization status is displayed at the
  		bottom of the screen instead of a small modal window.  Similarly, after you close your Edit Reminder window,
  		your reminders are uploaded in the background so you no longer have to wait for this operation to complete.  		
    - Better column interaction.  You can now click directly on columns to toggle Complete state, Remind Until Complete
    	 and Show In Tooltip status.  You can also click on a reminder's email icon to view its associated email.
    - Column headers now show icons for Mail, Completed, Show in Tooltip, and Remind Until Complete.  It  was difficult to 
      	really identify the columns with just the text, and now the column size can be much smaller
 	- Notes now show up in alarms.
 	- Now when you mark a repeating reminder as complete, it will only mark that instance (and previous instances)
 		so that future occurrences are not marked as well.  
 	- (SeaMonkey) Fixed some bugs to now work properly in SeaMonkey/Mozilla.  Thanks to Philip Chee.
 	- (Thunderbird) The Add a Reminder menu is now available when selecting any message in the message list, as well as 
 		the message and preview panes.  Thanks to G�nter Wahl. 

  Bug fixes:  
    - If the preference is set to show no past occurrences, the list wasn't showing reminders set to Remind Until Completed
    - fixed bug where alert could still possibly show if it had been marked complete since last alert
    - fixed bug where alert could close when you closed the Reminder List window
    - fixed bug where Importing from network would fail if the remote file was not created by ReminderFox. 
    - fixed bug 14783 -	Upload window with status "sending" stays open (ftp)
    - fixed bug 14784 - duplicate alerts could show multiple times

0.9.8:
  New features:
  	- Thunderbird Integration:
  	  -- From Thunderbird, you can add a reminder for any message that you view.  From the message pane, right-click and
  	select Add a Reminder from the context menu. This will allow you to add a reminder for that email so that 
  	you can be reminded to look at it again at a later date.  (Note that the context menu option is only available from the 
  	message pane and preview pane; it is not yet available on the message list view context menu, but we're working on it.)
  
      -- Note that you can add a reminder for any message inside of Thunderbird, be it an email from any account, an rss feed 
  message, a news group message, etc.  
  	
  	  -- When viewing your reminders in the ReminderFox list, all of the reminders that are associated
  	with an email  are indicated by a small mail icon in the Mail column.  (This column is hidden by default, but
  	can be made visible by clicking on the twisty at the top right-hand side of the reminder columns.)
  	
  	  -- From ReminderFox, for any reminder that is associated with an email, you can right-click and select View Mail
  	 from the context menu.  This will retrieve and display the associated message. 
  	 
  	  --Thanks to G�nter Wahl and Markus Hossner for their contributions to get Thunderbird integration working. 

 Minor improvements:    	
 	- You can now search for ToDos just like reminders (via the Find context menu or shortcut key)
  	
Bug fixes:  
    - Now only shows an alarm if reminder has not been marked complete or deleted
	- Fixed extension conflict with ProfilePassword
	- Now properly shows number of repeating upcoming reminders in the tooltip according to preferences
	  (it was showing an additional repeating instance)
	
0.9.7:
  New features:
  	- Daily reminders -- finally  :)
  	- New options to set the defaults for New Reminders (default repeat, default Remind Until Completed, etc)  	
  	- Hide repeating reminder occurrences.  There is a new preferences that allows you to specify how 
  		many previous ocurrences and upcoming occurrences should be displayed in the list of reminders
  	- Option on Edit Reminders window context menu that lets you toggle between showing all and showing no
  		repeating instances in the list

 Minor improvements:    	
 	- When you snooze an alarm, the last snooze time is remembered the next time you are alerted

Bug fixes:  
	- Fixed problem with export -wasn't adding an explicit date-end (which could cause problems with 
		Sunbird)
	- Fixed bug #13647 - reminderfox is not displayed in Thunderbird on startup (when using synchronization 
		with network)		
	- Fixed problem where wasn't showing some missed alarms	
	- Fixed problem where pressing "Open..." from alarm dialog wasn't always highlighting the correct reminder,
	  and wouldn't open the reminder if the Edit Reminders dialog was already open
	- Fixed bug #13887 - Now when Complete a reminder that is marked Remind Daily Until Completed, it doesn't
	   also clear the Remind Until Completed flag.  This is helpful so you could keep a repeating reminder always 
	   marked Remind Until Completed and complete it each occurrence
	- Fixed bug #14292: when downloading from the Options menu, wasn't downloading if the remote reminder file
		 was older than local reminder file
	- Fixed bug #14370 - problem when importing other calendar events that have an alarm with a Description set 
	- Made date text field in the New Reminder dialog editable		
	- Handle cases where invalid dates are entered for Reminders	
  	
0.9.6  - The "Show Europe the Love" release!
  New features:
  	- Option for 24-hour time
  	- Option to set starting day of week for the calendar
  	- Option to customize date appearance in the Edit Reminders list
  	- Can set an alarm to occur minutes, hours, or days in advance.  Note that you can type  in any number 
  		in the time field (the pre-existing values in the drop-down box are just for convenience)

 Minor improvements:    	
 	- You are now notified of any missed alarms when you start ReminderFox
	- Added localization for mn-MN (thanks to Natsagdorj Shagdar) 
		and ca-CD (thanks to Toni Hermoso Pulido)

Bug fixes:  
	- Fixed potential network synchronization problem when additionally sharing reminder file locally
	- 13662 -  Wasn't properly opening web links when used in Thunderbird
	- 14030 - Export to Network is not converted to UTF-8 (thanks to IWAMA Kazuhiko)
	- Fixed some localizations that were broken
     - Fixed bug where alert slider would sometimes show up as empty

0.9.5.1
 Bug fixes:  Fixed missing string in language localizations

0.9.5:
  New features:
  	- Network import and export via FTP or WebDAV (thanks to Josef Hajas).  In the network options,
  		enter a full address including the filename: ftp://www.mydomain.com/reminders.ics
  	- Network synchronization - you can choose to automatically keep your local and remote reminders 
  	 	synchronized.   (Note:  You may want to back up your existing reminders first for safety)
  	- Reworked Options menu - added tabs for better organization and usage of screen real-estate

 Minor improvements:    	
 	- You can now open the reminder from an alarm popup
	- Added option for label customization of today's reminders tooltip (similar to upcomng reminder tooltip).  
		So for the truly forgetful, you could now have today's reminders show today's date.
	- Added localizations for da-DK and pt-BR
		
 Bug fixes:
  	- Fixed bug - tooltip and context menu wasn't working in Mozilla
  	- Fixed bug where exporting reminders could set the wrong date (it would use the following day) 
  	
0.9.4
  New features:
  	- You can now add Notes to reminders and ToDo's.  Click the note icon in the Add Reminder/ToDo window
  		to add additional notes to a reminder.  You can also view notes in the Edit Reminders list by hovering 
  		over a reminder or ToDo item.  
  	- You can now mark ToDo's as Complete.  This will check the ToDo as complete and strike a line through it
  		but will leave the ToDo in your list.  (You can use the spacebar as a keyboard shortcut to toggle a ToDo 
  		or reminder as complete).  
  	- New icons to denote reminder and ToDo properties.   In the Edit Reminders list, if you show the various 
  		property columns (click the column picker icon to the right of the column headers to choose columns), 
  		they will appear as various icons to make it easier to distinguish properties:
  			- a note icon signifies that a reminder or ToDo has a note attached to it
  			- a ribbon icon signifies that a reminder is marked to Remind Until Complete.  A blue ribbon signifies that
  				the reminder is marked but the date has not yet been reached.  A red ribbon indicates that the reminder
  				is past the original date.  
	- New ReminderFox Icon - thanks to Ricardo Ortiz!
	
 Minor improvements:    	
	- Added some keyboard shortcut identifiers
	
 Bug fixes:
  	- Now sort reminders that occur on the same day chronologically by time
  	- Couldn't mark repeating reminders as Complete
	- bug 13144 - Couldn't change date of today's reminders if they were marked Remind Until Completed
	- bug 13087 - Error in Polish localization file - caused XUL problem when starting ReminderFox. 

0.9.3:
  New features:
	- Option for audio notification for alarms and alerts
	- Now an explicit preference in the Options dialog to specify the location of the reminder file - this can be used
		to share the same reminders between Thunderbird and Firefox, or across multiple profiles, or operating
		systems
	- Sweet new alert slider.  Now looks like the tooltip (can span multiple lines) and you can click on it to bring up the 
		Edit Reminders dialog

 Minor improvements:  
 	- Significant performance improvements in the Edit Reminder dialog
 	- Better synchronization between Firefox and Thunderbird
 	- New localizations - Slovak  [thanks to Slovaksoft], Chinese (zh-CN, zh-TW)
 		
 Bug fixes:
 	- 12826 - Tooltip wouldn't show if you disabled status-bar
 	- 12691 - Reminders marked as Remind Until Completed with a date of last year would not show up in 
 		the Edit Reminder List
 	- 12710 - Reminder ics file could not properly be shared between certain OS's
	- Toggling Show Alert on status context menu did not disable alerts
	
0.9.2:
  New features:
	- Now works with Thunderbird!
	- Can view reminders and ToDo's as an HTML page (via the context menu in the Edit Reminders dialog); 
		this can be useful for printing out reminders and ToDos

 Minor improvements:  
 	- Many performance improvements (especially with large numbers of reminders)	  
	- You can specify an alternate location to keep the stored reminder ics file.  Specify the filepath 
		(eg: C:\stuff\reminders.ics) in the following preference: extensions.reminderFox.storeFile
	 	This can be useful to share the same set of reminders between profiles or filesystems
	- New complete localizations (including French, Italian, Spanish, Turkish).
 		
 Bug fixes:
 	- Can now input any year in the reminder options
 	- Fixed bug where closing options dialog re-processed reminders even if no changes
 	- Fixed some small UI issues where text was not properly aligned
 	- Fixed bug where reminders would be processed more than neccessary

0.9.0.1:
  Bug fixes:
	- Fixed potential extension conflict with status-bar extensions  

0.9:
  New features:
	- Repeating reminders - yearly, yearly by day (Mother's Day), monthly by date, month by day, weekly, every 
		two weeks
	- You can now set an explicit year for a reminder
	- Reminder list syncs with year - it displays only those reminders for the selected year, and updates when the 
		year is changed on the calendar
	- Full integration with calendar widget.  Now you can double-click a date on the calendar to add a new reminder;
		you can also bring up the reminder context menu for any date on the calendar in order to manipulate that reminder	 	
	- Time - You can now set a specific time for a reminder to occur
	- Notifications - you can elect to have a reminder notification at a specified time prior to the event
	- Options - you can now alter all options for existing reminders, such as date, time, description, and other properties
	- Fully customizable tooltip labels (including day of the week, time, number of days until the event 
		occurs, etc)
	- ICS - Import and export now uses the ics standard (used by iCal and mozilla calendar)
	- localization - externalized strings to allow for localization for other languages
	- added Czech translation (thanks to Karel Ulman)
	
 Minor improvements:  
  	- Cleaned up UI - should not be as confusing to add a reminder now	
  	- New columns for Time and Repeat options
  	- Can drag columns around and their position is saved

 Bug fixes:
 	- Fixed problem where calendar day tooltips would show duplicate items if there were multiple reminders
 	  on that day  	
	- Fixed problem where tooltip items would always display as black text even in themes with black background 	  
	
0.5.8.3
 Bug fixes:
  - Fixed another date problem where adding dates at the end of the month were sometimes added incorrectly
  - Fixed problem where reminder alert sliders could constantly show, or show whenever the browser changed focus.

0.5.8.2:
 Bug fixes:
  - Bug 11961 - Fixed problem where reminders were not being read in/imported properly (maily when using Spanish characters)
  - Bug 11955 - Fixed problem where adding certain dates would be added for the following month instead
  - Upcoming reminders for the next year weren't showing up at the end of the list in the Tooltip if the month 
	was the same as the current month.

0.5.8.1:
 Bug fixes:
  - Bump version number to enable for Firefox 1.5rc1

0.5.8:
  New features:
  - Can now input text for reminders and ToDo's using any language encoding (Cyrillic, etc).
  - You can have reminders show a year count  like "Billy's 11th birthday"  by entering in a reminder 
  	with the year in the text like "Billy's <1994> birthday".
  
 Bug fixes:
  - Upcoming reminders  for the next year show up at the end of the list in the Tooltip 
  - If you change properties of Reminder/ToDo's in the Edit dialog, they aren't deleted and then re-added.  
  	The underlying model is simply modified instead.  

0.5.6.3:
 Bug fixes:
  - Fixed: Bug 11715 - one-time reminders shouldn't show up when year is changed via calendar widget
  - You can now single-click on the ribbon to invoke the Edit dialog, for those too lazy to be bothered with
     multiple clicks.
  - Now installs properly on Firefox 1.5 beta 2
  - Now installs on Mozilla as well (thanks Pete!)     

0.5.6.2:
 Bug fixes:
  - Fixed: Bug 11635 - importing reminders on a different OS could fail
  - Fixed: max width of the tooltip, so reminders/ToDo's do not have to wrap so short
  - Fixed: options dialog was being truncated and wouldn't close properly in some cases

0.5.6:
 Minor improvements:  
  - Added option to change where to display the ribbon status icon (status bar, menu bar, etc).
  - Added option to specify which dialog is opened on double-click of status icon: Reminders or 
	ToDo's

 Bug fixes:
  - Fixed off-by-one error when selecting items at the end of lists
  - Fixed problem where context menu was showing in Edit dialog when there were no reminders
     or ToDo's selected  	
 
0.5.5:
  New features:
  - Import/Export  reminders.  You can now import and export your lists of reminders and ToDo's.  This
  	 is useful for backing up your reminders as well as transferring them to other profiles.  
    -- When importing reminders, you can either overwrite your current existing reminders, or add the
        imported reminders to your existing list of reminders (sort of like merging).  This would also allow
        for you to import common shared lists of reminders for multiple people who share a pool of reminders
        such  members of your family (birthdays, etc).  

 - Options Dialog.  There is now a proper options dialog to change your preferences.  This can be 
 	accessed off of the context menu of the ribbon icon in the status bar.  The options page allows 
 	you to change some display preferences, alert preferences, as well as Import/Export of reminders and 
 	ToDo's.

  - There are a few new display options available in the Options page.  
    -- You can choose not to show the text of today's reminders in the status bar.
    -- You can choose whether to show reminders/ToDo's or both in the tooltip.
  
 Bug fixes:
  - Calendar was showing bold for some dates other than current date
  - Tooltips weren't properly handling long words (like URLs) with no spaces in them
  - Now installs properly on Firefox 1.5 beta


0.5.2.3:
 Bug fixes:
  - Fixed problem where alerts or the status text showing reminders might not be updated if using multiple
  	browser windows.

0.5.2.2:
 Bug fixes:
  - Fixed potential timing issues when there are lots of extensions
  
0.5.2.1:
 Bug fixes:
  - Fixed some conflicts with other extensions. 

0.5.2:
  New features:
  - You can now search for reminders in the Edit Reminders dialog by pressing [CTRL]-F.   You can also press 
  	[CTRL]-G to search for the next instance of a reminder containing your search text.  

  Minor improvements:  
  - You can now move ToDo's up or down in your list via the context menu.  This is useful for ordering your 
  	ToDo's by precendence.  You can also use the keyboard shortcut [ALT] + UP or DOWN arrow to sort 
  	your ToDo's. 
  	
  Bug fixes:
  - Fixed monthly-reminder bug where it wasn't handling end-of-month dates (29,30,31) for months with fewer
  	days than that
  - Pressing Enter adds reminder when focus is on the one-time or important checkboxes (useful for 
  	keyboard accessibility when tabbing).


0.5:
  New features:
  - Calendar.  There is now a fully synchronized calendar widget which can be toggled on or off 
  	via the calendar icon.  
  	-- The calendar displays all of the reminders for each month (highlighted
  		in yellow) and any important reminders will have the date highlighted in red.  
  	-- You can hover over any date with a reminder to get a tooltip of the description.  
  	-- Clicking on a date with a reminder in the calendar jumps to that date in the reminder list, and
  		vice-versa.  Also clicking on any date in the calendar sets the New Reminder month and day
  		to that date -- useful for quickly selecting which date you want.  
  	-- Thanks to Sandesh Karalkar for the base datepicker code

  Minor improvements:  
  - Replaced Cancel button from Edit Reminder dialog with Revert button.  The Cancel button was deemed 
	too confusing, as any changes made in the dialog appear to be immediate.  Now if you make any changes 
	to reminders/todo's, the Revert button will be enabled and will allow you to revert everything back to 
	its original state.  
  
  Bug fixes:
  - If Edit Reminders dialog is already open, and you double-click the reminder statusbar, it will set focus on
  	the Edit Reminders window, instead of closing it.  
  - Keep the new reminder text area selected when changing months and days from the drop-down lists
 
 
0.4.6:
 New features:
  - Reminders can be marked as Completed.  This is useful for reminders that you finish with 
    and no longer wish to be reminded about in the tooltip or in the status bar.  eg: if you 
    have a reminder to "Pay phone bill" and you pay it early, then you can mark it as Complete
    and it will not show up in the upcoming reminders.
 
  - You can now suspend the alert sliders via a context menu item off of the status bar.  This is 
    useful if for example you are sharing your screen for a presentation/demo for your boss and 
    you don't want your "Buy more laxatives!" reminder to happen to pop up.

 Minor improvements:  
  - Made the Edit Reminders dialog resizable
  - Cleaned up the Context Menu on Edit Reminders dialog
  - You can add a new String preference in the about:config dialog named 
  	"reminderFox.debug.lastUpdate".  This will then show the time that the 
  	reminder tooltip/status bar was last updated.  This can be useful for 
  	debugging.
   - You can add a new String preference in the about:config dialog named 
  	"reminderFox.backupFile" and set the value to be the filename where 
  	a backup of your reminders and todos will be kept.  This is extra insurance in the 
  	event that your reminders get modified or erased; you can go to the backup
  	file.  (this preference has since been removed)
  
 Bug fixes:
  - fixed About Dialog hijacking of FireFox dialog
  - Fixed grammar for ToDo's
  
  
0.4.5:
 New features:
  - ToDo's.  There is now a separate tab for ToDo items.  These are good for things that, unlike 
    reminders, do not have a specific start date or completion date.  eg: "Need to sign up for 
    gym membership".  You can choose whether or not to have todos show in the tooltip.

 Minor improvements:  
  - Added cancel button on the Edit Reminders dialog.  If you have made any changes, you will
    be prompted to save or discard them.
  - If you close the Edit Reminders dialog via the OS's 'X' close button, you are now prompted
 	to save or discard any changes.
  - Cleaned up Edit Reminder dialog options a little bit
  
 Bug fixes:
  - Properly update status text/tooltips on day rollover.  (After it turns midight, current/upcoming 
    reminders may have changed.)
  - properly handle reminders/todos containing delimiter characters


0.4:
 New features:
  - You can now mark reminders as 'Important'.  This is for those extra-special events that you
    can't miss, like your wife's birthday.  These reminders will show up highlighted in 
  	red in the Reminders list, as well as in the tooltip and status bar.  Reminders can be marked
  	as Important when initially added, or via the 'Mark as Important' entry in the context menu.
  - You can also set a reminder to 'Remind Until Completed'.  This means that once a reminder occurs,
  	it will continue to show up each following day until such time as you mark the reminder as 
  	'Completed' (via the context menu).  This is useful for things where you want to keep reminding
  	yourself until you actually do it, like "remember to call Mom".   Reminders can be marked
  	as 'Remind Until Completed' when initially added, or via the context menu.  Once a reminder
  	has been completed, select 'Mark as Completed' from the context menu.  

 Minor improvements:
  - There is now a confirmation dialog when deleting a reminder.
  - Reminder descriptions can now be edited.  This can be performed by selecting 
    "Edit Reminder Description" from the context menu or double-clicking on a reminder.
  - Columns in Edit Reminder dialog can now be hidden via the column selector, and their 
   	status will be persisted after you close the dialog/browser.  Also, the widths of the columns 
    are now flexible.
    
 Bug fixes:
  - The ReminderFox ribbon icon in the status bar now ACTUALLY changes color depending on status
  - Remiders are properly highlighted and scrolled to in the Edit Reminders dialog when added, 
  	removed, etc.
  - Show alerts even when more than one browser window is open. 
  - Update all browsers when Edit Reminders dialog is closed
  - Only have one update thread for all open browsers
  - Tooltip shows monthly reminders in proper order
  - Made Add Reminder options aligned
  
  
0.3.1:
 Minor improvements:
  - Usability enhancements to Add Reminder dialog
  	- When user hits enter key in Add Reminder text box, new reminder is added.
  	- When user clicks Done in Add Reminder dialog, ribbon text and tooltip is updated immediately.
  	- Cursor placed in New Reminder text box when dialog is loaded.
  - Alert slider no longer (annoyingly) pops up for all new windows, only the first firefox window opened.
    After that, the alert slider timeout preference is respected.


0.3: 
 New features:
  - You can add a one-time-only reminder by checking the "one-time" option when adding a reminder.  
    This is useful for one-off, non-repeating reminders -- eg: "Return library book".  Once
    the date has passed, these reminders are automatically deleted from the list of reminders.
  - You can now add a reoccurring, monthly reminder for an event that falls on the same date every 
    month.  Simply select "Monthly" in the month pull-down when adding a reminder, and the reminder will
    be added for that date every month.  Useful for repeating events -- eg: "Pay credit card bill"
  - You can now double-click the ribbon in the status bar to launch the reminder dialog
  - User-defined preferences.  You can now set a few preferences via the about:config dialog in FireFox:
    reminderFox.alertTimeout  -  the number of minutes between alerts (default: 120)
    reminderFox.enableAlertFor - controls when the alerts occur (default: all):
  	   none - never show alerts
  	   today - only show alerts when there is a reminder occurring today
  	   upcoming - only show alerts for upcoming reminders
       all - show alerts for current and upcoming reminders
    reminderFox.upcomingReminderDays - the number of days to look ahead and report on
  	 upcoming reminders for alerts and tooltips.  (default: 15)  
  - The ReminderFox ribbon icon in the status bar will change color depending on status; ie - there is a
    reminder today, there are upcoming reminders, or there are no current or upcoming reminders. 
 
 Minor improvements:
  - When launching the reminder list dialog, the current or next upcoming reminder is automatically 
    highlighted.
  - The 'add reminder' dialog defaults to the current date.
  - The 'add reminder' dialog now shows the correct number of days in the day pulldown list, corresponding to 
    the month that is selected
  - Tooltip text now wraps in order to handle long reminders.
  - Status bar text for Today's Reminder(s) is truncated for long reminders.
  - Reminder text in alerts are truncated for long reminders.

 Bug fixes:
  - Reminders are now added in sorted order.  Tooltips will show properly sorted items.
  - Delimiters for storing reminders have been changed to less-common characters (` and ~).
    If you have used a previous version of ReminderFox, a migration process will handle 
    converting the reminders to the new format.
  - Javascript files refactored into separate component files.


0.2: 
 - Fixed that install bug, you will no longer have to manually add the reminderFox.reminders preference.
 - Added an alert slider that will display all upcoming reminders on startup
 - Added a context menu on the ribbon to launch the "Edit Reminders" dialog.


0.1: 
  Initial release
  

Release chronology: 
04/29/08	ReminderFox 1.7
12/18/07	ReminderFox 1.6
09/23/07	ReminderFox 1.5
07/02/07	ReminderFox 1.4.1
06/30/07	ReminderFox 1.4
04/27/07	ReminderFox 1.3
02/20/07	ReminderFox 1.2.1
02/14/07	ReminderFox 1.2
01/05/07	ReminderFox  1.1.1
01/01/07	ReminderFox  1.1
11/07/06	ReminderFox  1.0.1
11/01/06	ReminderFox  1.0
09/26/06	ReminderFox  0.9.9.3
09/14/06	ReminderFox  0.9.9.2
09/03/06	ReminderFox  0.9.9.1
08/31/06	ReminderFox  0.9.9
07/25/06	ReminderFox  0.9.8
06/15/06	ReminderFox  0.9.7
05/12/06	ReminderFox  0.9.6
03/28/06	ReminderFox  0.9.5.1
03/27/06	ReminderFox  0.9.5
02/17/06	ReminderFox  0.9.4
01/22/06	ReminderFox  0.9.3
01/04/06	ReminderFox  0.9.2
12/20/05	ReminderFox  0.9.0.1
12/15/05	ReminderFox  0.9
11/07/05	ReminderFox  0.5.8.3
11/03/05	ReminderFox  0.5.8.2
10/30/05	ReminderFox  0.5.8.1
10/20/05	ReminderFox  0.5.8
10/07/05	ReminderFox  0.5.6.3
09/30/05	ReminderFox  0.5.6.2
09/20/05	ReminderFox  0.5.6
09/14/05	ReminderFox  0.5.5
09/07/05	ReminderFox  0.5.2.3
09/01/05	ReminderFox  0.5.2.2
09/01/05	ReminderFox  0.5.2.1
08/26/05	ReminderFox  0.5.2m
08/12/05	ReminderFox  0.5m
07/29/05	ReminderFox  0.4.6m
06/20/05	ReminderFox  0.4.5m
05/09/05	ReminderFox  0.4m
05/01/05	ReminderFox  0.3.1d
04/27/05	ReminderFox  0.3m
04/15/05	ReminderFox  0.2d
04/03/05	ReminderFox  0.1d

ReminderFox Team:
Tom Mutdosch & Daniel Lee
