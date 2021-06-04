package de.simonlammes.stream.event;

public class SupportEvent extends UserRelatedEvent {
    private int value;

    public SupportEvent() {
    }

    public SupportEvent(int value) {
        this.value = value;
    }

    public int getValue() {
        return value;
    }

    public void setValue(int value) {
        this.value = value;
    }
}
