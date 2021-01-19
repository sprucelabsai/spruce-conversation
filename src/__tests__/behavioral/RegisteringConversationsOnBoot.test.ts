import AbstractSpruceTest, { test, assert } from '@sprucelabs/test'
import AbstractConversationTest from '../../tests/AbstractConversationTest'

export default class RegisteringConversationsOnBootTest extends AbstractConversationTest {
	@test.skip()
	protected static async yourNextTest() {
		assert.isTrue(false)
	}
}
