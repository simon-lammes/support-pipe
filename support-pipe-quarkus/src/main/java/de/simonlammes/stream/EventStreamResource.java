package de.simonlammes.stream;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import de.simonlammes.stream.event.HeartbeatEvent;
import de.simonlammes.stream.event.SupportEvent;
import de.simonlammes.stream.event.SupportEventMapper;
import de.simonlammes.stream.event.UserRelatedEvent;
import io.quarkus.security.Authenticated;
import io.smallrye.mutiny.CompositeException;
import io.smallrye.mutiny.Multi;
import io.vertx.core.json.JsonObject;
import io.vertx.mutiny.core.Vertx;
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
    @Channel("support-events")
    Publisher<JsonObject> supportEvents;

    @GET
    @Authenticated
    @Path("/user-related-events")
    public Multi<UserRelatedEvent> greeting() {
        Multi<UserRelatedEvent> heartbeatEventStream = vertx.periodicStream(30000).toMulti().onItem().transform(value -> new HeartbeatEvent(OffsetDateTime.now()));
        Multi<UserRelatedEvent> supportEventStream = Multi.createFrom().publisher(supportEvents).map(json -> new SupportEventMapper().getSupportEvent(json));
        return Multi.createBy().merging().streams(
                heartbeatEventStream,
                supportEventStream
        );
    }
}
