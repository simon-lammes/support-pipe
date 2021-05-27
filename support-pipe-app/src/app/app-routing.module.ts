import {NgModule} from '@angular/core';
import {PreloadAllModules, RouterModule, Routes} from '@angular/router';
import {AuthenticatedGuard} from './cross-cutting/authentication/authenticated.guard';
import {UserPopulatedGuard} from './cross-cutting/user/user-populated.guard';

const routes: Routes = [
  {
    path: 'home',
    canActivate: [AuthenticatedGuard, UserPopulatedGuard],
    loadChildren: () => import('./pages/home/home.module').then(m => m.HomePageModule)
  },
  {
    path: 'issue-feed',
    canActivate: [AuthenticatedGuard, UserPopulatedGuard],
    loadChildren: () => import('./pages/issue-feed/issue-feed.module').then( m => m.IssueFeedPageModule)
  },
  {
    path: 'save-issue',
    canActivate: [AuthenticatedGuard, UserPopulatedGuard],
    loadChildren: () => import('./pages/save-issue/save-issue.module').then(m => m.SaveIssuePageModule)
  },
  {
    path: '**',
    redirectTo: 'home',
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
