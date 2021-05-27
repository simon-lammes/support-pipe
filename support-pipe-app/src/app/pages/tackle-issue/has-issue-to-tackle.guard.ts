import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {Store} from '@ngxs/store';
import {UserState} from '../../cross-cutting/user/user.state';
import {PopulateMyUser} from '../../cross-cutting/user/user.actions';
import {map, switchMap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HasIssueToTackleGuard implements CanActivate {

  constructor(
    private store: Store,
    private router: Router
  ) {
  }

  async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean> {
    return this.store.dispatch(PopulateMyUser).pipe(
      map(() => !!this.store.selectSnapshot(UserState.myUser).currentlyTackledIssueId),
      switchMap(async (allowed) => {
        if (!allowed) {
          await this.router.navigateByUrl('/tabs/issue-feed');
        }
        return allowed;
      })
    ).toPromise();
  }
}
