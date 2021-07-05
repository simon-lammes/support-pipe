import {Component, OnInit} from '@angular/core';
import {Select, Store} from '@ngxs/store';
import {Observable} from 'rxjs';
import {Issue} from '../../cross-cutting/issue/issue.model';
import {Router} from '@angular/router';
import {SupportProposalAction} from '../../cross-cutting/user/user.actions';
import {IssueState, IssueStateModel} from '../../cross-cutting/issue/issue.state';
import {LoadProposalAction, RejectProposalAction} from '../../cross-cutting/issue/issue.actions';
import {filter} from 'rxjs/operators';

@Component({
  selector: 'app-issue-feed',
  templateUrl: './issue-feed.page.html',
  styleUrls: ['./issue-feed.page.scss'],
})
export class IssueFeedPage implements OnInit {

  @Select(IssueState.getProposal) proposal$: Observable<Issue>;
  @Select(IssueState.getState) issueState$: Observable<IssueStateModel>;

  constructor(
    private store: Store,
    private router: Router
  ) { }

  ngOnInit() {
    // Whenever the issue state changes and we do not have a proposal, we try to load one.
    this.issueState$.pipe(
      filter(state => state.proposalState !== 'found' && state.proposalState !== 'loading')
    ).subscribe(() =>
      this.store.dispatch(new LoadProposalAction())
    );
  }

  async onProposalRejected(issue: Issue) {
    await this.store.dispatch(new RejectProposalAction(issue)).toPromise();
    this.store.dispatch(new LoadProposalAction());
  }

  async onProposalSupported(proposal: Issue) {
    await this.store.dispatch(new SupportProposalAction(proposal)).toPromise();
    await this.router.navigate(['support']);
  }
}
