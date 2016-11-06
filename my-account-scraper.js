/**
 * Module Imports
 */
var TaskManager = require('./tasks/manager/task-manager');
var TaskListManager = require('./tasks/manager/task-list-manager');

/**
 * @constructor
 */
function MyAccountScraper(credentials) 
{
	this.taskManager = new TaskManager(credentials);
	
	var taskListManager = new TaskListManager();
	this.myProfileTaskList = taskListManager.getProfileTaskList();
	this.myConnectionsTaskList = taskListManager.getConnectionsTaskList();
}

/**
 * @modifier
 * Update the base LinkedIn account credentials that we will be
 * operating with.
 *
 * @param newCredentials
 * New LinkedIn credentials
 */
MyAccountScraper.prototype.updateCredentials = function(newCredentials) {
	this.taskManager = new TaskManager(newCredentials);
};

/**
 * @description
 * Get my LinkedIn account's details (both profile and connections).
 *
 * @param callback
 * Function that accepts 2+ arguments: my LinkedIn profile details, my
 * LinkedIn connections details, and other, optional callbackArgs
 *
 * @param callbackArgs
 * Additional, optional arguments to specified callback function.
 */
MyAccountScraper.prototype.getAll = function(callback, callbackArgs) {	
	this.taskManager.runTaskGroups({
		'profile': this.myProfileTaskList,
		'connections': this.myConnectionsTaskList
	}, function(output) {
		callback(output['profile'], output['connections'], callbackArgs);
	});
};

/**
 * @description
 * Get my LinkedIn account's profile details.
 *
 * @param callback
 * Function that accepts 2+ arguments: my LinkedIn profile details and
 * other, optional callbackArgs
 *
 * @param callbackArgs
 * Additional, optional arguments to specified callback function.
 */
MyAccountScraper.prototype.getProfile = function(callback, callbackArgs) {
	this.taskManager.runTasks(this.myProfileTaskList, 
		callback, callbackArgs);
};

/**
 * @description
 * Get my LinkedIn account's connections details.
 *
 * @param callback
 * Function that accepts 1+ arguments: my LinkedIn connections details and
 * other, optional callbackArgs
 *
 * @param callbackArgs
 * Additional, optional arguments to specified callback function.
 */
MyAccountScraper.prototype.getConnections = function(callback, callbackArgs) {
	this.taskManager.runTasks(this.myConnectionsTaskList, 
		callback, callbackArgs);
};

module.exports = MyAccountScraper;