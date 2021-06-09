import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient, HttpParams} from '@angular/common/http';
import {User} from '../user/user.model';

export interface Message {
  id: number;
  text: string;
  authorId: number;
  author: User;
  issueId: number;
}

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  constructor(
    private http: HttpClient
  ) { }

  sendMessage(message: Message) {
    return this.http.post<Message>(`${environment.quarkusBaseUrl}/messages`, message);
  }

  loadMessages(issueId: number) {
    return this.http.get<Message[]>(`${environment.quarkusBaseUrl}/messages`, {
      params: new HttpParams().set('issueId', issueId.toString())
    });
  }
}
