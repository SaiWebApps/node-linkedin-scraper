var async = require('async');

const BROWSER_MGMT_DIR = '../browser-mgmt/';
var setupTask = require(BROWSER_MGMT_DIR + 'setup');
var loginTask = require(BROWSER_MGMT_DIR + 'login');
var finishTask = require(BROWSER_MGMT_DIR + 'finish');

/**
 * @constructor
 * Initialize a TaskManager for the given LinkedIn account.
 */
function TaskManager(linkedInCredentials)
{
	this.credentials = linkedInCredentials;
}

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
TaskManager.prototype.runTasks = function(taskList, callback, callbackArgs) {
	var tasks = [async.apply(setupTask, this.credentials), loginTask];
	tasks = tasks.concat(taskList);
	tasks.push(finishTask);

	async.waterfall(tasks, function(err, info) {
		if (err && !info) {
			info = { errors: [err.message] };
		}
		callback(info, callbackArgs);
	});
};

/**
 * @description
 * Parallely execute the tasks in the specified taskGroup dictionary.
 * Then, collate the task groups' output into a dictionary, where the key
 * is the task group name, and the value is its corresponding output.
 * Pass on this dictionary to the given callback function, along with callbackArgs.
 * 
 * @param taskGroups
 * Dictionary where the key is the task group name, and the value is a list of tasks.
 * Example:
 * {
 *   'profile': get-profile task list, 
 *   'connections': get-connections task list
 * }
 * 
 * @param callback
 * Function to execute after we finish executing all task groups.
 * Accepts 2+ arguments - error if one or more of the task groups failed, accumulated
 * output from the task groups, and user-specified callback arguments.
 * 
 * @param callbackArgs
 * Other arguments to pass to callback.
 */
TaskManager.prototype.runTaskGroups = function(taskGroups, callback, callbackArgs) {
    var thisTaskManager = this;
    var taskList = [];
    
    // 'profile'
    for (let taskGroupName in taskGroups) {
        // get-profile task list
        let taskGroupTaskList = taskGroups[taskGroupName];

        taskList.push(function(asyncCallback) {
            // Run tasks associated with this task group.
            thisTaskManager.runTasks(taskGroupTaskList, function(taskGroupOutput) {
                // Create a dictionary where the key is the task group name,
                // and the value is the output for that task group.
                // Pass dictionary along to main callback.
                var output = {};
                output[taskGroupName] = taskGroupOutput;
                asyncCallback(null, output);
            });
        });
    }
    
    // { 'profile': profile-tasks'-output, 'connections': connections-tasks'-output }
    async.parallel(taskList, function(err, taskGroupsOutputList) {
        var taskGroupsOutput = {};
        for (var taskGroupItem of taskGroupsOutputList) {
            Object.assign(taskGroupsOutput, taskGroupItem);
        }
        callback(taskGroupsOutput, callbackArgs);
    });
};

module.exports = TaskManager;