module.exports = function(profileInfo, browser, asyncCallback) {
	browser
		.evaluate(function() {
			var output = [];

			// Add each professional-experience node's information 
			// as a JSON object to output.
			var experienceNodes = document.querySelectorAll(
				'#background-experience > div.entity-container > div.entity' +
				' > div.edit-action-area');

			experienceNodes.forEach(function(experienceNode) {
				// Utility functions
				var get = (selector) => experienceNode.querySelector(selector);
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
					experienceNode.querySelectorAll(selector);

				// Extract basic details about this experience entry.
				var experienceInfo = {
					title: getText('div > header > h4 > div > span'),
					company: getText('div > header > h5.field > span'),
					timePeriod: getText('div > div > span > time'),
					location: getText('div > div > span > span > span'),
					description: getText('div > p > span'),
					imgUrl: getImgSrc('div > header > h5.section-logo >' +
						' span > strong > img')
				};

				// Extract names of projects associated with this experience.
				experienceInfo.associatedProjects = [];
				getAll('div > dl > dd > ul > li > h6').forEach(function(node) {
					experienceInfo.associatedProjects.push(node.innerText);
				});

				// Add JSON object with current experience entry's 
				// details to output.
				output.push(experienceInfo);
			});

			// Return a list of JSON objects, where each object is
			// essentially a LinkedIn professional experience entry.
			return output;
		})
		.then(function(experienceInfo) {
			profileInfo.experience = experienceInfo;
			asyncCallback(null, profileInfo, browser);
		}, function() {
			profileInfo.experience = [];
			profileInfo.errors.push('Unable to access work experience section.');
			asyncCallback(null, profileInfo);
		});
};