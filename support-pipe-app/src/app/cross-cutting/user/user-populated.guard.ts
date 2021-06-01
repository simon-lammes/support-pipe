import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {Store} from '@ngxs/store';
import {UserState} from './user.state';
import {PopulateMyUser} from './user.actions';
import {filter, first, map, switchMap} from 'rxjs/operators';

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
    return this.store.dispatch(PopulateMyUser).pipe(
      switchMap(() => this.store.select(UserState.state)),
      filter(userState => !userState.isWaitingForMyUser),
      first(),
      map(userState => !!userState.myUser)
    );
  }
}
