import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {IonicModule} from '@ionic/angular';

import {SupportIssuePageRoutingModule} from './support-issue-routing.module';

import {SupportIssuePage} from './support-issue.page';
import {IssueModule} from '../../components/issue/issue.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SupportIssuePageRoutingModule,
    IssueModule
  ],
  declarations: [SupportIssuePage]
})
export class SupportIssuePageModule {}
