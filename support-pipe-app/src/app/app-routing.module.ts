import {NgModule} from '@angular/core';
import {PreloadAllModules, RouterModule, Routes} from '@angular/router';
import {AuthenticatedGuard} from './cross-cutting/authentication/authenticated.guard';
import {UserPopulatedGuard} from './cross-cutting/user/user-populated.guard';
import {IsTacklingNoIssueGuard} from './pages/support/is-tackling-no-issue.guard';
import {IsTacklingAnIssueGuard} from './pages/support/is-tackling-an-issue.guard';

const routes: Routes = [
  {
    path: 'tabs',
    canActivate: [
      AuthenticatedGuard,
      UserPopulatedGuard,
      IsTacklingNoIssueGuard
    ],
    loadChildren: () => import('./pages/tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'support',
    canActivate: [IsTacklingAnIssueGuard],
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
