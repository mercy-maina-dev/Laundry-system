-- =========================
-- 1. CREATE DATABASE
-- =========================
CREATE DATABASE LaundryDB;
GO

USE LaundryDB;
GO

-- =========================
-- 2. USERS TABLE
-- =========================
CREATE TABLE Users (
    user_id INT IDENTITY(1,1) PRIMARY KEY,
    full_name VARCHAR(100),
    email VARCHAR(100) UNIQUE,
    phone VARCHAR(20) UNIQUE,
    password VARCHAR(255),
    role VARCHAR(20),
    created_at DATETIME DEFAULT GETDATE()
);
GO

-- USERS DATA (5)
INSERT INTO Users (full_name, email, phone, password, role)
VALUES
('Admin User', 'admin@gmail.com', '0700000001', '1234', 'ADMIN'),
('John Doe', 'john@gmail.com', '0700000002', '1234', 'CUSTOMER'),
('Jane Driver', 'jane@gmail.com', '0700000003', '1234', 'DRIVER'),
('Mary Wanjiku', 'mary@gmail.com', '0700000004', '1234', 'CUSTOMER'),
('Peter Kimani', 'peter@gmail.com', '0700000005', '1234', 'CUSTOMER');
GO

-- =========================
-- 3. SERVICES TABLE
-- =========================
CREATE TABLE Services (
    service_id INT IDENTITY(1,1) PRIMARY KEY,
    service_name VARCHAR(100),
    price_per_kg DECIMAL(10,2),
    description VARCHAR(255),
    created_at DATETIME DEFAULT GETDATE()
);
GO

-- SERVICES DATA (5)
INSERT INTO Services (service_name, price_per_kg, description)
VALUES
('Wash & Fold', 150, 'Normal washing'),
('Dry Cleaning', 300, 'Premium cleaning'),
('Ironing', 100, 'Clothes ironing'),
('Express Wash', 200, 'Fast service'),
('Blanket Cleaning', 400, 'Heavy items cleaning');
GO

-- =========================
-- 4. ORDERS TABLE
-- =========================
CREATE TABLE Orders (
    order_id INT IDENTITY(1,1) PRIMARY KEY,
    user_id INT,
    pickup_address VARCHAR(255),
    delivery_address VARCHAR(255),
    pickup_date DATETIME,
    delivery_date DATETIME,
    total_weight DECIMAL(10,2),
    total_price DECIMAL(10,2),
    status VARCHAR(30),
    created_at DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (user_id) REFERENCES Users(user_id)
);
GO
-- Orders table with GPS coordinates
ALTER TABLE Orders ADD
    pickup_latitude DECIMAL(10, 8) NULL,
    pickup_longitude DECIMAL(11, 8) NULL,
    delivery_latitude DECIMAL(10, 8) NULL,
    delivery_longitude DECIMAL(11, 8) NULL,
    pickup_distance_km DECIMAL(10, 2) NULL,
    delivery_distance_km DECIMAL(10, 2) NULL,
    estimated_pickup_time DATETIME NULL,
    estimated_delivery_time DATETIME NULL,
    actual_pickup_time DATETIME NULL,
    actual_delivery_time DATETIME NULL;

UPDATE Orders SET 
    pickup_latitude = -1.2921,
    pickup_longitude = 36.8219,
    delivery_latitude = -1.2864,
    delivery_longitude = 36.8172
WHERE pickup_latitude IS NULL;
GO
ALTER TABLE Orders ALTER COLUMN pickup_latitude DECIMAL(10, 8) NOT NULL;
ALTER TABLE Orders ALTER COLUMN pickup_longitude DECIMAL(11, 8) NOT NULL;
ALTER TABLE Orders ALTER COLUMN delivery_latitude DECIMAL(10, 8) NOT NULL;
ALTER TABLE Orders ALTER COLUMN delivery_longitude DECIMAL(11, 8) NOT NULL;
GO

-- Driver real-time tracking (with socket support)
CREATE TABLE DriverLiveTracking (
    tracking_id INT IDENTITY(1,1) PRIMARY KEY,
    driver_id INT NOT NULL,
    order_id INT NULL,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    speed DECIMAL(5, 2) NULL, -- km/h
    heading INT NULL, -- direction in degrees
    accuracy DECIMAL(5, 2) NULL, -- GPS accuracy in meters
    battery_level INT NULL,
    is_moving BIT DEFAULT 0,
    last_update DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (driver_id) REFERENCES Users(user_id),
    FOREIGN KEY (order_id) REFERENCES Orders(order_id)
);

-- Geofence zones for pickup/delivery locations
CREATE TABLE GeofenceZones (
    zone_id INT IDENTITY(1,1) PRIMARY KEY,
    order_id INT NOT NULL,
    type VARCHAR(20) NOT NULL, -- 'PICKUP', 'DELIVERY'
    center_latitude DECIMAL(10, 8) NOT NULL,
    center_longitude DECIMAL(11, 8) NOT NULL,
    radius_meters INT DEFAULT 100, -- 100 meter radius
    created_at DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (order_id) REFERENCES Orders(order_id)
);

-- Driver route history (for analytics)
CREATE TABLE DriverRoutes (
    route_id INT IDENTITY(1,1) PRIMARY KEY,
    driver_id INT NOT NULL,
    order_id INT NOT NULL,
    route_type VARCHAR(20) NOT NULL, -- 'TO_PICKUP', 'TO_DELIVERY'
    start_latitude DECIMAL(10, 8) NOT NULL,
    start_longitude DECIMAL(11, 8) NOT NULL,
    end_latitude DECIMAL(10, 8) NOT NULL,
    end_longitude DECIMAL(11, 8) NOT NULL,
    total_distance_km DECIMAL(10, 2) NULL,
    total_duration_minutes INT NULL,
    route_data NVARCHAR(MAX) NULL, -- JSON of all route points
    started_at DATETIME DEFAULT GETDATE(),
    completed_at DATETIME NULL,
    FOREIGN KEY (driver_id) REFERENCES Users(user_id),
    FOREIGN KEY (order_id) REFERENCES Orders(order_id)
);



-- ORDERS DATA (5)
INSERT INTO Orders (user_id, pickup_address, delivery_address, pickup_date, delivery_date, total_weight, total_price, status)
VALUES
(2, 'Nairobi CBD', 'Kilimani', '2026-05-15', NULL, 5, 750, 'PENDING'),
(3, 'Westlands', 'Karen', '2026-05-14', NULL, 3, 500, 'PICKED_UP'),
(4, 'Kasarani', 'CBD', '2026-05-13', NULL, 6, 900, 'WASHING'),
(5, 'Embakasi', 'Rongai', '2026-05-12', NULL, 4, 600, 'DELIVERED'),
(2, 'Thika Road', 'Kilimani', '2026-05-11', NULL, 2, 300, 'PENDING');
GO
ALTER TABLE Orders ADD updated_at DATETIME DEFAULT GETDATE();

-- =========================
-- 5. ORDER ITEMS TABLE
-- =========================
CREATE TABLE OrderItems (
    item_id INT IDENTITY(1,1) PRIMARY KEY,
    order_id INT,
    service_id INT,
    quantity INT,
    price DECIMAL(10,2),
    FOREIGN KEY (order_id) REFERENCES Orders(order_id),
    FOREIGN KEY (service_id) REFERENCES Services(service_id)
);
GO

-- ORDER ITEMS (5)
INSERT INTO OrderItems (order_id, service_id, quantity, price)
VALUES
(1, 1, 2, 300),
(2, 2, 1, 300),
(3, 3, 3, 300),
(4, 4, 2, 400),
(5, 5, 1, 400);
GO

-- =========================
-- 6. DELIVERIES TABLE
-- =========================
CREATE TABLE Deliveries (
    delivery_id INT IDENTITY(1,1) PRIMARY KEY,
    order_id INT,
    driver_id INT,
    pickup_time DATETIME,
    delivery_time DATETIME,
    delivery_status VARCHAR(30),
    FOREIGN KEY (order_id) REFERENCES Orders(order_id),
    FOREIGN KEY (driver_id) REFERENCES Users(user_id)
);
GO

-- DELIVERIES (5)
INSERT INTO Deliveries (order_id, driver_id, pickup_time, delivery_status)
VALUES
(1, 3, NULL, 'ASSIGNED'),
(2, 3, '2026-05-14', 'PICKED'),
(3, 3, NULL, 'ASSIGNED'),
(4, 3, '2026-05-12', 'DELIVERED'),
(5, 3, NULL, 'ASSIGNED');
GO

-- =========================
-- 7. PAYMENTS TABLE
-- =========================
CREATE TABLE Payments (
    payment_id INT IDENTITY(1,1) PRIMARY KEY,
    order_id INT,
    amount DECIMAL(10,2),
    payment_method VARCHAR(50),
    payment_status VARCHAR(30),
    transaction_ref VARCHAR(100),
    paid_at DATETIME,
    FOREIGN KEY (order_id) REFERENCES Orders(order_id)
);
GO

-- PAYMENTS (5)
INSERT INTO Payments (order_id, amount, payment_method, payment_status, transaction_ref, paid_at)
VALUES
(1, 750, 'MPESA', 'PENDING', 'TXN001', NULL),
(2, 500, 'MPESA', 'PAID', 'TXN002', GETDATE()),
(3, 900, 'CASH', 'PAID', 'TXN003', GETDATE()),
(4, 600, 'MPESA', 'PAID', 'TXN004', GETDATE()),
(5, 300, 'MPESA', 'PENDING', 'TXN005', NULL);
GO


-- Add new columns to Payments table if they don't exist
ALTER TABLE Payments ADD 
  checkout_request_id NVARCHAR(100) NULL,
  merchant_request_id NVARCHAR(100) NULL,
  phone_number NVARCHAR(15) NULL,
  result_code INT NULL,
  result_desc NVARCHAR(255) NULL,
  created_at DATETIME DEFAULT GETDATE(),
  updated_at DATETIME NULL;

-- Add indexes for better performance
CREATE INDEX IX_Payments_checkout_request_id ON Payments(checkout_request_id);
CREATE INDEX IX_Payments_order_id ON Payments(order_id);
CREATE INDEX IX_Payments_transaction_ref ON Payments(transaction_ref);
CREATE INDEX IX_Payments_payment_status ON Payments(payment_status);

-- =========================
-- 8. ORDER STATUS HISTORY
-- =========================
CREATE TABLE OrderStatusHistory (
    history_id INT IDENTITY(1,1) PRIMARY KEY,
    order_id INT,
    status VARCHAR(30),
    changed_at DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (order_id) REFERENCES Orders(order_id)
);
GO

ALTER TABLE OrderStatusHistory ADD
    notes TEXT NULL,
    changed_by INT NULL,
    previous_status VARCHAR(30) NULL,
    created_at DATETIME DEFAULT GETDATE(),
    updated_at DATETIME NULL;

ALTER TABLE OrderStatusHistory
ADD CONSTRAINT FK_OrderStatusHistory_Users 
FOREIGN KEY (changed_by) REFERENCES Users(user_id);

CREATE INDEX IX_OrderStatusHistory_order_id ON OrderStatusHistory(order_id);
CREATE INDEX IX_OrderStatusHistory_status ON OrderStatusHistory(status);
CREATE INDEX IX_OrderStatusHistory_changed_at ON OrderStatusHistory(changed_at);
CREATE INDEX IX_OrderStatusHistory_changed_by ON OrderStatusHistory(changed_by);

-- STATUS HISTORY (5)
INSERT INTO OrderStatusHistory (order_id, status)
VALUES
(1, 'PENDING'),
(2, 'PICKED_UP'),
(3, 'WASHING'),
(4, 'DELIVERED'),
(5, 'PENDING');
GO

UPDATE OrderStatusHistory 
SET updated_at = GETDATE() 
WHERE updated_at IS NULL;
GO

INSERT INTO OrderStatusHistory (order_id, status, previous_status, notes, changed_by, changed_at, created_at)
VALUES
(1, 'PENDING', NULL, 'Order created by customer', NULL, GETDATE(), GETDATE()),
(2, 'PICKED_UP', 'PENDING', 'Laundry picked up by driver John', 1, GETDATE(), GETDATE()),
(3, 'WASHING', 'PICKED_UP', 'Washing process started', 1, GETDATE(), GETDATE()),
(4, 'DELIVERED', 'READY', 'Order delivered to customer', 2, GETDATE(), GETDATE()),
(5, 'PENDING', NULL, 'Order placed and waiting for payment', NULL, GETDATE(), GETDATE());
GO
-- =========================
-- FINAL CHECK
-- =========================
SELECT * FROM Users;
SELECT * FROM Services;
SELECT * FROM Orders;
SELECT * FROM OrderItems;
SELECT * FROM Deliveries;
SELECT * FROM Payments;
SELECT * FROM OrderStatusHistory;
GO
-- Add verification columns to existing Users table
ALTER TABLE Users
ADD verification_code VARCHAR(10),
    is_verified BIT DEFAULT 0;

    CREATE TABLE MpesaTransactions (
  id INT PRIMARY KEY IDENTITY(1,1),
  checkout_request_id NVARCHAR(100) UNIQUE NOT NULL,
  merchant_request_id NVARCHAR(100) NOT NULL,
  order_id INT NOT NULL,
  phone_number NVARCHAR(15) NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  status NVARCHAR(20) DEFAULT 'PENDING',
  result_code INT NULL,
  result_desc NVARCHAR(255) NULL,
  created_at DATETIME DEFAULT GETDATE(),
  updated_at DATETIME NULL,
  FOREIGN KEY (order_id) REFERENCES Orders(order_id)
);

CREATE INDEX IX_MpesaTransactions_checkout_request_id ON MpesaTransactions(checkout_request_id);
CREATE INDEX IX_MpesaTransactions_order_id ON MpesaTransactions(order_id);

CREATE TABLE TransactionCache (
  id INT PRIMARY KEY IDENTITY(1,1),
  checkout_request_id NVARCHAR(100) UNIQUE NOT NULL,
  order_id INT NOT NULL,
  created_at DATETIME DEFAULT GETDATE()
);


CREATE FUNCTION dbo.CalculateDistance(
    @lat1 DECIMAL(10, 8),
    @lng1 DECIMAL(11, 8),
    @lat2 DECIMAL(10, 8),
    @lng2 DECIMAL(11, 8)
)
RETURNS DECIMAL(10, 2)
AS
BEGIN
    DECLARE @r DECIMAL(10, 6) = 6371
    DECLARE @lat1_r DECIMAL(10, 8) = RADIANS(@lat1)
    DECLARE @lat2_r DECIMAL(10, 8) = RADIANS(@lat2)
    DECLARE @dlat_r DECIMAL(10, 8) = RADIANS(@lat2 - @lat1)
    DECLARE @dlng_r DECIMAL(10, 8) = RADIANS(@lng2 - @lng1)
    
    DECLARE @a DECIMAL(10, 8) = POWER(SIN(@dlat_r / 2), 2) +
                                 COS(@lat1_r) * COS(@lat2_r) *
                                 POWER(SIN(@dlng_r / 2), 2)
    DECLARE @c DECIMAL(10, 8) = 2 * ATN2(SQRT(@a), SQRT(1 - @a))
    
    RETURN @r * @c
END
GO


CREATE OR ALTER TRIGGER trg_UpdateOrderDistance
ON Orders
AFTER INSERT, UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    
    UPDATE o
    SET pickup_distance_km = dbo.CalculateDistance(
        i.pickup_latitude, i.pickup_longitude,
        (SELECT store_latitude FROM StoreSettings),
        (SELECT store_longitude FROM StoreSettings)
    )
    FROM Orders o
    INNER JOIN inserted i ON o.order_id = i.order_id
    WHERE i.pickup_latitude IS NOT NULL;
END
GO


CREATE TABLE StoreSettings (
    setting_id INT PRIMARY KEY DEFAULT 1,
    store_name NVARCHAR(200) NOT NULL,
    store_latitude DECIMAL(10, 8) NOT NULL,
    store_longitude DECIMAL(11, 8) NOT NULL,
    store_address NVARCHAR(500) NOT NULL,
    contact_phone NVARCHAR(20) NOT NULL,
    operating_hours NVARCHAR(200) NULL,
    created_at DATETIME DEFAULT GETDATE(),
    updated_at DATETIME NULL,
    CONSTRAINT CHK_single_row CHECK (setting_id = 1)
);
GO

-- Insert default store location (update with your actual location)
UPDATE StoreSettings 
SET 
    store_name = 'Smart Laundry',
    store_latitude = -1.2921,
    store_longitude = 36.8219,
    store_address = 'Nairobi CBD, Kenya',
    contact_phone = '+254700000000',
    updated_at = GETDATE()
WHERE setting_id = 1;

IF @@ROWCOUNT = 0
BEGIN
    INSERT INTO StoreSettings (setting_id, store_name, store_latitude, store_longitude, store_address, contact_phone)
    VALUES (1, 'Smart Laundry', -1.2921, 36.8219, 'Nairobi CBD, Kenya', '+254700000000');
END
GO

IF NOT EXISTS (SELECT 1 FROM StoreSettings)
BEGIN
    INSERT INTO StoreSettings (store_name, store_latitude, store_longitude, store_address, contact_phone)
    VALUES ('Smart Laundry', -1.2921, 36.8219, 'Nairobi CBD, Kenya', '+254700000000');
END
GO


CREATE TABLE CustomerFeedback (
    feedback_id INT IDENTITY(1,1) PRIMARY KEY,
    order_id INT NOT NULL,
    customer_id INT NOT NULL,
    driver_id INT NOT NULL,
    rating INT NOT NULL,
    comment NVARCHAR(1000) NULL,
    delivery_rating INT NULL,
    punctuality_rating INT NULL,
    professionalism_rating INT NULL,
    feedback_type VARCHAR(50) DEFAULT 'DELIVERY',
    created_at DATETIME DEFAULT GETDATE(),
    updated_at DATETIME NULL,
    
    CONSTRAINT CHK_rating CHECK (rating >= 1 AND rating <= 5),
    CONSTRAINT CHK_delivery_rating CHECK (delivery_rating >= 1 AND delivery_rating <= 5),
    CONSTRAINT CHK_punctuality_rating CHECK (punctuality_rating >= 1 AND punctuality_rating <= 5),
    CONSTRAINT CHK_professionalism_rating CHECK (professionalism_rating >= 1 AND professionalism_rating <= 5),
    CONSTRAINT CHK_feedback_type CHECK (feedback_type IN ('PICKUP', 'DELIVERY', 'BOTH')),
    
    FOREIGN KEY (order_id) REFERENCES Orders(order_id),
    FOREIGN KEY (customer_id) REFERENCES Users(user_id),
    FOREIGN KEY (driver_id) REFERENCES Users(user_id)
);
GO

CREATE INDEX IX_CustomerFeedback_order_id ON CustomerFeedback(order_id);
CREATE INDEX IX_CustomerFeedback_driver_id ON CustomerFeedback(driver_id);
CREATE INDEX IX_CustomerFeedback_customer_id ON CustomerFeedback(customer_id);
CREATE INDEX IX_CustomerFeedback_rating ON CustomerFeedback(rating);
CREATE INDEX IX_CustomerFeedback_created_at ON CustomerFeedback(created_at);
GO

SELECT * FROM CustomerFeedback;
GO

SELECT * FROM StoreSettings;
GO

SELECT * FROM DriverLiveTracking;
GO

SELECT * FROM DriverRoutes;
GO
 SELECT * FROM GeofenceZones;
GO

SELECT *FROM Orders;
GO
-- Create PickupDelivery Table
CREATE TABLE PickupDelivery (
    record_id INT IDENTITY(1,1) PRIMARY KEY,
    order_id INT NOT NULL,
    driver_id INT NOT NULL,
    type VARCHAR(20) NOT NULL,
    status VARCHAR(50) NOT NULL,
    latitude DECIMAL(10, 8) NULL,
    longitude DECIMAL(11, 8) NULL,
    location_address NVARCHAR(500) NOT NULL,
    customer_photo_url NVARCHAR(500) NULL,
    cloths_photo_url NVARCHAR(500) NULL,
    signature_url NVARCHAR(500) NULL,
    notes NVARCHAR(500) NULL,
    assigned_at DATETIME DEFAULT GETDATE(),
    started_at DATETIME NULL,
    completed_at DATETIME NULL,
    customer_confirmed BIT DEFAULT 0,
    confirmed_at DATETIME NULL,
    created_at DATETIME DEFAULT GETDATE(),
    updated_at DATETIME NULL,
    FOREIGN KEY (order_id) REFERENCES Orders(order_id),
    FOREIGN KEY (driver_id) REFERENCES Users(user_id)
);
GO

CREATE INDEX IX_PickupDelivery_order_id ON PickupDelivery(order_id);
CREATE INDEX IX_PickupDelivery_driver_id ON PickupDelivery(driver_id);
CREATE INDEX IX_PickupDelivery_status ON PickupDelivery(status);
GO

-- Create DriverLiveTracking Table
CREATE TABLE DriverLiveTracking (
    tracking_id INT IDENTITY(1,1) PRIMARY KEY,
    driver_id INT NOT NULL,
    order_id INT NULL,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    speed DECIMAL(5, 2) NULL,
    heading INT NULL,
    accuracy DECIMAL(5, 2) NULL,
    battery_level INT NULL,
    is_moving BIT DEFAULT 0,
    last_update DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (driver_id) REFERENCES Users(user_id),
    FOREIGN KEY (order_id) REFERENCES Orders(order_id)
);
GO

CREATE INDEX IX_DriverLiveTracking_driver_id ON DriverLiveTracking(driver_id);
CREATE INDEX IX_DriverLiveTracking_last_update ON DriverLiveTracking(last_update);
GO

-- Create DriverRoutes Table
CREATE TABLE DriverRoutes (
    route_id INT IDENTITY(1,1) PRIMARY KEY,
    driver_id INT NOT NULL,
    order_id INT NOT NULL,
    route_type VARCHAR(20) NOT NULL,
    start_latitude DECIMAL(10, 8) NOT NULL,
    start_longitude DECIMAL(11, 8) NOT NULL,
    end_latitude DECIMAL(10, 8) NOT NULL,
    end_longitude DECIMAL(11, 8) NOT NULL,
    total_distance_km DECIMAL(10, 2) NULL,
    total_duration_minutes INT NULL,
    route_data NVARCHAR(MAX) NULL,
    started_at DATETIME DEFAULT GETDATE(),
    completed_at DATETIME NULL,
    FOREIGN KEY (driver_id) REFERENCES Users(user_id),
    FOREIGN KEY (order_id) REFERENCES Orders(order_id)
);
GO

CREATE INDEX IX_DriverRoutes_order_id ON DriverRoutes(order_id);
CREATE INDEX IX_DriverRoutes_driver_id ON DriverRoutes(driver_id);
GO

-- Create GeofenceZones Table
CREATE TABLE GeofenceZones (
    zone_id INT IDENTITY(1,1) PRIMARY KEY,
    order_id INT NOT NULL,
    type VARCHAR(20) NOT NULL,
    center_latitude DECIMAL(10, 8) NOT NULL,
    center_longitude DECIMAL(11, 8) NOT NULL,
    radius_meters INT DEFAULT 100,
    created_at DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (order_id) REFERENCES Orders(order_id)
);
GO

CREATE INDEX IX_GeofenceZones_order_id ON GeofenceZones(order_id);
GO

-- Create StoreSettings Table
CREATE TABLE StoreSettings (
    setting_id INT PRIMARY KEY DEFAULT 1,
    store_name NVARCHAR(200) NOT NULL,
    store_latitude DECIMAL(10, 8) NOT NULL,
    store_longitude DECIMAL(11, 8) NOT NULL,
    store_address NVARCHAR(500) NOT NULL,
    contact_phone NVARCHAR(20) NOT NULL,
    operating_hours NVARCHAR(200) NULL,
    created_at DATETIME DEFAULT GETDATE(),
    updated_at DATETIME NULL,
    CONSTRAINT CHK_single_row CHECK (setting_id = 1)
);
GO

-- Insert default store settings
INSERT INTO StoreSettings (store_name, store_latitude, store_longitude, store_address, contact_phone)
SELECT 'Smart Laundry', -1.2921, 36.8219, 'Nairobi CBD, Kenya', '+254700000000'
WHERE NOT EXISTS (SELECT 1 FROM StoreSettings);
GO

















-- Insert test orders
INSERT INTO Orders (user_id, pickup_address, delivery_address, pickup_latitude, pickup_longitude, delivery_latitude, delivery_longitude, total_weight, total_price, status) VALUES
(1, '123 Main St, Nairobi', '456 Park Ave, Nairobi', -1.2921, 36.8219, -1.2864, 36.8172, 5, 750, 'PENDING'),
(2, '789 Kenyatta Ave, Nairobi', '321 Moi Ave, Nairobi', -1.2833, 36.8233, -1.2763, 36.8153, 3, 450, 'PENDING');


CREATE TABLE PickupDelivery (
    record_id INT IDENTITY(1,1) PRIMARY KEY,
    order_id INT NOT NULL,
    driver_id INT NOT NULL,
    type VARCHAR(20) NOT NULL,
    status VARCHAR(50) NOT NULL,
    latitude DECIMAL(10, 8) NULL,
    longitude DECIMAL(11, 8) NULL,
    location_address NVARCHAR(500) NOT NULL,
    customer_photo_url NVARCHAR(500) NULL,
    cloths_photo_url NVARCHAR(500) NULL,
    signature_url NVARCHAR(500) NULL,
    notes NVARCHAR(500) NULL,
    assigned_at DATETIME DEFAULT GETDATE(),
    started_at DATETIME NULL,
    completed_at DATETIME NULL,
    customer_confirmed BIT DEFAULT 0,
    confirmed_at DATETIME NULL,
    created_at DATETIME DEFAULT GETDATE(),
    updated_at DATETIME NULL,
    FOREIGN KEY (order_id) REFERENCES Orders(order_id),
    FOREIGN KEY (driver_id) REFERENCES Users(user_id)
);
GO

CREATE INDEX IX_PickupDelivery_order_id ON PickupDelivery(order_id);
CREATE INDEX IX_PickupDelivery_driver_id ON PickupDelivery(driver_id);
CREATE INDEX IX_PickupDelivery_status ON PickupDelivery(status);
GO
select * from PickupDelivery;
GO
SELECT * FROM Users;


SELECT payment_id, result_code, created_at, updated_at 
FROM Payments 
WHERE payment_id = (SELECT MAX(payment_id) FROM Payments);


DISABLE TRIGGER ALL ON Payments;