import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {Store} from '@ngxs/store';
import {PopulateMyUser} from '../../cross-cutting/user/user.actions';
import {filter, first, map, switchMap} from 'rxjs/operators';
import {UserState} from '../../cross-cutting/user/user.state';

@Injectable({
  providedIn: 'root'
})
export class HasIssueExhibitedGuard implements CanActivate {

  constructor(
    private store: Store,
    private router: Router
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
      map(userState => !!userState.myUser.currentlyExhibitedIssueId),
      switchMap(async (allowed) => {
        if (!allowed) {
          await this.router.navigateByUrl('/tabs/issue-feed');
        }
        return allowed;
      })
    ).toPromise();
  }
}
