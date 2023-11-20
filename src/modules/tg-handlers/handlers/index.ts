import { AuthTokenHandler } from './auth-token.handler';
import { StartCommandHandler } from './start-command.handler';
import { UnknownMessageHandler } from './unknown-message.handler';

export const APP_HANDLERS = [StartCommandHandler, AuthTokenHandler, UnknownMessageHandler];
