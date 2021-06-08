import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {IonicModule} from '@ionic/angular';

import {SupportPageRoutingModule} from './support-routing.module';

import {SupportPage} from './support.page';
import {IssueModule} from '../../components/issue/issue.module';
import {MessageBlockModule} from '../../components/message-block/message-block.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SupportPageRoutingModule,
    ReactiveFormsModule,
    IssueModule,
    MessageBlockModule
  ],
  declarations: [SupportPage]
})
export class SupportPageModule {}
