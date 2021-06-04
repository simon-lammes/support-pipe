import {Action, Selector, State, StateContext} from '@ngxs/store';
import {HandleSupportEvent, LoadSupporters} from './support.actions';
import {Injectable} from '@angular/core';
import {User} from '../user/user.model';
import {IssueService} from '../issue/issue.service';
import {tap} from 'rxjs/operators';

export interface SupportStateModel {
  supporters: User[];
}

@Injectable()
@State<SupportStateModel>({
  name: 'support',
  defaults: {
    supporters: []
  }
})
export class SupportState {

  constructor(
    private issueService: IssueService
  ) {
  }

  @Selector()
  public static getState(state: SupportStateModel) {
    return state;
  }

  @Action(HandleSupportEvent)
  public addSupporter(ctx: StateContext<SupportStateModel>, {supportEvent}: HandleSupportEvent) {
    ctx.patchState({
      supporters: [...ctx.getState().supporters, supportEvent.supporter]
    });
  }

  @Action(LoadSupporters)
  public loadSupporters(ctx: StateContext<SupportStateModel>, {issueId}: LoadSupporters) {
    return this.issueService.getSupporters(issueId).pipe(
      tap(supporters => {
        ctx.patchState({supporters});
      })
    );
  }
}
