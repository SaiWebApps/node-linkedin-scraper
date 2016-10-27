var async = require('async');

/**
 * @description
 * Open PhantomJS browser, login to LinkedIn, execute list of tasks
 * in waterfall (each task passes on output to next stage; each stage
 * is executed serially), close browser, and pass accumulated task output
 * to callback, along with callbackArgs.
 * 
 * @param taskList
 * List of tasks that we want to execute in async-waterfall.
 * 
 * @param callback
 * Callback function that is expecting 2+ arguments: error if waterfall
 * fails before reaching the end and info (accumulated task output).
 * 
 * @param callbackArgs
 * Other arguments that should be passed onto the callback function.
 */
function run(credentials, taskList, callback, callbackArgs) 
{
	const BROWSER_MGMT_DIR = './tasks/browser-mgmt/'
	var setupTask = require(BROWSER_MGMT_DIR + 'setup')
	var loginTask = require(BROWSER_MGMT_DIR + 'login')
	var finishTask = require(BROWSER_MGMT_DIR + 'finish')

	var tasks = [async.apply(setupTask, credentials), loginTask];
	tasks = tasks.concat(taskList);
	tasks.push(finishTask);

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