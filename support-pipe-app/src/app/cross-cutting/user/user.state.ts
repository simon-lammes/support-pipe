import { State, Action, Selector, StateContext } from '@ngxs/store';
import {PopulateMyUser} from './user.actions';
import {UserService} from './user.service';
import {tap} from 'rxjs/operators';
import {User} from './user.model';
import {Injectable} from '@angular/core';

export interface UserStateModel {
  myUser: User;
}

@Injectable()
@State<UserStateModel>({
  name: 'user',
  defaults: {
    myUser: undefined
  }
})
export class UserState {

  constructor(
    private userService: UserService
  ) {
  }

  @Selector()
  public static myUser(state: UserStateModel) {
    return state.myUser;
  }

  @Action(PopulateMyUser)
  public populateMyUser(ctx: StateContext<UserStateModel>) {
    return this.userService.putMe().pipe(
      tap(user => {
        ctx.patchState({
          myUser: user
        });
      }),
    );
  }
}
