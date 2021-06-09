import {Action, createSelector, Selector, State, StateContext} from '@ngxs/store';
import {
  HandleProposalBeingTakenBySomeoneElse,
  IssueCreated,
  LoadIssue,
  LoadProposalAction,
  RejectProposalAction
} from './issue.actions';
import {IssueService} from './issue.service';
import {catchError, tap} from 'rxjs/operators';
import {Issue} from './issue.model';
import {Injectable} from '@angular/core';
import produce from 'immer';

type ProposalState = 'initial' | 'loading' | 'found' | 'noneFound' | 'error';

export interface IssueStateModel {
  issues: {
    [issueId: number]: Issue;
  };
  proposalId: number;
  proposalState: ProposalState;
  rejectedProposalIds: number[];
}

@Injectable()
@State<IssueStateModel>({
  name: 'issue',
  defaults: {
    issues: {},
    proposalId: undefined,
    proposalState: 'initial',
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
    if (!issueId || (state.issues && state.issues[issueId])) {
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
    ctx.patchState({
      proposalState: 'loading'
    });
    return this.issueService.getIssueProposal(excludedIssueIds).pipe(
      tap(issue => {
        if (!issue) {
          return ctx.patchState({
            proposalState: 'noneFound',
            proposalId: undefined
          });
        }
        ctx.setState(produce(draft => {
          draft.issues[issue.id] = issue;
          draft.proposalId = issue.id;
          draft.proposalState = 'found';
        }));
      }),
      catchError((err, caught) => {
        console.error(err);
        ctx.patchState({
          proposalState: 'error',
          proposalId: undefined
        });
        return caught;
      })
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

  @Action(HandleProposalBeingTakenBySomeoneElse)
  public handleProposalBeingTakenBySomeoneElse(ctx: StateContext<IssueStateModel>, {supportEvent}: HandleProposalBeingTakenBySomeoneElse) {
    if (ctx.getState().proposalId !== supportEvent.issue.id) {
      return;
    }
    return ctx.dispatch(new LoadProposalAction());
  }

  @Action(IssueCreated)
  public issueCreated(ctx: StateContext<IssueStateModel>, {event: {issue}}: IssueCreated) {
    const state = ctx.getState();
    // Only in certain cases we are interested in doing something we this event.
    if (new Array<ProposalState>('error', 'noneFound').includes(state.proposalState)) {
      ctx.setState(produce(draft => {
        draft.issues[issue.id] = issue;
        draft.proposalId = issue.id;
        draft.proposalState = 'found';
      }));
    }
  }
}
