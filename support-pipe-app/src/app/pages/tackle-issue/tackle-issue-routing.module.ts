import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {TackleIssuePage} from './tackle-issue.page';

const routes: Routes = [
  {
    path: '',
    component: TackleIssuePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TackleIssuePageRoutingModule {}
