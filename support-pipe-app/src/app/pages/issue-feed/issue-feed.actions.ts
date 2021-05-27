import {Issue} from '../../cross-cutting/issue/issue.model';

export class LoadProposalAction {
  public static readonly type = '[IssueFeed] Load Proposal';
  constructor() { }
}

export class RejectProposalAction {
  public static readonly type = '[IssueFeed] Reject Proposal';
  constructor(public proposal: Issue) { }
}
