-- Create database with proper character set
CREATE DATABASE IF NOT EXISTS train_reservation
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE train_reservation;

-- Stations table
CREATE TABLE stations (
    scode VARCHAR(100) PRIMARY KEY,
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

-- Train Classes table
CREATE TABLE train_classes (
    class_id VARCHAR(100) PRIMARY KEY,
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

-- Trains table
CREATE TABLE trains (
    tid VARCHAR(100) PRIMARY KEY,
    serial_number VARCHAR(50) UNIQUE NOT NULL,
    maintenance_status ENUM('ACTIVE', 'MAINTENANCE', 'OUT_OF_SERVICE') NOT NULL DEFAULT 'ACTIVE',
    class_capacities JSON NOT NULL,
    last_maintenance_date DATE,
    next_maintenance_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_maintenance_status (maintenance_status)
) ENGINE=InnoDB;

-- Employees table
CREATE TABLE employees (
    eid VARCHAR(100) PRIMARY KEY,
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
    station_code VARCHAR(100),
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

-- Employee Schedules table
CREATE TABLE employee_schedules (
    schedule_id VARCHAR(100) PRIMARY KEY,
    employee_id VARCHAR(100) NOT NULL,
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

-- Employee Leave table
CREATE TABLE employee_leave (
    leave_id VARCHAR(100) PRIMARY KEY,
    employee_id VARCHAR(100) NOT NULL,
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

-- Passengers table
CREATE TABLE passengers (
    pid VARCHAR(100) PRIMARY KEY,
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

-- Journeys table
CREATE TABLE journeys (
    jid VARCHAR(100) PRIMARY KEY,
    train_id VARCHAR(100) NOT NULL,
    base_price DECIMAL(10,2) NOT NULL,
    status ENUM('SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED') NOT NULL DEFAULT 'SCHEDULED',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (train_id) REFERENCES trains(tid) ON DELETE RESTRICT,
    INDEX idx_status (status)
) ENGINE=InnoDB;

-- Journey Stations table
CREATE TABLE journey_stations (
    journey_id VARCHAR(100),
    station_code VARCHAR(100),
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

-- Bookings table
CREATE TABLE bookings (
    booking_id VARCHAR(100) PRIMARY KEY,
    passenger_id VARCHAR(100) NOT NULL,
    journey_id VARCHAR(100) NOT NULL,
    train_id VARCHAR(100) NOT NULL,
    class_id VARCHAR(100) NOT NULL,
    coach_number VARCHAR(100) NOT NULL,
    seat_number VARCHAR(100) NOT NULL,
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

-- Notifications table
CREATE TABLE notifications (
    notification_id VARCHAR(100) PRIMARY KEY,
    passenger_id VARCHAR(100) NOT NULL,
    message TEXT NOT NULL,
    type ENUM('BOOKING_CONFIRMATION', 'JOURNEY_REMINDER', 'SYSTEM') NOT NULL,
    created_at DATETIME NOT NULL,
    status ENUM('SENT', 'DELIVERED', 'READ') NOT NULL,
    FOREIGN KEY (passenger_id) REFERENCES passengers(pid) ON DELETE CASCADE,
    INDEX idx_status (status),
    INDEX idx_type (type)
) ENGINE=InnoDB;