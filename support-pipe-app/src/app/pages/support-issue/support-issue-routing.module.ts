import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {SupportIssuePage} from './support-issue.page';

const routes: Routes = [
  {
    path: '',
    component: SupportIssuePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SupportIssuePageRoutingModule {}
