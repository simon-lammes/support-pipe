import {Action, Selector, State, StateContext} from '@ngxs/store';
import {HandleSupportEvent, LoadMessages, LoadSupporters, ReceiveMessage, SendMessage} from './support.actions';
import {Injectable} from '@angular/core';
import {User} from '../user/user.model';
import {IssueService} from '../issue/issue.service';
import {tap} from 'rxjs/operators';
import {Message, MessageService} from '../message/message.service';
import {VirtualEntity} from '../virtual-entity';
import * as uuid from 'uuid-random';
import produce from 'immer';

export interface OptimisticSupportStateModel {
  supporters: User[];
  messages: Message[];
}

export interface SupportStateModel {
  supporters: User[];
  messages: VirtualEntity<Message>[];
}

@Injectable()
@State<SupportStateModel>({
  name: 'support',
  defaults: {
    supporters: [],
    messages: []
  }
})
export class SupportState {

  constructor(
    private issueService: IssueService,
    private messageService: MessageService
  ) {
  }

  @Selector()
  public static getOptimisticState(state: SupportStateModel): OptimisticSupportStateModel {
    return {
      supporters: state.supporters,
      messages: state.messages.map(virtualMessage => virtualMessage.persisted ?? virtualMessage.mutated)
    };
  }

  @Action(HandleSupportEvent)
  public addSupporter(ctx: StateContext<SupportStateModel>, {supportEvent}: HandleSupportEvent) {
    ctx.patchState({
      supporters: [...ctx.getState().supporters, supportEvent.supporter]
    });
  }

  @Action(LoadSupporters)
  public loadSupporters(ctx: StateContext<SupportStateModel>, {issueId}: LoadSupporters) {
    return this.issueService.getSupporters(issueId).pipe(
      tap(supporters => {
        ctx.patchState({supporters});
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
    ctx.patchState({
      messages: [...ctx.getState().messages, {uuid: uuid(), persisted: message}]
    });
  }
}
