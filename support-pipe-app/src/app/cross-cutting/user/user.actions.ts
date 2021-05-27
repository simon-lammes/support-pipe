import {Issue} from '../issue/issue.model';

export class PopulateMyUser {
  public static readonly type = '[User] Populate My User';
  constructor() { }
}

export class TackleProposalAction {
  public static readonly type = '[User] Tackle Proposal';
  constructor(public proposal: Issue) { }
}
