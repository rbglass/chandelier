CREATE TABLE products(
	sku text DEFAULT '', 
	type text DEFAULT 'Other', 
	name text DEFAULT '', 
	description text DEFAULT '', 
	active boolean DEFAULT true, 
	saleable boolean DEFAULT true);

COPY products FROM 'D:\Apps\chandelier\test\api\models\csv\products.csv' CSV HEADER;

CREATE SEQUENCE products_id_seq 
		INCREMENT 1 
		MINVALUE 1 
		MAXVALUE 9223372036854775807 
		START 1 
		CACHE 1;

ALTER TABLE products ADD COLUMN id BIGINT UNIQUE DEFAULT nextval('products_id_seq'::regclass);

ALTER TABLE products ADD PRIMARY KEY (id);

UPDATE products SET name = DEFAULT WHERE name IS NULL;
		UPDATE products SET sku = DEFAULT WHERE sku IS NULL;
		UPDATE products SET description = DEFAULT WHERE description IS NULL;
		UPDATE products SET active = DEFAULT WHERE active IS NULL;
		UPDATE products SET saleable = DEFAULT WHERE saleable IS NULL;