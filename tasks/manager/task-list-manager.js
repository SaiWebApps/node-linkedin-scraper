function TaskListManager()
{
}

TaskListManager.prototype.getProfileTaskList = function() {
	const DIR = '../get-profile/';
 	
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
};

TaskListManager.prototype.getConnectionsTaskList = function() {
	const DIR = '../get-connections/';

	return [
		require(DIR + 'go-to-connections-page'),
		require(DIR + 'wait-for-all-connections'),
		require(DIR + 'get-connections')
	];
};

module.exports = TaskListManager;