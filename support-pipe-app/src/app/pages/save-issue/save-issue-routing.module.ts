import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {SaveIssuePage} from './save-issue.page';

const routes: Routes = [
  {
    path: '',
    component: SaveIssuePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SaveIssuePageRoutingModule {}
