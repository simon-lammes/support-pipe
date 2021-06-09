import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {Issue} from '../../cross-cutting/issue/issue.model';

@Component({
  selector: 'app-issue',
  templateUrl: './issue.component.html',
  styleUrls: ['./issue.component.css']
})
export class IssueComponent implements OnChanges {
  @Input() issue: Issue;

  /**
   * The number of milliseconds a new issue is disabled to prevent the user from
   * accidentally clicking a newly popped up issue.
   */
  @Input() disabledTimeoutForNewIssue = 1000;

  /**
   * Whether this issue is a proposal for the user to help fixing.
   */
  @Input() isProposal = false;
  @Output() issueRejected = new EventEmitter<boolean>();
  @Output() issueSupported = new EventEmitter<boolean>();
  isIssueEnabled = true;

  ngOnChanges(changes: SimpleChanges): void {
    const newIssue = changes.issue?.currentValue as Issue;
    if (newIssue && this.disabledTimeoutForNewIssue) {
      this.isIssueEnabled = false;
      setTimeout(() => {
        const hasIssueNotChangedInMeantime = newIssue.id === this.issue.id;
        if (hasIssueNotChangedInMeantime) {
          this.isIssueEnabled = true;
        }
      }, this.disabledTimeoutForNewIssue);
    }
  }

  rejectIssue() {
    this.issueRejected.emit(true);
  }

  supportIssue() {
    this.issueSupported.emit(true);
  }
}
