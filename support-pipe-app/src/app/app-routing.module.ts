import {NgModule} from '@angular/core';
import {PreloadAllModules, RouterModule, Routes} from '@angular/router';
import {AuthenticatedGuard} from './cross-cutting/authentication/authenticated.guard';
import {UserPopulatedGuard} from './cross-cutting/user/user-populated.guard';
import {HasNoIssueToSupportGuard} from './pages/support/has-no-issue-to-support.guard';
import {HasNoIssueExhibitedGuard} from './pages/support/has-no-issue-exhibited.guard';
import {HasIssueToSupportOrExhibitedIssueGuard} from './pages/support/has-issue-to-support-or-exhibited-issue.guard';

const routes: Routes = [
  {
    path: 'tabs',
    canActivate: [
      AuthenticatedGuard,
      UserPopulatedGuard,
      HasNoIssueToSupportGuard,
      HasNoIssueExhibitedGuard
    ],
    loadChildren: () => import('./pages/tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'support',
    canActivate: [HasIssueToSupportOrExhibitedIssueGuard],
    loadChildren: () => import('./pages/support/support.module').then(m => m.SupportPageModule)
  },
  {
    path: '**',
    redirectTo: 'tabs',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {preloadingStrategy: PreloadAllModules})
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
