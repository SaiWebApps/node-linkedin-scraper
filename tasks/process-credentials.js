var processCredentials = require('../utils/linkedin-credentials-processor');

module.exports = function(credentialsFilePath, browser, asyncCallback) {
	try {
		asyncCallback(null, processCredentials(credentialsFilePath), browser);
	} catch(error) {
		asyncCallback(error);
	}
};