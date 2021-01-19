import AbstractSpruceTest, { test, assert } from '@sprucelabs/test'
import { ConversationFeature } from '../../plugins/conversation.plugin'

export default class ReturnsConversationsFromHealthCheckTest extends AbstractSpruceTest {
	@test()
	protected static async canCreateReturnsConversationsFromHealthCheck() {
		const returnsConversationsFromHealthCheck = new ConversationFeature()
		assert.isTruthy(returnsConversationsFromHealthCheck)
	}

	@test()
	protected static async yourNextTest() {
		assert.isTrue(false)
	}
}
