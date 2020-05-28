-- Drops all tables
SOURCE ../nuke.sql
DROP TABLE IF EXISTS jbmanager;
DROP TABLE IF EXISTS jbcustomer;
DROP TABLE IF EXISTS jbtransaction;
DROP TABLE IF EXISTS jbaccount;
DROP TABLE IF EXISTS jbdeposit;
DROP TABLE IF EXISTS jbwithdrawal;

-- Get fresh database
SOURCE company_schema.sql;
SOURCE company_data.sql;

-- Query OK, 0 rows affected (0.06 sec)

/*
3) Implement your extensions in the database by first creating tables, if any, then
populating them with existing manager data, then adding/modifying foreign key
constraints. Do you have to initialize the bonus attribute to a value? Why?
*/
/*
Answer to 3)
We have to initialize bonus to a value, otherwise we get the error:
ERROR 1136 (21S01): Column count doesn't match value count at row 1
We can initialize to either NULL, or 0. We chose 0 because it makes sense as a default value for a bonus.
*/

CREATE TABLE jbmanager(
	id INTEGER PRIMARY KEY NOT NULL,
	bonus INTEGER,
	CONSTRAINT fk_employee
		FOREIGN KEY(id)
		REFERENCES jbemployee(id)
		ON DELETE CASCADE
);
-- Query OK, 0 rows affected (0.06 sec)

SHOW COLUMNS FROM jbmanager;
/*
+-------+---------+------+-----+---------+-------+
| Field | Type    | Null | Key | Default | Extra |
+-------+---------+------+-----+---------+-------+
| id    | int(11) | NO   | PRI | NULL    |       |
| bonus | int(11) | YES  |     | NULL    |       |
+-------+---------+------+-----+---------+-------+
2 rows in set (0.00 sec)
*/

INSERT INTO jbmanager
SELECT DISTINCT manager, 0 FROM jbemployee WHERE manager IS NOT NULL;
/*
Query OK, 8 rows affected (0.01 sec)
Records: 8  Duplicates: 0  Warnings: 0
*/

INSERT IGNORE INTO jbmanager
SELECT DISTINCT manager, 0 FROM jbdept WHERE manager IS NOT NULL;
/*
Query OK, 4 rows affected, 7 warnings (0.00 sec)
Records: 11  Duplicates: 7  Warnings: 7
*/

SELECT * FROM jbmanager;
/*
+-----+-------+
| id  | bonus |
+-----+-------+
|  10 |     0 |
|  13 |     0 |
|  26 |     0 |
|  32 |     0 |
|  33 |     0 |
|  35 |     0 |
|  37 |     0 |
|  55 |     0 |
|  98 |     0 |
| 129 |     0 |
| 157 |     0 |
| 199 |     0 |
+-----+-------+
12 rows in set (0.00 sec)
*/

ALTER TABLE jbemployee
ADD CONSTRAINT fk_emp_manager
FOREIGN KEY(manager)
REFERENCES jbmanager(id);
/*
Query OK, 25 rows affected (0.16 sec)
Records: 25  Duplicates: 0  Warnings: 0
*/

ALTER TABLE jbdept
ADD CONSTRAINT fk_dept_manager
FOREIGN KEY(manager)
REFERENCES jbmanager(id);
/*
Query OK, 19 rows affected (0.16 sec)
Records: 19  Duplicates: 0  Warnings: 0
*/

/*
4) All departments showed good sales figures last year! Give all current department
managers $10,000 in bonus. This bonus is an addition to other possible bonuses
they have.
Hint: Not all managers are department managers. Update all managers that are
referred in the jbdept relation.
*/
UPDATE jbmanager SET bonus = bonus+10000 WHERE id = ANY(SELECT manager FROM jbdept);
/*
Query OK, 11 rows affected (0.01 sec)
Rows matched: 11  Changed: 11  Warnings: 0
*/

SELECT * FROM jbmanager;
/*
+-----+-------+
| id  | bonus |
+-----+-------+
|  10 | 10000 |
|  13 | 10000 |
|  26 | 10000 |
|  32 | 10000 |
|  33 | 10000 |
|  35 | 10000 |
|  37 | 10000 |
|  55 | 10000 |
|  98 | 10000 |
| 129 | 10000 |
| 157 | 10000 |
| 199 |     0 |
+-----+-------+
12 rows in set (0.00 sec)
*/

/*
5b) Implement your extensions in your database. Add primary key constraints,
foreign key constraints and integrity constraints to your table definitions. Do
not forget to correctly set up the new and existing foreign keys.
*/

CREATE TABLE jbcustomer(
	id INTEGER PRIMARY KEY,
	name TEXT,
	street TEXT,
	city INTEGER,
	CONSTRAINT fk_city
		FOREIGN KEY(city)
		REFERENCES jbcity(id)
);
-- Query OK, 0 rows affected (0.06 sec)

CREATE TABLE jbaccount(
	id INTEGER PRIMARY KEY,
	balance INTEGER,
	customer INTEGER,
	CONSTRAINT fk_customer
		FOREIGN KEY(customer)
		REFERENCES jbcustomer(id)
);
-- Query OK, 0 rows affected (0.09 sec)

CREATE TABLE jbtransaction(
	id INTEGER PRIMARY KEY, -- NOT NULL (implied by PRIMARY KEY)
	account INTEGER,
	CONSTRAINT fk_transaction_account
		FOREIGN KEY(account)
		REFERENCES jbaccount(id),
	sdate DATETIME,
	amount INTEGER, -- INTEGER instead of FLOAT for simplicity and according to existing model
	employee INTEGER,
	CONSTRAINT fk_transaction_employee
		FOREIGN KEY(employee)
		REFERENCES jbemployee(id)
);
-- Query OK, 0 rows affected (0.06 sec)

CREATE TABLE jbdeposit(
	id INTEGER PRIMARY KEY,
	CONSTRAINT fk_deposit_transaction
		FOREIGN KEY(id)
		REFERENCES jbtransaction(id)
		ON DELETE CASCADE
);
-- Query OK, 0 rows affected (0.06 sec)

CREATE TABLE jbwithdrawal(
	id INTEGER PRIMARY KEY,
	CONSTRAINT fk_withdrawal_transaction
		FOREIGN KEY(id)
		REFERENCES jbtransaction(id)
		ON DELETE CASCADE
);
-- Query OK, 0 rows affected (0.06 sec)

-- Atomic transaction (@variable)
START TRANSACTION;
-- Query OK, 0 rows affected (0.00 sec)

-- Create customer
INSERT INTO jbcustomer(id)
(SELECT DISTINCT account FROM jbdebit);
/*
Query OK, 5 rows affected (0.00 sec)
Records: 5  Duplicates: 0  Warnings: 0
*/

-- Create account
INSERT INTO jbaccount(id, customer)
(SELECT DISTINCT account, account FROM jbdebit);
/*
Query OK, 5 rows affected (0.01 sec)
Records: 5  Duplicates: 0  Warnings: 0
*/

-- Create transaction
INSERT INTO jbtransaction(id, account, sdate, employee)
(SELECT id, account, sdate, employee FROM jbdebit);
/*
Query OK, 6 rows affected (0.00 sec)
Records: 6  Duplicates: 0  Warnings: 0
*/

-- Calculate cost of debit, fill transaction
UPDATE jbtransaction
INNER JOIN
(
	SELECT  d.id AS "did", SUM(i.price * s.quantity) AS "cost"
	FROM    jbdebit d, jbsale s, jbitem i
	WHERE   d.id = s.debit
	AND     s.item = i.id
	GROUP BY    d.id
)
AS cost_calc
ON jbtransaction.id = cost_calc.did
SET jbtransaction.amount = cost_calc.cost;
/*
Query OK, 6 rows affected (0.00 sec)
Rows matched: 6  Changed: 6  Warnings: 0
*/

-- Remove debit columns (TODO: compact)
ALTER TABLE jbdebit
	DROP COLUMN sdate;
/*
Query OK, 0 rows affected (0.19 sec)
Records: 0  Duplicates: 0  Warnings: 0
*/

ALTER TABLE jbdebit
	DROP FOREIGN KEY fk_debit_employee;
/*
Query OK, 0 rows affected (0.04 sec)
Records: 0  Duplicates: 0  Warnings: 0
*/

ALTER TABLE jbdebit
	DROP COLUMN employee; -- "fk_debit_employee" fk blocking (how to list/remove constraints?)
/*
Query OK, 0 rows affected (0.14 sec)
Records: 0  Duplicates: 0  Warnings: 0
*/

ALTER TABLE jbdebit
	DROP COLUMN account;
/*
Query OK, 0 rows affected (0.21 sec)
Records: 0  Duplicates: 0  Warnings: 0
*/


-- Add debit->transaction id fk
ALTER TABLE jbdebit
	ADD CONSTRAINT fk_debit_transaction
	FOREIGN KEY (id)
	REFERENCES jbtransaction(id)
	ON DELETE CASCADE;
/*
Query OK, 6 rows affected (0.16 sec)
Records: 6  Duplicates: 0  Warnings: 0
*/

COMMIT;
-- Query OK, 0 rows affected (0.00 sec)





-- TODO: Edit debit, and reconnect sale, fill/move data & test
-- NOTE: Possible to use auto-increment for new id's (will it reuse?)
