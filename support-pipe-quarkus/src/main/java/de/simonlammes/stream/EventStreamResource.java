package de.simonlammes.stream;

import de.simonlammes.crosscutting.JsonDeserializer;
import de.simonlammes.stream.event.HeartbeatEvent;
import de.simonlammes.stream.event.MessageEvent;
import de.simonlammes.stream.event.SupportEvent;
import de.simonlammes.stream.event.UserRelatedEvent;
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

    @GET
    @Authenticated
    @Path("/user-related-events")
    public Multi<UserRelatedEvent> greeting() {
        // We only want to fetch the user one time and provide the memoized value to all subscribers.
        // The user is not going to change anyway.
        Uni<User> userUni = userRepository.findBySubjectClaim(subjectClaim).memoize().indefinitely();
        // We subscribe to the uni so that the user is immediately fetched. Otherwise, the connection pool
        // could eventually close and this operation would fail.
        userUni.subscribe();
        // Send an initial heartbeat to show the browser that the connection was successful
        Multi<UserRelatedEvent> initialHeartbeat = Multi.createFrom().item(new HeartbeatEvent(OffsetDateTime.now()));
        Multi<UserRelatedEvent> heartbeatEventStream = vertx.periodicStream(30000).toMulti().onItem().transform(value -> new HeartbeatEvent(OffsetDateTime.now()));
        Multi<UserRelatedEvent> supportEventStream = Multi.createFrom().publisher(supportEvents)
                .map(json -> new JsonDeserializer<SupportEvent>().deserialize(json, SupportEvent.class))
                .select().when(supportEvent ->
                        userUni.map(user -> user.getCurrentlyExhibitedIssueId().equals(
                                supportEvent.getIssue().getId()
                        ))
                ).map(supportEvent -> supportEvent);
        Multi<UserRelatedEvent> messageEventStream = Multi.createFrom().publisher(messageEvents)
                .map(json -> new JsonDeserializer<MessageEvent>().deserialize(json, MessageEvent.class))
                .select().when(messageEvent ->
                        userUni.map(user -> {
                            return (
                                    (messageEvent.getMessage().getIssueId().equals(user.getCurrentlyExhibitedIssueId())
                                            || messageEvent.getMessage().getIssueId().equals(user.getCurrentlySupportedIssueId())
                                    )
                                            && !user.getId().equals(messageEvent.getMessage().getAuthorId())
                            );
                        })
                ).map(supportEvent -> supportEvent);
        return Multi.createBy().merging().streams(
                initialHeartbeat,
                heartbeatEventStream,
                supportEventStream,
                messageEventStream
        );
    }
}
