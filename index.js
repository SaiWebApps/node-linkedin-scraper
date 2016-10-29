var TaskManager = require('./tasks/manager/task-manager');
var TaskListManager = require('./tasks/manager/task-list-manager');

/**
 * Functions to retrieve MY LinkedIn information
 */

var myTaskListManager = new TaskListManager();
var myProfileTaskList = myTaskListManager.getProfileTaskList();
var myConnectionsTaskList = myTaskListManager.getConnectionsTaskList();

/**
 * @description
 * Get my LinkedIn account's details (both profile and connections).
 *
 * @param credentials
 * My LinkedIn account credentials
 *
 * @param callback
 * Function that accepts 2+ arguments: my LinkedIn profile details, my
 * LinkedIn connections details, and other, optional callbackArgs
 *
 * @param callbackArgs
 * Additional, optional arguments to specified callback function.
 */
exports.me = function(credentials, callback, callbackArgs) {
	var taskManager = new TaskManager(credentials);
	
	taskManager.runTaskGroups({
		'profile': myProfileTaskList,
		'connections': myConnectionsTaskList
	}, function(output) {
		callback(output['profile'], output['connections'], callbackArgs);
	});
};

/**
 * @description
 * Get my LinkedIn account's profile details.
 *
 * @param credentials
 * My LinkedIn account credentials
 *
 * @param callback
 * Function that accepts 2+ arguments: my LinkedIn profile details and
 * other, optional callbackArgs
 *
 * @param callbackArgs
 * Additional, optional arguments to specified callback function.
 */
exports.me.profile = function(credentials, callback, callbackArgs) {
	var taskManager = new TaskManager(credentials);
	taskManager.runTasks(myProfileTaskList, callback, callbackArgs);
};

/**
 * @description
 * Get my LinkedIn account's connections details.
 *
 * @param credentials
 * My LinkedIn account credentials
 *
 * @param callback
 * Function that accepts 1+ arguments: my LinkedIn connections details and
 * other, optional callbackArgs
 *
 * @param callbackArgs
 * Additional, optional arguments to specified callback function.
 */
exports.me.connections = function(credentials, callback, callbackArgs) {
	var taskManager = new TaskManager(credentials);
	taskManager.runTasks(myConnectionsTaskList, callback, callbackArgs);
};

/**
 * TODO: Functions to retrieve others' LinkedIn information
 */