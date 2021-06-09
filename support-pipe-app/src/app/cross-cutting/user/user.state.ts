import {Action, Selector, State, StateContext} from '@ngxs/store';
import {CloseIssue, IssueClosed, PopulateMyUser, SupportProposalAction} from './user.actions';
import {UserService} from './user.service';
import {finalize, switchMap, tap} from 'rxjs/operators';
import {User} from './user.model';
import {Injectable, NgZone} from '@angular/core';
import {Router} from '@angular/router';

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
    private userService: UserService,
    private router: Router,
    private ngZone: NgZone
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

  @Action(CloseIssue)
  public closeIssue(ctx: StateContext<UserStateModel>, {issue}: CloseIssue) {
    return this.userService.closeIssue(issue.id).pipe(
      tap(user => ctx.patchState({myUser: user})),
      switchMap(() => this.ngZone.run(() => this.router.navigateByUrl('/tabs/issue-feed')))
    );
  }

  @Action(IssueClosed)
  public issueClosed(ctx: StateContext<UserStateModel>, {event}: IssueClosed) {
    const myUser = ctx.getState().myUser;
    const myNewUser = event.participants.find(participant => myUser.id === participant.id);
    if (!myNewUser) {
      return;
    }
    ctx.patchState({myUser: myNewUser});
    return this.ngZone.run(() => this.router.navigateByUrl('/tabs/issue-feed'));
  }
}
