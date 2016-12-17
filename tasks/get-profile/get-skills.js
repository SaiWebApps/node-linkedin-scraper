module.exports = function(profileInfo, browser, asyncCallback) {
	browser
		.evaluate(function() {
			var output = [];

			// Add each skill node's information as a JSON
			// object to output.
			var skillsNodes = document.querySelectorAll('li.endorse-item');

			skillsNodes.forEach(function(skillsNode) {
				// Utility functions
				var getText = function(selector, altSelector) {
					var target = skillsNode.querySelector(selector);
					var altTarget = skillsNode.querySelector(altSelector);
					
					if (!target && !altTarget) {
						return null;
					}
					return (target || altTarget).innerText;
				};
				var toInt = function(str) {
					if (!str) {
						return 0;
					}
					return parseInt(str);
				};

				// Extract information about this skill, save to JSON object,
				// and add that object to output.
				var name = getText('span > span.endorse-item-name > span',
					'span > span.endorse-item-name > a');
				var numEndorsements = getText('span > span.endorse-count > span',
					'span > a.endorse-count > span');

				if (name === null && numEndorsements === null) {
					return;
				}
				output.push({
					name: getText('span > span.endorse-item-name > span',
						'span > span.endorse-item-name > a'),
					numEndorsements: toInt(getText(
						'span > span.endorse-count > span',
						'span > a.endorse-count > span'))
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