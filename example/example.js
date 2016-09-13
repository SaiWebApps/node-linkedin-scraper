// Constants
const PORT = process.env.PORT || 5000;
const CREDENTIALS_CONFIG_FILE = __dirname + '/config.json';

// Global Variables
var app = require('express')();
var profile = {};
var connections = {};

// Request node-linkedin-scraper to extract information
// about a target LinkedIn profile.
var linkedinScraper = require('../index');
linkedinScraper.getAll(CREDENTIALS_CONFIG_FILE, 
	function(profileInfo, connectionsInfo) {
		profile = profileInfo;
		connections = connectionsInfo;
		// Start the server only after we've received all our information.
		app.listen(PORT, function() {
			console.log('node-linkedin-scraper-example is',
				'running on port', PORT);
		});
	}
);

// URL Routing
app.get('/', function(request, response) {
	response.json(profile);
});

app.get('/get-connections', function(request, response) {
	response.json(connections);
});