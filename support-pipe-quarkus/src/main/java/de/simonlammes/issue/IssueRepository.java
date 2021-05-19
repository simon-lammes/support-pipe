package de.simonlammes.issue;

import io.quarkus.hibernate.reactive.panache.PanacheRepository;

import javax.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class IssueRepository implements PanacheRepository<Issue> {
}
