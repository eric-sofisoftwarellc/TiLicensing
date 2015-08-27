// This is a test harness for the Google Play Licensing module from Sofi Software LLC.
// It demonstrates how to check for a valid Google Play license.

// ------------------------------------------------------

// This is not license related code; it is simply to create something to look at.

// open a single window
var win = Ti.UI.createWindow({
	backgroundColor:'white'
});
var label = Ti.UI.createLabel();
win.add(label);
win.open();

// ------------------------------------------------------

// The following code is for license checking. You may copy all of this into your application.

// ------------------------------------------------------

// This first section is configuration options.  You must customize it for your application.

// To use this module, you must:
// - Add custom permissions to tiapp.xml. See instructions.
// - Customize the following:

// 1. Google play key. To set this up:
//		Register a Google publisher account: http://play.google.com/apps/publish
//		Obtain a public key for licensing, see http://developer.android.com/google/play/licensing/setting-up.html. 
//		Copy the key and paste it in this string.
var myMarketPublicKey = "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAhHUi+LcptgUToO+Mi7cIx+V+GKl55WNMSqIxlFWUCbZWvCnD0nJbuOXz5WK+wtbIbHZgwhSMHPpFNJhzCP8r9qnR7ttc7Fl0T1KzFOWLd5HEsqr2b5hQsGGv38sgHq6KkuseeIwDK63gGe1YyowXw2A5aNEdumLO8lIdWzmIGcrDXVzRmRtFXRfTX5tLF33UfegfAJ/4haBfaVeDcO74QgKRFL3Qu1K3CYLZ+BqwALAf60GDJF4YzztesiHddkJHlFHGM8Kxl8M4U3DgfFzVYKVlH6EwGIYQkc6Nm3nhXLytWP2hSDakhtbpUobaccnV4wpTArCX95ZFEaj5IP66OwIDAQAB";

// 2. Salt. 
//		This is a 40 digit hex (20 byte) value that must be unique to your application. You should generate it randomly.
//		The sample value below is NOT random.
var mySalt = "3031323334353637383930313233343536373839";

// 3. Finally, configure test account in Google Play publisher site, so you can test various responses

// ------------------------------------------------------

// This next section demonstrates how to invoke the license checker.

// First, create an instance of the licensing module.
var licensor = require('com.sofisoftwarellc.licensing');
Ti.API.info("module is => " + licensor);

// Initialize the license checker.
licensor.initialize({
	key: myMarketPublicKey,
	salt: mySalt
});

// This function is called when license checking completes.
var licenseCheckerCallback = function(e) {
	Ti.API.info("licenseCheckerEvent " + JSON.stringify(e));

	if (e.response == "allow") {
		// e.reason should be licensor.LICENSED, the server returned back a valid license response
		Ti.UI.createAlertDialog({ message: 'Application is licensed' }).show();
	} else if (e.response == "dontAllow") {
		var reason = e.reason;
		if (e.reason == licensor.NOT_LICENSED) {
			// NOT_LICENSED means that the server returned back a valid license response
			// that indicated that the user definitively is not licensed.
			// You should put up a dialog, possibly with a market link to allow purchase.
			Ti.UI.createAlertDialog({ message: 'Application is not licensed' }).show();
		} else if (e.reason == licensor.RETRY) {
			// RETRY means that the license response was unable to be determined ---
			// perhaps as a result of faulty networking.
			// It is your option how to handle this. You could permit the app to continue, or if you have stricter requirements, 
			// you could require a retry.
			Ti.UI.createAlertDialog({ message: 'License could not be determined' }).show();
		}
	} else if (e.response == "error") {
		// An internal error. Check the public key carefully.
		Ti.API.error("licenseCheckerEvent error=" + e.reason);
		Ti.UI.createAlertDialog({ message: 'Licensing internal error' }).show();
	}
};

// Listen for a callback from the license checker
licensor.addEventListener("licenseCheckerEvent", licenseCheckerCallback);

// Start the license check. When it completes, it will call the callback.
licensor.doLicenseCheck();

