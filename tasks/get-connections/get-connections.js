var async = require('async');

/**
 * @param start
 * Contacts index to start at.
 *
 * @param end
 * Contacts index to end at.
 *
 * @return
 * LinkedIn Contacts API URL that will return all contacts between
 * indices "start" and "end" inclusive.
 */
function getUrl(start, end)
{
	const URL_PREFIX = 'https://www.linkedin.com/connected/api/v2/contacts?';
	var count = end-start;
	return [URL_PREFIX, 'start=', start, '&count=', count].join('');
}

module.exports = function(connectionsInfo, browser, asyncCallback) {
	const ERR_MSG = 'Unable to retrieve LinkedIn connections information.';
	const CHUNK_SIZE = 300;

	var numConnections = connectionsInfo['numConnections'];
	var start = 0;
	var end = CHUNK_SIZE;
	
	var connections = [];

	async.whilst(
		// Continue looping as long as start is less than numConnections.
		() => start < numConnections,
		
		// Loop body
		function(callback) {
			browser
				// Invoke LinkedIn Contacts API URL using start and end.
				.goto(getUrl(start, end))
				.wait('body > pre')

				// Extract the values field from the API's JSON results.
				.evaluate(function() {
					var bodyPre = document.querySelector('body > pre');
					var connJson = JSON.parse(bodyPre.innerText);
					return ('values' in connJson) ? connJson['values'] : [];
				})

				// Add the latest list of connections to the cumulative list.
				// Update start and end, and continue iterating.
				.then(function(connectionsList) {
					connections = connections.concat(connectionsList);
					
					start += CHUNK_SIZE+1;
					end += CHUNK_SIZE;
					if (end > numConnections) {
						end = numConnections;
					}

					// Move onto the next loop iteration.
					callback(null);
				});
		},

		// Once we're done iterating, add cumulative list of results to
		// connectionsInfo object, and move onto next stage of waterfall.
		function(err) {
			if (err) {
				asyncCallback(null, {error: ERR_MSG}, browser);
				return;
			}
			connectionsInfo['connections'] = connections;
			asyncCallback(null, connectionsInfo, browser);
		}
	);
};