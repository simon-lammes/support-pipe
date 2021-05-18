import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {IonicModule} from '@ionic/angular';

import {SaveIssuePageRoutingModule} from './save-issue-routing.module';

import {SaveIssuePage} from './save-issue.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SaveIssuePageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [SaveIssuePage]
})
export class SaveIssuePageModule {}
