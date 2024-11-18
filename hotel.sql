# Tabla habitaciones datos en ingles

CREATE TABLE  Rooms(
    id SERIAL PRIMARY KEY,
    room_number VARCHAR(50) NOT NULL,
    type ENUM ("Basic", "Deluxe", "Suite", "Executive") NOT NULL,
    status ENUM ("Available", "Occupied", "Reserved") NOT NULL,
    price INTEGER NOT NULL,
    floor INTEGER NOT NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE  Customers(
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    dni VARCHAR(50) NOT NULL,
    email VARCHAR(50) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    address VARCHAR(50) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE  Reservations(
    id SERIAL PRIMARY KEY,
    room_id INTEGER NOT NULL,
    customer_id INTEGER NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE  Reservations
    ADD CONSTRAINT  Reservations_room_id_fkey
    FOREIGN KEY (room_id)
    REFERENCES  Rooms(id);

ALTER TABLE  Reservations
    ADD CONSTRAINT  Reservations_customer_id_fkey
    FOREIGN KEY (customer_id)
    REFERENCES  Customers(id);

ALTER TABLE  Rooms
    ADD CONSTRAINT  Rooms_type_check
    CHECK (type IN ('Basic', 'Deluxe', 'Suite', 'Executive'));

ALTER TABLE  Rooms
    ADD CONSTRAINT  Rooms_status_check
    CHECK (status IN ('Available', 'Occupied', 'Reserved'));    
    