package de.simonlammes.issue;

import de.simonlammes.stream.event.IssueCreatedEvent;
import de.simonlammes.stream.event.MessageEvent;
import de.simonlammes.user.User;
import de.simonlammes.user.UserRepository;
import io.quarkus.hibernate.reactive.panache.Panache;
import io.quarkus.security.Authenticated;
import io.smallrye.mutiny.Uni;
import io.smallrye.mutiny.tuples.Tuple2;
import io.smallrye.mutiny.tuples.Tuple3;
import org.eclipse.microprofile.jwt.Claim;
import org.eclipse.microprofile.jwt.Claims;
import org.eclipse.microprofile.reactive.messaging.Channel;
import org.eclipse.microprofile.reactive.messaging.Emitter;
import org.jboss.resteasy.reactive.RestQuery;

import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.persistence.LockModeType;
import javax.persistence.Tuple;
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

    @Inject @Channel("issue-created-events-outgoing")
    Emitter<IssueCreatedEvent> issueCreatedEventEmitter;

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
    @Path("/{issueId}/participants")
    @Authenticated
    public Uni<List<User>> getParticipants(@PathParam("issueId") Long issueId) {
        return userRepository.findByCurrentlyTackledIssueId(issueId);
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
        if (issue.getId() != null) {
            throw new BadRequestException("When posting a new entity that entity should not have an id as long as it is not yet created.");
        }
        return Panache.withTransaction(() ->
                userRepository.findBySubjectClaim(subjectClaim, LockModeType.PESSIMISTIC_READ).invoke(user -> {
                    if (!user.getId().equals(issue.getCreatorId())) {
                        throw new ForbiddenException("The creator id does not match the id of the user issuing the request.");
                    }
                    if (user.getCurrentlyTackledIssueId() != null) {
                        throw new ForbiddenException("This user is already tackling another issue.");
                    }
                }).onItem().call(user ->
                        issueRepository.persistAndFlush(issue)
                ).call(() -> {
                    IssueCreatedEvent event = new IssueCreatedEvent();
                    event.setIssue(issue);
                    return Uni.createFrom().completionStage(issueCreatedEventEmitter.send(event));
                })
        ).replaceWith(issue);
    }
}
