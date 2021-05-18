package de.simonlammes.issue;

import io.quarkus.security.Authenticated;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import java.util.List;

@Path("/issues")
public class IssueResource {

    @GET
    @Authenticated
    @Produces(MediaType.APPLICATION_JSON)
    public List<Issue> get() {
        return List.of(
                new Issue("big", "sdfs"),
                new Issue("small", "671")
        );
    }
}
