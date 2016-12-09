// Constants
const PORT = process.env.PORT || 5000;
const CREDENTIALS_CONFIG_FILE = __dirname + '/config.json';

// Global Variables
var app = require('express')();
var linkedinScraper = require('../index');

// Express App Config
app.set('view engine', 'ejs');

// URL Routing
app.get('/', function(request, response) {
	linkedinScraper.me(
		CREDENTIALS_CONFIG_FILE, 
		function(profileInfo, connectionsInfo) {
			response.render('index', {
				'profile': profileInfo,
				'connections': connectionsInfo,
				'showProfile': true,
				'showConnections': true,
				'title': profileInfo.fullName + ' @ LinkedIn'
			});
		}
	);
});

app.get('/connections', function(request, response) {
	linkedinScraper.me.connections(
		CREDENTIALS_CONFIG_FILE,
		function(connectionsInfo) {
			response.render('index', {
				'connections': myConnections,
				'showProfile': false,
				'showConnections': true,
				'title': myProfile.fullName + ' @ LinkedIn - Connections'
			});
		}
	);
});

app.get('/profile', function(request, response) {
	var processProfileInfo = function(profileInfo) {
		const TITLE_SUFFIX = ' @ LinkedIn - Profile';
		response.render('index', {
			'profile': profileInfo,
			'showProfile': true,
			'showConnections': false,
			'title': profileInfo.fullName + TITLE_SUFFIX
		});
	};

	if (!('profileUrl' in request.query)) {
		linkedinScraper.me.profile(CREDENTIALS_CONFIG_FILE, 
			processProfileInfo);
		return;
	}
	linkedinScraper.profile(CREDENTIALS_CONFIG_FILE, 
		request.query.profileUrl, processProfileInfo);
});

// Start server.
app.listen(PORT, function() {
	console.log('node-linkedin-scraper-example is',
		'running on port', PORT);
});