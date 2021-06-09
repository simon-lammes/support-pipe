package de.simonlammes.stream.event;

import de.simonlammes.issue.Issue;

public class IssueCreatedEvent extends UserRelatedEvent {
    private Issue issue;

    public Issue getIssue() {
        return issue;
    }

    public void setIssue(Issue issue) {
        this.issue = issue;
    }
}
