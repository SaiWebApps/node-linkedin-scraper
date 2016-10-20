module.exports = function(profileInfo, browser, asyncCallback) {
	browser
		.evaluate(function() {
			var output = [];

			// Add each education node's information as a JSON
			// object to output.
			var educationNodes = document.querySelectorAll(
				'#background-education > div.entity-container > div.entity ' +
				' > div.edit-action-area');

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
					title: getText('div > header > h4 > div > span'),
					degree: getText('div > header > h5 > span >' +
						' span.degree'),
					major: getText('div > header > h5 > span >' +
						' span.major'),
					grade: getText('div > header > h5 > span >' +
						' span:nth-child(3)'),
					startTime: getText('div > div.date-header-field.' +
						'field > span > time:nth-child(1)'),
					endTime: getText('div > div.date-header-field.' +
						'field > span > time:nth-child(2)'),
					description: getText('div > p > span'),
					imgUrl: getImgSrc('div > div > h5 > span > strong > img')
				};

				// Extract related projects and courses info for this 
				// education entry.
				educationInfo.associatedProjects = [];				
				getAll('div > dl > dd:nth-child(2) > ul > li > h6')
					.forEach(function(projectNode) {
						educationInfo.associatedProjects.push(
							projectNode.innerHTML);
					});

				educationInfo.associatedCourses = [];
				getAll('div > dl > dd:nth-child(4) > ul > li > h6')
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
			asyncCallback(null, profileInfo, browser);
		}, function() {
			profileInfo.education = [];
			profileInfo.errors.push('Unable to access education section.');
			asyncCallback(null, profileInfo, browser);
		});
};