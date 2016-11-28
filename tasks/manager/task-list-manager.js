/**
 * @constructor
 * @param profileUrl
 * Url of the target profile that we wish to scrape.
 * TaskManager will log into LinkedIn using provided account credentials.
 * TaskListManager will then retrieve information for user at "profileUrl."
 */
function TaskListManager(profileUrl)
{
	this.profileUrl = (profileUrl) ? profileUrl : null;
}

TaskListManager.prototype.configureTasks = function(taskList) {
	var profileUrl = this.profileUrl;
	if (!profileUrl) {
		return taskList;
	}

	return taskList.map(function(task) {
		if ('setProfileUrl' in task){
			task.setProfileUrl(profileUrl);
		}
		return task;
	});
};

TaskListManager.prototype.getProfileTaskList = function() {
	const DIR = '../get-profile/';
 	
 	return this.configureTasks([
		require(DIR + 'go-to-profile-page'),
		require(DIR + 'get-basic-profile-details'),
		require(DIR + 'get-languages'),
		require(DIR + 'get-education'),
		require(DIR + 'get-courses'),
		require(DIR + 'get-experience'),
		require(DIR + 'get-projects'),
		require(DIR + 'get-certifications'),
		require(DIR + 'get-skills'),
		require(DIR + 'get-recommendations')
	]);
};

TaskListManager.prototype.getConnectionsTaskList = function() {
	const DIR = '../get-connections/';

	return this.configureTasks([
		require(DIR + 'go-to-connections-page'),
		require(DIR + 'get-num-connections'),
		require(DIR + 'get-connections')
	]);
};

module.exports = TaskListManager;