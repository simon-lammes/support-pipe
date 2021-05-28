import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {ReceiveSupportPage} from './receive-support.page';

const routes: Routes = [
  {
    path: '',
    component: ReceiveSupportPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReceiveSupportPageRoutingModule {}
