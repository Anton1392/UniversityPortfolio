/*
Lab 1 report
Anton Sköld, antsk320
William Utbult, wilut499

All non code should be within SQL-comments /* like this */


/*
Drop all user created tables that have been created when solving the lab
*/
SOURCE ../nuke.sql;

DROP TABLE IF EXISTS jbitem_copy; 
DROP VIEW IF EXISTS jbitem_view_less;
DROP VIEW IF EXISTS jbdebit_view_cost;
DROP VIEW IF EXISTS jbsale_supply;


/* Have the source scripts in the file so it is easy to recreate!*/

SOURCE company_schema.sql;
SOURCE company_data.sql;


-- 1) List all employees, i.e. all tuples in the jbemployee relation.

SELECT * FROM jbemployee;
/*
+------+--------------------+--------+---------+-----------+-----------+
| id   | name               | salary | manager | birthyear | startyear |
+------+--------------------+--------+---------+-----------+-----------+
|   10 | Ross, Stanley      |  15908 |     199 |      1927 |      1945 |
|   11 | Ross, Stuart       |  12067 |    NULL |      1931 |      1932 |
|   13 | Edwards, Peter     |   9000 |     199 |      1928 |      1958 |
|   26 | Thompson, Bob      |  13000 |     199 |      1930 |      1970 |
|   32 | Smythe, Carol      |   9050 |     199 |      1929 |      1967 |
|   33 | Hayes, Evelyn      |  10100 |     199 |      1931 |      1963 |
|   35 | Evans, Michael     |   5000 |      32 |      1952 |      1974 |
|   37 | Raveen, Lemont     |  11985 |      26 |      1950 |      1974 |
|   55 | James, Mary        |  12000 |     199 |      1920 |      1969 |
|   98 | Williams, Judy     |   9000 |     199 |      1935 |      1969 |
|  129 | Thomas, Tom        |  10000 |     199 |      1941 |      1962 |
|  157 | Jones, Tim         |  12000 |     199 |      1940 |      1960 |
|  199 | Bullock, J.D.      |  27000 |    NULL |      1920 |      1920 |
|  215 | Collins, Joanne    |   7000 |      10 |      1950 |      1971 |
|  430 | Brunet, Paul C.    |  17674 |     129 |      1938 |      1959 |
|  843 | Schmidt, Herman    |  11204 |      26 |      1936 |      1956 |
|  994 | Iwano, Masahiro    |  15641 |     129 |      1944 |      1970 |
| 1110 | Smith, Paul        |   6000 |      33 |      1952 |      1973 |
| 1330 | Onstad, Richard    |   8779 |      13 |      1952 |      1971 |
| 1523 | Zugnoni, Arthur A. |  19868 |     129 |      1928 |      1949 |
| 1639 | Choy, Wanda        |  11160 |      55 |      1947 |      1970 |
| 2398 | Wallace, Maggie J. |   7880 |      26 |      1940 |      1959 |
| 4901 | Bailey, Chas M.    |   8377 |      32 |      1956 |      1975 |
| 5119 | Bono, Sonny        |  13621 |      55 |      1939 |      1963 |
| 5219 | Schwarz, Jason B.  |  13374 |      33 |      1944 |      1959 |
+------+--------------------+--------+---------+-----------+-----------+
25 rows in set (0,00 sec)
*/

-- 2) List the name of all departments in alphabetical order. Note: by “name” we mean the name attribute for all tuples in the jbdept relation.

SELECT name FROM jbdept ORDER BY name ASC;
/*
+------------------+
| name             |
+------------------+
| Bargain          |
| Book             |
| Candy            |
| Children's       |
| Children's       |
| Furniture        |
| Giftwrap         |
| Jewelry          |
| Junior Miss      |
| Junior's         |
| Linens           |
| Major Appliances |
| Men's            |
| Sportswear       |
| Stationary       |
| Toys             |
| Women's          |
| Women's          |
| Women's          |
+------------------+
19 rows in set (0,00 sec)
*/

-- 3) What parts are not in store, i.e. qoh = 0? (qoh = Quantity On Hand)

SELECT name FROM jbparts WHERE qoh = 0;
/*
+-------------------+
| name              |
+-------------------+
| card reader       |
| card punch        |
| paper tape reader |
| paper tape punch  |
+-------------------+
4 rows in set (0,00 sec)
*/

-- 4) Which employees have a salary between 9000 (included) and 10000 (included)?

SELECT name, salary FROM jbemployee WHERE salary BETWEEN 9000 and 10000;
/*
+----------------+--------+
| name           | salary |
+----------------+--------+
| Edwards, Peter |   9000 |
| Smythe, Carol  |   9050 |
| Williams, Judy |   9000 |
| Thomas, Tom    |  10000 |
+----------------+--------+
4 rows in set (0,00 sec)
*/

-- 5) What was the age of each employee when they started working (startyear)?

SELECT name, startyear-birthyear AS start_age FROM jbemployee;
/*
+--------------------+-----------+
| name               | start_age |
+--------------------+-----------+
| Ross, Stanley      |        18 |
| Ross, Stuart       |         1 |
| Edwards, Peter     |        30 |
| Thompson, Bob      |        40 |
| Smythe, Carol      |        38 |
| Hayes, Evelyn      |        32 |
| Evans, Michael     |        22 |
| Raveen, Lemont     |        24 |
| James, Mary        |        49 |
| Williams, Judy     |        34 |
| Thomas, Tom        |        21 |
| Jones, Tim         |        20 |
| Bullock, J.D.      |         0 |
| Collins, Joanne    |        21 |
| Brunet, Paul C.    |        21 |
| Schmidt, Herman    |        20 |
| Iwano, Masahiro    |        26 |
| Smith, Paul        |        21 |
| Onstad, Richard    |        19 |
| Zugnoni, Arthur A. |        21 |
| Choy, Wanda        |        23 |
| Wallace, Maggie J. |        19 |
| Bailey, Chas M.    |        19 |
| Bono, Sonny        |        24 |
| Schwarz, Jason B.  |        15 |
+--------------------+-----------+
25 rows in set (0,01 sec)
*/

-- 6) Which employees have a last name ending with “son”?

SELECT name FROM jbemployee WHERE name LIKE "%son,%";
/*
+---------------+
| name          |
+---------------+
| Thompson, Bob |
+---------------+
1 row in set (0,01 sec)
*/

-- 7) Which items (note items, not parts) have been delivered by a supplier called Fisher-Price? Formulate this query using a subquery in the where-clause.

SELECT id, name FROM jbitem WHERE supplier =
    (SELECT id FROM jbsupplier WHERE name = "Fisher-Price");
/*
+-----+-----------------+
| id  | name            |
+-----+-----------------+
|  43 | Maze            |
| 107 | The 'Feel' Book |
| 119 | Squeeze Ball    |
+-----+-----------------+
3 rows in set (0,00 sec)
*/

-- 8) Formulate the same query as above, but without a subquery.

SELECT jbitem.id, jbitem.name FROM jbitem, jbsupplier WHERE jbsupplier.name = "Fisher-Price" AND jbitem.supplier = jbsupplier.id;
/*
+-----+-----------------+
| id  | name            |
+-----+-----------------+
|  43 | Maze            |
| 107 | The 'Feel' Book |
| 119 | Squeeze Ball    |
+-----+-----------------+
3 rows in set (0,00 sec)
*/


-- 9) Show all cities that have suppliers located in them. Formulate this query using a subquery in the where-clause.
SELECT * FROM jbcity WHERE id = ANY(SELECT city FROM jbsupplier);
/*
+-----+----------------+-------+
| id  | name           | state |
+-----+----------------+-------+
|  10 | Amherst        | Mass  |
|  21 | Boston         | Mass  |
| 100 | New York       | NY    |
| 106 | White Plains   | Neb   |
| 118 | Hickville      | Okla  |
| 303 | Atlanta        | Ga    |
| 537 | Madison        | Wisc  |
| 609 | Paxton         | Ill   |
| 752 | Dallas         | Tex   |
| 802 | Denver         | Colo  |
| 841 | Salt Lake City | Utah  |
| 900 | Los Angeles    | Calif |
| 921 | San Diego      | Calif |
| 941 | San Francisco  | Calif |
| 981 | Seattle        | Wash  |
+-----+----------------+-------+
*/


-- 10) What is the name and color of the parts that are heavier than a card reader? Formulate this query using a subquery in the where-clause. (The SQL query must not contain the weight as a constant.)

SELECT name, color FROM jbparts WHERE weight > (SELECT weight FROM jbparts WHERE name = "card reader");
/*
+--------------+--------+
| name         | color  |
+--------------+--------+
| disk drive   | black  |
| tape drive   | black  |
| line printer | yellow |
| card punch   | gray   |
+--------------+--------+
*/


-- 11) Formulate the same query as above, but without a subquery. (The query must not contain the weight as a constant.)

SELECT a.name, a.color from jbparts a, jbparts b WHERE a.weight > b.weight AND b.id = 11;
/*
+--------------+--------+
| name         | color  |
+--------------+--------+
| disk drive   | black  |
| tape drive   | black  |
| line printer | yellow |
| card punch   | gray   |
+--------------+--------+
*/


-- 12) What is the average weight of black parts?

SELECT AVG(weight) FROM jbparts WHERE color = "black";
/*
+-------------+
| AVG(weight) |
+-------------+
|    347.2500 |
+-------------+
*/


-- 13) What is the total weight of all parts that each supplier in Massachusetts (“Mass”) has delivered? Retrieve the name and the total weight for each of these suppliers. Do not forget to take the quantity of delivered parts into account. Note that one row should be returned for each supplier.

SELECT jbsupplier.name AS "supplier", SUM(jbparts.weight * jbsupply.quan) AS "weight total"
FROM jbparts, jbsupplier, jbcity, jbsupply
WHERE jbsupplier.city = jbcity.id
    AND jbcity.state = "Mass"
    AND jbsupply.supplier = jbsupplier.id
    AND jbparts.id = jbsupply.part
    GROUP BY jbsupplier.name;
/*
+--------------+--------------+
| supplier     | weight total |
+--------------+--------------+
| DEC          |         3120 |
| Fisher-Price |      1135000 |
+--------------+--------------+
*/

-- 14) Create a new relation (a table), with the same attributes as the table items using the CREATE TABLE syntax where you define every attribute explicitly (i.e. not 10 as a copy of another table). Then fill the table with all items that cost less than the average price for items. Remember to define primary and foreign keys in your table!


CREATE TABLE jbitem_copy (
    id	int, -- (11) default, but what does it do?
    PRIMARY KEY (id),
    name	varchar(20), -- 20, text, text(20) = tinytext
    dept	int NOT NULL,
	price	int,
    qoh	int unsigned,
    supplier int NOT NULL,
	CONSTRAINT fk_dept
		FOREIGN KEY (dept) 
		REFERENCES jbdept(id)
		ON DELETE CASCADE,
	CONSTRAINT fk_supplier
		FOREIGN KEY (supplier) 
		REFERENCES jbsupplier(id)
		ON DELETE CASCADE
);


INSERT INTO jbitem_copy
    SELECT *
    FROM jbitem
    WHERE price < (
        SELECT AVG(price)
        FROM jbitem
        );

-- SELECT * FROM jbitem_copy;

-- 15) Create a view that contains the items that cost less than the average price for items.


CREATE VIEW  jbitem_view_less AS
SELECT  *
FROM    jbitem
WHERE price < (
    SELECT AVG(price)
    FROM jbitem
    );

-- SELECT * FROM jbitem_view_less;

-- 16) What is the difference between a table and a view? One is static and the other is dynamic. Which is which and what do we mean by static respectively dynamic?

/*
    A table is static in the sense that the data within will not change without
    explicit instructions. Whereas a view is an indirect container of data,
    pointing to tables when used, the "data" in the view is dynamic in the sense
    it might change if any of the tables it uses changes even though the view
    remained untouched.

    It is also dynamic in the sense they can change without changing the data
    stored on disk whereas a table change will affect the disk memory.
*/

-- 17) Create a view, using only the implicit join notation, i.e. only use where statements but no inner join, right join or left join statements, that calculates the total cost of each debit, by considering price and quantity of each bought item. (To be used for charging customer accounts). The view should contain the sale identifier (debit) and total cost.


CREATE VIEW jbdebit_view_cost AS
SELECT  d.id, SUM(i.price * s.quantity) as "total cost"
FROM    jbdebit d, jbsale s, jbitem i
WHERE   d.id = s.debit
AND     s.item = i.id
GROUP BY    d.id;

-- SELECT * FROM jbdebit_view_cost; 

-- 18) Do the same as in (17), using only the explicit join notation, i.e. using only left, right or inner joins but no where statement. Motivate why you use the join you do (left, right or inner), and why this is the correct one (unlike the others).

DROP VIEW jbdebit_view_cost;

CREATE VIEW jbdebit_view_cost AS
SELECT d.id, SUM(i.price * s.quantity) as "total cost"
FROM jbdebit d
INNER JOIN jbsale s
ON d.id = s.debit
INNER JOIN jbitem i
ON s.item = i.id
GROUP BY d.id;

-- SELECT * FROM jbdebit_view_cost;

/*
Two inner joins is correct as it works similarly to a where-clause. We want to combine entries of two tables where some attribute matches.
In our case we want to match jbdebit.id = jbsale.debit, and jbsale.item = jbitem.id.
We need two inner joins because we have two things we need to match.
A left or right join would return the same result as inner joins , plus the entire left or right table. This is not equivalent to the implicit join above.
We might want to use left join making the debit the "point of view" to not lose or forget any debits that might have missing information (like when we delete a supplier in problem 19).
*/

/*
19) Oh no! An earthquake!
a) Remove all suppliers in Los Angeles from the table jbsupplier.
This will not work right away (you will receive error code 23000) which you will have to solve by deleting some other related tuples.
However, do not delete more tuples from other tables than necessary and do not change the structure of the tables,
i.e. do not remove foreign keys. Also, remember that you are only allowed to use “Los Angeles” as a constant in your queries, not “199” or “900”.
b) Explain what you did and why.
*/



DELETE FROM jbsale WHERE item IN
  (SELECT id FROM jbitem WHERE supplier =
    (SELECT id FROM jbsupplier WHERE city =
      (SELECT id FROM jbcity WHERE name = "Los Angeles")));



DELETE FROM jbitem WHERE supplier =
  (SELECT id FROM jbsupplier WHERE city =
    (SELECT id FROM jbcity WHERE name = "Los Angeles"));


DELETE FROM jbsupplier WHERE
city = (SELECT id FROM jbcity WHERE name = "Los Angeles");

/*
  The first step we tried was to run the third query, which tries to delete the suppier directly. This threw the error code 23000 and explained that there were items which had the suppliers id referenced.
  We then constructed a lengthy query to delete those tuples, which referenced the suppliers in Los Angeles. This threw another 23000 error, there were tuples in jbsale which referenced some of the deleted items.
  We then constructed an even lengthier query to delete the sales which referenced the item which referenced the supplier.
  Then, we execute the queries backwards, deleting sales first, then items, and finally suppliers.

  We read up on alternate solutions, but they  altered the table structure by removing the foreign key constraints, or ignored constraints all together (which is dangerous).
  One could also redefine the table to make the foreign keys DELETE CASCADE, which deletes the row when the foreign key gets deleted.
  This clunky solution is the only one we found which didn't touch the table structure.
*/

/*
20) An employee has tried to find out which suppliers that have delivered items that have been sold. He has created a view and a query that shows the number of items sold from a supplier.
mysql> CREATE VIEW jbsale_supply(supplier, item, quantity) AS     -> SELECT jbsupplier.name, jbitem.name, jbsale.quantity      -> FROM jbsupplier, jbitem, jbsale     -> WHERE jbsupplier.id = jbitem.supplier      -> AND jbsale.item = jbitem.id; Query OK, 0 rows affected (0.01 sec)


mysql> SELECT supplier, sum(quantity) AS sum FROM jbsale_supply     -> GROUP BY supplier
+--------------+---------------+
| supplier     | sum(quantity) |
+--------------+---------------+
| Cannon       |             6 |
| Levi-Strauss |             1 |
| Playskool    |             2 |
| White Stag   |             4 |
| Whitman's    |             2 |
+--------------+---------------+
5 rows in set (0.00 sec) The employee would also like include the suppliers which has delivered some items, although for whom no items have been sold so far.
In other words he wants to list all suppliers, which has supplied any item, as well as the number of these 11 items that have been sold.
Help him! Drop and redefine jbsale_supply to consider suppliers that have delivered items that have never been sold as well.
Hint: The above definition of jbsale_supply uses an (implicit) inner join that removes suppliers that have not had any of their delivered items sold.
*/

CREATE VIEW jbsale_supply(supplier, item, quantity) AS
  SELECT jbsupplier.name, jbitem.name, jbsale.quantity
    FROM jbsupplier
      INNER JOIN jbitem
      ON jbsupplier.id = jbitem.supplier
      LEFT JOIN jbsale
      ON jbsale.item = jbitem.id;

SELECT supplier, sum(quantity) AS sum FROM jbsale_supply GROUP BY supplier;

-- SELECT * FROM jbsale_supply;

/*
+--------------+------+
| supplier     | sum  |
+--------------+------+
| Cannon       |    6 |
| Fisher-Price | NULL |
| Levi-Strauss |    1 |
| Playskool    |    2 |
| White Stag   |    4 |
| Whitman's    |    2 |
+--------------+------+
6 rows in set (0.00 sec)

OBS: Not including the supplier removed in upg19 above
*/
