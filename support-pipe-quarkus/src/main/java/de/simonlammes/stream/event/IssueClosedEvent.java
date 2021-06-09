package de.simonlammes.stream.event;

import de.simonlammes.issue.Issue;
import de.simonlammes.user.User;

import java.util.List;

public class IssueClosedEvent extends UserRelatedEvent {
    private List<User> participants;
    private Issue issue;

    public List<User> getParticipants() {
        return participants;
    }

    public void setParticipants(List<User> participants) {
        this.participants = participants;
    }

    public Issue getIssue() {
        return issue;
    }

    public void setIssue(Issue issue) {
        this.issue = issue;
    }
}
