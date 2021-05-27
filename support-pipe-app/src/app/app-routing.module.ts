import {NgModule} from '@angular/core';
import {PreloadAllModules, RouterModule, Routes} from '@angular/router';
import {AuthenticatedGuard} from './cross-cutting/authentication/authenticated.guard';
import {UserPopulatedGuard} from './cross-cutting/user/user-populated.guard';
import {HasIssueToTackleGuard} from './pages/tackle-issue/has-issue-to-tackle.guard';
import {HasNoIssueToTackleGuard} from './pages/tackle-issue/has-no-issue-to-tackle.guard';

const routes: Routes = [
  {
    path: 'tabs',
    canActivate: [AuthenticatedGuard, UserPopulatedGuard, HasNoIssueToTackleGuard],
    loadChildren: () => import('./pages/tabs/tabs.module').then( m => m.TabsPageModule)
  },
  {
    path: 'tackle-issue',
    canActivate: [HasIssueToTackleGuard],
    loadChildren: () => import('./pages/tackle-issue/tackle-issue.module').then(m => m.TackleIssuePageModule)
  },
  {
    path: '**',
    redirectTo: 'tabs',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
