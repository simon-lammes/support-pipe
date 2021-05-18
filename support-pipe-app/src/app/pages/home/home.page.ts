import {Component} from '@angular/core';
import {Select} from '@ngxs/store';
import {MyPostedIssuesState} from '../../cross-cutting/issue/my-posted-issues/my-posted-issues.state';
import {Observable} from 'rxjs';
import {Issue} from '../../cross-cutting/issue/issue.model';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  @Select(MyPostedIssuesState.issues) myPostedIssues$: Observable<Issue[]>;

  constructor() {
  }

}
