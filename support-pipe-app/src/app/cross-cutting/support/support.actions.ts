export class HandleSupportEvent {
  public static readonly type = '[Support] Add Supporter';
  constructor(public supportEvent: any) { }
}
