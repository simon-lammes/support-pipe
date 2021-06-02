import {Component, NgZone} from '@angular/core';
import {EventSourcePolyfill} from 'ng-event-source';
import {KeycloakService} from 'keycloak-angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(
    private zone: NgZone,
    private keycloakService: KeycloakService
  ) {
    this.keycloakService.getToken().then(token => {
      if (!token)  {
        return;
      }
      const eventSource = new EventSourcePolyfill('http://localhost:9090/event-stream/user-related-events', {
        headers: {
          // eslint-disable-next-line @typescript-eslint/naming-convention
          Authorization: `Bearer ${token}`
        }
      });
      eventSource.onmessage = (message => {
        this.zone.run(() => {
          console.log('data', message);
        });
      });
      eventSource.onopen = (a) => {
        // Do stuff here
      };
      eventSource.onerror = (e) => {
        // Do stuff here
      };
      window.setTimeout(() => {
        eventSource.close();
      }, 15000);
    });
  }
}
