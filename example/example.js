// Constants
const PORT = process.env.PORT || 5000;
const CREDENTIALS_CONFIG_FILE = __dirname + '/config.json';

// Global Variables
var app = require('express')();
var profile = {};

require('../linkedin-scraper')(
	CREDENTIALS_CONFIG_FILE, 
	
	function(profileInfo) { 
		profile = profileInfo;
				
		// Start this server only after we get back information
		// from the LinkedIn scraper.
		app.listen(PORT, function() {
			console.log('"node-linkedin-scraper-example"',
				"is running on port", PORT);
		});
	}
);

app.get('/', function(request, response) {
	response.json(profile);
});