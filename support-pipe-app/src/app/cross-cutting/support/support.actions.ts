import {SupportEvent} from './support-event';

export class HandleSupportEvent {
  public static readonly type = '[Support] Add Supporter';
  constructor(public supportEvent: SupportEvent) { }
}

export class LoadSupporters {
  public static readonly type = '[Support] Load Supporters';
  constructor(public issueId: number) { }
}
