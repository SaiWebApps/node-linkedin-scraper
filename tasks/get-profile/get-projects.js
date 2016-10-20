module.exports = function(profileInfo, browser, asyncCallback) {
	browser
		.evaluate(function() {
			var output = [];

			// Add each project node's information as a JSON object to output.
			var projectNodes = document.querySelectorAll(
				'#background-projects > div.entity-container > div.entity' +
				' > div.edit-action-area');

			projectNodes.forEach(function(projectNode) {
				// Utility functions
				var get = (selector) => projectNode.querySelector(selector);
				var getText = function(selector) {
					var targetNode = get(selector);
					if (!targetNode) {
						return null;
					}
					return targetNode.innerText;
				};
				var getHRef = function(selector) {
					var targetNode = get(selector);
					if (!targetNode) {
						return null;
					}
					return targetNode.href;
				}
				var getAll = (selector) => 
					projectNode.querySelectorAll(selector);

				// Extract basic details about this project entry.
				var projectInfo = {
					title: getText('div > header > h4 > div > span'),
					description: getText('div > p'),
					timePeriod: getText('div > div > span')
				};

				// Extract team members who worked on this project.
				projectInfo.teamMembers = [];
				getAll('div > dl > dd > ul > li').forEach(function(node) {
					projectInfo.teamMembers.push({
						name: getText('div > dl > dd > ul > li' +
							' > h5 > span > strong > a'),
						profileLink: getHRef('div > dl > dd > ul > li' +
							' > h5 > span > strong > a'),
						headline: getText('div > dl > dd > ul > li > h6')
					});
				});

				// Add JSON object with current project entry's 
				// details to output.
				output.push(projectInfo);
			});

			// Return a list of JSON objects, where each object is
			// essentially a LinkedIn profile page project entry.
			return output;
		})
		.then(function(projectInfo) {
			profileInfo.projects = projectInfo;
			asyncCallback(null, profileInfo, browser);
		}, function() {
			profileInfo.projects = [];
			profileInfo.errors.push('Unable to access projects section.');
			asyncCallback(null, profileInfo, browser);
		});
};