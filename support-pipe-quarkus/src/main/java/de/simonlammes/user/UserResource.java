package de.simonlammes.user;

import de.simonlammes.issue.Issue;
import de.simonlammes.issue.IssueRepository;
import io.quarkus.hibernate.reactive.panache.Panache;
import io.quarkus.security.Authenticated;
import io.smallrye.mutiny.Uni;
import org.eclipse.microprofile.jwt.Claim;
import org.eclipse.microprofile.jwt.Claims;

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
    @Path("tackleIssue/{issueId}")
    @Authenticated
    public Uni<User> tackleIssue(@PathParam("issueId") Long issueId) {
        return Panache.withTransaction(() -> Uni.combine().all().unis(
                userRepository.findBySubjectClaim(subjectClaim, LockModeType.PESSIMISTIC_READ),
                issueRepository.findById(issueId, LockModeType.PESSIMISTIC_READ)
        ).asTuple().chain(objects -> {
            User user = objects.getItem1();
            Issue issue = objects.getItem2();
            if (user.getCurrentlyTackledIssueId() != null) {
                throw new ForbiddenException("This user is already tackling another issue.");
            }
            user.setCurrentlyTackledIssueId(issueId);
            issue.setDoesRequireHelp(false);
            return userRepository.persist(user)
                    .replaceWith(issueRepository.persist(issue))
                    .replaceWith(user);
        }));
    }
}
