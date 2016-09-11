var processCredentials = require('./credentials-processor');
const EXPECTED_FIELDS = ['email', 'password'];

module.exports = function(credentials) {
	return processCredentials(credentials, EXPECTED_FIELDS);
};