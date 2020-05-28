create table esdcheck_user (
    id serial primary key,
    login text not null unique,
    password_hash text not null,
    salt text not null
);

create table esdcheck_role (
    id serial primary key,
    name text not null
);

create table user_role (
    id serial primary key,
    user_id int not null references esdcheck_user(id),
    role_id int not null references esdcheck_role(id)
);
