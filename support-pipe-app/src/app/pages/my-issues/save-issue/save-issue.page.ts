import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Store} from '@ngxs/store';
import {PostIssue} from '../../../cross-cutting/issue/my-posted-issues/my-posted-issues.actions';
import {Router} from '@angular/router';
import {UserState} from '../../../cross-cutting/user/user.state';

@Component({
  selector: 'app-save-issue',
  templateUrl: './save-issue.page.html',
  styleUrls: ['./save-issue.page.scss'],
})
export class SaveIssuePage implements OnInit {
  issueForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private store: Store,
    private router: Router
  ) { }

  ngOnInit() {
    this.issueForm = this.fb.group({
      title: this.fb.control(''),
      description: this.fb.control('')
    });
  }

  async submitIssueForm() {
    await this.store.dispatch(new PostIssue({
      ...this.issueForm.value,
      doesRequireHelp: true,
      creatorId: this.store.selectSnapshot(UserState.myUser).id
    }));
    await this.router.navigateByUrl('/tabs/my-issues');
  }
}
