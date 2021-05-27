import {Action, Selector, State, StateContext} from '@ngxs/store';
import {LoadProposalAction, RejectProposalAction} from './issue-feed.actions';
import {IssueService} from '../../cross-cutting/issue/issue.service';
import {tap} from 'rxjs/operators';
import {Issue} from '../../cross-cutting/issue/issue.model';
import {Injectable} from '@angular/core';
import produce from 'immer';

export interface IssueFeedStateModel {
  proposal: Issue;
  rejectedProposalIds: number[];
}

@Injectable()
@State<IssueFeedStateModel>({
  name: 'issueFeed',
  defaults: {
    proposal: undefined,
    rejectedProposalIds: []
  }
})
export class IssueFeedState {

  constructor(
    private issueService: IssueService
  ) {
  }

  @Selector()
  public static getProposal(state: IssueFeedStateModel) {
    return state.proposal;
  }

  @Action(LoadProposalAction)
  public loadProposal(ctx: StateContext<IssueFeedStateModel>) {
    const excludedIssueIds = ctx.getState().rejectedProposalIds;
    return this.issueService.getIssueProposal(excludedIssueIds).pipe(
      tap(issue => ctx.patchState({proposal: issue}))
    );
  }

  @Action(RejectProposalAction)
  public rejectProposal(ctx: StateContext<IssueFeedStateModel>, {proposal}: RejectProposalAction) {
    ctx.setState(
      produce(draft => {
        draft.rejectedProposalIds.push(proposal.id);
      })
    );
  }
}
