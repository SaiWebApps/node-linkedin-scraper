var jsonfile = require('jsonfile');

/**
 * Determine the type of the given credentials information;
 * if it's a string, then read the contents of the JSON file
 * at the path within the string into an object, and return it.
 * If it's a JSON object, then return as is.
 *
 * @param credentialsSrc
 * Either a String, in which case it's a file path to a JSON
 * credentials file, OR a JSON object with some credentials info.
 */
function extractCredentials(credentialsSrc)
{
	var credentials;

	switch(typeof(credentialsSrc)) {
		case 'string':
			try {
				credentials = jsonfile.readFileSync(credentialsSrc);
			} catch(err) {
				throw new Error(credentialsSrc + ' is an invalid path.');
			}
			break;

		case 'object':
			credentials = credentialsSrc;
			break;

		default:
			throw new Error('Invalid type. Must be string file path ' +
				'or JSON object.');
	}

	return credentials;
}

/**
 * Determine if the provided credentials object contains
 * the expected fields; if it's missing even 1 of these
 * fields, then throw an error indicating the missing fields.
 *
 * @param credentials
 * Credentials object whose schema is being validated.
 *
 * @param expectedFields
 * Array of strings, where each string is the name of a field
 * that we expect to see in the supplied credentials object.
 */
function validateSchema(credentials, expectedFields)
{
	var missingFields = [];
	expectedFields.forEach(function(field) {
		if (!(field in credentials)) {
			missingFields.push(field);
		}
	});
	if (missingFields.length > 0) {
		throw new Error('Missing Fields "' + missingFields.join() + '".');
	}
}

/**
 * Load the credentials contained in the specified JSON file into a variable.
 *
 * @param credentialsFilePath
 * (String) Path to the JSON file with the desired account credentials
 * OR (JSON Object) with credentials information
 *
 * @param expectedFields
 * (List of Strings) The fields/keys that should be present in the credentials
 * JSON object stored within the file at credentialsFilePath.
 *
 * @return
 * An Object with the desired credentials information stored at credentialsFilePath.
 */
module.exports = function(credentialsInfo, expectedFields) {
	var credentials = extractCredentials(credentialsInfo);
	validateSchema(credentials, expectedFields);
	return credentials;
};