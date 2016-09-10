module.exports = function(profileInfo, browser, asyncCallback) {
	browser
		.evaluate(function() {
			var viewMoreButton = document.querySelector('#endorsements')
				.querySelectorAll('*[class*="view-more"]');
			if (viewMoreButton) {
				viewMoreButton.click();
				viewMoreButton.click();
				viewMoreButton.click();
			}

			var recInfo = [];

			document.querySelectorAll('div.endorsements-received > ol > li')
				.forEach(function(node) {
					var position = 
						node.querySelector('li > hgroup > h3').innerText;
					var company = 
						node.querySelector('li > hgroup > h4').innerText;

					node.querySelectorAll('.endorsement-full')
						.forEach(function(eNode) {
							var getText = function(selector) {
								var target = eNode.querySelector(selector);
								if (!target) {
									return null;
								}
								return target.innerText;
							};

							recInfo.push({
								yourPosition: position,
								yourCompany: company,
								recommenderName: 
									getText('div > div.endorsement-info > h6'),
								recommenderPosition: 
									getText('div > div.endorsement-info > h6'),
								recommendation:
									getText('div > div.endorsement-info > p'),
								moreAboutRecommender:
									getText('div > div.endorsement-info > span')
							});
						});
				});

			return recInfo;
		})
		.then(function(recInfo) {
			profileInfo.recommendations = recInfo;
			asyncCallback(null, profileInfo, browser);
		}, function(err) {
			profileInfo.recommendations = [];
			var error = new Error('Unable to access recommendations section.');
			asyncCallback(error, profileInfo);
		});
};