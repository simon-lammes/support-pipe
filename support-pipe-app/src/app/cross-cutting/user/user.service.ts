import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Issue} from '../issue/issue.model';
import {environment} from '../../../environments/environment';
import {User} from './user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private http: HttpClient
  ) { }

  putMe() {
    return this.http.put<User>(environment.quarkusBaseUrl + '/users/me', undefined);
  }
}
