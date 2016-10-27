var Nightmare = require('nightmare');
var processCredentials = require('../../utils/linkedin-credentials-processor');

module.exports = function(credentials, asyncCallback) {
	var browser;
	
	try {
		browser = new Nightmare();
		asyncCallback(null, processCredentials(credentials), browser);
	} catch(error) {
		if (!browser) {
			asyncCallback(error);
			return;
		}

		// If we finished initializing the browser before hitting the
		// error, then close it before invoking the callback w/ the error.
		browser
			.end()
			.then(function() {
				asyncCallback(error);
			});
	}
};