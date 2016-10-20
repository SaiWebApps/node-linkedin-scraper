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
							// Utility functions
							var get = (selector) => eNode.querySelector(selector);
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

							const REC_TEXT_SELECTOR = 
								'div > div.endorsement-info > p';

							// Create a JSON object with info about the
							// recommender, recommendation itself, and
							// the (position, company) that it was for.
							var entry = {
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
									getText(REC_TEXT_SELECTOR),
								moreAboutRecommender:
									getText('div > div.endorsement-info > span')
							};

							// Some recommendations have been abbreviated.
							// Click on the "Show More" button to expand them
							// to their full description.
							var showMoreButton = get(REC_TEXT_SELECTOR + 
								' > a.toggle-show-more');
							if (showMoreButton) {
								showMoreButton.click();
								entry.recommendation = getText(REC_TEXT_SELECTOR);
							}

							// Add recommendation entry to cumulative list.
							recInfo.push(entry);
						});
				});

			return recInfo;
		})
		.then(function(recInfo) {
			profileInfo.recommendations = recInfo;
			asyncCallback(null, profileInfo, browser);
		}, function(err) {
			profileInfo.recommendations = [];
			profileInfo.errors.push('Unable to access recommendations section.');
			asyncCallback(null, profileInfo, browser);
		});
};