/**
 * @description
 * Login into LinkedIn using the specified credentials.
 *
 * @param credentials
 * JSON object with LinkedIn credentials, consists of email and password
 * 
 * @param asyncCallback
 * Callback function provided by "async"; invoke either when we want to
 * error out to the main callback OR when we want to move to the next
 * step in the async-waterfall.
 */
module.exports = function(credentials, browser, asyncCallback) {
	browser
		// Fill in LinkedIn login form.
		.goto('https://linkedin.com/uas/login')
		.insert('input[name="session_key"]', '')
		.type('input[name="session_key"]', credentials.email)
		.insert('input[name="session_password"]', '')
		.type('input[name="session_password"]', credentials.password)
		
		// Submit login form.
		.click('input[type="submit"]')

		// Wait for home page to load; if the home page loads successfully,
		// then we will be able to find the navbar.
		.wait('#main-site-nav')
		.then(
			// If login succeeds, then invoke callback so that we can
			// move to the next function in the waterfall.
			function onLoginSuccess() {
				asyncCallback(null, browser);
			},

			// Otherwise, error out to main callback.
			function onLoginFailure() {
				asyncCallback(new Error('Invalid LinkedIn credentials.'));
			}
		);
};