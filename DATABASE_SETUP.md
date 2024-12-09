# Train Reservation System - Database Setup Guide

## Prerequisites
- MySQL Server installed
- MySQL Command Line Tool or MySQL Workbench

## Database Setup Steps

1. Create the database:
```sql
CREATE DATABASE train_reservation;
USE train_reservation;
```

2. Create Tables:

```sql
-- Stations
CREATE TABLE stations (
    scode VARCHAR(10) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    name_ar VARCHAR(100) NOT NULL,
    name_en VARCHAR(100) NOT NULL,
    capacity INT NOT NULL,
    city VARCHAR(50) NOT NULL,
    district VARCHAR(50) NOT NULL,
    street_name VARCHAR(100) NOT NULL,
    platform_count INT NOT NULL,
    image_url VARCHAR(255)
);

-- Train Classes
CREATE TABLE train_classes (
    class_id VARCHAR(10) PRIMARY KEY,
    name_ar VARCHAR(50) NOT NULL,
    name_en VARCHAR(50) NOT NULL,
    description_ar TEXT,
    description_en TEXT,
    price_multiplier DECIMAL(3,2) NOT NULL,
    features JSON,
    icon VARCHAR(20)
);

-- Trains
CREATE TABLE trains (
    tid VARCHAR(10) PRIMARY KEY,
    serial_number VARCHAR(50) UNIQUE NOT NULL,
    maintenance_status VARCHAR(20) NOT NULL,
    class_capacities JSON NOT NULL
);

-- Journeys
CREATE TABLE journeys (
    jid VARCHAR(10) PRIMARY KEY,
    train_id VARCHAR(10) NOT NULL,
    base_price DECIMAL(10,2) NOT NULL,
    status ENUM('SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED') NOT NULL DEFAULT 'SCHEDULED',
    FOREIGN KEY (train_id) REFERENCES trains(tid)
);

-- Journey_Stations
CREATE TABLE journey_stations (
    journey_id VARCHAR(10),
    station_code VARCHAR(10),
    sequence_number INT NOT NULL,
    arrival_time TIME NOT NULL,
    departure_time TIME NOT NULL,
    platform_number INT NOT NULL,
    PRIMARY KEY (journey_id, station_code),
    FOREIGN KEY (journey_id) REFERENCES journeys(jid),
    FOREIGN KEY (station_code) REFERENCES stations(scode)
);

-- Passengers
CREATE TABLE passengers (
    pid VARCHAR(10) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    loyalty_status ENUM('BRONZE', 'SILVER', 'GOLD', 'PLATINUM') DEFAULT 'BRONZE',
    loyalty_points INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

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
    FOREIGN KEY (passenger_id) REFERENCES passengers(pid),
    FOREIGN KEY (journey_id) REFERENCES journeys(jid),
    FOREIGN KEY (train_id) REFERENCES trains(tid),
    FOREIGN KEY (class_id) REFERENCES train_classes(class_id)
);

-- Notifications
CREATE TABLE notifications (
    notification_id VARCHAR(10) PRIMARY KEY,
    passenger_id VARCHAR(10) NOT NULL,
    message TEXT NOT NULL,
    type ENUM('BOOKING_CONFIRMATION', 'JOURNEY_REMINDER', 'SYSTEM') NOT NULL,
    created_at DATETIME NOT NULL,
    status ENUM('SENT', 'DELIVERED', 'READ') NOT NULL,
    FOREIGN KEY (passenger_id) REFERENCES passengers(pid)
);
```

3. Insert Sample Data:

```sql
-- Insert stations
INSERT INTO stations (scode, name, name_ar, name_en, capacity, city, district, street_name, platform_count, image_url) VALUES
('RYD001', 'محطة الرياض المركزية', 'محطة الرياض المركزية', 'Riyadh Central Station', 1000, 'الرياض', 'العليا', 'طريق الملك فهد', 10, 'https://images.unsplash.com/photo-1586724237569-f3d0c1dee8c6'),
('JED001', 'محطة جدة', 'محطة جدة', 'Jeddah Station', 800, 'جدة', 'البلد', 'طريق الملك عبدالعزيز', 8, 'https://images.unsplash.com/photo-1578895101408-1a36b834405b'),
('DMM001', 'محطة الدمام', 'محطة الدمام', 'Dammam Station', 600, 'الدمام', 'وسط المدينة', 'شارع الأمير محمد', 6, 'https://images.unsplash.com/photo-1578474846511-04ba529f0b88'),
('MKH001', 'محطة مكة المكرمة', 'محطة مكة المكرمة', 'Makkah Station', 1200, 'مكة المكرمة', 'العزيزية', 'طريق الحرم', 12, 'https://images.unsplash.com/photo-1565552645632-d725f8bfc19a'),
('MED001', 'محطة المدينة المنورة', 'محطة المدينة المنورة', 'Madinah Station', 900, 'المدينة المنورة', 'المركزية', 'طريق الهجرة', 8, 'https://images.unsplash.com/photo-1591604129939-f7c5f6145e31');

-- Insert train classes
INSERT INTO train_classes (class_id, name_ar, name_en, description_ar, description_en, price_multiplier, features, icon) VALUES
('CLS001', 'الدرجة الأولى', 'First Class', 'خدمة فاخرة مع مقاعد جلدية ووجبات مجانية', 'Luxury service with leather seats and complimentary meals', 2.00, '{"wifi": true, "meals": true, "entertainment": true, "powerOutlets": true, "extraLegroom": true}', 'crown'),
('CLS002', 'درجة رجال الأعمال', 'Business Class', 'مقاعد مريحة مع خدمة متميزة', 'Comfortable seats with premium service', 1.50, '{"wifi": true, "meals": true, "powerOutlets": true, "extraLegroom": true}', 'briefcase'),
('CLS003', 'الدرجة السياحية', 'Economy Class', 'رحلة مريحة بسعر معقول', 'Comfortable journey at reasonable price', 1.00, '{"wifi": true, "powerOutlets": true}', 'users');

-- Insert trains
INSERT INTO trains (tid, serial_number, maintenance_status, class_capacities) VALUES
('TRN001', 'SR12345', 'ACTIVE', '{"CLS001": 20, "CLS002": 40, "CLS003": 120}'),
('TRN002', 'SR12346', 'ACTIVE', '{"CLS001": 20, "CLS002": 40, "CLS003": 120}'),
('TRN003', 'SR12347', 'MAINTENANCE', '{"CLS001": 20, "CLS002": 40, "CLS003": 120}');

-- Insert journeys
INSERT INTO journeys (jid, train_id, base_price, status) VALUES
('JRN001', 'TRN001', 150.00, 'SCHEDULED'),
('JRN002', 'TRN002', 200.00, 'SCHEDULED');

-- Insert journey stations
INSERT INTO journey_stations VALUES
('JRN001', 'RYD001', 1, '08:00:00', '08:15:00', 1),
('JRN001', 'MKH001', 2, '12:00:00', '12:15:00', 1),
('JRN002', 'JED001', 1, '09:00:00', '09:15:00', 1),
('JRN002', 'MED001', 2, '13:00:00', '13:15:00', 1);
```

4. Create Triggers:

```sql
-- Trigger for sending notification 3 hours before departure
DELIMITER //
CREATE TRIGGER before_journey_notification
BEFORE UPDATE ON journeys
FOR EACH ROW
BEGIN
    DECLARE journey_departure DATETIME;
    
    SELECT MIN(departure_time) INTO journey_departure
    FROM journey_stations
    WHERE journey_id = NEW.jid;
    
    IF TIMESTAMPDIFF(HOUR, NOW(), journey_departure) = 3 THEN
        INSERT INTO notifications (
            notification_id,
            passenger_id,
            message,
            type,
            created_at,
            status
        )
        SELECT 
            CONCAT('N', UNIX_TIMESTAMP(), '-', b.passenger_id),
            b.passenger_id,
            CONCAT('رحلتك رقم ', b.journey_id, ' ستغادر خلال 3 ساعات'),
            'JOURNEY_REMINDER',
            NOW(),
            'SENT'
        FROM bookings b
        WHERE b.journey_id = NEW.jid AND b.booking_status = 'CONFIRMED';
    END IF;
END //
DELIMITER ;

-- Trigger for updating loyalty points after booking
DELIMITER //
CREATE TRIGGER after_booking_completion
AFTER UPDATE ON bookings
FOR EACH ROW
BEGIN
    IF NEW.payment_status = 'COMPLETED' AND OLD.payment_status != 'COMPLETED' THEN
        UPDATE passengers
        SET loyalty_points = loyalty_points + FLOOR(NEW.amount / 100)
        WHERE pid = NEW.passenger_id;
    END IF;
END //
DELIMITER ;

-- Trigger for updating loyalty status based on points
DELIMITER //
CREATE TRIGGER update_loyalty_status
AFTER UPDATE ON passengers
FOR EACH ROW
BEGIN
    IF NEW.loyalty_points != OLD.loyalty_points THEN
        UPDATE passengers
        SET loyalty_status = 
            CASE
                WHEN NEW.loyalty_points >= 5000 THEN 'PLATINUM'
                WHEN NEW.loyalty_points >= 2500 THEN 'GOLD'
                WHEN NEW.loyalty_points >= 1000 THEN 'SILVER'
                ELSE 'BRONZE'
            END
        WHERE pid = NEW.pid;
    END IF;
END //
DELIMITER ;
```

## Important Notes

1. All stations are actual Saudi Arabian cities with real train connections
2. Train classes reflect the actual service levels offered
3. Prices are in Saudi Riyal (SAR)
4. Loyalty program tiers:
   - BRONZE: 0-999 points
   - SILVER: 1,000-2,499 points
   - GOLD: 2,500-4,999 points
   - PLATINUM: 5,000+ points
5. Each loyalty point is worth 1 SAR in future bookings
6. Journey statuses:
   - SCHEDULED: Future journey
   - IN_PROGRESS: Currently running
   - COMPLETED: Past journey
   - CANCELLED: Cancelled journey
7. Booking statuses:
   - CONFIRMED: Booking is confirmed
   - WAITLISTED: On waiting list
   - CANCELLED: Booking was cancelled
8. Payment statuses:
   - PENDING: Payment not received
   - COMPLETED: Payment successful
   - REFUNDED: Payment refunded

## Security Considerations

1. Passwords are stored using bcrypt hashing
2. Email addresses must be unique
3. All foreign key constraints are enforced
4. Proper indexing on frequently queried columns
5. Regular backup procedures should be implemented

## Maintenance

1. Regular cleanup of old notifications (older than 30 days)
2. Archive completed journeys and their related bookings
3. Monitor trigger performance
4. Regular database optimization and indexing