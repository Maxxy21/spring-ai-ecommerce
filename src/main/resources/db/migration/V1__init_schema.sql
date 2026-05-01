-- Categories table
CREATE TABLE IF NOT EXISTS categories (
    id          BIGSERIAL PRIMARY KEY,
    name        VARCHAR(100) NOT NULL UNIQUE,
    description VARCHAR(500),
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Products table
CREATE TABLE IF NOT EXISTS products (
    id             BIGSERIAL PRIMARY KEY,
    name           VARCHAR(200) NOT NULL,
    description    TEXT,
    price          NUMERIC(10, 2) NOT NULL CHECK (price > 0),
    stock_quantity INTEGER      NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
    image_url      VARCHAR(500),
    category_id    BIGINT REFERENCES categories (id) ON DELETE SET NULL,
    created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_product_category ON products (category_id);
CREATE INDEX IF NOT EXISTS idx_product_name ON products (name);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
    id               BIGSERIAL PRIMARY KEY,
    user_id          VARCHAR(100) NOT NULL,
    status           VARCHAR(50)  NOT NULL DEFAULT 'PENDING',
    total_amount     NUMERIC(10, 2) NOT NULL,
    shipping_address TEXT,
    notes            TEXT,
    created_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_order_user ON orders (user_id);
CREATE INDEX IF NOT EXISTS idx_order_status ON orders (status);

-- Order items table
CREATE TABLE IF NOT EXISTS order_items (
    id          BIGSERIAL PRIMARY KEY,
    order_id    BIGINT         NOT NULL REFERENCES orders (id) ON DELETE CASCADE,
    product_id  BIGINT         NOT NULL REFERENCES products (id),
    quantity    INTEGER        NOT NULL CHECK (quantity > 0),
    unit_price  NUMERIC(10, 2) NOT NULL,
    total_price NUMERIC(10, 2) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items (order_id);
