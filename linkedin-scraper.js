var async = require('async');

module.exports = function(credentials, callback, callbackArgs) {
	async.waterfall(
		[
			async.apply(require('./tasks/setup'), credentials),
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
			require('./tasks/wait-for-all-recommendations'),
			require('./tasks/get-recommendations'),
			
			require('./tasks/finish')
		],

		function(err, profileInfo) {
			if (err && !profileInfo) {
				profileInfo = { errors: [err.message] };
			}
			callback(profileInfo, callbackArgs);
		}
	);
};