import AbstractSpruceTest, { test, assert } from '@sprucelabs/test'

class RegisteringConversationsOnBoot {}

export default class RegisteringConversationsOnBootTest extends AbstractSpruceTest {
	@test()
	protected static async canCreateRegisteringConversationsOnBoot() {
		const registeringConversationsOnBoot = new RegisteringConversationsOnBoot()
		assert.isTruthy(registeringConversationsOnBoot)
	}

	@test()
	protected static async yourNextTest() {
		assert.isTrue(false)
	}
}
