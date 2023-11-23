import { AuthTokenHandler } from './auth-token.handler';
import { MembersCommandHandler } from './members-command.handler';
import { PlayActionHandler } from './play-action.handler';
import { RemindActionHandler } from './remind-action.handler';
import { StartCommandHandler } from './start-command.handler';
import { UnknownMessageHandler } from './unknown-message.handler';
import { WriteLetterHandler } from './write-letter.handler';

export const APP_HANDLERS = [
  StartCommandHandler,
  AuthTokenHandler,
  MembersCommandHandler,
  RemindActionHandler,
  PlayActionHandler,
  WriteLetterHandler,
  UnknownMessageHandler,
];
