/**
 * @description
 * Create a JSON object with all standalone details in the target LinkedIn
 * profile. Pass both browser and said object onto the next step in the
 * "async" waterfall.
 *
 * @param browser
 * Nightmare reference intialized in "login" above (previous stage in 
 * "async" waterfall). At this point, we should be logged into LinkedIn
 * and should be on the profile page.
 *
 * @param asyncCallback
 * Callback function provided by "async"; invoke either when we want to
 * error out to the main callback OR when we want to move to the next
 * step in the async-waterfall.
 */
module.exports = function(browser, asyncCallback) {
	browser
		.evaluate(function() {
			var getText = function(selector, property) {
				var targetNode = document.querySelector(selector);
				if (!targetNode) {
					return null;
				}
				return targetNode.innerHTML;
			};

			return {
				fullName: getText('#name > h1 > span > span'),
				headline: getText('#headline > div.field > p'),
				locality: getText(
					'#location > div.field > dl > dd:nth-child(2) > span'),
				industry: getText(
					'#location > div.field > dl > dd.industry'),
				summary: getText('#summary-item-view > div > p > span'),
				publicUrl: getText([
					'#top-card > div > div.profile-card-extras >',
					'div.profile-actions.entity > ul > li > dl > dd > span'
				].join(' ')),
				numConnections: getText([
					'#top-card > div > div.profile-card.vcard.entity', 
					'> div.profile-overview > div.profile-aux >',
					'div.member-connections > strong'
				].join(' '))
			};
		})
		.then(
			function(profileInfo) {
				asyncCallback(null, browser, profileInfo);
			},

			function() {
				var errorMessage = 'Unable to access basic profile details.';
				asyncCallback(new Error(errorMessage));
			}
		);
};