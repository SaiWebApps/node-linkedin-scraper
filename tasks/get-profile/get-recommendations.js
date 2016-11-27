var async = require('async');

function getErrorHandler(profileInfo, browser, asyncCallback)
{
	return function(err) {
		profileInfo.recommendations = [];
		profileInfo.errors.push('Unable to access recommendations section.');
		asyncCallback(null, profileInfo, browser);
	};
}

function getRecommendationsTuple()
{
	var recsJsonStr = document.querySelector('body > pre').innerText;
	var recsJson = JSON.parse(recsJsonStr);

	var totalNumRecs;
	var recsData;

	try {
		var refsMpr = recsJson['content']['Endorsements']['refsMpr'];
		totalNumRecs = refsMpr['total'];
		recsData = refsMpr['results'];
	} catch(error) {
		totalNumRecs = 0;
		recsData = null;
	}

	return [totalNumRecs, recsData];
}

module.exports = function(profileInfo, browser, asyncCallback) {
	var errorHandler = getErrorHandler(profileInfo, browser, asyncCallback);
	var getUrl = (count) => ['https://www.linkedin.com/profile/',
		'my-profile-endorsements?id=', profileInfo['id'],
		'&count=', count].join('');

	browser
		.goto(getUrl(1))
		.wait('body > pre')
		.evaluate(getRecommendationsTuple)
		.then(function(tempRecsTuple) {
			browser
				.goto(getUrl(tempRecsTuple[0]))
				.wait('body > pre')
				.evaluate(getRecommendationsTuple)
				.then(function(recsTuple) {
					profileInfo.recommendations = recsTuple[1];
					asyncCallback(null, profileInfo, browser);
				}, errorHandler);
		}, errorHandler);
};