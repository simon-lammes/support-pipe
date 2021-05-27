import {Action, createSelector, Selector, State, StateContext} from '@ngxs/store';
import {LoadIssue, LoadProposalAction, RejectProposalAction} from './issue.actions';
import {IssueService} from './issue.service';
import {tap} from 'rxjs/operators';
import {Issue} from './issue.model';
import {Injectable} from '@angular/core';
import produce from 'immer';

export interface IssueStateModel {
  issues: {
    [issueId: number]: Issue;
  };
  proposalId: number;
  rejectedProposalIds: number[];
}

@Injectable()
@State<IssueStateModel>({
  name: 'issue',
  defaults: {
    issues: {},
    proposalId: undefined,
    rejectedProposalIds: []
  }
})
export class IssueState {

  constructor(
    private issueService: IssueService
  ) {
  }

  static issueById(id: number) {
    return createSelector([IssueState], (state: IssueStateModel) =>
      state.issues ? state.issues[id] : undefined);
  }

  @Selector()
  public static getState(state: IssueStateModel) {
    return state;
  }

  @Selector()
  public static getProposal(state: IssueStateModel) {
    return state.issues && state.proposalId
      ? state.issues[state.proposalId]
      : undefined;
  }

  @Action(LoadIssue)
  public loadIssue(ctx: StateContext<IssueStateModel>, { issueId }: LoadIssue) {
    const state = ctx.getState();
    if (state.issues && state.issues[issueId]) {
      return;
    }
    return this.issueService.getIssueById(issueId).pipe(
      tap(issue => {
        ctx.patchState({
          issues: {
            ...issue,
            [issueId]: issue
          }
        });
      })
    );
  }

  @Action(LoadProposalAction)
  public loadProposal(ctx: StateContext<IssueStateModel>) {
    const excludedIssueIds = ctx.getState().rejectedProposalIds;
    return this.issueService.getIssueProposal(excludedIssueIds).pipe(
      tap(issue => ctx.setState(produce(draft => {
        draft.issues[issue.id] = issue;
        draft.proposalId = issue.id;
      })))
    );
  }

  @Action(RejectProposalAction)
  public rejectProposal(ctx: StateContext<IssueStateModel>, {proposal}: RejectProposalAction) {
    ctx.setState(
      produce(draft => {
        draft.rejectedProposalIds.push(proposal.id);
      })
    );
  }
}
