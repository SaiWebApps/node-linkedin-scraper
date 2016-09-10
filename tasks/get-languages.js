module.exports = function(profileInfo, browser, asyncCallback) {
	browser
		.evaluate(function() {
			const PREFIX = ['#languages-view > ol > li > div.entity >',
				'div.edit-action-area >'].join(' ');
			var languageNodes = document.querySelectorAll(PREFIX + 
				' h4 > span.field-text');
			var proficiencyNodes = document.querySelectorAll(PREFIX + 
				' div > span.field-text');

			var results = [];
			languageNodes.forEach(function(langNode, index) {
				var langValue = langNode.innerHTML;
				var proficiencyValue = proficiencyNodes[index].innerHTML;
				results.push({
					language: langValue,
					proficiency: proficiencyValue
				});
			});
			return results;
		})
		.then(function(languageInfo) {
			profileInfo.languages = languageInfo;
			asyncCallback(null, profileInfo, browser);
		}, function() {
			profileInfo.languages = [];
			var error = new Error('Unable to access languages section.');
			asyncCallback(error, profileInfo);
		});
};