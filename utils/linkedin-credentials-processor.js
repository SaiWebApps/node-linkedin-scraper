var processCredentials = require('./credentials-processor');

module.exports = function(credentialsFilePath) {
	return processCredentials(credentialsFilePath, ['email', 'password']);
};