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

    @Column(name = "given_name")
    private String givenName;

    @Column(name = "family_name")
    private String familyName;

    public String getGivenName() {
        return givenName;
    }

    public void setGivenName(String givenName) {
        this.givenName = givenName;
    }

    public String getFamilyName() {
        return familyName;
    }

    public void setFamilyName(String familyName) {
        this.familyName = familyName;
    }

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

    @Override
    public String toString() {
        return "User{" +
                "id=" + id +
                ", subjectClaim='" + subjectClaim + '\'' +
                ", currentlySupportedIssueId=" + currentlySupportedIssueId +
                ", currentlyExhibitedIssueId=" + currentlyExhibitedIssueId +
                ", givenName='" + givenName + '\'' +
                ", familyName='" + familyName + '\'' +
                '}';
    }
}
