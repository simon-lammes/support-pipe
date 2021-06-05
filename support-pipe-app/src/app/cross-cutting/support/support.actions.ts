import {SupportEvent} from './support-event';
import {Message} from '../message/message.service';

export class HandleSupportEvent {
  public static readonly type = '[Support] Add Supporter';
  constructor(public supportEvent: SupportEvent) { }
}

export class LoadSupporters {
  public static readonly type = '[Support] Load Supporters';
  constructor(public issueId: number) { }
}

export class SendMessage {
  public static readonly type = '[Support] Send Message';
  constructor(public message: Message) { }
}

export class LoadMessages {
  public static readonly type = '[Support] Load Messages';
  constructor(public issueId: number) { }
}

export class ReceiveMessage {
  public static readonly type = '[Support] Receive Message';
  constructor(public message: Message) { }
}
