module.exports = function(browser, asyncCallback) {
	browser
		.evaluate(function() {
			var connectionsInfo = [];

			document.querySelectorAll('ul.contacts-list-view > li')
				.forEach(function(connectionNode) {
					// Utility functions
					var get = function(selector, property) {
						var target = connectionNode.querySelector(selector);
						if (!target || !(property in target)) {
							return null;
						}
						return target[property];
					};
					var getText = (selector) => get(selector, 'innerHTML');
					var getHRef = (selector) => get(selector, 'href');
					var getImgSrc = (selector) => get(selector, 'src');

					// Save this connection node's information to a JSON
					// object, and add said object to connectionsInfo array.
					connectionsInfo.push({
						'name': getText('li > div.body > h3 > a'),
						'headline': getText('li > div.body > p.headline'),
						'locality': getText('li > div.body > span.location'),
						'profileUrl': getHRef('li > div.body > h3 > a'),
						'imgUrl': getImgSrc('li > a.image > img.user_pic')
					});
				});

			return connectionsInfo;
		})
		.then(function(connectionsInfo) {
			asyncCallback(null, connectionsInfo, browser);
		}, function(err) {
			console.log(err);
			asyncCallback(null, {
				error: 'Unable to retrieve LinkedIn connections information.'
			}, browser);
		});
};