import {Component} from '@angular/core';
import {Observable} from 'rxjs';
import {Issue} from '../../cross-cutting/issue/issue.model';
import {Select, Store} from '@ngxs/store';
import {IssueState} from '../../cross-cutting/issue/issue.state';
import {UserState} from '../../cross-cutting/user/user.state';
import {User} from '../../cross-cutting/user/user.model';
import {switchMap} from 'rxjs/operators';
import {LoadIssue} from '../../cross-cutting/issue/issue.actions';

@Component({
  selector: 'app-support-issue',
  templateUrl: './support-issue.page.html',
  styleUrls: ['./support-issue.page.scss'],
})
export class SupportIssuePage {

  @Select(UserState.myUser) user$: Observable<User>;

  supportedIssue$: Observable<Issue>;

  constructor(
    private store: Store
  ) {
    this.supportedIssue$ = this.user$.pipe(
      switchMap(async user => {
        await this.store.dispatch(new LoadIssue(user.currentlySupportedIssueId)).toPromise();
        return user;
      }),
      switchMap(user => this.store.select(
        IssueState.issueById(user.currentlySupportedIssueId)
      ))
    );
  }


}
