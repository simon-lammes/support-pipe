import {Issue} from './issue.model';
import {UserRelatedEvent} from '../stream/user-related-event';
import {User} from '../user/user.model';

export interface IssueClosedEvent extends UserRelatedEvent {
  issue: Issue;
  participants: User[];
}
