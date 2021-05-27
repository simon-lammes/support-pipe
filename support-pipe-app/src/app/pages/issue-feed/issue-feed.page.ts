import {Component, OnInit} from '@angular/core';
import {Select, Store} from '@ngxs/store';
import {LoadProposalAction, RejectProposalAction} from './issue-feed.actions';
import {IssueFeedState} from './issue-feed.state';
import {Observable} from 'rxjs';
import {Issue} from '../../cross-cutting/issue/issue.model';

@Component({
  selector: 'app-issue-feed',
  templateUrl: './issue-feed.page.html',
  styleUrls: ['./issue-feed.page.scss'],
})
export class IssueFeedPage implements OnInit {

  @Select(IssueFeedState.getProposal) proposal$: Observable<Issue>;

  constructor(
    private store: Store
  ) { }

  ngOnInit() {
    this.store.dispatch(new LoadProposalAction());
  }

  async onProposalRejected(issue: Issue) {
    await this.store.dispatch(new RejectProposalAction(issue)).toPromise();
    this.store.dispatch(new LoadProposalAction());
  }
}
