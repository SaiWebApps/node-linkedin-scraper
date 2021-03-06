module.exports = function(profileInfo, browser, asyncCallback) {
	browser
		.evaluate(function() {
			var courses = [];

			document
				.querySelectorAll('#courses-view > div > ul > li')
				.forEach(function(courseNode) {
					var courseDetails = courseNode.innerText.replace(
						'Click to edit course', '').trim();
					courses.push(courseDetails);
				}); 
			
			return courses;
		})
		.then(function(courseInfo) {
			profileInfo.courses = courseInfo;
			asyncCallback(null, profileInfo, browser);
		}, function(err) {
			profileInfo.courses = [];
			profileInfo.errors.push('Unable to access courses section.');
			asyncCallback(null, profileInfo, browser);
		});
};