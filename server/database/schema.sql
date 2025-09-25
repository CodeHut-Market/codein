-- CodeHut Database Schema for Razorpay Integration

-- Create database
CREATE DATABASE IF NOT EXISTS codehut_db;
USE codehut_db;

-- Orders table to store Razorpay order information
CREATE TABLE IF NOT EXISTS orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    amount DECIMAL(10, 2) NOT NULL COMMENT 'Order amount in the smallest currency unit',
    currency VARCHAR(3) NOT NULL DEFAULT 'INR' COMMENT 'Currency code (INR, USD, etc.)',
    status VARCHAR(20) NOT NULL DEFAULT 'created' COMMENT 'Order status: created, paid, failed',
    razorpay_order_id VARCHAR(50) UNIQUE NOT NULL COMMENT 'Razorpay order ID',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Purchases table to store payment verification details
CREATE TABLE IF NOT EXISTS purchases (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL COMMENT 'Reference to orders table',
    razorpay_payment_id VARCHAR(50) COMMENT 'Razorpay payment ID after successful payment',
    razorpay_signature VARCHAR(255) COMMENT 'Payment signature for verification',
    user_id VARCHAR(50) NOT NULL COMMENT 'User who made the purchase',
    status VARCHAR(20) NOT NULL DEFAULT 'pending' COMMENT 'Payment status: pending, success, failed',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);

-- Indexes for better performance
CREATE INDEX idx_orders_razorpay_id ON orders(razorpay_order_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_purchases_order_id ON purchases(order_id);
CREATE INDEX idx_purchases_user_id ON purchases(user_id);
CREATE INDEX idx_purchases_status ON purchases(status);
CREATE INDEX idx_purchases_payment_id ON purchases(razorpay_payment_id);

-- Insert sample data for testing
INSERT INTO orders (amount, currency, status, razorpay_order_id) VALUES
(50000, 'INR', 'created', 'order_sample123'),
(100000, 'INR', 'paid', 'order_sample456');

INSERT INTO purchases (order_id, razorpay_payment_id, razorpay_signature, user_id, status) VALUES
(2, 'pay_sample123', 'signature_sample123', 'user-1', 'success');
