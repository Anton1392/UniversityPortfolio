-- Reset
SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS ba_airport;
DROP TABLE IF EXISTS ba_route;
DROP TABLE IF EXISTS ba_routeprice;
DROP TABLE IF EXISTS ba_flight;
DROP TABLE IF EXISTS ba_schedule;
DROP TABLE IF EXISTS ba_reservationpassenger;
DROP TABLE IF EXISTS ba_passenger;
DROP TABLE IF EXISTS ba_customer;
DROP TABLE IF EXISTS ba_creditcard;
DROP TABLE IF EXISTS ba_ticket;
DROP TABLE IF EXISTS ba_booking;
DROP TABLE IF EXISTS ba_contact;
DROP TABLE IF EXISTS ba_reservationflight;
DROP TABLE IF EXISTS ba_profitfactor;
DROP TABLE IF EXISTS ba_weekdayfactor;

DROP PROCEDURE IF EXISTS addYear;
DROP PROCEDURE IF EXISTS addDay;
DROP PROCEDURE IF EXISTS addDestination;
DROP PROCEDURE IF EXISTS addRoute;
DROP PROCEDURE IF EXISTS addRoutePrice;
DROP PROCEDURE IF EXISTS addFlight;

DROP FUNCTION IF EXISTS calculateFreeSeats;
DROP FUNCTION IF EXISTS calculatePrice;

DROP TRIGGER IF EXISTS trigger_ticket;

DROP PROCEDURE IF EXISTS addReservation;
DROP PROCEDURE IF EXISTS addPassenger;
DROP PROCEDURE IF EXISTS addContact;
DROP PROCEDURE IF EXISTS addPayment;

DROP VIEW IF EXISTS allFlights;

SET FOREIGN_KEY_CHECKS = 1;

CREATE TABLE ba_profitfactor(
	year INTEGER PRIMARY KEY NOT NULL,
	profitfactor DOUBLE
);

CREATE TABLE ba_weekdayfactor(
	year INTEGER NOT NULL,
	day VARCHAR(10) NOT NULL,
	weekdayfactor DOUBLE,
	PRIMARY KEY(year, day)
);

-- Main
CREATE TABLE ba_airport(
	code 	VARCHAR(3) PRIMARY KEY NOT NULL,
	name 	VARCHAR(30),
	country	VARCHAR(30)
);

CREATE TABLE ba_route(
	id 	INTEGER AUTO_INCREMENT PRIMARY KEY,

	departure VARCHAR(3),
	FOREIGN KEY fk_departure(departure)
	REFERENCES ba_airport(code)
	ON UPDATE CASCADE
	ON DELETE RESTRICT,

	arrival	VARCHAR(3),
	FOREIGN KEY fk_arrival(arrival)
	REFERENCES ba_airport(code)
	ON UPDATE CASCADE
	ON DELETE RESTRICT
);

CREATE TABLE ba_routeprice(
	route	INTEGER NOT NULL,
	FOREIGN KEY fk_route(route)
	REFERENCES ba_route(id)
	ON UPDATE CASCADE
	ON DELETE RESTRICT,

	year	INTEGER NOT NULL,
	routeprice	DOUBLE,
	PRIMARY KEY(route, year)
);

CREATE TABLE ba_schedule(
	id	INTEGER AUTO_INCREMENT,
	year	INTEGER NOT NULL,
	departuretime TIME,
	day		VARCHAR(10),

	route 	INTEGER,
	FOREIGN KEY fk_schedule_route(route)
	REFERENCES ba_route(id)
	ON UPDATE CASCADE
	ON DELETE RESTRICT,
	PRIMARY KEY(id)
);

CREATE INDEX ix_schedule_id ON ba_schedule(year); -- So we can foreign key properly.

CREATE TABLE ba_flight(
	flightnumber INTEGER AUTO_INCREMENT PRIMARY KEY,
	seats 	INTEGER,

	week INTEGER,
	-- FK schedule + year => id + year (schedule)
	schedule INTEGER,
	FOREIGN KEY fk_flight_schedule(schedule)
	REFERENCES ba_schedule(id)
	ON UPDATE CASCADE
	ON DELETE RESTRICT,

	year 	INTEGER,
	FOREIGN KEY fk_flight_year(year)
	REFERENCES ba_schedule(year)
	ON UPDATE CASCADE
	ON DELETE RESTRICT
);

CREATE TABLE ba_customer(
	id	INTEGER PRIMARY KEY AUTO_INCREMENT NOT NULL,
	name VARCHAR(30)
);

CREATE TABLE ba_passenger(
	customer INTEGER PRIMARY KEY,
	FOREIGN KEY fk_passenger_customer(customer)
	REFERENCES ba_customer(id)
	ON UPDATE CASCADE
	ON DELETE RESTRICT,

	passportnumber INTEGER
);

CREATE TABLE ba_reservationflight(
	id	INTEGER PRIMARY KEY,

	flight	INTEGER,
  FOREIGN KEY fk_reservationflight_flight(flight)
	REFERENCES ba_flight(flightnumber)
	ON UPDATE CASCADE
	ON DELETE RESTRICT,

	week INTEGER
);

CREATE TABLE ba_reservationpassenger(
	id	INTEGER,
	FOREIGN KEY fk_reservationpassenger_id(id)
	REFERENCES ba_reservationflight(id)
	ON UPDATE CASCADE
	ON DELETE RESTRICT,

	passenger INTEGER,
	FOREIGN KEY fk_reservation_passenger(passenger)
	REFERENCES ba_passenger(customer)
	ON UPDATE CASCADE
	ON DELETE RESTRICT,

	PRIMARY KEY(id, passenger)
);

CREATE TABLE ba_creditcard(
	number BIGINT PRIMARY KEY,

	cardholder_name VARCHAR(30)
);

CREATE TABLE ba_contact(
	customer INTEGER,
	FOREIGN KEY fk_contact_customer(customer)
	REFERENCES ba_passenger(customer)
	ON UPDATE CASCADE
	ON DELETE RESTRICT,

	reservation INTEGER,
	FOREIGN KEY fk_contact_reservation_nr(reservation)
	REFERENCES ba_reservationflight(id)
	ON UPDATE CASCADE
	ON DELETE RESTRICT,

	phone	BIGINT,
	email	VARCHAR(30),
	PRIMARY KEY(customer, reservation)
);



CREATE TABLE ba_booking(
	id	INTEGER AUTO_INCREMENT,

	reservation INTEGER,
	FOREIGN KEY fk_booking_reservation(reservation)
	REFERENCES ba_reservationflight(id)
	ON UPDATE CASCADE
	ON DELETE RESTRICT,

	contact INTEGER,
	FOREIGN KEY fk_booking_contact(contact)
	REFERENCES ba_contact(customer)
	ON UPDATE CASCADE
	ON DELETE RESTRICT,

	payer_card BIGINT,
	FOREIGN KEY fk_booking_payer(payer_card)
	REFERENCES ba_creditcard(number)
	ON UPDATE CASCADE
	ON DELETE RESTRICT,

	price	FLOAT,

	PRIMARY KEY(id, reservation)
);

CREATE TABLE ba_ticket(
	number	INTEGER PRIMARY KEY,

	passenger INTEGER,
	FOREIGN KEY fk_ticket_passenger(passenger)
	REFERENCES ba_passenger(customer)
	ON UPDATE CASCADE
	ON DELETE RESTRICT,

	booking INTEGER,
	FOREIGN KEY fk_ticket_booking(booking)
	REFERENCES ba_booking(id)
	ON UPDATE CASCADE
	ON DELETE RESTRICT
);

/*
DESCRIBE ba_airport;
DESCRIBE ba_route;
DESCRIBE ba_routeprice;
DESCRIBE ba_flight;
DESCRIBE ba_schedule;
DESCRIBE ba_reservationpassenger;
DESCRIBE ba_passenger;
DESCRIBE ba_customer;
DESCRIBE ba_creditcard;
DESCRIBE ba_ticket;
DESCRIBE ba_booking;
DESCRIBE ba_contact;
DESCRIBE ba_reservationflight;
DESCRIBE ba_profitfactor;
DESCRIBE ba_weekdayfactor;
*/

DELIMITER //

CREATE PROCEDURE addYear
(IN year INTEGER, IN factor DOUBLE)
BEGIN
  INSERT INTO ba_profitfactor (year, profitfactor) VALUES (year, factor);
END //

CREATE PROCEDURE addDay
(IN year INTEGER, IN day VARCHAR(10), IN factor DOUBLE)
BEGIN
  INSERT INTO ba_weekdayfactor (year, day, weekdayfactor) VALUES (year, day, factor);
END //

CREATE PROCEDURE addDestination
(IN airport_code VARCHAR(3), IN name VARCHAR(30), IN country VARCHAR(30))
BEGIN
  INSERT INTO ba_airport (code, name, country) VALUES (airport_code, name, country);
END //

CREATE PROCEDURE addRoute
(IN departure_airport_code VARCHAR(3), IN arrival_airport_code VARCHAR(3))
BEGIN
	INSERT INTO ba_route(departure, arrival) VALUES (departure_airport_code, arrival_airport_code);
END //

CREATE PROCEDURE addRoutePrice
(IN route INTEGER, IN year INTEGER, IN price DOUBLE)
BEGIN
	INSERT INTO ba_routeprice(route, year, routeprice) VALUES (route, year, price);
END //

CREATE PROCEDURE addFlight
(IN departure_airport_code VARCHAR(3), IN arrival_airport_code VARCHAR(3), IN year INTEGER, IN day VARCHAR(10), IN departuretime TIME)
BEGIN
	INSERT INTO ba_schedule(year, day, departuretime, route)
	VALUES (year, day, departuretime, (SELECT id from ba_route WHERE departure=departure_airport_code AND arrival=arrival_airport_code));
	SET @sch_id = LAST_INSERT_ID();

	SET @i = 1;
	WHILE @i < 53 DO
		INSERT INTO ba_flight(seats, schedule, year, week) VALUES(40, @sch_id, year, @i);
		SET @i = @i + 1;
	END WHILE;
END //

CREATE FUNCTION calculateFreeSeats(flightnumber INTEGER)
RETURNS INTEGER
BEGIN
	/*SELECT 40-COUNT(ba_reservationpassenger.id) INTO @to_return
	FROM ba_booking, ba_reservationflight, ba_reservationpassenger
	WHERE ba_reservationflight.flight = flightnumber
	AND ba_booking.reservation = ba_reservationflight.id
	AND ba_booking.reservation = ba_reservationflight.id;*/
  RETURN 40-(SELECT COUNT(ba_ticket.number)
		FROM ba_booking, ba_reservationflight, ba_ticket
		WHERE ba_ticket.booking = ba_booking.id
		AND ba_reservationflight.flight = flightnumber
		AND ba_booking.reservation = ba_reservationflight.id);

	-- SELECT COUNT(ba_ticket.number) FROM ba_booking, ba_reservationflight, ba_ticket WHERE ba_reservationflight.flight = flightnumber AND ba_booking.reservation = ba_reservationflight.id AND ba_ticket.booking = ba_booking.id
END //

CREATE FUNCTION calculatePrice(_flightnumber INTEGER)
RETURNS DOUBLE
BEGIN
	SELECT -1, -1, -1, -1, "", 99999, -1, -1, -1 INTO @p_routeID, @p_routePriceID, @p_scheduleID, @p_scheduleYear, @p_day, @p_bookedPassengers, @p_routePrice, @p_weekdayfactor, @p_profitFactor;
	SELECT schedule, year INTO @p_scheduleID, @p_scheduleYear FROM ba_flight WHERE flightnumber = _flightnumber;
	SELECT route, day INTO @p_routeID, @p_day FROM ba_schedule WHERE id = @p_scheduleID AND year = @p_scheduleYear;
	SELECT routeprice INTO @p_routePrice FROM ba_routeprice WHERE route = @p_routeID AND year = @p_scheduleYear;

	SELECT weekdayfactor INTO @p_weekdayFactor FROM ba_weekdayfactor WHERE day = @p_day AND year = @p_scheduleYear;

	SELECT 40-(SELECT calculateFreeSeats(_flightnumber)) INTO @p_bookedPassengers;
	SELECT profitfactor INTO @p_profitFactor FROM ba_profitfactor WHERE year = @p_scheduleYear;
	return ROUND(@p_routePrice * @p_weekdayfactor * (@p_bookedPassengers+1)/40 * @p_profitFactor, 3);
	-- return p_weekdayFactor;
	-- return p_routePrice;
END //

CREATE TRIGGER trigger_ticket
	AFTER INSERT ON ba_booking
	FOR EACH ROW
BEGIN
	SELECT -1 INTO @reservationID;
	-- SELECT 'test' as '';
	SELECT NEW.reservation INTO @reservationID;
	-- Find passengers for reservation
	INSERT INTO ba_ticket(number, passenger, booking)
	SELECT DISTINCT rand()*1000000, customer, NEW.id
	FROM ba_passenger WHERE
		customer = ANY(SELECT passenger FROM ba_reservationpassenger WHERE id = @reservationID);

	-- rand()*1000000,
	-- (SELECT customer FROM ba_passenger WHERE
	-- 	customer = ANY(SELECT passenger FROM ba_reservationpassenger WHERE id = @reservationID)),
	-- NEW.id);
	-- Insert ticket for each passenger
END //

CREATE PROCEDURE addReservation
(IN departure_airport_code VARCHAR(3), IN arrival_airport_code VARCHAR(3), IN year INTEGER, IN _week INTEGER, IN day VARCHAR(10), IN time TIME, IN number_of_passengers INTEGER, OUT output_reservation_nr INTEGER)
BEGIN
	SELECT -1, -1, -1, -1, -1 INTO @routeID, @scheduleID, @scheduleYear, @flightnumber, @freeSeats;
	SELECT id INTO @routeID FROM ba_route WHERE departure = departure_airport_code AND arrival = arrival_airport_code;
	SELECT id, year INTO @scheduleID, @scheduleYear FROM ba_schedule WHERE route = @routeID AND departuretime = time AND ba_schedule.day = day AND ba_schedule.year = year;
	SELECT flightnumber INTO @flightnumber FROM ba_flight WHERE schedule = @scheduleID AND year = @scheduleYear AND week = _week;

	IF @flightnumber = -1 THEN
		SELECT "There exist no flight for the given route, date and time" as "Message";
	ELSE
		SET @freeSeats := calculateFreeSeats(@flightnumber);
		IF number_of_passengers <= @freeSeats THEN
			SET @r = rand()*1000000;
			INSERT INTO ba_reservationflight(id, flight, week) VALUES (@r, @flightnumber, week);
			SET output_reservation_nr = @r;
		ELSE
			SELECT "There are not enough seats available on the chosen flight" as "Message";
		END IF;
	END IF;
END //

CREATE PROCEDURE addPassenger
(IN reservation_nr INTEGER, IN passport_number INTEGER, IN name VARCHAR(30))
BEGIN
	IF NOT EXISTS(SELECT 1 FROM ba_reservationflight WHERE id = reservation_nr) THEN
		SELECT "The given reservation number does not exist" as "Message";
	ELSE
		IF EXISTS(SELECT 1 FROM ba_booking WHERE reservation = reservation_nr) THEN
			SELECT "The booking has already been payed and no futher passengers can be added" as "Message";
		ELSE
			-- Create new customer and passenger if it doesn't exist already.
		  IF NOT EXISTS (SELECT customer FROM ba_passenger as p, ba_customer as c WHERE p.passportnumber = passport_number AND c.name = name AND c.id = p.customer)
			THEN
				INSERT INTO ba_customer(name) VALUES (name);
				INSERT INTO ba_passenger(customer, passportnumber) VALUES(LAST_INSERT_ID(), passport_number);
			END IF;

			INSERT INTO ba_reservationpassenger(id, passenger) VALUES(
				reservation_nr, (SELECT customer FROM ba_passenger as p, ba_customer as c WHERE p.passportnumber = passport_number AND c.name = name AND c.id = p.customer)
			);
		END IF;
	END IF;
END //

CREATE PROCEDURE addContact
(IN reservation_nr INTEGER, IN passport_number INTEGER, IN email VARCHAR(30), in phone BIGINT)
BEGIN
	IF NOT EXISTS(SELECT 1 FROM ba_reservationflight WHERE id = reservation_nr) THEN
		SELECT "The given reservation number does not exist" as "Message";
	ELSE
		-- If the passport is a passenger in a reservation
		SET @passenger_id = -1;
		SELECT customer INTO @passenger_id FROM ba_passenger WHERE passportnumber = passport_number;
		IF EXISTS(SELECT id FROM ba_reservationpassenger WHERE id = reservation_nr AND passenger = @passenger_id)
		THEN
			INSERT INTO ba_contact(customer, reservation, phone, email) VALUES(@passenger_id, reservation_nr, phone, email);
		ELSE
			SELECT "The person is not a passenger of the reservation" as "Message";
		END IF;
	END IF;
END //

CREATE PROCEDURE addPayment
(IN reservation_nr INTEGER, IN cardholder_name VARCHAR(30), IN credit_card_number BIGINT)
BEGIN
	SELECT -1, -1, -1 INTO @flight_no, @contact, @price;

	IF NOT EXISTS(SELECT 1 FROM ba_reservationflight WHERE id = reservation_nr) THEN
		SELECT "The given reservation number does not exist" as "Message";
	ELSE
		SELECT flight INTO @flight_no FROM ba_reservationflight WHERE id = reservation_nr;

		SELECT passenger INTO @contact FROM ba_reservationpassenger as r, ba_contact as c
			 WHERE c.customer = r.passenger AND r.id = reservation_nr AND c.reservation = reservation_nr;

		-- If reservation has contact AND freeSeats > 0
		IF @contact = -1 THEN
		 	SELECT "The reservation has no contact yet" as "Message";
		ELSE
			SET @free_seats = calculateFreeSeats(@flight_no);
			SELECT COUNT(passenger) INTO @reservation_size FROM ba_reservationpassenger WHERE id = reservation_nr;
			IF @free_seats < @reservation_size THEN
				SELECT "There are not enough seats available on the flight anymore, deleting reservation" as "Message";
				DELETE FROM ba_contact WHERE reservation = reservation_nr;
				DELETE FROM ba_reservationpassenger WHERE id = reservation_nr;
				DELETE FROM ba_reservationflight WHERE id = reservation_nr;
			ELSE
				SELECT SLEEP(5); -- force delay for concurrency test
			    START TRANSACTION;
				-- Insert credit card
				INSERT IGNORE INTO ba_creditcard(number, cardholder_name) VALUES (credit_card_number, cardholder_name);
				-- Calculate price, insert booking
				SET @price = calculatePrice(@flight_no);
				INSERT INTO ba_booking(reservation, contact, payer_card, price) VALUES (reservation_nr, @contact, credit_card_number, @price);
				SET @remaining = calculateFreeSeats(@flight_no);
				IF @remaining >= 0 THEN
					COMMIT;
					SELECT "Payment successfully added, commit transaction" AS "MESSAGE";
				ELSE
					ROLLBACK;
					SELECT "Payment failed, rollback transaction" AS "MESSAGE";
				END IF;
			END IF;
		END IF;
	END IF;
END //

DELIMITER ;

/*
7. Create a view allFlights containing all flights in your database with the following
information: departure_city_name, destination_city_name, departure_time,
departure_day, departure_week, departure_year, nr_of_free_seats,
current_price_per_seat. See the testcode for an example of how it can look like.
*/


CREATE VIEW allFlights(departure_city_name, destination_city_name, departure_time, departure_day, departure_week, departure_year, nr_of_free_seats, current_price_per_seat) AS
SELECT dep.name, arr.name, sc.departuretime, sc.day, fli.week, fli.year, calculateFreeSeats(fli.flightnumber), calculatePrice(fli.flightnumber)
FROM ba_airport dep, ba_airport arr, ba_schedule sc, ba_flight fli, ba_route rt
WHERE fli.schedule = sc.id AND fli.year = sc.year AND sc.route = rt.id
AND rt.departure = dep.code AND rt.arrival = arr.code;

/*
CALL addYear(2019, 1.05);
-- SELECT * FROM ba_profitfactor;

CALL addDay(2019, "Monday", 1.05);
-- SELECT * FROM ba_weekdayfactor;

CALL addDestination("AUS", "Australia National Airport", "Australia");
CALL addDestination("LIA", "Linköping Airport", "Sweden");
-- SELECT * from ba_airport;

CALL addRoute("AUS", "LIA");
CALL addRoutePrice(LAST_ID_INSERT(), 2000, 100);
-- SELECT * FROM ba_routeprice;
-- SELECT * FROM ba_route;

CALL addFlight("AUS", "LIA", 2019, "Monday", "08:00:00");

-- SELECT * FROM ba_schedule;
-- SELECT * FROM ba_flight;

SELECT calculateFreeSeats(1);
-- SELECT calculatePrice(1);

CALL addReservation("AUS", "LIA", 2019, 1, "Monday", "08:00:00", 20, @res_no);

-- SELECT * FROM ba_reservationflight;

-- SELECT @res_no;
CALL addPassenger(@res_no, "12345", "Anton Sköld");
CALL addPassenger(@res_no, "1234567", "Banton Böld");
CALL addPassenger(@res_no, "12345678", "Kanton Köld");
-- SELECT * FROM ba_customer;
-- SELECT * FROM ba_passenger;
-- SELECT * FROM ba_reservationpassenger;

CALL addContact(@res_no, "12345", "foo@bar.com", 1234567);
-- CALL addContact(@res_no, "123456123", "foo@bar.com", 1234567); -- invalid passport
-- CALL addContact(@res_no, "12345", "foo@bar.com", 1234567);
-- SELECT * FROM ba_contact;

CALL addPayment(@res_no, "Anton Sköld", 91919191919);

SELECT calculateFreeSeats(1);

-- SELECT * FROM ba_booking;
-- SELECT * FROM ba_creditcard;
SELECT * FROM ba_ticket;
*/
