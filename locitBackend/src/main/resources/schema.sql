CREATE DATABASE IF NOT EXISTS locit_db;
USE locit_db;

CREATE TABLE IF NOT EXISTS users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    email VARCHAR(180) NOT NULL UNIQUE,
    phone VARCHAR(20) UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'BUYER',
    profile_image VARCHAR(500),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS shops (
    shop_id INT AUTO_INCREMENT PRIMARY KEY,
    seller_id INT NOT NULL,
    shop_name VARCHAR(180) NOT NULL,
    description TEXT,
    address VARCHAR(255),
    city VARCHAR(80),
    state VARCHAR(80),
    pincode VARCHAR(12),
    latitude DOUBLE,
    longitude DOUBLE,
    CONSTRAINT fk_shop_seller FOREIGN KEY (seller_id) REFERENCES users(user_id)
);

CREATE TABLE IF NOT EXISTS category (
    category_id INT AUTO_INCREMENT PRIMARY KEY,
    category_name VARCHAR(120) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS brands (
    brand_id INT AUTO_INCREMENT PRIMARY KEY,
    category_id INT NOT NULL,
    brand_name VARCHAR(120) NOT NULL,
    logo VARCHAR(500),
    CONSTRAINT fk_brand_category FOREIGN KEY (category_id) REFERENCES category(category_id)
);

CREATE TABLE IF NOT EXISTS products (
    product_id INT AUTO_INCREMENT PRIMARY KEY,
    shop_id INT NOT NULL,
    category_id INT NOT NULL,
    brand_id INT NOT NULL,
    product_name VARCHAR(180) NOT NULL,
    description TEXT,
    price DOUBLE NOT NULL,
    stock INT DEFAULT 0,
    is_available BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_product_shop FOREIGN KEY (shop_id) REFERENCES shops(shop_id),
    CONSTRAINT fk_product_category FOREIGN KEY (category_id) REFERENCES category(category_id),
    CONSTRAINT fk_product_brand FOREIGN KEY (brand_id) REFERENCES brands(brand_id)
);

CREATE TABLE IF NOT EXISTS product_images (
    image_id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    CONSTRAINT fk_image_product FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS inventory (
    inventory_id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL UNIQUE,
    available_stock INT DEFAULT 0,
    last_updated DATETIME,
    CONSTRAINT fk_inventory_product FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS cart_items (
    cart_item_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    CONSTRAINT fk_cart_user FOREIGN KEY (user_id) REFERENCES users(user_id),
    CONSTRAINT fk_cart_product FOREIGN KEY (product_id) REFERENCES products(product_id)
);

CREATE TABLE IF NOT EXISTS orders (
    order_id INT AUTO_INCREMENT PRIMARY KEY,
    buyer_id INT NOT NULL,
    shop_id INT NOT NULL,
    total_amount DOUBLE,
    order_status VARCHAR(20) DEFAULT 'Pending',
    ordered_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_order_buyer FOREIGN KEY (buyer_id) REFERENCES users(user_id),
    CONSTRAINT fk_order_shop FOREIGN KEY (shop_id) REFERENCES shops(shop_id)
);

CREATE TABLE IF NOT EXISTS order_items (
    order_item_id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    price DOUBLE NOT NULL,
    CONSTRAINT fk_orderitem_order FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
    CONSTRAINT fk_orderitem_product FOREIGN KEY (product_id) REFERENCES products(product_id)
);
