module.exports = function(browser, profileInfo, asyncCallback) {
	browser
		.evaluate(function() {
			var courses = [];

			document
				.querySelectorAll('#courses-view > div > ul > li > span')
				.forEach(function(courseNode) {
					courses.push(courseNode.innerText);
				});
			
			return courses;
		})
		.then(function(courseInfo) {
			profileInfo.courses = courseInfo;
			asyncCallback(null, browser, profileInfo);
		}, function(err) {
			asyncCallback(new Error('Unable to access courses section.'));
		});
};