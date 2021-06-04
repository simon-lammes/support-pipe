import {APP_INITIALIZER, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {RouteReuseStrategy} from '@angular/router';

import {IonicModule, IonicRouteStrategy} from '@ionic/angular';

import {AppComponent} from './app.component';
import {AppRoutingModule} from './app-routing.module';
import {ReactiveFormsModule} from '@angular/forms';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {environment} from '../environments/environment';
import {NgxsModule} from '@ngxs/store';
import {MyPostedIssuesState} from './cross-cutting/issue/my-posted-issues/my-posted-issues.state';
import {KeycloakAngularModule, KeycloakService} from 'keycloak-angular';
import {UserState} from './cross-cutting/user/user.state';
import {IssueState} from './cross-cutting/issue/issue.state';
import {StreamState} from './cross-cutting/stream/stream.state';
import {SupportState} from './cross-cutting/support/support.state';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    TranslateModule.forRoot({
      defaultLanguage: 'en',
      loader: {
        provide: TranslateLoader,
        deps: [HttpClient],
        useFactory: (http: HttpClient) => new TranslateHttpLoader(http, './assets/i18n/', '.json')
      }
    }),
    NgxsModule.forRoot([
      MyPostedIssuesState,
      UserState,
      IssueState,
      StreamState,
      SupportState
    ], {
      developmentMode: !environment.production
    }),
    KeycloakAngularModule
  ],
  providers: [
    {
      provide: RouteReuseStrategy,
      useClass: IonicRouteStrategy
    },
    {
      provide: APP_INITIALIZER,
      useFactory: (keycloak: KeycloakService) => () => keycloak.init({
          config: {
            url: 'http://localhost:8080/auth',
            realm: 'support-pipe',
            clientId: 'frontend',
          },
          initOptions: {
            onLoad: 'check-sso',
            // PKCE solves some security vulnerabilities.
            // The use of PKCE should also be enforced in our backend in my opinion.
            pkceMethod: 'S256',
            silentCheckSsoRedirectUri:
              window.location.origin + '/assets/silent-check-sso.html',
          },
        }),
      multi: true,
      deps: [KeycloakService],
    }
  ],
  bootstrap: [AppComponent],
  exports: [
  ]
})
export class AppModule {}
