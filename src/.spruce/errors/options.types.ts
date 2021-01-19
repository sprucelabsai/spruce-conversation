import { SpruceErrors } from "#spruce/errors/errors.types"
import { SpruceErrorOptions, ErrorOptions as ISpruceErrorOptions} from "@sprucelabs/error"
import { SchemaErrorOptions } from '@sprucelabs/schema'

export interface InvalidTopicErrorOptions extends SpruceErrors.SpruceConversation.InvalidTopic, ISpruceErrorOptions {
	code: 'INVALID_TOPIC'
}
export interface ConversationPluginErrorErrorOptions extends SpruceErrors.SpruceConversation.ConversationPluginError, ISpruceErrorOptions {
	code: 'CONVERSATION_PLUGIN_ERROR'
}

type ErrorOptions = SchemaErrorOptions | SpruceErrorOptions | InvalidTopicErrorOptions  | ConversationPluginErrorErrorOptions 

export default ErrorOptions
