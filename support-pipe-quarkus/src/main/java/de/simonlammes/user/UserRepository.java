package de.simonlammes.user;

import io.quarkus.hibernate.reactive.panache.PanacheRepository;
import io.smallrye.mutiny.Uni;

import javax.enterprise.context.ApplicationScoped;
import javax.persistence.LockModeType;
import java.util.List;

@ApplicationScoped
public class UserRepository implements PanacheRepository<User> {

    public Uni<User> findBySubjectClaim(String subjectClaim, LockModeType lockModeType) {
        return find("subjectClaim", subjectClaim).withLock(lockModeType).firstResult();
    }

    public Uni<User> findBySubjectClaim(String subjectClaim) {
        return findBySubjectClaim(subjectClaim, LockModeType.NONE);
    }

    public Uni<List<User>> findByCurrentlyTackledIssueId(Long issueId) {
        return find("currently_tackled_issue_id", issueId).list();
    }
}
