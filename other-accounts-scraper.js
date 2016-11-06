/**
 * Module Imports
 */
var TaskManager = require('./tasks/manager/task-manager');
var TaskListManager = require('./tasks/manager/task-list-manager');

function OtherAccountsScraper(credentials, profileUrl) 
{
	this.taskManager = new TaskManager(credentials);
	this.taskListManager = new TaskListManager(profileUrl);
}

OtherAccountsScraper.prototype.setCredentials = function(credentials) {
	this.taskManager = new TaskManager(credentials);
};

OtherAccountsScraper.prototype.setProfileUrl = function(profileUrl) {
	this.taskListManager = new TaskListManager(profileUrl);
};

OtherAccountsScraper.prototype.getProfile = function(callback, callbackArgs) {
	this.taskManager.runTasks(this.taskListManager.getProfileTaskList(),
		callback, callbackArgs);
};

module.exports = OtherAccountsScraper;