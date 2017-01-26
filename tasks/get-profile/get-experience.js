module.exports = function(profileInfo, browser, asyncCallback) {
	browser
		.evaluate(function() {
			var output = [];

			// Utility functions
			var get = function() {
				var querySelector = (sel) => document.querySelector(sel);
				var startIdx = 0;
				if (typeof(arguments[0]) === 'object') {
					querySelector = (sel) => arguments[0].querySelector(sel);
					startIdx = 1;
				}

				for (var i = startIdx; i < arguments.length; i++) {
					var query = arguments[i];
					var targetNode = querySelector(query);
					if (targetNode) {
						return targetNode;
					}
				}
				return null;
			};
			var getText = function() {
				var targetNode = get.apply(this, arguments);
				return (targetNode) ? targetNode.innerText : null;
			};
			var getImgSrc = function() {
				var targetNode = get.apply(this, arguments);
				return (targetNode) ? targetNode.src : null;
			};
			var getAll = function() {
				var querySelectorAll = (sel) => document.querySelectorAll(sel);
				var startIdx = 0;
				if (typeof(arguments[0]) === 'object') {
					querySelectorAll = (sel) => arguments[0].querySelectorAll(sel);
					startIdx = 1;
				}

				for (var i = startIdx; i < arguments.length; i++) {
					var query = arguments[i];
					var targetNode = querySelectorAll(query);
					if (targetNode && targetNode.length > 0) {
						return targetNode;
					}
				}
				return [];
			};

			// Add each professional-experience node's information 
			// as a JSON object to output.
			const MY_PROFILE_SELECTOR = [
				'#background-experience > div.entity-container',
				'div.entity > div.edit-action-area'
			].join('>');
			var experienceNodes = getAll(MY_PROFILE_SELECTOR,
				'#background-experience > div > div');

			experienceNodes.forEach(function(experienceNode) {
				// Extract basic details about this experience entry.
				var experienceInfo = {
					title: getText(experienceNode, 
						'div > header > h4 > div > span',
						'div > header > h4 > a'),
					company: getText(experienceNode,
						'div > header > h5.field > span',
						'div > header > h5 > span',
						'div > header > h5 > a'),
					timePeriod: getText(experienceNode,
						'div > div > span'),
					location: getText(experienceNode,
						'div > div > span > span > span',
						'div > div > span > span'),
					description: getText(experienceNode, 
						'div > p > span', 
						'div > p'),
					imgUrl: getImgSrc(experienceNode,
						'div > header > h5.section-logo > span > strong > img',
						'div > header > h5.experience-logo > a > span > strong > img')
				};
				// If we successfully extracted a timeStr, then currently,
				// it includes time AND locale info, which are separated by
				// ) at end of the time info.
				var timeStr = experienceInfo.timePeriod;
				if (timeStr) {
					timeStr = timeStr.split(')')[0] + ')';
					experienceInfo.timePeriod = timeStr;
				}

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
			asyncCallback(null, profileInfo, browser);
		});
};