import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {MyIssuesPage} from './my-issues.page';

const routes: Routes = [
  {
    path: '',
    component: MyIssuesPage,
  },
  {
    path: 'save-issue',
    loadChildren: () => import('../my-issues/save-issue/save-issue.module').then(m => m.SaveIssuePageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MyIssuesPageRoutingModule {}
