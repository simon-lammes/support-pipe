import {Issue} from '../issue.model';

export class PostIssue {
  public static readonly type = '[MyPostedIssues] Post Issue';
  constructor(public issue: Issue) { }
}
