package de.simonlammes.stream.event;

import de.simonlammes.issue.Issue;
import de.simonlammes.user.User;

public class SupportEvent extends UserRelatedEvent {
    private Issue issue;
    private User supporter;

    public SupportEvent() {
    }

    public SupportEvent(Issue issue, User supporter) {
        this.issue = issue;
        this.supporter = supporter;
    }

    public Issue getIssue() {
        return issue;
    }

    public void setIssue(Issue issue) {
        this.issue = issue;
    }

    public User getSupporter() {
        return supporter;
    }

    public void setSupporter(User supporter) {
        this.supporter = supporter;
    }
}
