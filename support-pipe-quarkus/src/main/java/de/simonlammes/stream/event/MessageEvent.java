package de.simonlammes.stream.event;

import de.simonlammes.issue.Issue;
import de.simonlammes.message.Message;
import de.simonlammes.user.User;

public class MessageEvent extends UserRelatedEvent {
    private Message message;

    public Message getMessage() {
        return message;
    }

    public void setMessage(Message message) {
        this.message = message;
    }

    public MessageEvent() {
    }

    public MessageEvent(Message message) {
        this.message = message;
    }
}
