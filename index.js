var async = require('async');

function run(credentials, taskList, callback, callbackArgs) 
{
	// First, execute the initialization tasks (e.g., open PhantomJS 
	// browser, and login to LinkedIn).
	var tasks = [
		async.apply(require('./tasks/setup'), credentials),
		require('./tasks/login')
	];
	// Then, execute the user-specified list of tasks.
	tasks = tasks.concat(taskList);
	// Finally, execute a finalization task to release all resources
	// (e.g., close the Phantom JS browser that we opened in the 
	// initialization tasks).
	tasks.push(require('./tasks/finish'));

	async.waterfall(tasks, function(err, info) {
		if (err && !info) {
			info = { errors: [err.message] };
		}
		callback(info, callbackArgs);
	});
}

function getProfileTaskList()
{
	const DIR = './tasks/get-profile/';
 	return [
		require(DIR + 'go-to-profile-page'),
		require(DIR + 'get-basic-profile-details'),
		require(DIR + 'get-languages'),
		require(DIR + 'get-education'),
		require(DIR + 'get-courses'),
		require(DIR + 'get-experience'),
		require(DIR + 'get-projects'),
		require(DIR + 'get-certifications'),
		require(DIR + 'get-skills'),
		require(DIR + 'wait-for-all-recommendations'),
		require(DIR + 'get-recommendations')
	];
}

function getConnectionsTaskList()
{
	const DIR = './tasks/get-connections/';
	return [
		require(DIR + 'go-to-connections-page'),
		require(DIR + 'wait-for-all-connections'),
		require(DIR + 'get-connections')
	];
}

exports.getProfile = function(credentials, callback, callbackArgs) {
	run(credentials, getProfileTaskList(), callback, callbackArgs);
};

exports.getConnections = function(credentials, callback, callbackArgs) {
	run(credentials, getConnectionsTaskList(), callback, callbackArgs);
};

exports.getAll = function(credentials, callback, callbackArgs) {
	async.parallel([
		function(asyncParallelCallback) {
			run(credentials, getProfileTaskList(), function(profileInfo) {
				asyncParallelCallback(null, {profile: profileInfo});
			});
		},

		function(asyncParallelCallback) {
			run(credentials, getConnectionsTaskList(), function(connectionsInfo) {
				asyncParallelCallback(null, {connections: connectionsInfo});
			});
		}
	], function(err, infoList) {
		var profile = {};
		var connections = {};
		for (var element of infoList) {
			if ('profile' in element) {
				profile = element.profile;
			}
			else if ('connections' in element) {
				connections = element.connections;
			}
		}

		callback(profile, connections, callbackArgs);
	});
};