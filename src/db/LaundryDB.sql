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

-- ORDERS DATA (5)
INSERT INTO Orders (user_id, pickup_address, delivery_address, pickup_date, delivery_date, total_weight, total_price, status)
VALUES
(2, 'Nairobi CBD', 'Kilimani', '2026-05-15', NULL, 5, 750, 'PENDING'),
(3, 'Westlands', 'Karen', '2026-05-14', NULL, 3, 500, 'PICKED_UP'),
(4, 'Kasarani', 'CBD', '2026-05-13', NULL, 6, 900, 'WASHING'),
(5, 'Embakasi', 'Rongai', '2026-05-12', NULL, 4, 600, 'DELIVERED'),
(2, 'Thika Road', 'Kilimani', '2026-05-11', NULL, 2, 300, 'PENDING');
GO

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

-- STATUS HISTORY (5)
INSERT INTO OrderStatusHistory (order_id, status)
VALUES
(1, 'PENDING'),
(2, 'PICKED_UP'),
(3, 'WASHING'),
(4, 'DELIVERED'),
(5, 'PENDING');
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