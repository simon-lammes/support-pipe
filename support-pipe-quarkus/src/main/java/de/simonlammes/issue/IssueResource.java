package de.simonlammes.issue;

import io.quarkus.security.Authenticated;
import io.smallrye.mutiny.Uni;

import javax.inject.Inject;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import java.util.List;

@Path("/issues")
public class IssueResource {

    @Inject
    IssueRepository issueRepository;

    @GET
    @Authenticated
    @Produces(MediaType.APPLICATION_JSON)
    public Uni<List<Issue>> get() {
        return issueRepository.listAll();
    }
}
