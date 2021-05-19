import {Action, Selector, State, StateContext} from '@ngxs/store';
import {LoadPostedIssues, PostIssue} from './my-posted-issues.actions';
import {Issue} from '../issue.model';
import {IssueService} from '../issue.service';
import {catchError, tap} from 'rxjs/operators';
import {Injectable} from '@angular/core';
import {Mutation} from '../../mutation.model';
import * as _ from 'lodash';

export interface MyPostedIssuesStateModel {
  issues: Issue[];
  unresolvedMutations: Mutation<Issue>[];
}

@Injectable()
@State<MyPostedIssuesStateModel>({
  name: 'myPostedIssues',
  defaults: {
    issues: [],
    unresolvedMutations: []
  }
})
export class MyPostedIssuesState {

  constructor(
    private issueService: IssueService
  ) {
  }

  @Selector()
  public static optimisticIssues(state: MyPostedIssuesStateModel) {
    const clonedIssues = _.cloneDeep(state.issues);
    state.unresolvedMutations.forEach(mutation => {
      switch (mutation.type) {
        case 'create':
          clonedIssues.push(mutation.modifiedState);
      }
    });
    return clonedIssues;
  }

  @Action(PostIssue)
  public add(ctx: StateContext<MyPostedIssuesStateModel>, { issue }: PostIssue) {
    const timestampIso = new Date().toISOString();
    const mutation: Mutation<Issue> = {
      timestampIso,
      type: 'create',
      originalState: null,
      modifiedState: issue
    };
    ctx.patchState({
      unresolvedMutations: [...ctx.getState().unresolvedMutations, mutation]
    });
    return this.issueService.postIssue(issue).pipe(
      tap(result => {
        ctx.patchState({
          issues: [...ctx.getState().issues, result],
          unresolvedMutations: ctx.getState().unresolvedMutations
            .filter(mut => mut.timestampIso !== timestampIso)
        });
      }),
      catchError((err, caught) => {
        ctx.patchState({
          unresolvedMutations: ctx.getState().unresolvedMutations
            .filter(mut => mut.timestampIso !== timestampIso)
        });
        return caught;
      })
    );
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
