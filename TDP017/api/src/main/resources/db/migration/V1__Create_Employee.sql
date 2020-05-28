create table employee (
    id serial primary key,
    first_name text not null,
    last_name text not null,
    card_uid bigint not null unique
);
