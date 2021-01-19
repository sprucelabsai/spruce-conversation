import { debug } from 'console'
import pathUtil from 'path'
import globby from 'globby'
import SpruceError from '../errors/SpruceError'
import { TopicDefinition } from '../types/conversation.types'

export default class TopicLoader {
	public static async Loader(sourceDir: string) {
		const pattern = pathUtil.join(
			sourceDir,
			'conversations',
			'**/*.topic.[j|t]s'
		)

		const matches = await globby(pattern)
		const topics: TopicDefinition[] = []

		if (matches.length > 0) {
			for (const match of matches) {
				const topic = this.loadTopic(match)
				topics.push(topic)
			}
		}

		return topics
	}

	private static loadTopic(match: string): TopicDefinition {
		const imported = require(match) as { default?: TopicDefinition }
		const file = pathUtil.basename(match).replace(pathUtil.extname(match), '')

		if (!imported || !imported.default) {
			throw new SpruceError({
				code: 'INVALID_TOPIC',
				topicScript: file,
				friendlyMessage: 'Default export missing.',
			})
		}

		const { default: topicDefinition } = imported

		const missing: string[] = []

		const keys = ['key', 'label', 'utterances', 'script']

		for (const key of keys) {
			//@ts-ignore
			if (!topicDefinition[key]) {
				missing.push(key)
			}
		}

		if (missing.length > 0) {
			throw new SpruceError({
				code: 'INVALID_TOPIC',
				topicScript: file,
				originalError: new SpruceError({
					code: 'MISSING_PARAMETERS',
					parameters: missing,
				}),
			})
		}

		return topicDefinition
	}
}
