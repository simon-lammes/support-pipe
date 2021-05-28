import {Issue} from '../issue/issue.model';

export class PopulateMyUser {
  public static readonly type = '[User] Populate My User';
  constructor() { }
}

export class SupportProposalAction {
  public static readonly type = '[User] Support Proposal';
  constructor(public proposal: Issue) { }
}
