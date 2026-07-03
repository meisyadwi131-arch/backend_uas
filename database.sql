-- Database Dump for UAS Web Programming 2 - Sneaker Store

CREATE DATABASE IF NOT EXISTS `db_uas_sneakers`;
USE `db_uas_sneakers`;

-- Table structure for categories
CREATE TABLE IF NOT EXISTS `categories` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Dumping data for categories
INSERT IGNORE INTO `categories` (`id`, `name`) VALUES
(1, 'Sneakers'),
(2, 'Apparel'),
(3, 'Accessories');

-- Table structure for products
CREATE TABLE IF NOT EXISTS `products` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `description` text,
  `price` decimal(10,2) NOT NULL,
  `stock` int(11) NOT NULL DEFAULT '0',
  `image_url` varchar(255) DEFAULT NULL,
  `category_id` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Dumping data for products
INSERT IGNORE INTO `products` (`id`, `name`, `description`, `price`, `stock`, `image_url`, `category_id`) VALUES
(1, 'Air Max 90', 'Classic retro sneaker with visible Air cushioning', 2100000.00, 15, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80', 1),
(2, 'Yeezy Boost 350', 'Comfortable and stylish streetwear essential', 4500000.00, 8, 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=500&q=80', 1),
(3, 'Graphic Oversized Tee', 'Premium cotton oversized t-shirt', 350000.00, 30, 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&q=80', 2),
(4, 'Sneaker Cleaning Kit', 'Complete kit for keeping your kicks fresh', 150000.00, 50, 'https://images.unsplash.com/photo-1620916297397-a4a5402a3c6c?w=500&q=80', 3);

-- Table structure for users
CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL UNIQUE,
  `email` varchar(100) NOT NULL UNIQUE,
  `password` varchar(255) NOT NULL,
  `role` enum('admin','customer') DEFAULT 'customer',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Dumping data for users (Password is 'admin123' encrypted with bcrypt)
INSERT IGNORE INTO `users` (`id`, `username`, `email`, `password`, `role`) VALUES
(1, 'admin', 'admin@kicks.com', '$2a$10$vI8aWBnW3fID.ZQ4/zo1G.q1lRps.9cGLcZEiGDMVr5yUP1KUOYTa', 'admin');

-- Table structure for orders
CREATE TABLE IF NOT EXISTS `orders` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `customer_name` varchar(255) NOT NULL,
  `customer_phone` varchar(50) NOT NULL,
  `customer_address` text NOT NULL,
  `total_amount` decimal(10,2) NOT NULL,
  `status` enum('pending','processing','completed','cancelled') DEFAULT 'pending',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table structure for order_items
CREATE TABLE IF NOT EXISTS `order_items` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `order_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
