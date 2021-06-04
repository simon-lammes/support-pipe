import {Injectable} from '@angular/core';
import {EventSourcePolyfill} from 'ng-event-source';
import {Observable, Subject} from 'rxjs';
import {KeycloakService} from 'keycloak-angular';
import {UserRelatedEvent} from './user-related-event';

@Injectable({
  providedIn: 'root'
})
export class StreamService {

  private userRelatedEvents$: Observable<UserRelatedEvent>;
  private userRelatedEventsBehaviourSubject: Subject<UserRelatedEvent>;

  constructor(
    private keycloakService: KeycloakService
  ) {
  }

  listenToUserRelatedEvents() {
    if (this.userRelatedEvents$) {
      return this.userRelatedEvents$;
    }
    this.userRelatedEventsBehaviourSubject = new Subject<UserRelatedEvent>();
    this.userRelatedEvents$ = this.userRelatedEventsBehaviourSubject.asObservable();
    this.keycloakService.getToken().then(token => {
      const eventSource = new EventSourcePolyfill('http://localhost:9090/event-stream/user-related-events', {
        headers: {
          // eslint-disable-next-line @typescript-eslint/naming-convention
          Authorization: `Bearer ${token}`
        }
      });
      eventSource.onmessage = message => {
        this.userRelatedEventsBehaviourSubject.next(JSON.parse(message.data));
      };
      eventSource.onerror = error => {
        this.userRelatedEventsBehaviourSubject.error(error);
      };
    });
    return this.userRelatedEvents$;
  }
}
