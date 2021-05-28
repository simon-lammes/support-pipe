import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {UserState} from '../../cross-cutting/user/user.state';
import {Store} from '@ngxs/store';
import {PopulateMyUser} from '../../cross-cutting/user/user.actions';
import {map, switchMap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HasNoIssueToSupportGuard implements CanActivate {

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
      map(() => !this.store.selectSnapshot(UserState.myUser).currentlySupportedIssueId),
      switchMap(async (allowed) => {
        if (!allowed) {
          await this.router.navigateByUrl('/support-issue');
        }
        return allowed;
      })
    ).toPromise();
  }

}
