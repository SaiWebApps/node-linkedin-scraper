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
	browser
		.click('#main-site-nav > ul > li:nth-child(2) > a')
		.then(function() { 
			asyncCallback(null, browser); 
		}, function() {
			asyncCallback(new Error('Unable to navigate to profile page.'));
		});
}