USE locit_db;

INSERT INTO users (name, email, phone, password_hash, role)
VALUES
    ('Demo Buyer', 'buyer@locit.com', '9876543210', 'buyer123', 'BUYER'),
    ('Rakesh Kumar', 'seller@locit.com', '9876543211', 'seller123', 'SELLER')
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO shops (seller_id, shop_name, description, address, city, state, pincode, latitude, longitude)
SELECT user_id, 'Daily Marts', 'Neighborhood grocery store', 'Sector 15', 'Hisar', 'Haryana', '125001', 29.1492, 75.7217
FROM users
WHERE email = 'seller@locit.com'
  AND NOT EXISTS (SELECT 1 FROM shops WHERE shop_name = 'Daily Marts');

INSERT INTO shops (seller_id, shop_name, description, address, city, state, pincode, latitude, longitude)
SELECT user_id, 'Super Market', 'Local supermarket', 'Model Town', 'Hisar', 'Haryana', '125005', 29.1530, 75.7300
FROM users
WHERE email = 'seller@locit.com'
  AND NOT EXISTS (SELECT 1 FROM shops WHERE shop_name = 'Super Market');

INSERT INTO category (category_name)
VALUES ('Food & Grocery'), ('Household'), ('Snacks')
ON DUPLICATE KEY UPDATE category_name = VALUES(category_name);

INSERT INTO brands (category_id, brand_name)
SELECT category_id, 'Amul'
FROM category
WHERE category_name = 'Food & Grocery'
  AND NOT EXISTS (SELECT 1 FROM brands WHERE brand_name = 'Amul');

INSERT INTO brands (category_id, brand_name)
SELECT category_id, 'Aashirvaad'
FROM category
WHERE category_name = 'Food & Grocery'
  AND NOT EXISTS (SELECT 1 FROM brands WHERE brand_name = 'Aashirvaad');

INSERT INTO brands (category_id, brand_name)
SELECT category_id, 'Maggi'
FROM category
WHERE category_name = 'Snacks'
  AND NOT EXISTS (SELECT 1 FROM brands WHERE brand_name = 'Maggi');

INSERT INTO brands (category_id, brand_name)
SELECT category_id, 'Surf Excel'
FROM category
WHERE category_name = 'Household'
  AND NOT EXISTS (SELECT 1 FROM brands WHERE brand_name = 'Surf Excel');

INSERT INTO products (shop_id, category_id, brand_id, product_name, description, price, stock, is_available)
SELECT s.shop_id, c.category_id, b.brand_id, 'Amul Taaza Milk', 'Fresh toned milk 1L', 56, 40, TRUE
FROM shops s, category c, brands b
WHERE s.shop_name = 'Daily Marts'
  AND c.category_name = 'Food & Grocery'
  AND b.brand_name = 'Amul'
  AND NOT EXISTS (SELECT 1 FROM products WHERE product_name = 'Amul Taaza Milk');

INSERT INTO products (shop_id, category_id, brand_id, product_name, description, price, stock, is_available)
SELECT s.shop_id, c.category_id, b.brand_id, 'Aashirwad Atta', 'Whole wheat flour 5Kg', 249, 25, TRUE
FROM shops s, category c, brands b
WHERE s.shop_name = 'Daily Marts'
  AND c.category_name = 'Food & Grocery'
  AND b.brand_name = 'Aashirvaad'
  AND NOT EXISTS (SELECT 1 FROM products WHERE product_name = 'Aashirwad Atta');

INSERT INTO products (shop_id, category_id, brand_id, product_name, description, price, stock, is_available)
SELECT s.shop_id, c.category_id, b.brand_id, 'Maggi Noodles', '2-minute noodles pack', 14, 80, TRUE
FROM shops s, category c, brands b
WHERE s.shop_name = 'Super Market'
  AND c.category_name = 'Snacks'
  AND b.brand_name = 'Maggi'
  AND NOT EXISTS (SELECT 1 FROM products WHERE product_name = 'Maggi Noodles');

INSERT INTO products (shop_id, category_id, brand_id, product_name, description, price, stock, is_available)
SELECT s.shop_id, c.category_id, b.brand_id, 'Washing Powder', 'Detergent 1Kg', 240, 30, TRUE
FROM shops s, category c, brands b
WHERE s.shop_name = 'Super Market'
  AND c.category_name = 'Household'
  AND b.brand_name = 'Surf Excel'
  AND NOT EXISTS (SELECT 1 FROM products WHERE product_name = 'Washing Powder');

INSERT INTO product_images (product_id, image_url)
SELECT product_id, '/assets/amul-milk.png'
FROM products
WHERE product_name = 'Amul Taaza Milk'
  AND NOT EXISTS (SELECT 1 FROM product_images pi WHERE pi.product_id = products.product_id);

INSERT INTO product_images (product_id, image_url)
SELECT product_id, '/assets/aashirwad-aata.png'
FROM products
WHERE product_name = 'Aashirwad Atta'
  AND NOT EXISTS (SELECT 1 FROM product_images pi WHERE pi.product_id = products.product_id);

INSERT INTO product_images (product_id, image_url)
SELECT product_id, '/assets/maggi-image.png'
FROM products
WHERE product_name = 'Maggi Noodles'
  AND NOT EXISTS (SELECT 1 FROM product_images pi WHERE pi.product_id = products.product_id);

INSERT INTO product_images (product_id, image_url)
SELECT product_id, '/assets/detergent-image.png'
FROM products
WHERE product_name = 'Washing Powder'
  AND NOT EXISTS (SELECT 1 FROM product_images pi WHERE pi.product_id = products.product_id);
