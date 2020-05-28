create table esdcheck (
    id serial primary key,
    employee_id int not null references employee(id),
    passed boolean not null,
    date timestamp not null
);
