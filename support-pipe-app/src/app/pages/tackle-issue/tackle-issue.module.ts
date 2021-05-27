import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {IonicModule} from '@ionic/angular';

import {TackleIssuePageRoutingModule} from './tackle-issue-routing.module';

import {TackleIssuePage} from './tackle-issue.page';
import {IssueModule} from '../../components/issue/issue.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TackleIssuePageRoutingModule,
    IssueModule
  ],
  declarations: [TackleIssuePage]
})
export class TackleIssuePageModule {}
