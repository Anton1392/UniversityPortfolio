-- Setup new user allowed to create new databases and logging in
create role esdcheck with
    login
    encrypted password 'esdcheck';

-- Setup database with esdcheck as owner, and utf8 character encodings.
create database "esdcheck"
    with owner "esdcheck"
    encoding 'utf8'
    lc_collate='C.UTF-8'
    lc_ctype='C.UTF-8'
    template template0;
