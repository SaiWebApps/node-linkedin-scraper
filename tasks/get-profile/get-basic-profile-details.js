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
			var getText = function(selector, altSelector) {
				var targetNode = document.querySelector(selector) ||
					document.querySelector(altSelector);
				if (!targetNode) {
					return null;
				}
				return targetNode.innerText;
			};

			return {
				id: LI.Profile.data['memberId'],
				fullName: getText('#name > h1 > span > span'),
				headline: getText('#headline > div.field > p', 
					'#headline > p'),
				locality: getText(
					'#location > div.field > dl > dd:nth-child(2) > span',
					'#location > dl > dd:nth-child(2) > span > a'
				),
				industry: getText(
					'#location > div.field > dl > dd.industry',
					'#location > dl > dd.industry > a'
				),
				summary: getText(
					'#summary-item-view > div > p > span',
					'#summary-item-view > div > p'
				),
				publicUrl: getText(
					[
						'#top-card > div > div.profile-card-extras >',
						'div.profile-actions.entity > ul > li > dl > dd > span'
					].join(' '),
					[
						'#top-card > div > div.profile-card-extras >',
						'div > ul > li:nth-child(1) > dl > dd > a'
					].join(' ')
				),
				numConnections: getText(
					[
						'#top-card > div > div.profile-card.vcard.entity', 
						'> div.profile-overview > div.profile-aux >',
						'div.member-connections > strong'
					].join(' '),
					[
						'#top-card > div > div.profile-card.vcard > div',
						'> div.profile-aux > div.member-connections > strong'
					].join(' ')
				)
			};
		})
		.then(
			function(profileInfo) {
				profileInfo.errors = [];
				asyncCallback(null, profileInfo, browser);
			},

			function(err) {
				asyncCallback(null, {
					errors: ['Unable to access basic profile details.']
				});
			}
		);
};