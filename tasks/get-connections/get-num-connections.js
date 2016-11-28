module.exports = function(browser, asyncCallback) {
	const ERR_MSG = 'Unable to retrieve LinkedIn connections information.';
	
	browser
		.evaluate(function() {
			var NUM_CONNECTIONS_SELECTOR = ['#wrapper > div.top-bar',
				'> div.header > div.left-entity > div > h3'].join('');
			var connectionsHeaderElem = 
				document.querySelector(NUM_CONNECTIONS_SELECTOR);

			if (!connectionsHeaderElem) {
				return 0;
			}
			return connectionsHeaderElem.innerText.split(' ')[2];
		})
		.then(function(totalNumConnections) {
			connectionsInfo = {}
			connectionsInfo['numConnections'] = totalNumConnections;
			asyncCallback(null, connectionsInfo, browser);
		}, (err) => asyncCallback(null, {error: ERR_MSG}, browser));
};