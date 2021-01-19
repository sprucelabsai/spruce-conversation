import Skill from '@sprucelabs/spruce-skill-utils'
import AbstractSpruceTest from '@sprucelabs/test'
import plugin from '../plugins/conversation.plugin'

export default abstract class AbstractConversationTest extends AbstractSpruceTest {
	protected static Skill(options?: { activeDir?: string }) {
		const skill = new Skill({
			rootDir: this.cwd,
			activeDir: this.cwd,
			hashSpruceDir: this.cwd,
			...options,
		})
		plugin(skill)
		return skill
	}
}
