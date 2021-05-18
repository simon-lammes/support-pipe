import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IssueComponent} from './issue.component';
import {IonicModule} from '@ionic/angular';


@NgModule({
  declarations: [
    IssueComponent
  ],
  exports: [
    IssueComponent
  ],
  imports: [
    CommonModule,
    IonicModule
  ]
})
export class IssueModule { }
