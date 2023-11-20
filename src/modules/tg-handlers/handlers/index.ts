import { AuthTokenHandler } from './auth-token.handler';
import { StartCommandHandler } from './start-command.handler';
import { UnknownMessageHandler } from './unknown-message.handler';
import { WriteLetterHandler } from './write-letter.handler';

export const APP_HANDLERS = [StartCommandHandler, AuthTokenHandler, WriteLetterHandler, UnknownMessageHandler];
