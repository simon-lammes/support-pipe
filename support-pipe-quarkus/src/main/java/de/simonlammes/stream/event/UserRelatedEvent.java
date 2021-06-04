package de.simonlammes.stream.event;

public abstract class UserRelatedEvent {
    private String type;

    public UserRelatedEvent() {
        this.type = this.getClass().getSimpleName();
    }

    public UserRelatedEvent(String type) {
        this.type = type;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }
}
