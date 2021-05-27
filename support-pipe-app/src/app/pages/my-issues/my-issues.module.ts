import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IonicModule} from '@ionic/angular';
import {FormsModule} from '@angular/forms';
import {MyIssuesPage} from './my-issues.page';

import {MyIssuesPageRoutingModule} from './my-issues-routing.module';
import {IssueModule} from '../../components/issue/issue.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MyIssuesPageRoutingModule,
    IssueModule
  ],
  declarations: [MyIssuesPage]
})
export class MyIssuesPageModule {}
