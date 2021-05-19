import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {Issue} from './issue.model';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

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
}
