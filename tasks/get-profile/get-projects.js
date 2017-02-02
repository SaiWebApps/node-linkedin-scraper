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
			var getHRef = function() {
				var targetNode = get.apply(this, arguments);
				return (targetNode) ? targetNode.href : null;
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

			// Add each project node's information as a JSON object to output.
			var projectNodes = getAll(
				[
					'#background-projects > div.entity-container',
					'> div.entity > div.edit-action-area'
				].join(' '),
				'#background-projects > div > div'
			);

			projectNodes.forEach(function(projectNode) {
				// Extract basic details about this project entry.
				var projectInfo = {
					title: getText(projectNode, 
						'div > header > h4 > div > span',
						'div > hgroup > h4 > span'),
					description: getText(projectNode, 
						'div > p > span',
						'div > p.description'),
					timePeriod: getText(projectNode, 
						'div > div > span',
						'div > p')
				};

				// Extract team members who worked on this project.
				projectInfo.teamMembers = [];
				var teamMembersNodes = getAll(projectNode, 
					'div > dl > dd > ul > li');
				teamMembersNodes.forEach(function(teamMemberNode) {
					projectInfo.teamMembers.push({
						name: getText(teamMemberNode, 
							'div > dl > dd > ul > li > h5 > span > strong > a',
							'div > dl > dd > ul > li > h5',
							'div > dl > dd > ul > li > hgroup > h5 > span > strong > a',
							'div > dl > dd > ul > li > hgroup > h5'),
						profileLink: getHRef(teamMemberNode,
							'div > dl > dd > ul > li > h5 > span > strong > a',
							'div > dl > dd > ul > li > hgroup > h5 > span > strong > a'),
						headline: getText(teamMemberNode,
							'div > dl > dd > ul > li > h6',
							'div > dl > dd > ul > li > hgroup > h6')
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