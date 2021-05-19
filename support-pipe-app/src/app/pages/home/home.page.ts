import {Component, OnInit} from '@angular/core';
import {Select, Store} from '@ngxs/store';
import {MyPostedIssuesState} from '../../cross-cutting/issue/my-posted-issues/my-posted-issues.state';
import {Observable} from 'rxjs';
import {Issue} from '../../cross-cutting/issue/issue.model';
import {KeycloakService} from 'keycloak-angular';
import {LoadPostedIssues} from '../../cross-cutting/issue/my-posted-issues/my-posted-issues.actions';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  @Select(MyPostedIssuesState.issues) myPostedIssues$: Observable<Issue[]>;

  constructor(
    private store: Store
  ) {
  }

  ngOnInit(): void {
    this.store.dispatch(new LoadPostedIssues());
  }

}
