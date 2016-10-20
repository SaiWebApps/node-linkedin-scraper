module.exports = function(profileInfo, browser, asyncCallback) {
	browser
		.evaluate(function() {
			var output = [];

			// Add each skill node's information as a JSON
			// object to output.
			var skillsNodes = document.querySelectorAll('li.endorse-item');

			skillsNodes.forEach(function(skillsNode) {
				// Utility functions
				var get = (selector) => skillsNode.querySelector(selector);
				var getText = function(selector) {
					var targetNode = get(selector);
					if (targetNode === null || targetNode === undefined) {
						return null;
					}
					return targetNode.innerHTML;
				};

				// Extract information about this skill, save to JSON object,
				// and add that object to output.
				const NAME_SELECTOR = 'span > span.endorse-item-name > span';
				const ENDORSEMENT_COUNT_SELECTOR = 'span > span.endorse-count > span';
				var prefix = get('li > ' + NAME_SELECTOR) ? 'li > ': 'li > div > ';

				output.push({
					name: getText(NAME_SELECTOR),
					numEndorsements: getText(ENDORSEMENT_COUNT_SELECTOR)
				});
			});

			// Return a list of JSON objects, where each object is
			// essentially a LinkedIn profile page skill entry.
			return output;
		})
		.then(function(skillsInfo) {
			profileInfo.skills = skillsInfo;
			asyncCallback(null, profileInfo, browser);
		}, function() {
			profileInfo.skills = [];
			profileInfo.errors.push('Unable to access skill section.');
			asyncCallback(null, profileInfo, browser);
		});
};