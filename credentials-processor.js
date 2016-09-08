var jsonfile = require('jsonfile');

/**
 * Load the credentials contained in the specified JSON file into a variable.
 *
 * @param credentialsFilePath
 * (String) Path to the JSON file with the desired account credentials.
 *
 * @param expectedFields
 * (List of Strings) The fields/keys that should be present in the credentials
 * JSON object stored within the file at credentialsFilePath.
 *
 * @return
 * An Object with the desired credentials information stored at credentialsFilePath.
 */
module.exports = function(credentialsFilePath, expectedFields) {
	var credentials = null;

	// Verify that the specified file path exists.
	try {
		credentials = jsonfile.readFileSync(credentialsFilePath);
	} catch(err) {
		throw new Error(credentialsFilePath + ' is an invalid path.');
	}

	// Check whether the expected set of fields are present in
	// the credentials that we read from credentialsFilePath.
	var missingFields = [];
	expectedFields.forEach(function(field) {
		if (!(field in credentials)) {
			missingFields.push(field);
		}
	});
	if (missingFields.length > 0) {
		throw new Error('Missing Fields "' + missingFields.join() + '".');
	}

	return credentials;
};