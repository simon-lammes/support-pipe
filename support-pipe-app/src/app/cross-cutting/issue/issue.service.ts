import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {Issue} from './issue.model';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IssueService {

  constructor(
    private http: HttpClient
  ) { }

  getMyPostedIssues(): Observable<Issue[]> {
    return this.http.get<Issue[]>(environment.quarkusBaseUrl + '/issues');
  }

  postIssue(issue: Issue): Observable<Issue> {
    return this.http.post<Issue>(environment.quarkusBaseUrl + '/issues', issue);
  }
}
