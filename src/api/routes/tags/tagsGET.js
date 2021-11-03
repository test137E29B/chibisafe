const Route = require('../../structures/Route');

class tagsGET extends Route {
	constructor() {
		super('/tags', 'get', { canApiKey: true });
	}

	async run(req, res, db, user) {
		try {
			const tags = await db.table('tags')
				.where('userId', user.id);

			for (const tag of tags) {
				const files = await db.table('fileTags')
					.where({ tagId: tag.id });

				tag.count = files.length ? files.length : 0;
			}

			return res.json({
				message: 'Successfully retrieved tags',
				tags
			});
		} catch (error) {
			return super.error(res, error);
		}
	}
}

module.exports = tagsGET;
