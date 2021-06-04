package de.simonlammes.stream.event;

import java.time.OffsetDateTime;

/**
 * Just tells subscribers that the connection is still living and therefore should not be closed.
 * This is our way of preventing the client closing the connection when the server has nothing to say for a long period.
 */
public class HeartbeatEvent extends UserRelatedEvent {
    private OffsetDateTime timestamp;

    public HeartbeatEvent(OffsetDateTime timestamp) {
        this.timestamp = timestamp;
    }

    public OffsetDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(OffsetDateTime timestamp) {
        this.timestamp = timestamp;
    }
}
