package de.simonlammes.user;

import io.quarkus.hibernate.reactive.panache.PanacheRepository;
import io.smallrye.mutiny.Uni;

import javax.enterprise.context.ApplicationScoped;
import javax.persistence.LockModeType;

@ApplicationScoped
public class UserRepository implements PanacheRepository<User> {

    public Uni<User> findBySubjectClaim(String subjectClaim, LockModeType lockModeType) {
        return find("subjectClaim", subjectClaim).withLock(lockModeType).firstResult();
    }

    public Uni<User> findBySubjectClaim(String subjectClaim) {
        return findBySubjectClaim(subjectClaim, LockModeType.NONE);
    }
}
