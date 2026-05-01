-- Seed categories
INSERT INTO categories (name, description) VALUES
    ('Electronics',     'Computers, phones, audio, and accessories'),
    ('Clothing',        'Men and women fashion, footwear, and accessories'),
    ('Books',           'Fiction, non-fiction, technical, and educational'),
    ('Home & Garden',   'Furniture, decor, kitchenware, and garden supplies'),
    ('Sports',          'Fitness equipment, outdoor gear, and sportswear')
ON CONFLICT (name) DO NOTHING;

-- Seed products (Electronics)
INSERT INTO products (name, description, price, stock_quantity, category_id)
SELECT 'Wireless Noise-Cancelling Headphones',
       'Premium over-ear headphones with 30h battery and active noise cancellation',
       89.99, 45, id FROM categories WHERE name = 'Electronics';

INSERT INTO products (name, description, price, stock_quantity, category_id)
SELECT 'Mechanical Keyboard',
       'Tenkeyless layout, Cherry MX switches, RGB backlight',
       129.99, 30, id FROM categories WHERE name = 'Electronics';

INSERT INTO products (name, description, price, stock_quantity, category_id)
SELECT 'USB-C Hub 7-in-1',
       '4K HDMI, 3x USB 3.0, SD card reader, 100W PD passthrough',
       49.99, 80, id FROM categories WHERE name = 'Electronics';

INSERT INTO products (name, description, price, stock_quantity, category_id)
SELECT 'Smart Watch Pro',
       'Heart-rate monitor, GPS, 5-day battery, water-resistant',
       199.99, 20, id FROM categories WHERE name = 'Electronics';

-- Seed products (Books)
INSERT INTO products (name, description, price, stock_quantity, category_id)
SELECT 'Clean Code',
       'A Handbook of Agile Software Craftsmanship by Robert C. Martin',
       34.99, 60, id FROM categories WHERE name = 'Books';

INSERT INTO products (name, description, price, stock_quantity, category_id)
SELECT 'Designing Data-Intensive Applications',
       'The big ideas behind reliable, scalable, and maintainable systems',
       44.99, 40, id FROM categories WHERE name = 'Books';

-- Seed products (Sports)
INSERT INTO products (name, description, price, stock_quantity, category_id)
SELECT 'Adjustable Dumbbell Set',
       'Quick-adjust 5-50 lbs per dumbbell, replaces 15 sets',
       299.99, 15, id FROM categories WHERE name = 'Sports';

INSERT INTO products (name, description, price, stock_quantity, category_id)
SELECT 'Yoga Mat Premium',
       'Non-slip 6mm thick TPE mat with carrying strap',
       29.99, 100, id FROM categories WHERE name = 'Sports';
