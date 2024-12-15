DELIMITER //

-- Trigger to update loyalty status based on points
CREATE TRIGGER update_loyalty_status
BEFORE UPDATE ON Passengers
FOR EACH ROW
BEGIN
    IF NEW.loyalty_points != OLD.loyalty_points THEN
        SET NEW.loyalty_status = CASE
            WHEN NEW.loyalty_points >= 5000 THEN 'Platinum'
            WHEN NEW.loyalty_points >= 2500 THEN 'Gold'
            WHEN NEW.loyalty_points >= 1000 THEN 'Silver'
            ELSE 'Basic'
        END;
    END IF;
END//


-- Trigger to prevent double booking of seats
CREATE TRIGGER prevent_double_booking
BEFORE INSERT ON bookings
FOR EACH ROW
BEGIN
    DECLARE seat_taken INT;
    SELECT COUNT(*) INTO seat_taken
    FROM bookings
    WHERE journey_id = NEW.journey_id
    AND seat_number = NEW.seat_number
    AND booking_status = 'CONFIRMED';
    
    IF seat_taken > 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'This seat is already booked';
    END IF;
END//

-- Trigger to update journey status based on time
CREATE TRIGGER update_journey_status
BEFORE UPDATE ON journeys
FOR EACH ROW
BEGIN
    DECLARE journey_start TIME;
    DECLARE journey_end TIME;
    
    SELECT MIN(departure_time), MAX(arrival_time)
    INTO journey_start, journey_end
    FROM journey_stations
    WHERE journey_id = NEW.jid;
    
    IF CURRENT_TIME() >= journey_start AND CURRENT_TIME() <= journey_end THEN
        SET NEW.status = 'IN_PROGRESS';
    ELSEIF CURRENT_TIME() > journey_end THEN
        SET NEW.status = 'COMPLETED';
    END IF;
END//

-- Trigger to validate employee salary
CREATE TRIGGER validate_employee_salary
BEFORE INSERT ON employees
FOR EACH ROW
BEGIN
    IF NEW.salary < 3000 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Salary cannot be less than 3000';
    END IF;
END//

-- Trigger to create welcome notification for new passengers
CREATE TRIGGER create_welcome_notification
AFTER INSERT ON passengers
FOR EACH ROW
BEGIN
    INSERT INTO notifications (
        notification_id,
        passenger_id,
        message,
        type,
        created_at,
        status
    ) VALUES (
        CONCAT('N', UNIX_TIMESTAMP()),
        NEW.pid,
        'Welcome to the train booking system!',
        'SYSTEM',
        NOW(),
        'SENT'
    );
END//

-- Trigger to notify passengers before journey departure
CREATE TRIGGER notify_before_departure
AFTER INSERT ON bookings
FOR EACH ROW
BEGIN
    DECLARE departure_time DATETIME;
    DECLARE station_from VARCHAR(100);
    DECLARE platform_num INT;
    
    -- Get journey departure details
    SELECT 
        CONCAT(CURRENT_DATE(), ' ', js.departure_time),
        s.name_ar,
        js.platform_number
    INTO departure_time, station_from, platform_num
    FROM journey_stations js
    JOIN stations s ON js.station_code = s.scode
    WHERE js.journey_id = NEW.journey_id
    AND js.sequence_number = 1;
    
    -- Schedule notification for 3 hours before departure
    INSERT INTO notifications (
        notification_id,
        passenger_id,
        message,
        type,
        created_at,
        status
    )
    SELECT 
        CONCAT('ND', UNIX_TIMESTAMP()),
        NEW.passenger_id,
        CONCAT(
            'Your journey will depart in 3 hours from ',
            station_from,
            ' platform ',
            platform_num,
            '. Have a safe journey!'
        ),
        'JOURNEY_REMINDER',
        DATE_SUB(departure_time, INTERVAL 3 HOUR),
        'SENT'
    WHERE departure_time > NOW() + INTERVAL 3 HOUR;
END//

-- Event to check and send notifications
CREATE EVENT check_journey_notifications
ON SCHEDULE EVERY 1 MINUTE
DO
BEGIN
    DECLARE done INT DEFAULT FALSE;
    DECLARE notification_id VARCHAR(10);
    DECLARE passenger_id VARCHAR(10);
    DECLARE message TEXT;
    
    DECLARE cur CURSOR FOR
        SELECT n.notification_id, n.passenger_id, n.message
        FROM notifications n
        WHERE n.type = 'JOURNEY_REMINDER'
        AND n.status = 'SENT'
        AND n.created_at <= NOW()
        AND n.created_at > DATE_SUB(NOW(), INTERVAL 5 MINUTE);
        
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;
    
    OPEN cur;
    
    read_loop: LOOP
        FETCH cur INTO notification_id, passenger_id, message;
        IF done THEN
            LEAVE read_loop;
        END IF;
        
        -- Update notification status to delivered
        UPDATE notifications 
        SET status = 'DELIVERED'
        WHERE notification_id = notification_id;
        
    END LOOP;
    
    CLOSE cur;
END//

DELIMITER ;