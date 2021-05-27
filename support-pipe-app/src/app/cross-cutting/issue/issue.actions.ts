import {Issue} from './issue.model';

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
