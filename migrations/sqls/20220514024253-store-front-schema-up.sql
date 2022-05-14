CREATE TABLE products (
  id serial PRIMARY KEY,
  name varchar(254) NOT NULL,
  price FLOAT NOT NULL,
  category varchar(254)
);

CREATE TABLE users(
	id serial PRIMARY KEY,
	first_name varchar(255) NOT NULL,
	second_name varchar(255) NOT NULL,
	password varchar(255) NOT NULL
);

CREATE TABLE orders(
	id serial PRIMARY KEY,
	user_id integer NOT NULL,
	CONSTRAINT orders_user_id_fkey FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

CREATE TABLE orders_products (
	id serial PRIMARY KEY,
	order_id INTEGER NOT NULL,
	product_id INTEGER NOT NULL,
	quantity INTEGER NOT NULL,
	FOREIGN KEY (order_id) REFERENCES orders(id),
	FOREIGN KEY (product_id) REFERENCES products(id)
);
