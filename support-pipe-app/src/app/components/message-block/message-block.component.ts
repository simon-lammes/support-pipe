import {Component, Input, OnInit} from '@angular/core';
import {Message} from '../../cross-cutting/message/message.service';
import {Store} from '@ngxs/store';
import {UserState} from '../../cross-cutting/user/user.state';
import {User} from '../../cross-cutting/user/user.model';
import {Observable, of} from 'rxjs';

@Component({
  selector: 'app-message-block',
  templateUrl: './message-block.component.html',
  styleUrls: ['./message-block.component.scss']
})
export class MessageBlockComponent implements OnInit {

  @Input() messages: Message[];
  myUserId: number;
  author$: Observable<User>;

  constructor(
    private store: Store
  ) { }

  ngOnInit(): void {
    this.myUserId = this.store.selectSnapshot(UserState.myUser).id;
    this.author$ = of(this.messages[0].author);
  }


  areMessagesSentByMe() {
    return this.messages[0].authorId === this.myUserId;
  }
}
