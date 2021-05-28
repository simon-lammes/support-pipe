import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Issue} from '../../cross-cutting/issue/issue.model';

@Component({
  selector: 'app-issue',
  templateUrl: './issue.component.html',
  styleUrls: ['./issue.component.css']
})
export class IssueComponent {
  @Input() issue: Issue;

  /**
   * Whether this issue is a proposal for the user to help fixing.
   */
  @Input() isProposal = false;
  @Output() issueRejected = new EventEmitter<boolean>();
  @Output() issueSupported = new EventEmitter<boolean>();

  rejectIssue() {
    this.issueRejected.emit(true);
  }

  supportIssue() {
    this.issueSupported.emit(true);
  }
}
