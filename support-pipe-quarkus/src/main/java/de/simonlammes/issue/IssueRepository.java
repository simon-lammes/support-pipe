package de.simonlammes.issue;

import io.quarkus.hibernate.reactive.panache.PanacheRepository;
import io.quarkus.panache.common.Parameters;
import io.smallrye.mutiny.Uni;

import javax.enterprise.context.ApplicationScoped;
import javax.ws.rs.BadRequestException;
import java.util.List;

@ApplicationScoped
public class IssueRepository implements PanacheRepository<Issue> {

    public Uni<List<Issue>> filterIssues(List<Long> includedCreatorIds, List<Long> excludedCreatorIds) {
        // This nesting looks horrible but I found no good alternative because
        // I could not use the Hibernate Criteria API or something similar.
        if (includedCreatorIds.size() > 0 && excludedCreatorIds.size() > 0) {
            throw new BadRequestException("You should either specify includedCreatorIds or excludedCreatorIds because specifying both can lead to ambiguity.");
        } else if (includedCreatorIds.size() > 0) {
            return find("creatorId in :includedCreatorIds", Parameters
                    .with("includedCreatorIds", includedCreatorIds)).list();
        } else if (excludedCreatorIds.size() > 0) {
            return find("creatorId not in :excludedCreatorIds", Parameters
                    .with("excludedCreatorIds", excludedCreatorIds)).list();
        } else {
            return findAll().list();
        }
    }

    public Uni<Issue> findProposal(long excludedCreatorId, List<Long> excludedIssueIds) {
        if (excludedIssueIds.isEmpty()) {
            // This should have no effect except of making Hibernate Panache create a query with valid syntax.
            excludedIssueIds.add(-1L);
        }
        return find("creatorId != :excludedCreatorId " +
                        "and id not in :excludedIssueIds " +
                        "and doesRequireHelp = true " +
                        "and author.currentlyTackledIssueId is null",
                Parameters
                        .with("excludedCreatorId", excludedCreatorId)
                        .and("excludedIssueIds", excludedIssueIds)
        ).firstResult();
    }
}
