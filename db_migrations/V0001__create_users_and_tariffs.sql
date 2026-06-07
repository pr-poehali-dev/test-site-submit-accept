CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255),
    phone VARCHAR(50),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_tariffs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    tariff VARCHAR(50) NOT NULL DEFAULT 'free',
    started_at TIMESTAMP DEFAULT NOW(),
    expires_at TIMESTAMP,
    granted_by VARCHAR(100) DEFAULT 'admin'
);
