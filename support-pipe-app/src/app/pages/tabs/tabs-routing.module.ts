import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {TabsPage} from './tabs.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'my-issues',
        loadChildren: () => import('../my-issues/my-issues.module').then(m => m.MyIssuesPageModule)
      },
      {
        path: 'issue-feed',
        loadChildren: () => import('../../pages/issue-feed/issue-feed.module').then( m => m.IssueFeedPageModule)
      },
      {
        path: '**',
        redirectTo: 'issue-feed',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsPageRoutingModule {}
