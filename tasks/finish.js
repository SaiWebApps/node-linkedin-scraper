module.exports = function(profileInfo, browser, asyncCallback) {
	browser
		.end()
		.then(function() {
			asyncCallback(null, profileInfo);
		});
};