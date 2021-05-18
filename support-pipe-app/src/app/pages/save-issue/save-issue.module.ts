import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {IonicModule} from '@ionic/angular';

import {SaveIssuePageRoutingModule} from './save-issue-routing.module';

import {SaveIssuePage} from './save-issue.page';
import {TranslateModule} from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SaveIssuePageRoutingModule,
    ReactiveFormsModule,
    TranslateModule
  ],
  declarations: [SaveIssuePage]
})
export class SaveIssuePageModule {}
