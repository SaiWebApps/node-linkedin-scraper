module.exports = function(browser, asyncCallback) {
	const CONN_TAB_SELECTOR = '#network-sub-nav > li:nth-child(1) > a';
	const ERROR = new Error('Unable to navigate to connections page.');

	browser
		// Click on "Connections" under the "My Network" nav item.
		.wait(CONN_TAB_SELECTOR)
		.click(CONN_TAB_SELECTOR)

		// Wait for the connections page to load.
		.wait('#wrapper > div.top-bar > div.header > div.left-entity')
		
		// Once the connections page has loaded, move onto the next
		// stage of the waterfall. Otherwise, error out of waterfall.
		.then(() => asyncCallback(null, browser), function() {
			browser
				.end()
				.then(() => asyncCallback(ERROR));
		});
};