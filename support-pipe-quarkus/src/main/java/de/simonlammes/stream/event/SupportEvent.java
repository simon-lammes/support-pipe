package de.simonlammes.stream.event;

import de.simonlammes.user.User;

public class SupportEvent extends UserRelatedEvent {
    private User supporter;

    public SupportEvent() {
    }

    public SupportEvent(User supporter) {
        this.supporter = supporter;
    }

    public User getSupporter() {
        return supporter;
    }

    public void setSupporter(User supporter) {
        this.supporter = supporter;
    }
}
