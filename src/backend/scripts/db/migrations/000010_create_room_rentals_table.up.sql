CREATE TABLE room_rentals (
    id INT AUTO_INCREMENT PRIMARY KEY,
    room_id INT NOT NULL,
    rental_id INT NOT NULL,
    floor INT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    quantity INT NOT NULL DEFAULT 1
);