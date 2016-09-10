var async = require('async');
var Nightmare = require('nightmare');

module.exports = function(credentialsFilePath, callback, callbackArgs) {
	var browser = new Nightmare();

	async.waterfall(
		[
			async.apply(require('./tasks/process-credentials'), 
				credentialsFilePath, browser),
			require('./tasks/login'),
			require('./tasks/go-to-profile-page'),
			require('./tasks/get-basic-profile-details'),
			require('./tasks/get-languages'),
			require('./tasks/get-education'),
			require('./tasks/get-courses'),
			require('./tasks/get-experience')
		],

		function(err, browserRef, profileInfo) {
			browser
				.end()
				.then(function() {
					if (err) {
						console.error(err);
						callback(null, callbackArgs);
						return;
					}
					callback(profileInfo, callbackArgs);
				});
		}
	);
};