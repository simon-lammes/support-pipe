import {Action, Selector, State, StateContext} from '@ngxs/store';
import {PopulateMyUser, SupportProposalAction} from './user.actions';
import {UserService} from './user.service';
import {finalize, tap} from 'rxjs/operators';
import {User} from './user.model';
import {Injectable} from '@angular/core';

export interface UserStateModel {
  isWaitingForMyUser: boolean;
  myUser: User;
}

@Injectable()
@State<UserStateModel>({
  name: 'user',
  defaults: {
    isWaitingForMyUser: false,
    myUser: undefined
  }
})
export class UserState {

  constructor(
    private userService: UserService
  ) {
  }

  @Selector()
  public static state(state: UserStateModel) {
    return state;
  }


  @Selector()
  public static myUser(state: UserStateModel) {
    return state.myUser;
  }

  @Action(PopulateMyUser)
  public populateMyUser(ctx: StateContext<UserStateModel>) {
    if (ctx.getState().isWaitingForMyUser) {
      return;
    }
    ctx.patchState({
      isWaitingForMyUser: true
    });
    return this.userService.putMe().pipe(
      tap(user => {
        ctx.patchState({
          myUser: user
        });
      }),
      finalize(() => {
        ctx.patchState({
          isWaitingForMyUser: false
        });
      })
    );
  }

  @Action(SupportProposalAction)
  public supportProposal(ctx: StateContext<UserStateModel>, {proposal}: SupportProposalAction) {
    return this.userService.supportIssue(proposal).pipe(
      tap((user) => {
        ctx.patchState({
          myUser: user
        });
      })
    );
  }
}
