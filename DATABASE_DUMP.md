# Train Reservation System - Sample Data

## Stations Data
```sql
INSERT INTO stations (scode, name_ar, name_en, capacity, city, district, street_name, platform_count, image_url) VALUES
('RYD001', 'محطة الرياض المركزية', 'Riyadh Central Station', 5000, 'الرياض', 'العليا', 'طريق الملك فهد', 8, 'https://images.unsplash.com/photo-1586724237569-f3d0c1dee8c6'),
('JED001', 'محطة جدة الرئيسية', 'Jeddah Main Station', 4000, 'جدة', 'البلد', 'طريق الملك عبدالعزيز', 6, 'https://images.unsplash.com/photo-1578895101408-1a36b834405b'),
('DMM001', 'محطة الدمام', 'Dammam Station', 3500, 'الدمام', 'الشاطئ', 'شارع الأمير محمد', 5, 'https://images.unsplash.com/photo-1578474846511-04ba529f0b88'),
('MKH001', 'محطة مكة المكرمة', 'Makkah Station', 6000, 'مكة المكرمة', 'العزيزية', 'طريق الحرم', 10, 'https://images.unsplash.com/photo-1565552645632-d725f8bfc19a'),
('MED001', 'محطة المدينة المنورة', 'Madinah Station', 4500, 'المدينة المنورة', 'العنابس', 'طريق الملك عبدالله', 7, 'https://images.unsplash.com/photo-1591604129939-f7c5f6145e31'),
('TAF001', 'محطة الطائف', 'Taif Station', 2500, 'الطائف', 'الشرقية', 'طريق الملك فيصل', 4, 'https://images.unsplash.com/photo-1578895101408-1a36b834405b');
```

## Train Classes Data
```sql
INSERT INTO train_classes (class_id, name_ar, name_en, description_ar, description_en, price_multiplier, features, icon) VALUES
('CLS001', 'الدرجة الأولى', 'First Class', 'خدمة فاخرة مع مقاعد جلدية ووجبات مجانية', 'Luxury service with leather seats and complimentary meals', 2.0, '{"wifi": true, "meals": true, "entertainment": true, "powerOutlets": true, "extraLegroom": true}', 'crown'),
('CLS002', 'درجة رجال الأعمال', 'Business Class', 'مقاعد مريحة مع خدمة متميزة', 'Comfortable seats with premium service', 1.5, '{"wifi": true, "meals": true, "powerOutlets": true, "extraLegroom": true}', 'briefcase'),
('CLS003', 'الدرجة السياحية', 'Economy Class', 'رحلة مريحة بسعر معقول', 'Comfortable journey at reasonable price', 1.0, '{"wifi": true, "powerOutlets": true}', 'users');
```

## Trains Data
```sql
INSERT INTO trains (tid, serial_number, maintenance_status, class_capacities) VALUES
('TRN001', 'SAR-2024-001', 'ACTIVE', '{"CLS001": 50, "CLS002": 100, "CLS003": 200}'),
('TRN002', 'SAR-2024-002', 'ACTIVE', '{"CLS001": 50, "CLS002": 100, "CLS003": 200}'),
('TRN003', 'SAR-2024-003', 'MAINTENANCE', '{"CLS001": 50, "CLS002": 100, "CLS003": 200}'),
('TRN004', 'SAR-2024-004', 'ACTIVE', '{"CLS001": 50, "CLS002": 100, "CLS003": 200}'),
('TRN005', 'SAR-2024-005', 'ACTIVE', '{"CLS001": 50, "CLS002": 100, "CLS003": 200}');
```

## Employees Data
```sql
INSERT INTO employees (eid, first_name, middle_name, last_name, email, password, salary, contract_type, shift_type, branch_location, role, station_code, hire_date, can_login, certification_details) VALUES
('EMP001', 'محمد', 'أحمد', 'العمري', 'mohammed@trainco.sa', '$2a$10$xxxxxxxxxxx', 8000.00, 'FULL_TIME', 'MORNING', 'الرياض', 'MANAGER', 'RYD001', '2023-01-15', true, '{"certifications": ["Project Management", "Railway Operations"]}'),
('EMP002', 'فاطمة', 'علي', 'الشمري', 'fatima@trainco.sa', '$2a$10$xxxxxxxxxxx', 6000.00, 'FULL_TIME', 'EVENING', 'جدة', 'RECEPTIONIST', 'JED001', '2023-02-20', true, NULL),
('EMP003', 'عبدالله', NULL, 'السعيد', NULL, NULL, 7000.00, 'FULL_TIME', 'NIGHT', 'الدمام', 'DRIVER', 'DMM001', '2023-03-10', false, '{"licenses": ["Heavy Vehicle", "Train Operation"]}'),
('EMP004', 'نورة', 'محمد', 'القحطاني', NULL, NULL, 5500.00, 'PART_TIME', 'MORNING', 'مكة المكرمة', 'CLEANER', 'MKH001', '2023-04-05', false, NULL),
('EMP005', 'أحمد', 'عبدالله', 'الغامدي', 'ahmad@trainco.sa', '$2a$10$xxxxxxxxxxx', 7500.00, 'FULL_TIME', 'MORNING', 'المدينة المنورة', 'STAFF', 'MED001', '2023-05-15', true, '{"certifications": ["Customer Service"]}');
```

## Employee Schedules Data
```sql
INSERT INTO employee_schedules (schedule_id, employee_id, date, start_time, end_time, status) VALUES
('SCH001', 'EMP001', '2024-03-15', '08:00:00', '16:00:00', 'SCHEDULED'),
('SCH002', 'EMP002', '2024-03-15', '16:00:00', '00:00:00', 'SCHEDULED'),
('SCH003', 'EMP003', '2024-03-15', '00:00:00', '08:00:00', 'SCHEDULED'),
('SCH004', 'EMP004', '2024-03-15', '08:00:00', '12:00:00', 'SCHEDULED'),
('SCH005', 'EMP005', '2024-03-15', '09:00:00', '17:00:00', 'SCHEDULED');
```

## Employee Leave Data
```sql
INSERT INTO employee_leave (leave_id, employee_id, start_date, end_date, leave_type, status, reason) VALUES
('LV001', 'EMP001', '2024-04-01', '2024-04-07', 'ANNUAL', 'APPROVED', 'Annual vacation'),
('LV002', 'EMP002', '2024-03-20', '2024-03-22', 'SICK', 'PENDING', 'Medical appointment'),
('LV003', 'EMP003', '2024-05-01', '2024-05-03', 'EMERGENCY', 'APPROVED', 'Family emergency'),
('LV004', 'EMP004', '2024-04-15', '2024-04-16', 'SICK', 'APPROVED', 'Dental procedure'),
('LV005', 'EMP005', '2024-06-01', '2024-06-14', 'ANNUAL', 'PENDING', 'Summer vacation');
```

## Passengers Data
```sql
INSERT INTO passengers (pid, name, email, password, phone, id_number, loyalty_status, loyalty_points) VALUES
('P001', 'عبدالرحمن محمد الشهري', 'abdulrahman@email.com', '$2a$10$xxxxxxxxxxx', '+966501234567', '1234567890', 'GOLD', 2800),
('P002', 'سارة أحمد العتيبي', 'sarah@email.com', '$2a$10$xxxxxxxxxxx', '+966512345678', '2345678901', 'SILVER', 1500),
('P003', 'خالد عبدالله الدوسري', 'khalid@email.com', '$2a$10$xxxxxxxxxxx', '+966523456789', '3456789012', 'PLATINUM', 5200),
('P004', 'نوف سعد القحطاني', 'nouf@email.com', '$2a$10$xxxxxxxxxxx', '+966534567890', '4567890123', 'BRONZE', 500),
('P005', 'فهد علي الغامدي', 'fahad@email.com', '$2a$10$xxxxxxxxxxx', '+966545678901', '5678901234', 'GOLD', 3100);
```

## Journeys Data
```sql
INSERT INTO journeys (jid, train_id, base_price, status) VALUES
('J001', 'TRN001', 250.00, 'SCHEDULED'),
('J002', 'TRN002', 300.00, 'IN_PROGRESS'),
('J003', 'TRN004', 200.00, 'SCHEDULED'),
('J004', 'TRN005', 350.00, 'SCHEDULED'),
('J005', 'TRN001', 275.00, 'SCHEDULED');
```

## Journey Stations Data
```sql
INSERT INTO journey_stations (journey_id, station_code, sequence_number, arrival_time, departure_time, platform_number) VALUES
('J001', 'RYD001', 1, '08:00:00', '08:15:00', 1),
('J001', 'DMM001', 2, '11:45:00', '12:00:00', 3),
('J002', 'JED001', 1, '09:00:00', '09:15:00', 2),
('J002', 'MKH001', 2, '10:45:00', '11:00:00', 1),
('J003', 'DMM001', 1, '14:00:00', '14:15:00', 2),
('J003', 'RYD001', 2, '17:45:00', '18:00:00', 4);
```

## Bookings Data
```sql
INSERT INTO bookings (booking_id, passenger_id, journey_id, train_id, class_id, coach_number, seat_number, booking_status, booking_date, payment_status, payment_method, amount) VALUES
('B001', 'P001', 'J001', 'TRN001', 'CLS001', 'A', '12', 'CONFIRMED', '2024-03-01 10:30:00', 'COMPLETED', 'CREDIT_CARD', 500.00),
('B002', 'P002', 'J001', 'TRN001', 'CLS002', 'B', '15', 'CONFIRMED', '2024-03-01 11:45:00', 'COMPLETED', 'CREDIT_CARD', 375.00),
('B003', 'P003', 'J002', 'TRN002', 'CLS001', 'A', '08', 'CONFIRMED', '2024-03-02 09:15:00', 'COMPLETED', 'CREDIT_CARD', 600.00),
('B004', 'P004', 'J003', 'TRN004', 'CLS003', 'C', '22', 'CONFIRMED', '2024-03-02 14:20:00', 'COMPLETED', 'DEBIT_CARD', 200.00),
('B005', 'P005', 'J002', 'TRN002', 'CLS002', 'B', '19', 'CANCELLED', '2024-03-03 16:30:00', 'REFUNDED', 'CREDIT_CARD', 450.00);
```

## Notifications Data
```sql
INSERT INTO notifications (notification_id, passenger_id, message, type, created_at, status) VALUES
('N001', 'P001', 'تم تأكيد حجزك للرحلة رقم J001', 'BOOKING_CONFIRMATION', '2024-03-01 10:31:00', 'READ'),
('N002', 'P002', 'تذكير: رحلتك غداً في تمام الساعة 8:00 صباحاً', 'JOURNEY_REMINDER', '2024-03-01 12:00:00', 'DELIVERED'),
('N003', 'P003', 'تم تأكيد حجزك للرحلة رقم J002', 'BOOKING_CONFIRMATION', '2024-03-02 09:16:00', 'READ'),
('N004', 'P004', 'تم تأكيد حجزك للرحلة رقم J003', 'BOOKING_CONFIRMATION', '2024-03-02 14:21:00', 'SENT'),
('N005', 'P005', 'تم إلغاء حجزك وسيتم رد المبلغ خلال 3-5 أيام عمل', 'SYSTEM', '2024-03-03 16:31:00', 'DELIVERED');
```