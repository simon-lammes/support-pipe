import {Action, Selector, State, StateContext} from '@ngxs/store';
import {LoadPostedIssues, PostIssue} from './my-posted-issues.actions';
import {Issue} from '../issue.model';
import {IssueService} from '../issue.service';
import {tap} from 'rxjs/operators';
import {Injectable} from '@angular/core';

export interface MyPostedIssuesStateModel {
  issues: Issue[];
}

@Injectable()
@State<MyPostedIssuesStateModel>({
  name: 'myPostedIssues',
  defaults: {
    issues: []
  }
})
export class MyPostedIssuesState {

  constructor(
    private issueService: IssueService
  ) {
  }

  @Selector()
  public static issues(state: MyPostedIssuesStateModel) {
    return state.issues;
  }

  @Action(PostIssue)
  public add(ctx: StateContext<MyPostedIssuesStateModel>, { issue }: PostIssue) {
    const stateModel = ctx.getState();
    ctx.patchState({
      issues: [...stateModel.issues, issue]
    });
  }

  @Action(LoadPostedIssues)
  public loadPostedIssues(ctx: StateContext<MyPostedIssuesStateModel>) {
    return this.issueService.getMyPostedIssues().pipe(
      tap(issues => {
        ctx.patchState({
          issues: [...ctx.getState().issues, ...issues]
        });
      })
    );
  }
}
