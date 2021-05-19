import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import {UserService} from './user.service';
import {Store} from '@ngxs/store';
import {UserState} from './user.state';
import {PopulateMyUser} from './user.actions';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserPopulatedGuard implements CanActivate {

  constructor(
    private store: Store
  ) {
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const myUser = this.store.selectSnapshot(UserState.myUser);
    if (myUser) {
      return true;
    }
    return this.store.dispatch(PopulateMyUser).pipe(
      map(() => !!this.store.selectSnapshot(UserState.myUser))
    );
  }
}
