package de.simonlammes.message;

import de.simonlammes.user.UserRepository;
import io.quarkus.hibernate.reactive.panache.PanacheRepository;
import io.quarkus.panache.common.Sort;
import io.smallrye.mutiny.Uni;

import javax.enterprise.context.ApplicationScoped;
import java.util.List;

@ApplicationScoped
public class MessageRepository implements PanacheRepository<Message> {
    public Uni<List<Message>> findByIssueId(Long issueId) {
        return list("issueId", Sort.by("timestamp"), issueId);
    }
}
