module.exports = function(profileInfo, browser, asyncCallback) {
	browser
		.evaluate(function() {
			/**
			 * @param selectors
			 * Variadic arguments; 1 or more strings containing CSS
			 * selectors for the collection of languages nodes.
			 * 
			 * @return
			 * - List with the languages nodes corresponding to the
			 * first valid selector in @selectors.
			 * - Empty list if @selectors doesn't contain any valid selectors.
			 */
			var getAll = function() {
				for (var i = 0; i < arguments.length; i++) {
					var query = arguments[i];
					var queryNodes = document.querySelectorAll(query);

					if (queryNodes && queryNodes.length > 0) {
						return queryNodes;
					}
				}
				return [];
			};

			const PREFIX = ['#languages-view > ol > li > div.entity >',
				'div.edit-action-area >'].join(' ');
			var languageNodes = getAll(PREFIX + ' h4 > span.field-text',
				'#languages-view > ol > li > h4 > span');
			var proficiencyNodes = getAll(PREFIX + ' div > span.field-text',
				'#languages-view > ol > li > div');

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
			profileInfo.errors.push('Unable to access languages section.');
			asyncCallback(null, profileInfo, browser);
		});
};