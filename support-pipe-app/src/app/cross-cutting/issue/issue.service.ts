import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {Issue} from './issue.model';
import {Observable} from 'rxjs';
import {Store} from '@ngxs/store';
import {UserState} from '../user/user.state';
import {User} from '../user/user.model';

@Injectable({
  providedIn: 'root'
})
export class IssueService {

  constructor(
    private http: HttpClient,
    private store: Store
  ) { }

  getMyPostedIssues(): Observable<Issue[]> {
    const userId = this.store.selectSnapshot(UserState.myUser)?.id;
    return this.http.get<Issue[]>(environment.quarkusBaseUrl + '/issues', {
      params: {
        includedCreatorIds: [userId.toString()]
      }
    });
  }

  postIssue(issue: Issue): Observable<Issue> {
    return this.http.post<Issue>(environment.quarkusBaseUrl + '/issues', issue);
  }

  getIssueProposal(excludedIssueIds: number[] = []) {
    return this.http.get<Issue>(environment.quarkusBaseUrl + '/issues/proposal', {
      params: {
        excludedIssueIds: excludedIssueIds.map(x => x.toString())
      }
    });
  }

  getIssueById(issueId: number) {
    return this.http.get<Issue>(environment.quarkusBaseUrl + `/issues/${issueId}`, );
  }

  getParticipants(issueId: number) {
    return this.http.get<User[]>(`${environment.quarkusBaseUrl}/issues/${issueId}/participants`);
  }
}
