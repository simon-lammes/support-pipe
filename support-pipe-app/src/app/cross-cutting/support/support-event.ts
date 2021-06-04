import {User} from '../user/user.model';
import {UserRelatedEvent} from '../stream/user-related-event';

export interface SupportEvent extends UserRelatedEvent {
  supporter: User;
}
