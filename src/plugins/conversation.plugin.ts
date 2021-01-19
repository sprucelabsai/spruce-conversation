import { Skill, SkillFeature } from '@sprucelabs/spruce-skill-utils'
import TopicLoader from '../conversations/TopicLoader'
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
			await TopicLoader.loadTopics(this.activeDir)
			return {
				status: 'passed',
				topics: [],
			}
		} catch (err) {
			return {
				status: 'failed',
				topics: [],
				errors: [],
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
