package de.simonlammes.issue;

import de.simonlammes.user.UserRepository;
import io.quarkus.security.Authenticated;
import io.smallrye.mutiny.Uni;
import org.eclipse.microprofile.jwt.Claim;
import org.eclipse.microprofile.jwt.Claims;
import org.jboss.resteasy.reactive.RestQuery;

import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import java.time.Duration;
import java.util.List;

@Path("/issues")
@RequestScoped
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class IssueResource {

    @Inject
    IssueRepository issueRepository;

    @Inject
    UserRepository userRepository;

    @Inject
    @Claim(standard = Claims.sub)
    String subjectClaim;

    @GET
    @Authenticated
    public Uni<List<Issue>> get(@RestQuery() List<Long> includedCreatorIds, @RestQuery() List<Long> excludedCreatorIds) {
        return issueRepository.filterIssues(includedCreatorIds, excludedCreatorIds);
    }

    @GET
    @Path("/proposal")
    @Authenticated
    public Uni<Issue> getProposal(@RestQuery() List<Long> excludedIssueIds) {
        return userRepository.findBySubjectClaim(subjectClaim)
                .chain(user -> issueRepository.findProposal(user.getId(), excludedIssueIds));
    }

    @POST
    @Authenticated
    public Uni<Issue> post(Issue issue) {
        return userRepository.findBySubjectClaim(subjectClaim).invoke(user -> {
            if (user.getId() != issue.getCreatorId()) {
                throw new ForbiddenException("The creator id does not match the id of the user issuing the request.");
            }
        }).chain(() -> issueRepository.persistAndFlush(issue))
                .replaceWith(issue);
    }
}
