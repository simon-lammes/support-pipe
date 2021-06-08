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

    @Override
    public String toString() {
        return "User{" +
                "id=" + id +
                ", subjectClaim='" + subjectClaim + '\'' +
                ", currentlySupportedIssueId=" + currentlyTackledIssueId +
                ", givenName='" + givenName + '\'' +
                ", familyName='" + familyName + '\'' +
                '}';
    }
}
