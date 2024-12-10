-- Insert sample data into stations
INSERT INTO stations (scode, name_ar, name_en, capacity, city, district, street_name, platform_count, image_url)
VALUES
('ST001', 'محطة الرياض', 'Riyadh Station', 5000, 'Riyadh', 'Olaya', 'King Fahd Road', 5, 'https://example.com/riyadh_station.jpg'),
('ST002', 'محطة جدة', 'Jeddah Station', 4000, 'Jeddah', 'Al Balad', 'King Abdulaziz Street', 4, 'https://example.com/jeddah_station.jpg'),
('ST003', 'محطة الدمام', 'Dammam Station', 3000, 'Dammam', 'Al Khobar', 'Prince Turki Street', 3, 'https://example.com/dammam_station.jpg');

-- Insert sample data into train_classes
INSERT INTO train_classes (class_id, name_ar, name_en, description_ar, description_en, price_multiplier, features, icon)
VALUES
('TC001', 'درجة رجال الأعمال', 'Business Class', 'راحة وأناقة لرجال الأعمال.', 'Comfort and elegance for business travelers.', 1.5, '{"wifi": true, "powerOutlets": true, "mealService": true}', 'briefcase'),
('TC002', 'الدرجة الاقتصادية', 'Economy Class', 'خيار مريح وبأسعار معقولة.', 'A comfortable and affordable option.', 1.0, '{"wifi": false, "powerOutlets": false}', 'wallet');

-- Insert sample data into trains
INSERT INTO trains (tid, serial_number, maintenance_status, class_capacities, last_maintenance_date, next_maintenance_date)
VALUES
('TR001', 'SN123456', 'ACTIVE', '{"TC001": 50, "TC002": 100}', '2024-01-01', '2024-12-31'),
('TR002', 'SN654321', 'MAINTENANCE', '{"TC001": 40, "TC002": 80}', '2023-12-01', '2024-06-01');

-- Insert sample data into employees
INSERT INTO employees (eid, first_name, middle_name, last_name, email, password, salary, contract_type, shift_type, branch_location, role, station_code, hire_date, can_login)
VALUES
('E001', 'أحمد', 'عبدالله', 'الزهراني', 'ahmad.zahrani@example.com', MD5('Password123'), 7000.00, 'FULL_TIME', 'MORNING', 'Riyadh Station', 'MANAGER', 'ST001', '2020-03-01', TRUE),
('E002', 'سالم', 'محمد', 'الغامدي', 'salem.gamdi@example.com', MD5('SecurePass!'), 5000.00, 'PART_TIME', 'EVENING', 'Jeddah Station', 'TECHNICIAN', 'ST002', '2021-05-10', TRUE);

-- Insert sample data into employee_schedules
INSERT INTO employee_schedules (schedule_id, employee_id, date, start_time, end_time, status)
VALUES
('SCH001', 'E001', '2024-12-10', '08:00:00', '16:00:00', 'SCHEDULED'),
('SCH002', 'E002', '2024-12-10', '14:00:00', '22:00:00', 'SCHEDULED');

-- Insert sample data into employee_leave
INSERT INTO employee_leave (leave_id, employee_id, start_date, end_date, leave_type, status, reason)
VALUES
('LV001', 'E002', '2024-12-15', '2024-12-20', 'ANNUAL', 'PENDING', 'Vacation with family.');

-- Insert sample data into journeys
INSERT INTO journeys (jid, train_id, base_price, status)
VALUES
('J001', 'TR001', 150.00, 'SCHEDULED'),
('J002', 'TR002', 100.00, 'SCHEDULED');

-- Insert sample data into journey_stations
INSERT INTO journey_stations (journey_id, station_code, sequence_number, arrival_time, departure_time, platform_number)
VALUES
('J001', 'ST001', 1, '08:00:00', '08:15:00', 1),
('J001', 'ST002', 2, '10:00:00', '10:15:00', 2);