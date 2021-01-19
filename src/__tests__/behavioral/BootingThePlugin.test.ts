import Skill from '@sprucelabs/spruce-skill-utils'
import AbstractSpruceTest, { test, assert } from '@sprucelabs/test'
import plugin from '../../plugins/conversation.plugin'
import { ConversationHealthCheckResults } from '../../types/conversation.types'

export default class BootingThePluginTest extends AbstractSpruceTest {
	@test()
	protected static async pluginReturnsInstance() {
		assert.isTrue(plugin instanceof Function)
	}

	@test()
	protected static registersWithSkilll() {
		const skill = this.Skill()
		const features = skill.getFeatures()
		assert.isLength(features, 1)
	}

	private static Skill(options?: { activeDir?: string }) {
		const skill = new Skill({
			rootDir: this.cwd,
			activeDir: this.cwd,
			hashSpruceDir: this.cwd,
			...options,
		})
		plugin(skill)
		return skill
	}

	@test()
	protected static async returnsZeroStateResponseFromHealthCheckWhenNoConversations() {
		const healthCheck = await this.checkHealth()

		assert.isEqual(healthCheck.conversation.status, 'passed')
		assert.isEqualDeep(healthCheck.conversation.topics, [])
	}

	private static async checkHealth(options?: { activeDir?: string }) {
		const skill = this.Skill(options)
		const healthCheck = (await skill.checkHealth()) as ConversationHealthCheckResults
		return healthCheck
	}

	@test()
	protected static async returnsHelpfulErrorWHenPassedBadConvos() {
		const healthCheck = await this.checkHealth({
			activeDir: this.resolvePath(
				__dirname,
				'..',
				'testDirsAndFiles',
				'bad-missing-params'
			),
		})

		assert.isEqual(healthCheck.conversation.status, 'failed')
	}
}
