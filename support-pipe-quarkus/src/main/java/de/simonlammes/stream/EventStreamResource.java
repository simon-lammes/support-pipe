package de.simonlammes.stream;

import io.quarkus.security.Authenticated;
import io.smallrye.mutiny.Multi;
import org.eclipse.microprofile.reactive.messaging.Channel;
import org.reactivestreams.Publisher;

import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

@Path("/event-stream")
@RequestScoped
@Produces(MediaType.SERVER_SENT_EVENTS)
@Consumes(MediaType.APPLICATION_JSON)
public class EventStreamResource {

    @Inject
    @Channel("support-events")
    Publisher<SupportEvent> supportEvents;

    @GET
    @Authenticated
    @Path("/user-related-events")
    public Multi<SupportEvent> greeting() {
        return Multi.createFrom().publisher(supportEvents).select().first(3);
    }
}
