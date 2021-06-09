import {Issue} from './issue.model';
import {SupportEvent} from '../support/support-event';
import {IssueCreatedEvent} from './issue-created-event';

export class LoadIssue {
  public static readonly type = '[Issue] Load Issue';
  constructor(public issueId: number) { }
}

export class LoadProposalAction {
  public static readonly type = '[Issue] Load Proposal';
  constructor() { }
}

export class RejectProposalAction {
  public static readonly type = '[Issue] Reject Proposal';
  constructor(public proposal: Issue) { }
}

export class HandleProposalBeingTakenBySomeoneElse {
  public static readonly type = '[Issue] Handle proposal being taken by someone else';
  constructor(public supportEvent: SupportEvent) { }
}

export class IssueCreated {
  public static readonly type = '[Issue] Issue Created';
  constructor(public event: IssueCreatedEvent) { }
}
