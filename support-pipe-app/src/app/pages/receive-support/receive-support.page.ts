import {Component, OnInit} from '@angular/core';
import {Select, Store} from '@ngxs/store';
import {UserState} from '../../cross-cutting/user/user.state';
import {Observable} from 'rxjs';
import {User} from '../../cross-cutting/user/user.model';
import {Issue} from '../../cross-cutting/issue/issue.model';
import {first, map, switchMap} from 'rxjs/operators';
import {LoadIssue} from '../../cross-cutting/issue/issue.actions';
import {IssueState} from '../../cross-cutting/issue/issue.state';
import {SupportState, SupportStateModel} from '../../cross-cutting/support/support.state';
import {LoadSupporters} from '../../cross-cutting/support/support.actions';

@Component({
  selector: 'app-receive-support',
  templateUrl: './receive-support.page.html',
  styleUrls: ['./receive-support.page.scss'],
})
export class ReceiveSupportPage implements OnInit {

  @Select(UserState.myUser) user$: Observable<User>;
  @Select(SupportState.getState) supportState$: Observable<SupportStateModel>;

  exhibitedIssue$: Observable<Issue>;

  constructor(
    private store: Store
  ) {
    this.exhibitedIssue$ = this.user$.pipe(
      map(user => user.currentlyExhibitedIssueId),
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
    this.user$.pipe(first()).subscribe(user =>
      this.store.dispatch(new LoadSupporters(user.currentlyExhibitedIssueId))
    );
  }
}
