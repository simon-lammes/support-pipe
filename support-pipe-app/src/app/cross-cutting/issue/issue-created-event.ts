import {UserRelatedEvent} from '../stream/user-related-event';
import {Issue} from './issue.model';

export interface IssueCreatedEvent extends UserRelatedEvent {
  issue: Issue;
}
