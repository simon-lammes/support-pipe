import {Component, OnInit} from '@angular/core';
import {Select, Store} from '@ngxs/store';
import {UserState} from '../../cross-cutting/user/user.state';
import {combineLatest, Observable} from 'rxjs';
import {User} from '../../cross-cutting/user/user.model';
import {OptimisticSupportStateModel, SupportState} from '../../cross-cutting/support/support.state';
import {Issue} from '../../cross-cutting/issue/issue.model';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {filter, first, map, switchMap} from 'rxjs/operators';
import {LoadIssue} from '../../cross-cutting/issue/issue.actions';
import {IssueState} from '../../cross-cutting/issue/issue.state';
import {LoadMessages, LoadParticipants, SendMessage} from '../../cross-cutting/support/support.actions';
import {Message} from '../../cross-cutting/message/message.service';
import {IssueAction} from '../../components/issue/issue.component';

@Component({
  selector: 'app-support',
  templateUrl: './support.page.html',
  styleUrls: ['./support.page.scss'],
})
export class SupportPage implements OnInit {

  @Select(UserState.myUser) user$: Observable<User>;
  @Select(SupportState.getOptimisticState) supportState$: Observable<OptimisticSupportStateModel>;

  currentIssueId$: Observable<number>;
  currentIssue$: Observable<Issue>;
  isAuthorOfIssue$: Observable<boolean>;
  enabledIssueActions$: Observable<IssueAction[]>;
  messageForm: FormGroup;

  /**
   * An array of message arrays so that adjacent messages of the same person are grouped together.
   */
  messageBlocks$: Observable<Message[][]>;

  constructor(
    private store: Store,
    private fb: FormBuilder
  ) {
    this.currentIssueId$ = this.user$.pipe(
      map(user => user.currentlyTackledIssueId)
    );
    this.currentIssue$ = this.currentIssueId$.pipe(
      switchMap(async issueId => {
        await this.store.dispatch(new LoadIssue(issueId)).toPromise();
        return issueId;
      }),
      switchMap(issueId => this.store.select(
        IssueState.issueById(issueId)
      ))
    );
    this.messageBlocks$ = this.supportState$.pipe(
      map(supportState => {
        const messageBlocks = [];
        let currentMessageBlock: Message[] = [];
        for (const message of supportState.messages) {
          if (currentMessageBlock.length === 0 || currentMessageBlock[0].authorId === message.authorId) {
            currentMessageBlock.push(message);
          } else {
            messageBlocks.push(currentMessageBlock);
            currentMessageBlock = [message];
          }
        }
        if (currentMessageBlock.length > 0) {
          messageBlocks.push(currentMessageBlock);
        }
        return messageBlocks;
      })
    );
    this.isAuthorOfIssue$ = combineLatest([this.currentIssue$, this.user$]).pipe(
      map(([issue, user]) => issue?.creatorId === user.id)
    );
    this.enabledIssueActions$ = this.isAuthorOfIssue$.pipe(
      map(isAuthor => isAuthor ? ['close'] : [])
    );
  }

  ngOnInit(): void {
    // Whenever the issue changes, the participants and messages need to be loaded again.
    // Otherwise, we might be stuck with old participants and messages that don't belong to the new issue.
    this.currentIssueId$.pipe(
      // Without this filter, we could trigger loading of messages although we currently have no issue.
      filter(issueId => !!issueId)
    ).subscribe(currentIssueId =>
      this.store.dispatch([
        new LoadParticipants(currentIssueId),
        new LoadMessages(currentIssueId)
      ])
    );
    this.messageForm = this.fb.group({
      text: this.fb.control('', [Validators.required]),
    });
  }

  async sendMessage() {
    const issue = await this.currentIssue$.pipe(first()).toPromise();
    const user = await this.user$.pipe(first()).toPromise();
    const message: Message = {
      ...this.messageForm.value,
      issueId: issue.id,
      authorId: user.id
    };
    this.messageForm.reset();
    this.store.dispatch(new SendMessage(message));
  }
}
