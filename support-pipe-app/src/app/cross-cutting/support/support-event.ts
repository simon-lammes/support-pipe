import {User} from '../user/user.model';
import {UserRelatedEvent} from '../stream/user-related-event';
import {Issue} from '../issue/issue.model';

export interface SupportEvent extends UserRelatedEvent {
  issue: Issue;
  supporter: User;
}
