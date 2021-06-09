import {Action, Selector, State, StateContext, Store} from '@ngxs/store';
import {AddSupporter, LoadMessages, LoadParticipants, ReceiveMessage, SendMessage} from './support.actions';
import {Injectable, NgZone} from '@angular/core';
import {User} from '../user/user.model';
import {IssueService} from '../issue/issue.service';
import {tap} from 'rxjs/operators';
import {Message, MessageService} from '../message/message.service';
import {VirtualEntity} from '../virtual-entity';
import * as uuid from 'uuid-random';
import produce from 'immer';
import {Router} from '@angular/router';
import {UserState} from '../user/user.state';

export interface OptimisticSupportStateModel {
  participants: User[];
  messages: Message[];
}

export interface SupportStateModel {
  participants: User[];
  messages: VirtualEntity<Message>[];
}

@Injectable()
@State<SupportStateModel>({
  name: 'support',
  defaults: {
    participants: [],
    messages: []
  }
})
export class SupportState {

  constructor(
    private issueService: IssueService,
    private messageService: MessageService,
    private router: Router,
    private store: Store,
    private ngZone: NgZone
  ) {
  }

  @Selector()
  public static getOptimisticState(state: SupportStateModel): OptimisticSupportStateModel {
    return {
      participants: state.participants,
      messages: state.messages.map(virtualMessage => virtualMessage.persisted ?? virtualMessage.mutated)
    };
  }

  @Action(AddSupporter)
  public addSupporter(ctx: StateContext<SupportStateModel>, {supportEvent}: AddSupporter) {
    const myUser = this.store.selectSnapshot(UserState.myUser);
    if (
      supportEvent.issue.creatorId !== myUser.id &&
      supportEvent.issue.id !== myUser.currentlyTackledIssueId
    ) {
      return;
    }
    ctx.patchState({
      participants: [...ctx.getState().participants, supportEvent.supporter]
    });
    // If the user is not already at the support page, we need to navigate him there!
    return this.ngZone.run(() => this.router.navigateByUrl('/support'));
  }

  @Action(LoadParticipants)
  public loadParticipants(ctx: StateContext<SupportStateModel>, {issueId}: LoadParticipants) {
    return this.issueService.getParticipants(issueId).pipe(
      tap(participants => {
        ctx.patchState({participants});
      })
    );
  }

  @Action(SendMessage)
  public sendMessage(ctx: StateContext<SupportStateModel>, {message}: SendMessage) {
    const newVirtualMessage: VirtualEntity<Message> = {
      uuid: uuid(),
      mutated: message
    };
    ctx.patchState({
      messages: [...ctx.getState().messages, newVirtualMessage]
    });
    return this.messageService.sendMessage(message).pipe(
      tap(persistedMessage => {
        ctx.setState(
          produce(draft => {
            const persistedVirtualMessage = draft.messages.find(virtualMessage => virtualMessage.uuid === newVirtualMessage.uuid);
            persistedVirtualMessage.persisted = persistedMessage;
            persistedVirtualMessage.mutated = undefined;
          })
        );
      })
    );
  }

  @Action(LoadMessages)
  public loadMessages(ctx: StateContext<SupportStateModel>, {issueId}: LoadMessages) {
    return this.messageService.loadMessages(issueId).pipe(
      tap(messages => {
        ctx.patchState({
          messages: messages.map(message => ({persisted: message, uuid: uuid()}))
        });
      })
    );
  }

  @Action(ReceiveMessage)
  public receiveMessage(ctx: StateContext<SupportStateModel>, {message}: ReceiveMessage) {
    const myUser = this.store.selectSnapshot(UserState.myUser);
    if (
      message.issueId !== myUser.currentlyTackledIssueId
      || message.authorId === myUser.id
    ) {
      return;
    }
    ctx.patchState({
      messages: [...ctx.getState().messages, {uuid: uuid(), persisted: message}]
    });
  }
}
