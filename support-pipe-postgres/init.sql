create table if not exists issues
(
    id                integer generated always as identity
        constraint issues_pk
            primary key,
    title             varchar              not null,
    description       varchar,
    creator_id        integer              not null,
    does_require_help boolean default true not null,
    closed_timestamp  timestamp,
    constraint issues_check
        check ((closed_timestamp IS NULL) OR (does_require_help IS FALSE))
);

create table if not exists users
(
    id                         integer generated always as identity
        constraint users_pk
            primary key,
    subject_claim              varchar not null
        constraint user_subject_claim_key
            unique,
    currently_tackled_issue_id integer
        constraint users_issues_id_fk
            references issues
            on delete set default,
    given_name                 varchar not null,
    family_name                varchar not null
);

alter table issues
    add constraint issue_creator_fk
        foreign key (creator_id) references users
            on update cascade on delete cascade;

alter table issues
    add constraint issues_users_id_fk
        foreign key (creator_id) references users;

create table if not exists messages
(
    id        integer generated always as identity
        constraint messages_pk
            primary key,
    text      varchar                 not null,
    issue_id  integer                 not null
        constraint messages_issues_id_fk
            references issues
            on update cascade on delete cascade,
    author_id integer                 not null
        constraint messages_users_id_fk
            references users,
    timestamp timestamp default now() not null
);
