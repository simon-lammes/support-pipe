package de.simonlammes.message;

import de.simonlammes.issue.Issue;
import de.simonlammes.issue.IssueRepository;
import de.simonlammes.stream.event.MessageEvent;
import de.simonlammes.stream.event.SupportEvent;
import de.simonlammes.user.User;
import de.simonlammes.user.UserRepository;
import io.quarkus.hibernate.reactive.panache.PanacheRepository;
import io.quarkus.security.Authenticated;
import io.smallrye.mutiny.Uni;
import org.eclipse.microprofile.jwt.Claim;
import org.eclipse.microprofile.jwt.Claims;
import org.eclipse.microprofile.reactive.messaging.Channel;
import org.eclipse.microprofile.reactive.messaging.Emitter;
import org.jboss.resteasy.reactive.RestQuery;

import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import java.sql.Timestamp;
import java.time.Instant;
import java.util.List;

@Path("/messages")
@RequestScoped
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class MessageResource {

    @Inject
    MessageRepository messageRepository;

    @Inject
    @Claim(standard = Claims.sub)
    String subjectClaim;

    @Inject
    UserRepository userRepository;

    @Inject @Channel("message-events-outgoing")
    Emitter<MessageEvent> messageEventEmitter;

    @POST
    @Authenticated
    public Uni<Message> postMessage(Message message) {
        if (message.getId() != null) {
            throw new BadRequestException("When posting a message that message should not have an id as long as it is not yet created.");
        }
        return userRepository.findBySubjectClaim(subjectClaim).invoke(user -> {
            if (user.getId() != message.getAuthorId()) {
                throw new ForbiddenException("The author id does not match the id of the user issuing the request.");
            }
        }).onItem()
                .invoke(() -> message.setTimestamp(Timestamp.from(Instant.now())))
                .call(() -> messageRepository.persistAndFlush(message))
                .call(() -> Uni.createFrom().completionStage(
                        messageEventEmitter.send(new MessageEvent(message))
                ))
                .replaceWith(message);
    }

    @GET
    @Authenticated
    public Uni<List<Message>> getMessages(@RestQuery() Long issueId) {
        if (issueId == null) {
            throw new BadRequestException("You must filter by issue id.");
        }
        return messageRepository.findByIssueId(issueId);
    }
}
