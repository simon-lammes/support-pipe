package de.simonlammes.issue;

import de.simonlammes.user.User;

import javax.persistence.*;
import java.sql.Timestamp;

@Entity
@Table(name = "issues")
public class Issue {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String title;
    private String description;
    @Column(name = "creator_id")
    private Long creatorId;

    @Column(name = "closed_timestamp")
    private Timestamp closedTimestamp;

    @ManyToOne()
    @JoinColumn(name = "creator_id", referencedColumnName = "id", insertable = false, updatable = false)
    private User author;

    @Column(name = "does_require_help")
    private boolean doesRequireHelp;

    public Timestamp getClosedTimestamp() {
        return closedTimestamp;
    }

    public void setClosedTimestamp(Timestamp closedTimestamp) {
        this.closedTimestamp = closedTimestamp;
    }

    public User getAuthor() {
        return author;
    }

    public void setAuthor(User author) {
        this.author = author;
    }

    public boolean isDoesRequireHelp() {
        return doesRequireHelp;
    }

    public void setDoesRequireHelp(boolean doesRequireHelp) {
        this.doesRequireHelp = doesRequireHelp;
    }

    public Long getCreatorId() {
        return creatorId;
    }

    public void setCreatorId(Long creatorId) {
        this.creatorId = creatorId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getId() {
        return id;
    }
}
