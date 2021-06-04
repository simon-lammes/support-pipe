import {Action, Selector, State, StateContext} from '@ngxs/store';
import {HandleSupportEvent} from './support.actions';
import {Injectable} from '@angular/core';

export interface SupportStateModel {
  supporters: any[];
}

@Injectable()
@State<SupportStateModel>({
  name: 'support',
  defaults: {
    supporters: []
  }
})
export class SupportState {

  @Selector()
  public static getState(state: SupportStateModel) {
    return state;
  }

  @Action(HandleSupportEvent)
  public addSupporter(ctx: StateContext<SupportStateModel>, { supportEvent }: HandleSupportEvent) {
    console.log('x23', supportEvent);
    // ctx.patchState({
    //   supporters: [...ctx.getState().supporters, newSupporter]
    // });
  }
}
