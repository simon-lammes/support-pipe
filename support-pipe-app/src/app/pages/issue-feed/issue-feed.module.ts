import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {IonicModule} from '@ionic/angular';

import {IssueFeedPageRoutingModule} from './issue-feed-routing.module';

import {IssueFeedPage} from './issue-feed.page';
import {IssueModule} from '../../components/issue/issue.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    IssueFeedPageRoutingModule,
    IssueModule
  ],
  declarations: [IssueFeedPage]
})
export class IssueFeedPageModule {}
