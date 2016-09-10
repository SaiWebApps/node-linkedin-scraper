module.exports = function(browser, profileInfo, asyncCallback) {
	browser
		.evaluate(function() {
			var output = [];

			// Add each education node's information as a JSON
			// object to output.
			var educationNodes = document.querySelectorAll(
				'#background-education > div.li-ig-educations');

			educationNodes.forEach(function(educationNode) {
				// Utility functions
				var get = (selector) => educationNode.querySelector(selector);
				var getText = function(selector) {
					var targetNode = get(selector);
					if (!targetNode) {
						return null;
					}
					return targetNode.innerText;
				};
				var getImgSrc = function(selector) {
					var targetNode = get(selector);
					if (!targetNode) {
						return null;
					}
					return targetNode.src;
				}
				var getAll = (selector) => 
					educationNode.querySelectorAll(selector);

				// Extract basic details about this education entry.
				var educationInfo = {
					title: getText('div > div > header > h4 > div > span'),
					degree: getText('div > div > header > h5 > span >' +
						' span.degree'),
					major: getText('div > div > header > h5 > span >' +
						' span.major'),
					grade: getText('div > div > header > h5 > span >' +
						' span:nth-child(3)'),
					startTime: getText('div > div > div.date-header-field.' +
						'field > span > time:nth-child(1)'),
					endTime: getText('div > div > div.date-header-field.' +
						'field > span > time:nth-child(2)'),
					description: getText('div > div > p > span'),
					imgUrl: getImgSrc('div > div > h5 > span > strong > img')
				};

				// Extract related projects and courses info for this 
				// education entry.
				educationInfo.associatedProjects = [];				
				getAll('div > div > dl > dd:nth-child(2) > ul > li > h6')
					.forEach(function(projectNode) {
						educationInfo.associatedProjects.push(
							projectNode.innerHTML);
					});

				educationInfo.associatedCourses = [];
				getAll('div > div > dl > dd:nth-child(4) > ul > li > h6')
					.forEach(function(courseNode) {
						educationInfo.associatedCourses.push(
							courseNode.innerHTML);
					});

				// Add JSON object with current education entry's 
				// details to output.
				output.push(educationInfo);
			});

			// Return a list of JSON objects, where each object is
			// essentially a LinkedIn education entry.
			return output;
		})
		.then(function(educationInfo) {
			profileInfo.education = educationInfo;
			asyncCallback(null, browser, profileInfo);
		}, function() {
			asyncCallback(new Error('Unable to access education section.'));
		});
};