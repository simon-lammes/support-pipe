import {Issue} from '../issue.model';

export class PostIssue {
  public static readonly type = '[MyPostedIssues] Post Issue';
  constructor(public issue: Issue) { }
}

export class LoadPostedIssues {
  public static readonly type = '[MyPostedIssues] Load Posted Issues';
  constructor() { }
}
