package de.simonlammes.issue;

import de.simonlammes.user.User;
import de.simonlammes.user.UserRepository;
import io.quarkus.hibernate.reactive.panache.Panache;
import io.quarkus.security.Authenticated;
import io.smallrye.mutiny.Uni;
import org.eclipse.microprofile.jwt.Claim;
import org.eclipse.microprofile.jwt.Claims;
import org.jboss.resteasy.reactive.RestQuery;

import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.persistence.LockModeType;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
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
    @Path("/{issueId}")
    @Authenticated
    public Uni<Issue> getById(@PathParam("issueId") Long issueId) {
        return issueRepository.findById(issueId);
    }

    @GET
    @Path("/{issueId}/supporters")
    @Authenticated
    public Uni<List<User>> getSupporters(@PathParam("issueId") Long issueId) {
        return userRepository.findByCurrentlySupportedIssueId(issueId);
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
        return Panache.withTransaction(() ->
                userRepository.findBySubjectClaim(subjectClaim, LockModeType.PESSIMISTIC_READ).invoke(user -> {
                    if (user.getId() != issue.getCreatorId()) {
                        throw new ForbiddenException("The creator id does not match the id of the user issuing the request.");
                    }
                    if (user.getCurrentlySupportedIssueId() != null || user.getCurrentlyExhibitedIssueId() != null) {
                        throw new ForbiddenException("This user is already supporting or exhibiting another issue.");
                    }
                }).onItem().call(user ->
                        issueRepository.persistAndFlush(issue)
                ).onItem().call(user -> {
                    user.setCurrentlyExhibitedIssueId(issue.getId());
                    return userRepository.persist(user);
                })
        ).replaceWith(issue);
    }
}
