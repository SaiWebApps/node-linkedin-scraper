function getErrorHandler(browser, asyncCallback)
{
	const ERR_MSG = 'Unable to retrieve LinkedIn connections information.';
	return (err) => asyncCallback(null, {error: ERR_MSG}, browser);
}

module.exports = function(browser, asyncCallback) {
	var errorHandler = getErrorHandler(browser, asyncCallback);

	browser
		// Retrieve the total number of connections.
		.evaluate(function() {
			const SELECTOR = ['#wrapper > div.top-bar > div.header',
				'> div.left-entity'].join(' ');
			var connectionsHeaderElem = document.querySelector(SELECTOR);

			if (!connectionsHeaderElem) {
				return 0;
			}
			return connectionsHeaderElem.innerText.split(' ')[2];
		})
		
		// Request connections info from LinkedIn Contacts API.
		.then(function(numConnections) {
			const URL_PREFIX = ['https://www.linkedin.com/connected/api/v2',
				'/contacts?start=0&count='].join('');
			const URL_SUFFIX = ['&fields=id%2Cname%2CfirstName%2ClastName',
				'%2Ccompany%2Ctitle%2Clocation%2Ctags%2Cemails%2Csources',
				'%2CdisplaySources%2CconnectionDate%2CsecureProfileImageUrl',
				'&sort=CREATED_DESC&_=1479676617428'].join('');
			var url = [URL_PREFIX, numConnections, URL_SUFFIX].join('');

			browser
				.goto(url)
				.wait('body > pre')
				.evaluate(function() {
					const SELECTOR = 'body > pre';
					var connJsonStr = document.querySelector(SELECTOR).innerText;
					var connJson = JSON.parse(connJsonStr);
					return ('values' in connJson) ? connJson['values'] : {};
				})
				.then(function(connectionsInfo) {
					asyncCallback(null, connectionsInfo, browser);
				}, errorHandler);
		}, errorHandler);
};