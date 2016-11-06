const DELAY_MS = 7200;
var profileUrl = null;

/**
 * @description
 * Transition from the LinkedIn home page to the profile page.
 *
 * @param browser
 * Nightmare reference intialized in "login" above (previous stage in 
 * "async" waterfall). At this point, we should be logged in to LinkedIn
 * and should be on the home page.
 *
 * @param asyncCallback
 * Callback function provided by "async"; invoke either when we want to
 * error out to the main callback OR when we want to move to the next
 * step in the async-waterfall.
 */
module.exports = function(browser, asyncCallback) {
	var navigateToProfile = function(next) {
		// If this module was not configured with any profileUrl, then
		// simply navigate to the profile page of the logged-in user.
		if (!profileUrl) {
			browser
				.click('#main-site-nav > ul > li:nth-child(2) > a')
				.then(() => next());
		}
		// Otherwise, navigate to the specified profileUrl.
		else {
			browser
				.goto(profileUrl)
				.then(() => next());
		}
	};

	browser
		// Wait for user to sign in and home page to finish loading.
		.wait(DELAY_MS)

		// Move to either current user's profile or specified profile url.
		// If navigation was successful, then move onto next step of async
		// waterfall. Otherwise, error out of async waterfall.
		.then(() => navigateToProfile(function() {
			browser
				.wait(DELAY_MS)
				.then(() => asyncCallback(null, browser), function() {
					browser
						.end()
						.then(function() {
							var errMsg = 'Unable to navigate to profile page.';
							asyncCallback(new Error(errMsg));
						});
				});
		}));
};

/**
 * @description
 * Configure this module to navigate to a specified profile URL after
 * logging in rather than to the logged-in/current user's profile.
 *
 * @param url
 * LinkedIn profile URL that we want to navigate to after logging in.
 */
module.exports.setProfileUrl = function(url) {
	profileUrl = url;
};