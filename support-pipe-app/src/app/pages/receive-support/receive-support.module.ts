import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {IonicModule} from '@ionic/angular';

import {ReceiveSupportPageRoutingModule} from './receive-support-routing.module';

import {ReceiveSupportPage} from './receive-support.page';
import {IssueModule} from '../../components/issue/issue.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReceiveSupportPageRoutingModule,
    IssueModule
  ],
  declarations: [ReceiveSupportPage]
})
export class ReceiveSupportPageModule {}
