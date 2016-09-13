module.exports = function(profileInfo, browser, asyncCallback) {
	browser
		.evaluate(function() {
			var output = [];

			// Add each certification node's information as a JSON
			// object to output.
			var certificationNodes = document.querySelectorAll(
				'#background-certifications > div.entity-container' +
				' > div.entity > div.edit-action-area');

			certificationNodes.forEach(function(certNode) {
				// Utility functions
				var get = (selector) => certNode.querySelector(selector);
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
				var getAll = (selector) => certNode.querySelectorAll(selector);

				// Extract basic details about this certification entry.
				var certInfo = {
					title: getText('div > header > h4 > div > span'),
					imgUrl: getImgSrc('div > header > h5.section-logo >' +
						' span > strong > img'),
					certAuthority: getText('div > header > h5.' + 
						'sub-header-field.field > span'),
					timePeriod: getText('div > div > span')
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
			asyncCallback(null, profileInfo);
		});
};