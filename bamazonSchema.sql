CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products (
  item_id (rand()*5000)
  product_name VARCHAR(25) NOT NULL,
  department_name VARCHAR(25) NOT NULL,
  price DECIMAL(12,2) not null,
  stock_quantity INT default 0,
  PRIMARY KEY (item_id)
);

CREATE TABLE departments (
  department_id INT NOT NULL AUTO_INCREMENT,
  department_name VARCHAR(45) NULL,
  total_sales DECIMAL(19,2) NULL,
  PRIMARY KEY (department_id)
  );

--add new products
INSERT INTO products(product_name,department_name,price,stock_quantity)
values 

--add new departments
INSERT INTO departments(department_name, total_sales)
values

--connection query to grab products
SELECT * FROM products;

--manager role to update products
UPDATE products
SET stock_quantity = x + 1;
WHERE item_id = x;
