import {Message} from './message.service';
import {UserRelatedEvent} from '../stream/user-related-event';

export interface MessageEvent extends UserRelatedEvent {
  message: Message;
}
