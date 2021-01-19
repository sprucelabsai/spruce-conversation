import { Skill, SkillFeature } from '@sprucelabs/spruce-skill-utils'
import TopicLoader from '../conversations/TopicLoader'
import SpruceError from '../errors/SpruceError'
import { ConversationHealthCheckItem } from '../types/conversation.types'

export class ConversationFeature implements SkillFeature {
	private activeDir: string

	public constructor(activeDir: string) {
		this.activeDir = activeDir
	}

	public async execute(): Promise<void> {
		throw new Error('Method not implemented.')
	}
	public async checkHealth(): Promise<ConversationHealthCheckItem> {
		try {
			const topics = await TopicLoader.loadTopics(this.activeDir)
			return {
				status: 'passed',
				topics: topics.map((t) => t.key),
			}
		} catch (err) {
			return {
				status: 'failed',
				topics: [],
				errors: [
					new SpruceError({
						code: 'CONVERSATION_PLUGIN_ERROR',
						originalError: err,
					}),
				],
			}
		}
	}
	public async isInstalled(): Promise<boolean> {
		return true
	}
}

export default (skill: Skill) => {
	const feature = new ConversationFeature(skill.activeDir)
	skill.registerFeature('conversation', feature)
}
