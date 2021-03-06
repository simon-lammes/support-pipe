import {Action, Selector, State, StateContext, Store} from '@ngxs/store';
import {ListenToUserRelatedEvents} from './stream.actions';
import {StreamService} from './stream.service';
import {finalize} from 'rxjs/operators';
import {AddSupporter, ReceiveMessage} from '../support/support.actions';
import {Injectable} from '@angular/core';
import {SupportEvent} from '../support/support-event';
import {MessageEvent} from '../message/message-event';
import {HandleProposalBeingTakenBySomeoneElse, IssueCreated} from '../issue/issue.actions';
import {IssueClosedEvent} from '../issue/issue-closed-event';
import {IssueClosed} from '../user/user.actions';
import {IssueCreatedEvent} from '../issue/issue-created-event';

export interface StreamStateModel {
  isListeningToUserRelatedEvents: boolean;
}

@Injectable()
@State<StreamStateModel>({
  name: 'stream',
  defaults: {
    isListeningToUserRelatedEvents: false
  }
})
export class StreamState {

  constructor(
    private streamService: StreamService,
    private store: Store
  ) {
  }

  @Selector()
  public static getState(state: StreamStateModel) {
    return state;
  }

  @Action(ListenToUserRelatedEvents)
  public listenToUserRelatedEvents(ctx: StateContext<StreamStateModel>) {
    const state = ctx.getState();
    if (state.isListeningToUserRelatedEvents) {
      return;
    }
    this.streamService.listenToUserRelatedEvents().pipe(
      finalize(() => ctx.patchState({
        isListeningToUserRelatedEvents: false
      }))
    ).subscribe(event => {
      switch (event.type) {
        case 'HeartbeatEvent':
          break;
        case 'SupportEvent':
          const supportEvent = event as SupportEvent;
          this.store.dispatch([
            new AddSupporter(supportEvent),
            new HandleProposalBeingTakenBySomeoneElse(supportEvent)
          ]);
          break;
        case 'MessageEvent':
          const messageEvent = event as MessageEvent;
          this.store.dispatch(new ReceiveMessage(messageEvent.message));
          break;
        case 'IssueClosedEvent':
          const issueClosedEvent = event as IssueClosedEvent;
          this.store.dispatch(new IssueClosed(issueClosedEvent));
          break;
        case 'IssueCreatedEvent':
          const issueCreatedEvent = event as IssueCreatedEvent;
          this.store.dispatch(new IssueCreated(issueCreatedEvent));
          break;
        default:
          console.warn('Unknown event was sent', event);
      }
    });
  }
}
