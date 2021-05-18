import {Action, Selector, State, StateContext} from '@ngxs/store';
import {PostIssue} from './my-posted-issues.actions';
import {Issue} from '../issue.model';

export interface MyPostedIssuesStateModel {
  issues: Issue[];
}

@State<MyPostedIssuesStateModel>({
  name: 'myPostedIssues',
  defaults: {
    issues: []
  }
})
export class MyPostedIssuesState {

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
}
