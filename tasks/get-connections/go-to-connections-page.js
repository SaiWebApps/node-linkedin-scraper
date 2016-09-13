module.exports = function(browser, asyncCallback) {
	browser
		// Wait to land on home page after logging in (previous stage).
		.wait(7200)
		// Click on "Connections" under the "My Network" nav item.
		.click('#network-sub-nav > li:nth-child(1) > a')
		// Wait for "Connections" page to load.
		.wait(7200)
		.then(function() { 
			asyncCallback(null, browser); 
		}, function() {
			browser
				.end()
				.then(function() {
					var errMsg = 'Unable to navigate to connections page.';
					asyncCallback(new Error(errMsg));
				});
		});	
};