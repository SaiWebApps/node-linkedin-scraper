var async = require('async');
var Nightmare = require('nightmare');

var processCredentials = require('./credentials-processor');

function login(credentials, asyncCallback)
{
	// Initialize browser.
	var browser = new Nightmare({show: true});

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
}

function goToProfilePage(browser, asyncCallback)
{
	browser
		.click('#main-site-nav > ul > li:nth-child(2) > a')
		.then(function() { asyncCallback(null, browser); });
}

function getFullName(browser, asyncCallback)
{
	browser
		.evaluate(function() {
			return document.querySelector('#name > h1 > span > span').innerHTML;
		})
		.end()
		.then(function(fullName) {
			asyncCallback(null, fullName)
		});
}

module.exports = function(credentialsFilePath) {
	async.waterfall([
		function(asyncCallback) {
			try {
				var credentials = processCredentials(credentialsFilePath, 
					['email', 'password']);
				asyncCallback(null, credentials);
			} catch(error) {
				asyncCallback(error);
			}
		},
		login,
		goToProfilePage,
		getFullName
	], function(err, fullName) {
		if (err) {
			console.log(err);
		}
		console.log(fullName);
	});
};