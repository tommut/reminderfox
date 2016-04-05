if (!reminderfoxX)     var reminderfoxX = {};

/**
 * Reminderfox Send/Get functions to work with CalDAV Server
 *
 * @param  caller {object} call back routine
 *    caller needs to pass detail with array 'elements' including:
 * @requires  {object}  elements  with:
 *
 * elements.
 *   username/password/url/name/ID
 *   url          {string} CalDAV server address, maybe extended with ics file name
 *   urlstr       {string}
 *   request      {string} call method
 *   Typ          {string} VEVENT or VTODO
 *   href         {string}
 *   etag         {string}
 *   contentTyp   {string}
 *   responseTyp  {string}
 *   header       {string}
 *   timeout      {string} value in sec the query will be canceled
 *   callback     {string}  caller.callback address
 *
 * HTTP functionality based on httpRequester,
 *    see https://addons.mozilla.org/en-US/firefox/addon/httprequester/
 *
 * Parse of 'xml' results to JS object based on
 *     https://developer.mozilla.org/en-US/docs/JXON)
 */
reminderfoxX.calDAVhttp = function () {}
//------------------------------------------------------------------
reminderfoxX.calDAVhttp.prototype.inprogress = null;

reminderfoxX.calDAVhttp.prototype.handlePW= function (call) {
	//---------------------------------------------------------------
	if ((call.password === "") && (call.username !== "")) {

		return reminderFox_getPassword ({
			ljURL    : call.url,
			username : call.username,
			password : call.password
		});
	} else {
		return {
			username : call.username,
			password : call.password
		};
	}
};


reminderfoxX.calDAVhttp.prototype.sendContentToURL = function(caller,call) {
	//----------------------------------------------------------------
	var logMsg;

	call.ID = new Date().getTime();

	if ((!call.tester) || (call.tester === false)){
		call.method  = reminderfox.calDAVcalls[call.request][0];
		call.body = reminderfox.calDAVcalls[call.request][1];
		call.header  = reminderfox.calDAVcalls[call.request][2];

		if (call.header !== '') call.header += ';';
		call.header += 'User-Agent:Reminderfox/' + reminderfox.consts.MIGRATED_PREF_VERSION;
	}
	call.test = false;

	var loginpw = "";

	if ((call.url) && (call.url.search('https://www.googleapis.com/caldav/v2/')) === 0) {

		var access_token = reminderFox_getPassword ({
			ljURL    : "https://www.googleapis.com/caldav/v2/" + call.username,
			username : 'access_token',
			password : ""
		});
		if (!access_token) {
			caller[call.callback](402 /*status*/, null /*xml*/, "Login failure" /*text*/, null /*headers*/,
				"Google Calendar Access token failure with account: " + call.username /*statusText*/, call);
			return;
		}
		call.header += ';Authorization: Bearer ' + access_token.password;
	} else {

		var loginData = this.handlePW(call);
		if (!loginData) {
			caller[call.callback] (402 /*status*/, null /*xml*/, "Login failure" /*text*/, null /*headers*/,
				"Login failed!" /*statusText*/, call);
			return;
		} else {
			loginpw =  loginData.password;
		}
	}


	var urlstr = (!call.urlstr) ? call.url : call.urlstr ;

	if (call.body === "") call.body = call.vCalendar;
	if (!call.body) call.body = "";

	if (call.Typ) {
		call.body = call.body.replace("%VELEMENTS%", call.Typ);
	}
	if (call.href) {
		call.body = call.body.replace("%<d:href/>%", call.href);
	}
	if (call.redirect_uri) {
		call.body = call.body.replace("%redirect_uri%", call.redirect_uri);
	}

	if (call.etag) {
		call.header = call.header.replace("%etag%", call.etag);
	}

	if( call.contentType.length === 0) {
		call.contentType = "text/xml";
	}

	if (call.header === "") {
		call.headers = null;
	} else {
		call.headers = {};
		var headersArray = call.header.split(';');

		for (var i= 0; i < headersArray.length; i++) {
			var cHeader = headersArray[i].split(':');
			call.headers[cHeader[0]] = cHeader[1];
		}
	}

	if(this.inprogress) {
		var requestToCancel = this.inprogress;
		this.inprogress = null;
		requestToCancel.abort();
	}

	logMsg = "CalDAV  HTTP sendContentToURL  [" + call.request + "|" + call.callback +"]  (" + call.ID + ")"
		+ '\n  method: ' + call.method +  "  headers >>\n" + call.header + "\n<<"
		+ "\n  urlstr:"    + urlstr + "  login : " + call.username
		+ "\n  contentType:" + call.contentType
		+ "\n  content   >>\n" + call.body + "\n<<";
	reminderfox.util.Logger('calDAVhttp', logMsg);

	var spdy = rmFX_GCal_SPDYset(call,  ("[" + call.request + "|" + call.callback +"]  (" + call.ID + ")" ))

	var requester;
	var currentApp = this;
	this.inprogress = reminderfox.HTTP.call(call.method, urlstr, {
		caller        : caller,
		username      : call.username,
		password      : loginpw,   // loginData.password,

		timeout       : parseInt(call.timeout, 10) * 1000,

		contentType   : call.contentType,
		body          : call.body,
		headers       : call.headers,
		returnHeaders : true,
		spdy          : spdy,

		onOpened : function() {
		},
		onHeaders : function() {
		},
		onLoading : function() {
		},

		onSuccess : function(status, xml, text, headers, statusText) {
			rmFX_GCal_SPDYreset(call, "(" + call.ID + ")" )
			caller[call.callback](status, xml, text, headers, statusText, call);
		}
	});
	return;
};


/*
 * gW 2014-10-24 
 * SPDY handling with Google CalDAV handling
 * See [Bug 1072525] Interfacing with Google DAV services over HTTP/2.0 Fails with "400 Bad Request"
 *   https://bugzilla.mozilla.org/show_bug.cgi?id=1072525
 * 
 * call.Url : 
 * https://www.googleapis.com/caldav/v2/gneandr%40googlemail.com/events/
 * https://accounts.google.com/o/oauth2/token
 * https://apidata.googleusercontent.com/caldav/v2/" + username,
 * https://www.google.com/calendar/dav/{AccountLogin}/
 */
function rmFX_GCal_SPDYset(call, aStatus) {

	//	return;		//enable the return if SPDY handling Google/Mozilla works

	if ((call.url.search('www.google.com') > -1)
		|| (call.url.search('www.googleapis.com') > -1)
		|| (call.url.search('accounts.google.com') > -1)) {

		try {
			call.spdy = reminderfox._prefs.getBoolPref('network.http.spdy.enabled');
			var msg = " ** SPDY setting:" + call.spdy + "  status: " + aStatus
				+ "\n  call.url : " + call.url
			//			reminderfox.util.Logger('SPDY', msg)
			if (call.spdy == true) {
				reminderfox._prefs.setBoolPref('network.http.spdy.enabled', false);
				call.spdy = false
			}
		} catch(e) {}
	} else {
		return call.spdy
	}
}

function rmFX_GCal_SPDYreset(call, id) {
	var msg = " ** SPDY status:" + call.spdy + "  call.id: " + id

	if ((!call.spdy)&&(call.spdy == false)) {
		reminderfox._prefs.setBoolPref('network.http.spdy.enabled', true);
		var msg = " ** SPDY reset  call.id: " + id
	}
	//	reminderfox.util.Logger('SPDY', msg)
}