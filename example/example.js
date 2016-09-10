require('../linkedin-scraper')(
	__dirname + '/config.json',
	function(profileInfo) {
		console.log(profileInfo);
	}
);