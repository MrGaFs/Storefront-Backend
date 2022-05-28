CREATE TABLE products (
  id serial PRIMARY KEY,
  product_name varchar(254) NOT NULL UNIQUE,
  price FLOAT NOT NULL,
  category varchar(254)
);

CREATE TABLE users(
	id serial PRIMARY KEY,
	user_name varchar(254) NOT NULL UNIQUE,
	first_name varchar(255) NOT NULL,
	second_name varchar(255) NOT NULL,
	password varchar(255) NOT NULL 
);


CREATE TABLE orders (
	id serial PRIMARY KEY,
	user_id INTEGER NOT NULL,
	product_id INTEGER NOT NULL,
	quantity INTEGER NOT NULL,
	status BOOLEAN NOT NULL,
	FOREIGN KEY (user_id) REFERENCES users(id),
	FOREIGN KEY (product_id) REFERENCES products(id)
);
