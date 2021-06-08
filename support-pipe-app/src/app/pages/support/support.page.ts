import {Component, OnInit} from '@angular/core';
import {Select, Store} from '@ngxs/store';
import {UserState} from '../../cross-cutting/user/user.state';
import {Observable} from 'rxjs';
import {User} from '../../cross-cutting/user/user.model';
import {OptimisticSupportStateModel, SupportState} from '../../cross-cutting/support/support.state';
import {Issue} from '../../cross-cutting/issue/issue.model';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {first, map, switchMap} from 'rxjs/operators';
import {LoadIssue} from '../../cross-cutting/issue/issue.actions';
import {IssueState} from '../../cross-cutting/issue/issue.state';
import {LoadMessages, LoadParticipants, SendMessage} from '../../cross-cutting/support/support.actions';
import {Message} from '../../cross-cutting/message/message.service';

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
  messageForm: FormGroup;

  constructor(
    private store: Store,
    private fb: FormBuilder
  ) {
    this.currentIssueId$ = this.user$.pipe(
      map(user => user.currentlyTackledIssueId ?? user.currentlyTackledIssueId)
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
  }

  ngOnInit(): void {
    this.currentIssueId$.pipe(first()).subscribe(currentIssueId =>
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
