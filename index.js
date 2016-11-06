var MyAccountScraper = require('./my-account-scraper');
var OtherAccountsScraper = require('./other-accounts-scraper');

exports.me = function(credentials, callback, callbackArgs) {
	var scraper = new MyAccountScraper(credentials);
	scraper.getAll(callback, callbackArgs);
};

exports.me.profile = function(credentials, callback, callbackArgs) {
	var scraper = new MyAccountScraper(credentials);
	scraper.getProfile(callback, callbackArgs);
};

exports.me.connections = function(credentials, callback, callbackArgs) {
	var scraper = new MyAccountScraper(credentials);
	scraper.getConnections(callback, callbackArgs);
};

exports.profile = function(credentials, profileUrl, callback, callbackArgs) {
	var scraper = new OtherAccountsScraper(credentials, profileUrl);
	scraper.getProfile(callback, callbackArgs);
};