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

    @Column(name = "currently_supported_issue_id")
    private Long currentlySupportedIssueId;

    @Column(name = "currently_exhibited_issue_id")
    private Long currentlyExhibitedIssueId;

    public Long getCurrentlyExhibitedIssueId() {
        return currentlyExhibitedIssueId;
    }

    public void setCurrentlyExhibitedIssueId(Long currentlyExhibitedIssue) {
        this.currentlyExhibitedIssueId = currentlyExhibitedIssue;
    }

    public Long getCurrentlySupportedIssueId() {
        return currentlySupportedIssueId;
    }

    public void setCurrentlySupportedIssueId(Long currentlyTackledIssueId) {
        this.currentlySupportedIssueId = currentlyTackledIssueId;
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
