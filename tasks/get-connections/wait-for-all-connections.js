var async = require('async');

module.exports = function(browser, asyncCallback) {
	browser
		.evaluate(function() {
			var numConnectionsStr = document.querySelector(
				'#wrapper > div.top-bar > div.header > ' +
				'div.left-entity > div > h3'
			).innerText;
			return parseInt(numConnectionsStr.split(' ')[2]);
		})
		.then(function(totalNumConnections) {
			var pageHeight = 0;
			var currentNumConnections = 0;
			var check = () => currentNumConnections - totalNumConnections >= -1;

			async.until(
				// While this function returns false
				// (a.k.a, current # connections on page is NOT equal to 
				// the total number of connections)
				function() {
					browser
						.evaluate(function(height) {
							return {
								numConnections: document.querySelectorAll(
									'ul.contacts-list-view > li').length,
								height: document.body.scrollHeight
							};
						})
						.then(function(results) {
							pageHeight = results.height;
							currentNumConnections = results.numConnections;
							return check();
						});
				}, 

				// Scroll down, and load more connections.
				// But when current # connections equals total # connections,
				// exit loop, and error out to second callback below.
				function(callback) {
					if (check()) {
						callback(new Error('Done'));
						return;
					}
					browser
						.scrollTo(pageHeight, 0)
						.then(function() { 
							callback() 
						});
				}, 

				// After we finish loading all connections, move onto
				// next stage of overarching async waterfall.
				function(err) {
					browser
						.wait(3600)
						.then(function() { 
							asyncCallback(null, browser); 
						});
				}
			);
		});
};