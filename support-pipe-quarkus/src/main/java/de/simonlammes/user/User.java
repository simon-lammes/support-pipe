package de.simonlammes.user;

import javax.persistence.*;

@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "subject_claim")
    private String subjectClaim;

    @Column(name = "currently_tackled_issue_id")
    private Long currentlyTackledIssueId;

    public Long getCurrentlyTackledIssueId() {
        return currentlyTackledIssueId;
    }

    public void setCurrentlyTackledIssueId(Long currentlyTackledIssueId) {
        this.currentlyTackledIssueId = currentlyTackledIssueId;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getSubjectClaim() {
        return subjectClaim;
    }

    public void setSubjectClaim(String subjectClaim) {
        this.subjectClaim = subjectClaim;
    }
}
