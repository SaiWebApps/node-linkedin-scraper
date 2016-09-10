var async = require('async');

module.exports = function(profileInfo, browser, asyncCallback) {
	const SELECTOR = '#endorsements *[class*="view-more"]';

	async.timesSeries(10, function(n, next) {
		browser
			.visible(SELECTOR)
			.then(function(isVisible) {
				// Exit to main callback if "View More" button
				// is no longer visible.
				if (!isVisible) {
					next(new Error('Done'));
				}

				// Otherwise, if it's still visible, then click
				// on it, wait 2 seconds, and then repeat this loop.
				browser
					.click(SELECTOR)
					.wait(7200)
					.then(function() {
						next(null);
					});
			});
	}, function(err) {
		// We have all recommendations, so move onto the next
		// stage in the waterfall: get-recommendations.
		asyncCallback(null, profileInfo, browser);
	});
};