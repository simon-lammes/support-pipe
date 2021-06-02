package de.simonlammes.stream;

import io.quarkus.security.Authenticated;
import io.smallrye.mutiny.Multi;
import io.vertx.mutiny.core.Vertx;

import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.sse.OutboundSseEvent;
import javax.ws.rs.sse.Sse;
import javax.ws.rs.sse.SseEventSink;
import java.util.HashMap;
import java.util.Map;

@Path("/event-stream")
@RequestScoped
@Produces(MediaType.SERVER_SENT_EVENTS)
@Consumes(MediaType.APPLICATION_JSON)
public class EventStreamResource {

    @Inject
    Vertx vertx;

    @GET
    @Authenticated
    @Path("/user-related-events")
    public Multi<OutboundSseEvent> greeting(@Context Sse sse, @Context SseEventSink sseEventSink) {
        return vertx.periodicStream(2000).toMulti().select().first(3)
                .map(l -> {
                    Map<String, String> map = new HashMap<>();
                    map.put("hello", "world");
                    return sse.newEventBuilder().name("my-own-event").data(map).build();
                });
    }
}
