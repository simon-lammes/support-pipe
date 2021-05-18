import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-save-issue',
  templateUrl: './save-issue.page.html',
  styleUrls: ['./save-issue.page.scss'],
})
export class SaveIssuePage implements OnInit {
  issueForm: FormGroup;

  constructor(
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.issueForm = this.fb.group({
      title: this.fb.control(''),
      description: this.fb.control('')
    });
  }

  submitIssueForm() {
    console.log(this.issueForm.value);
  }
}
