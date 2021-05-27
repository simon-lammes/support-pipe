import {Component, OnInit} from '@angular/core';
import {Select, Store} from '@ngxs/store';
import {MyPostedIssuesState} from '../../cross-cutting/issue/my-posted-issues/my-posted-issues.state';
import {Observable} from 'rxjs';
import {Issue} from '../../cross-cutting/issue/issue.model';
import {LoadPostedIssues} from '../../cross-cutting/issue/my-posted-issues/my-posted-issues.actions';

@Component({
  selector: 'app-my-issues',
  templateUrl: 'my-issues.page.html',
  styleUrls: ['my-issues.page.scss'],
})
export class MyIssuesPage implements OnInit {

  @Select(MyPostedIssuesState.optimisticIssues) myPostedIssues$: Observable<Issue[]>;

  constructor(
    private store: Store
  ) {
  }

  ngOnInit(): void {
    this.store.dispatch(new LoadPostedIssues());
  }

  /**
   * This function should be updated, once issues can be modified or edited.
   * This function is not only used to make angular rendering more efficient but also to
   * prevent content jumping:
   * https://stackoverflow.com/questions/52705148/how-to-prevent-content-jumping-scrolling-in-angular-5-with-ngrx
   */
  trackByIssue(index, _item: Issue) {
    return index;
  }
}
