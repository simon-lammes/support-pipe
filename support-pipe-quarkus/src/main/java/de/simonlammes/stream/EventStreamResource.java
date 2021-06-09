package de.simonlammes.stream;

import de.simonlammes.crosscutting.JsonDeserializer;
import de.simonlammes.stream.event.*;
import de.simonlammes.user.User;
import de.simonlammes.user.UserRepository;
import io.quarkus.security.Authenticated;
import io.smallrye.mutiny.Multi;
import io.smallrye.mutiny.Uni;
import io.vertx.core.json.JsonObject;
import io.vertx.mutiny.core.Vertx;
import org.eclipse.microprofile.jwt.Claim;
import org.eclipse.microprofile.jwt.Claims;
import org.eclipse.microprofile.reactive.messaging.Channel;
import org.reactivestreams.Publisher;

import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import java.time.OffsetDateTime;

@Path("/event-stream")
@RequestScoped
@Produces(MediaType.SERVER_SENT_EVENTS)
@Consumes(MediaType.APPLICATION_JSON)
public class EventStreamResource {

    @Inject
    Vertx vertx;

    @Inject
    @Claim(standard = Claims.sub)
    String subjectClaim;

    @Inject
    UserRepository userRepository;

    @Inject
    @Channel("support-events")
    Publisher<JsonObject> supportEvents;

    @Inject
    @Channel("message-events")
    Publisher<JsonObject> messageEvents;

    @Inject
    @Channel("issue-closed-events")
    Publisher<JsonObject> issueClosedEvents;

    @GET
    @Authenticated
    @Path("/user-related-events")
    public Multi<UserRelatedEvent> greeting() {
        // Send an initial heartbeat to show the browser that the connection was successful
        Multi<UserRelatedEvent> initialHeartbeat = Multi.createFrom().item(new HeartbeatEvent(OffsetDateTime.now()));
        Multi<UserRelatedEvent> heartbeatEventStream = vertx.periodicStream(30000).toMulti().onItem().transform(value -> new HeartbeatEvent(OffsetDateTime.now()));
        Multi<UserRelatedEvent> supportEventStream = Multi.createFrom().publisher(supportEvents)
                .map(json -> new JsonDeserializer<SupportEvent>().deserialize(json, SupportEvent.class))
                .map(supportEvent -> supportEvent);
        Multi<UserRelatedEvent> messageEventStream = Multi.createFrom().publisher(messageEvents)
                .map(json -> new JsonDeserializer<MessageEvent>().deserialize(json, MessageEvent.class))
                .map(supportEvent -> supportEvent);
        Multi<UserRelatedEvent> issueClosedEventStream = Multi.createFrom().publisher(issueClosedEvents)
                .map(json -> new JsonDeserializer<IssueClosedEvent>().deserialize(json, IssueClosedEvent.class))
                .map(supportEvent -> supportEvent);
        return Multi.createBy().merging().streams(
                initialHeartbeat,
                heartbeatEventStream,
                supportEventStream,
                messageEventStream,
                issueClosedEventStream
        );
    }
}
