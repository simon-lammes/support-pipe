import {Issue} from '../issue/issue.model';
import {IssueClosedEvent} from '../issue/issue-closed-event';

export class PopulateMyUser {
  public static readonly type = '[User] Populate My User';
  constructor() { }
}

export class SupportProposalAction {
  public static readonly type = '[User] Support Proposal';
  constructor(public proposal: Issue) { }
}


export class CloseIssue {
  public static readonly type = '[Issue] Close Issue';
  constructor(public issue: Issue) { }
}

export class IssueClosed {
  public static readonly type = '[Issue] Issue Closed';
  constructor(public event: IssueClosedEvent) { }
}
