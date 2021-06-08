import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MessageBlockComponent} from './message-block.component';


@NgModule({
  declarations: [
    MessageBlockComponent
  ],
  exports: [
    MessageBlockComponent
  ],
  imports: [
    CommonModule
  ]
})
export class MessageBlockModule { }
