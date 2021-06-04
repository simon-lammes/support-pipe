package de.simonlammes.user;

import de.simonlammes.issue.Issue;
import de.simonlammes.issue.IssueRepository;
import de.simonlammes.stream.event.SupportEvent;
import io.quarkus.hibernate.reactive.panache.Panache;
import io.quarkus.security.Authenticated;
import io.smallrye.mutiny.Uni;
import org.eclipse.microprofile.jwt.Claim;
import org.eclipse.microprofile.jwt.Claims;
import org.eclipse.microprofile.reactive.messaging.Channel;
import org.eclipse.microprofile.reactive.messaging.Emitter;

import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.persistence.LockModeType;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;

@RequestScoped
@Path("/users")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public class UserResource {

    @Inject
    UserRepository userRepository;

    @Inject
    IssueRepository issueRepository;

    @Inject
    @Claim(standard = Claims.sub)
    String subjectClaim;

    @Inject @Channel("support-events-outgoing")
    Emitter<SupportEvent> supportEventEmitter;

    @PUT
    @Path("/me")
    @Authenticated
    public Uni<User> put() {
        return userRepository.findBySubjectClaim(subjectClaim)
                .onItem().ifNull()
                .continueWith(() -> {
                    User user = new User();
                    user.setSubjectClaim(subjectClaim);
                    return user;
                }).call(user -> userRepository.persistAndFlush(user));
    }

    @PUT
    @Path("supportIssue/{issueId}")
    @Authenticated
    public Uni<User> tackleIssue(@PathParam("issueId") Long issueId) {
        return Panache.withTransaction(() -> Uni.combine().all().unis(
                userRepository.findBySubjectClaim(subjectClaim, LockModeType.PESSIMISTIC_READ),
                issueRepository.findById(issueId, LockModeType.PESSIMISTIC_READ)
        ).asTuple().chain(objects -> {
            User user = objects.getItem1();
            Issue issue = objects.getItem2();
            if (user.getCurrentlySupportedIssueId() != null || user.getCurrentlyExhibitedIssueId() != null) {
                throw new ForbiddenException("This user is already supporting or exhibiting another issue.");
            }
            user.setCurrentlySupportedIssueId(issueId);
            issue.setDoesRequireHelp(false);
            return userRepository.persist(user)
                    .replaceWith(issueRepository.persist(issue))
                    .replaceWith(user);
        })).call(user -> Uni.createFrom().completionStage(supportEventEmitter.send(new SupportEvent(user))));
    }
}
