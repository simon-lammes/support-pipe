import {Component, Input} from '@angular/core';
import {Issue} from '../../cross-cutting/issue/issue.model';

@Component({
  selector: 'app-issue',
  templateUrl: './issue.component.html',
  styleUrls: ['./issue.component.css']
})
export class IssueComponent {
  @Input() issue: Issue;
}
