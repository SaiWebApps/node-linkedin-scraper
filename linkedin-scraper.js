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
			require('./tasks/get-experience'),
			require('./tasks/get-projects'),
			require('./tasks/get-certifications'),
			require('./tasks/get-skills'),
			require('./tasks/get-recommendations')
		],

		function(err, profileInfo, browserRef) {
			browser
				.end()
				.then(function() {
					if (!profileInfo) {
						profileInfo = {};
					}
					if (err) {
						console.error(err);
					}
					callback(profileInfo, callbackArgs);
				});
		}
	);
};