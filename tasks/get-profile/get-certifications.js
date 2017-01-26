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

			// Add each certification node's information as a JSON
			// object to output.
			var certificationNodes = getAll(
				'#background-certifications > div.entity-container > ' +
					'div.entity > div.edit-action-area',
				'#background-certifications > div'
			);

			certificationNodes.forEach(function(certNode) {
				// Extract basic details about this certification entry.
				var certInfo = {
					title: getText(certNode,
						'div > hgroup > h4 > a',
						'div > header > h4 > div > span'),
					imgUrl: getImgSrc(certNode,
						'div > hgroup > h5.certification-logo > a ' +
							'> span > strong > img',
						'div > header > h5.section-logo > span > strong > img'),
					certAuthority: getText(certNode,
						'div > hgroup > h5 > span > strong > a',
						'div > header > h5.sub-header-field.field > span'),
					timePeriod: getText(certNode, 'div > div > span', 'div > span')
				};

				// Add JSON object with current certification entry's 
				// details to output.
				output.push(certInfo);
			});

			// Return a list of JSON objects, where each object is
			// essentially a LinkedIn education entry.
			return output;
		})
		.then(function(certInfo) {
			profileInfo.certifications = certInfo;
			asyncCallback(null, profileInfo, browser);
		}, function() {
			profileInfo.certifications = [];
			profileInfo.errors.push('Unable to access certifications section.');
			asyncCallback(null, profileInfo, browser);
		});
};