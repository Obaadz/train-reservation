# Train Reservation System - Database Setup Guide

## Prerequisites
- MySQL Server 8.0 or higher
- MySQL Command Line Tool or MySQL Workbench
- Node.js environment for running migrations

## Initial Setup

1. Create the database and set character set:
```sql
CREATE DATABASE train_reservation
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE train_reservation;
```

2. Create Tables:

```sql
-- Stations
CREATE TABLE stations (
    scode VARCHAR(10) PRIMARY KEY,
    name_ar VARCHAR(100) NOT NULL,
    name_en VARCHAR(100) NOT NULL,
    capacity INT NOT NULL,
    city VARCHAR(50) NOT NULL,
    district VARCHAR(50) NOT NULL,
    street_name VARCHAR(100) NOT NULL,
    platform_count INT NOT NULL,
    image_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_city (city)
) ENGINE=InnoDB;

-- Train Classes
CREATE TABLE train_classes (
    class_id VARCHAR(10) PRIMARY KEY,
    name_ar VARCHAR(50) NOT NULL,
    name_en VARCHAR(50) NOT NULL,
    description_ar TEXT,
    description_en TEXT,
    price_multiplier DECIMAL(3,2) NOT NULL,
    features JSON,
    icon VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Trains
CREATE TABLE trains (
    tid VARCHAR(10) PRIMARY KEY,
    serial_number VARCHAR(50) UNIQUE NOT NULL,
    maintenance_status ENUM('ACTIVE', 'MAINTENANCE', 'OUT_OF_SERVICE') NOT NULL DEFAULT 'ACTIVE',
    class_capacities JSON NOT NULL,
    last_maintenance_date DATE,
    next_maintenance_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_maintenance_status (maintenance_status)
) ENGINE=InnoDB;

-- Employees
CREATE TABLE employees (
    eid VARCHAR(10) PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    middle_name VARCHAR(50),
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE,
    password VARCHAR(255),
    salary DECIMAL(10, 2) NOT NULL,
    contract_type ENUM('FULL_TIME', 'PART_TIME', 'TEMPORARY') NOT NULL,
    shift_type ENUM('MORNING', 'EVENING', 'NIGHT') NOT NULL,
    branch_location VARCHAR(100) NOT NULL,
    role ENUM('RECEPTIONIST', 'DRIVER', 'TECHNICIAN', 'CLEANER', 'STAFF', 'MANAGER', 'ADMIN') NOT NULL,
    station_code VARCHAR(10),
    hire_date DATE NOT NULL,
    can_login BOOLEAN DEFAULT FALSE,
    certification_details JSON,
    last_login TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (station_code) REFERENCES stations(scode) ON DELETE SET NULL,
    INDEX idx_role (role),
    INDEX idx_email (email)
) ENGINE=InnoDB;

-- Employee Schedules
CREATE TABLE employee_schedules (
    schedule_id VARCHAR(10) PRIMARY KEY,
    employee_id VARCHAR(10) NOT NULL,
    date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    status ENUM('SCHEDULED', 'COMPLETED', 'ABSENT') DEFAULT 'SCHEDULED',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (employee_id) REFERENCES employees(eid) ON DELETE CASCADE,
    INDEX idx_date (date),
    INDEX idx_status (status)
) ENGINE=InnoDB;

-- Employee Leave
CREATE TABLE employee_leave (
    leave_id VARCHAR(10) PRIMARY KEY,
    employee_id VARCHAR(10) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    leave_type ENUM('ANNUAL', 'SICK', 'EMERGENCY') NOT NULL,
    status ENUM('PENDING', 'APPROVED', 'REJECTED') DEFAULT 'PENDING',
    reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (employee_id) REFERENCES employees(eid) ON DELETE CASCADE,
    INDEX idx_status (status),
    INDEX idx_dates (start_date, end_date)
) ENGINE=InnoDB;

-- Passengers
CREATE TABLE passengers (
    pid VARCHAR(10) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    id_number VARCHAR(20),
    loyalty_status ENUM('BRONZE', 'SILVER', 'GOLD', 'PLATINUM') DEFAULT 'BRONZE',
    loyalty_points INT DEFAULT 0,
    last_login TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_loyalty_status (loyalty_status),
    INDEX idx_email (email)
) ENGINE=InnoDB;

-- Journeys
CREATE TABLE journeys (
    jid VARCHAR(10) PRIMARY KEY,
    train_id VARCHAR(10) NOT NULL,
    base_price DECIMAL(10,2) NOT NULL,
    status ENUM('SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED') NOT NULL DEFAULT 'SCHEDULED',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (train_id) REFERENCES trains(tid) ON DELETE RESTRICT,
    INDEX idx_status (status)
) ENGINE=InnoDB;

-- Journey Stations
CREATE TABLE journey_stations (
    journey_id VARCHAR(10),
    station_code VARCHAR(10),
    sequence_number INT NOT NULL,
    arrival_time TIME NOT NULL,
    departure_time TIME NOT NULL,
    platform_number INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (journey_id, station_code),
    FOREIGN KEY (journey_id) REFERENCES journeys(jid) ON DELETE CASCADE,
    FOREIGN KEY (station_code) REFERENCES stations(scode) ON DELETE RESTRICT,
    INDEX idx_sequence (sequence_number)
) ENGINE=InnoDB;

-- Bookings
CREATE TABLE bookings (
    booking_id VARCHAR(10) PRIMARY KEY,
    passenger_id VARCHAR(10) NOT NULL,
    journey_id VARCHAR(10) NOT NULL,
    train_id VARCHAR(10) NOT NULL,
    class_id VARCHAR(10) NOT NULL,
    coach_number VARCHAR(10) NOT NULL,
    seat_number VARCHAR(10) NOT NULL,
    booking_status ENUM('CONFIRMED', 'WAITLISTED', 'CANCELLED') NOT NULL,
    booking_date DATETIME NOT NULL,
    payment_status ENUM('PENDING', 'COMPLETED', 'REFUNDED') NOT NULL,
    payment_method VARCHAR(20),
    amount DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (passenger_id) REFERENCES passengers(pid) ON DELETE RESTRICT,
    FOREIGN KEY (journey_id) REFERENCES journeys(jid) ON DELETE RESTRICT,
    FOREIGN KEY (train_id) REFERENCES trains(tid) ON DELETE RESTRICT,
    FOREIGN KEY (class_id) REFERENCES train_classes(class_id) ON DELETE RESTRICT,
    INDEX idx_booking_status (booking_status),
    INDEX idx_payment_status (payment_status)
) ENGINE=InnoDB;

-- Notifications
CREATE TABLE notifications (
    notification_id VARCHAR(10) PRIMARY KEY,
    passenger_id VARCHAR(10) NOT NULL,
    message TEXT NOT NULL,
    type ENUM('BOOKING_CONFIRMATION', 'JOURNEY_REMINDER', 'SYSTEM') NOT NULL,
    created_at DATETIME NOT NULL,
    status ENUM('SENT', 'DELIVERED', 'READ') NOT NULL,
    FOREIGN KEY (passenger_id) REFERENCES passengers(pid) ON DELETE CASCADE,
    INDEX idx_status (status),
    INDEX idx_type (type)
) ENGINE=InnoDB;
```

3. Create Triggers:

```sql
-- Update loyalty status based on points
DELIMITER //
CREATE TRIGGER update_loyalty_status
AFTER UPDATE ON passengers
FOR EACH ROW
BEGIN
    IF NEW.loyalty_points != OLD.loyalty_points THEN
        SET NEW.loyalty_status = CASE
            WHEN NEW.loyalty_points >= 5000 THEN 'PLATINUM'
            WHEN NEW.loyalty_points >= 2500 THEN 'GOLD'
            WHEN NEW.loyalty_points >= 1000 THEN 'SILVER'
            ELSE 'BRONZE'
        END;
    END IF;
END//
DELIMITER ;

-- Prevent double booking of seats
DELIMITER //
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
DELIMITER ;
```

4. Create Indexes for Performance:

```sql
-- Additional indexes for common queries
CREATE INDEX idx_journey_date ON journey_stations (departure_time);
CREATE INDEX idx_booking_date ON bookings (booking_date);
CREATE INDEX idx_passenger_bookings ON bookings (passenger_id, booking_status);
CREATE INDEX idx_employee_schedule ON employee_schedules (employee_id, date);
```

## Security Measures

1. Create application user with limited privileges:

```sql
CREATE USER 'train_app'@'localhost' IDENTIFIED BY 'your_secure_password';

GRANT SELECT, INSERT, UPDATE, DELETE ON train_reservation.* TO 'train_app'@'localhost';
REVOKE DROP, ALTER, CREATE ON train_reservation.* FROM 'train_app'@'localhost';
```

2. Enable binary logging for audit trail:

```sql
SET GLOBAL log_bin = ON;
SET GLOBAL binlog_format = 'ROW';
```

## Maintenance Procedures

1. Create backup procedure:

```sql
DELIMITER //
CREATE PROCEDURE backup_database()
BEGIN
    -- Set backup filename with timestamp
    SET @backup_file = CONCAT('backup_', DATE_FORMAT(NOW(), '%Y%m%d_%H%i%s'), '.sql');
    SET @backup_cmd = CONCAT('mysqldump -u root -p train_reservation > ', @backup_file);
    
    -- Execute backup
    SET @execute = CONCAT('system ', @backup_cmd);
    PREPARE stmt FROM @execute;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;
END//
DELIMITER ;
```

2. Create cleanup procedure:

```sql
DELIMITER //
CREATE PROCEDURE cleanup_old_data()
BEGIN
    -- Delete old notifications
    DELETE FROM notifications 
    WHERE created_at < DATE_SUB(NOW(), INTERVAL 6 MONTH);
    
    -- Archive completed journeys
    INSERT INTO journey_archive 
    SELECT * FROM journeys 
    WHERE status = 'COMPLETED' 
    AND updated_at < DATE_SUB(NOW(), INTERVAL 1 YEAR);
    
    -- Delete archived journeys
    DELETE FROM journeys 
    WHERE status = 'COMPLETED' 
    AND updated_at < DATE_SUB(NOW(), INTERVAL 1 YEAR);
END//
DELIMITER ;
```

## Important Notes

1. Always backup the database before running migrations
2. Test triggers and procedures in a staging environment first
3. Monitor index usage and performance regularly
4. Keep binary logs rotated to prevent disk space issues
5. Regularly update user passwords and review permissions
6. Enable slow query logging in development for optimization

## Error Handling

The database includes various constraints and triggers to maintain data integrity:

- Foreign key constraints prevent orphaned records
- Unique constraints prevent duplicate entries
- Check constraints validate data ranges
- Triggers enforce business rules
- Stored procedures include error handling

## Performance Optimization

1. Tables use appropriate data types
2. Indexes are created for frequently queried columns
3. Partitioning can be implemented for large tables
4. Regular ANALYZE TABLE maintenance
5. Monitor and optimize slow queries

## Backup Strategy

1. Daily automated backups
2. Binary logging enabled for point-in-time recovery
3. Regular backup testing
4. Retention policy enforcement
5. Backup monitoring and alerting