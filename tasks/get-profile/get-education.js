module.exports = function(profileInfo, browser, asyncCallback) {
	browser
		.evaluate(function() {
			var output = [];

			// Add each education node's information as a JSON
			// object to output.
			var educationNodes = document.querySelectorAll([
				'#background-education > div.entity-container >',
				'div.entity > div.edit-action-area'
			].join(' '));
			if (educationNodes.length === 0) {
				educationNodes = document.querySelectorAll(
					'#background-education > div > div > div');
			}

			educationNodes.forEach(function(educationNode) {
				// Utility functions
				var get = function(selector, altSelector) {
					return educationNode.querySelector(selector) ||
						educationNode.querySelector(altSelector);
				};
				
				var getText = function(selector, altSelector) {
					var targetNode = get(selector, altSelector);
					if (!targetNode) {
						return null;
					}
					return targetNode.innerText;
				};
				
				var getImgSrc = function(selector, altSelector) {
					var targetNode = get(selector, altSelector);
					if (!targetNode) {
						return null;
					}
					return targetNode.src;
				};
				
				// For the first selector with matches, return the
				// corresponding list of nodes.
				var getAll = function(selector) {
					var target = educationNode.querySelectorAll(selector);
					if (arguments.length === 1 || target.length > 0) {
						return target;
					}

					for (var i = 1; i < arguments.length; i++) {
						var arg = arguments[i];
						target = educationNode.querySelectorAll(arg);
						
						// We're done if target has items because we
						// found matches for this selector, arg.
						if (arg && target && target.length > 0) {
							break;
						}
					}
					return target;
				};

				var clean = function(str) {
					if (!str) {
						return str;
					}
					return str.trim().replace(/(^[\W])|(,$)/g, '').trim();
				};

				// Extract basic details about this education entry.
				var educationInfo = {
					title: getText('div > header > h4 > div > span',
						'div > header > h4 > a'),
					degree: clean(getText('div > header > h5 > span >' +
						' span.degree', 'div > header > h5 > span.degree')),
					major: clean(getText('div > header > h5 > span >' +
						' span.major', 'div > header > h5 > span.major > a')),
					grade: getText('div > header > h5 > span >' +
						' span:nth-child(3)', 'div > header > h5 > span.grade'),
					startTime: getText('div > div.date-header-field.' +
						'field > span > time:nth-child(1)', 
						'div > span > time:nth-child(1)'),
					endTime: clean(getText('div > div.date-header-field.' +
						'field > span > time:nth-child(2)',
						'div > span > time:nth-child(2)')),
					description: getText('div > p > span', 'div > p'),
					imgUrl: getImgSrc('div > div > h5 > span > strong > img',
						'div > a > h5 > span > strong > img')
				};

				// Extract related projects and courses info for this 
				// education entry.
				educationInfo.associatedProjects = [];				
				getAll('div > dl > dd:nth-child(2) > ul > li > h6')
					.forEach(function(projectNode) {
						educationInfo.associatedProjects.push(
							projectNode.innerText);
					});

				const PREFIX = 'div > dl > dd:nth-child(';
				const SUFFIX = ') > ul > li';
				const OPTIONAL_SUFFIX = ' > h6';

				var courseNodes = getAll(PREFIX + 6 + SUFFIX,
					PREFIX + 6 + SUFFIX + OPTIONAL_SUFFIX);
				var awardNodes = getAll(PREFIX + 4 + SUFFIX);
				if (courseNodes.length === 0) {
					courseNodes = getAll(PREFIX + 4 + SUFFIX,
						PREFIX + 4 + SUFFIX + OPTIONAL_SUFFIX,
						'div > dl > dd > ul > li');
					awardNodes = [];
				}

				educationInfo.associatedCourses = [];
				courseNodes.forEach(function(courseNode) {
					educationInfo.associatedCourses.push(courseNode.innerText);
				});

				educationInfo.associatedAwards = [];
				awardNodes.forEach(function(awardNode) {
					educationInfo.associatedAwards.push(awardNode.innerText);
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