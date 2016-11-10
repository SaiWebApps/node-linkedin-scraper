// Constants
const PORT = process.env.PORT || 5000;
const CREDENTIALS_CONFIG_FILE = __dirname + '/config.json';

// Global Variables
var app = require('express')();
var myProfile = {};
var myConnections = {};

// Configure app.
app.set('view engine', 'ejs');

// Use node-linkedin-scraper to gather information about your (current
// user's) LinkedIn account.
var linkedinScraper = require('../index');
linkedinScraper.me(CREDENTIALS_CONFIG_FILE, 
	function(profileInfo, connectionsInfo) {
		myProfile = profileInfo;
		myConnections = connectionsInfo;

		// Start the server only after we've received all our information.
		app.listen(PORT, function() {
			console.log('node-linkedin-scraper-example is',
				'running on port', PORT);
		});
	}
);

// URL Routing
app.get('/me', function(request, response) {
	response.render('index', {
		'profile': myProfile,
		'connections': myConnections,
		'showProfile': true,
		'showConnections': true,
		'title': myProfile.fullName + ' @ LinkedIn'
	});
});

app.get('/me/connections', function(request, response) {
	response.render('index', {
		'connections': myConnections,
		'showProfile': false,
		'showConnections': true,
		'title': myProfile.fullName + ' @ LinkedIn - Connections'
	});
});

app.get('/profile', function(request, response) {
	if (!('profileUrl' in request.query)) {
		response.render('index', {
			'profile': myProfile,
			'showProfile': true,
			'showConnections': false,
			'title': myProfile.fullName + ' @ LinkedIn - Profile'
		});
		return;
	}

	linkedinScraper.profile(
		CREDENTIALS_CONFIG_FILE, 
		request.query.profileUrl,
		function(profile) {
			response.render('index', {
				'profile': profile,
				'showProfile': true,
				'showConnections': false,
				'title': profile.fullName + ' @ LinkedIn - Profile'
			});
		}
	);
});