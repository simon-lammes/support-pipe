package de.simonlammes.user;

import de.simonlammes.issue.Issue;
import de.simonlammes.issue.IssueRepository;
import de.simonlammes.stream.event.SupportEvent;
import io.quarkus.hibernate.reactive.panache.Panache;
import io.quarkus.security.Authenticated;
import io.smallrye.mutiny.Uni;
import io.smallrye.mutiny.tuples.Tuple2;
import org.eclipse.microprofile.jwt.Claim;
import org.eclipse.microprofile.jwt.Claims;
import org.eclipse.microprofile.jwt.JsonWebToken;
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

    @Inject
    JsonWebToken jwt;

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
                    user.setGivenName(jwt.getClaim("given_name"));
                    user.setFamilyName(jwt.getClaim("family_name"));
                    return user;
                }).call(user -> userRepository.persistAndFlush(user));
    }

    @PUT
    @Path("supportIssue/{issueId}/{authorId}")
    @Authenticated
    public Uni<User> tackleIssue(@PathParam("issueId") Long issueId, @PathParam("authorId") Long authorId) {
        return Panache.withTransaction(() -> Uni.combine().all().unis(
                userRepository.findBySubjectClaim(subjectClaim, LockModeType.PESSIMISTIC_READ),
                userRepository.findById(authorId, LockModeType.PESSIMISTIC_READ),
                issueRepository.findById(issueId, LockModeType.PESSIMISTIC_READ)
        ).asTuple().call(objects -> {
            User supporter = objects.getItem1();
            User author = objects.getItem2();
            Issue issue = objects.getItem3();
            if (supporter.getCurrentlyTackledIssueId() != null) {
                throw new ForbiddenException("The supporter is already tackling another issue.");
            }
            if (!issue.getCreatorId().equals(author.getId())) {
                throw new ForbiddenException("The provided author id is incorrect.");
            }
            if (author.getCurrentlyTackledIssueId() != null) {
                throw new ForbiddenException("The author is already tackling another issue.");
            }
            supporter.setCurrentlyTackledIssueId(issueId);
            author.setCurrentlyTackledIssueId(issueId);
            issue.setDoesRequireHelp(false);
            return userRepository.persist(supporter)
                    .replaceWith(issueRepository.persist(issue));
        })).call(objects -> Uni.createFrom().completionStage(supportEventEmitter.send(new SupportEvent(objects.getItem3(), objects.getItem1()))))
                .onItem().transform(Tuple2::getItem1);
    }
}
