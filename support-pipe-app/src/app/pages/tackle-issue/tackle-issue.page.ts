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
  selector: 'app-tackle-issue',
  templateUrl: './tackle-issue.page.html',
  styleUrls: ['./tackle-issue.page.scss'],
})
export class TackleIssuePage {

  @Select(UserState.myUser) user$: Observable<User>;

  tackledIssue$: Observable<Issue>;

  constructor(
    private store: Store
  ) {
    this.tackledIssue$ = this.user$.pipe(
      switchMap(async user => {
        await this.store.dispatch(new LoadIssue(user.currentlyTackledIssueId)).toPromise();
        return user;
      }),
      switchMap(user => this.store.select(
        IssueState.issueById(user.currentlyTackledIssueId)
      ))
    );
  }


}
