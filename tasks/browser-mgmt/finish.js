module.exports = function(results, browser, asyncCallback) {
	browser
		.end()
		.then(function() {
			asyncCallback(null, results);
		});
};