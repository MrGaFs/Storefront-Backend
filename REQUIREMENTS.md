# API Requirements

The company stakeholders want to create an online storefront to showcase their great product ideas. Users need to be able to browse an index of all products, see the specifics of a single product, and add products to an order that they can view in a cart page. You have been tasked with building the API that will support this application, and your coworker is building the frontend.

These are the notes from a meeting with the frontend developer that describe what endpoints the API needs to supply, as well as data shapes the frontend and backend have agreed meet the requirements of the application.

## API Endpoints

### Products endpoint

- Index `[GET] /products`
- Show `[GET] /products/:id`
- Create [token required] `[POST] /products (request body[{name:string, price:number, category:string}])`
- [OPTIONAL] Top 5 most popular products `[GET] /products/top`
- [OPTIONAL] Products by category (args: product category) `[GET] /products/category/:category`
- [ADDED] Delete [token required] `[DELETE] /products/:id`
- [ADDED] Change [token required] `[put] /products/:id (request body[{property:value}])`

### Users endpoint

- [ADDED] Login (to Get you token) `[POST] /users/login (request body[{user_name:string, password:string}]) => return token`
- Index [token required] `[GET] /users`
- Show [token required] `[GET] /users/:id`
- Create N `[POST] /users (request body[{user_name:string,first_name:string, second_name:string, password:string}])  => return token`
- [ADDED] Delete [token required] `[DELETE] /users/:id`
- [ADDED] Change [token required] `[PUT] /users/:id (request body[{property:string, value:string}])`

### Orders endpoint

- Current Order by user (args: user id) [token required] `[GET] /orders/:id`
- [OPTIONAL] Completed Orders by user (args: user id) [token required] `[GET] /orders/completed/:id`
- [ADDED] Create New order and finish the last order [token required] `[POST] /orders/:id`

### Cart endpoint

- [ADDED] Get current cart for the user [token required] `[GET] /cart/user/:id (id is user id)`
- [ADDED] Get any cart by order id [token required] `[GET] /cart/:id`
- [ADDED] Add product to cart [token required] `[POST] /cart/user/:id (request body[{product_id:number, quantity:number}])`

## Data Shapes

### Product

```sql
CREATE TABLE products ( 
 id serial PRIMARY KEY,
 product_name varchar(254) NOT NULL UNIQUE,
 price FLOAT NOT NULL,
 category varchar(254)
);
```

- id
- name
- price
- [OPTIONAL] category

### User

```sql
CREATE TABLE users(
 id serial PRIMARY KEY,
 user_name varchar(254) NOT NULL UNIQUE,
 first_name varchar(255) NOT NULL,
 second_name varchar(255) NOT NULL,
 password varchar(255) NOT NULL 
);

```

- id
- firstName
- lastName
- password

### Orders

```sql
CREATE TABLE orders (
 id serial PRIMARY KEY,
 user_id INTEGER NOT NULL,
 product_id INTEGER NOT NULL,
 quantity INTEGER NOT NULL,
 status BOOLEAN NOT NULL,
 FOREIGN KEY (user_id) REFERENCES users(id),
 FOREIGN KEY (product_id) REFERENCES products(id)
);

```

- id
- user_id (user.id)
- status of order (active or complete): Boolean (True or false)

### OrdersProducts

```sql
CREATE TABLE orders_products(
 id serial PRIMARY KEY,
 order_id INTEGER NOT NULL,
 product_id INTEGER NOT NULL,
 quantity INTEGER NOT NULL,
 FOREIGN KEY (product_id) REFERENCES products(id)
);
```

- id
- order_id (order.id)
- product_id (product.id)
- quantity
