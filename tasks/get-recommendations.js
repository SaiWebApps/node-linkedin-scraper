module.exports = function(profileInfo, browser, asyncCallback) {
	browser
		.evaluate(function() {
			var recInfo = [];

			// The recommendations section divides recommendations up by
			// (position, company) from your work experience.
			// Iterate through the recommendations within each of these
			// sections.
			document.querySelectorAll('div.endorsements-received > ol > li')
				.forEach(function(node) {
					// Your position/work-experience that brought you in
					// touch with the recommender.
					var position =
						node.querySelector('li > h3').innerText;
					// The company that position was in.
					var company =
						node.querySelector('li > h4').innerText;

					// For a particular (position, company), get 
					// all recommendations.
					node.querySelectorAll('.endorsement-full')
						.forEach(function(eNode) {
							// Utility function
							var getText = function(selector) {
								var target = eNode.querySelector(selector);
								if (!target) {
									return null;
								}
								return target.innerText;
							};
							var getHRef = function(selector) {
								var target = eNode.querySelector(selector);
								if (!target) {
									return null;
								}
								return target.href;
							}

							// Create a JSON object with info about the
							// recommender, recommendation itself, and
							// the (position, company) that it was for.
							recInfo.push({
								yourPosition: position,
								yourCompany: company,
								recommenderName: 
									getText('div > div.endorsement-info > h5' +
										' > span > strong > a'),
								recommenderPosition: 
									getText('div > div.endorsement-info > h6'),
								recommenderProfileUrl:
									getHRef('div > div.endorsement-info > h5' +
										' > span > strong > a'),
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