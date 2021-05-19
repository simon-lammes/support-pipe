package de.simonlammes.user;

import io.quarkus.hibernate.reactive.panache.PanacheRepository;
import io.smallrye.mutiny.Uni;

import javax.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class UserRepository implements PanacheRepository<User> {

    public Uni<User> findBySubjectClaim(String subjectClaim) {
        return find("subjectClaim", subjectClaim).firstResult();
    }
}
