import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import {KeycloakService} from 'keycloak-angular';

@Injectable({
  providedIn: 'root'
})
export class AuthenticatedGuard implements CanActivate {

  constructor(
    private keycloakService: KeycloakService
  ) {
  }

  async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean>{
    const loggedIn = await this.keycloakService.isLoggedIn();
    if (!loggedIn) {
      await this.keycloakService.login();
    }
    return this.keycloakService.isLoggedIn();
  }
}
