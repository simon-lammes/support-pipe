import {NgModule} from '@angular/core';
import {PreloadAllModules, RouterModule, Routes} from '@angular/router';
import {AuthenticatedGuard} from './cross-cutting/authentication/authenticated.guard';
import {UserPopulatedGuard} from './cross-cutting/user/user-populated.guard';
import {HasIssueToSupportGuard} from './pages/support-issue/has-issue-to-support.guard';
import {HasNoIssueToSupportGuard} from './pages/support-issue/has-no-issue-to-support.guard';
import {HasIssueExhibitedGuard} from './pages/receive-support/has-issue-exhibited.guard';
import {HasNoIssueExhibitedGuard} from './pages/receive-support/has-no-issue-exhibited.guard';

const routes: Routes = [
  {
    path: 'tabs',
    canActivate: [
      AuthenticatedGuard,
      UserPopulatedGuard,
      HasNoIssueToSupportGuard,
      HasNoIssueExhibitedGuard
    ],
    loadChildren: () => import('./pages/tabs/tabs.module').then( m => m.TabsPageModule)
  },
  {
    path: 'support-issue',
    canActivate: [HasIssueToSupportGuard],
    loadChildren: () => import('./pages/support-issue/support-issue.module').then(m => m.SupportIssuePageModule)
  },
  {
    path: 'receive-support',
    canActivate: [HasIssueExhibitedGuard],
    loadChildren: () => import('./pages/receive-support/receive-support.module').then( m => m.ReceiveSupportPageModule)
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
