"use strict";
var path = require("path");
var csvPath = path.join(__dirname, "/csv");

// TODO: change to just create - copy - edit;
module.exports = {
	jobs: {
		create: "CREATE TABLE jobs(" +
							"job_id bigint PRIMARY KEY NOT NULL UNIQUE, " +
							"client text DEFAULT '', project text DEFAULT '', " +
							"client_ref text DEFAULT '', job_status text DEFAULT 'TBC', " +
							"order_type text DEFAULT '', updatedat date DEFAULT CURRENT_DATE, " +
							"shipping_date date, shipping_notes text DEFAULT '', " +
							"parts_status text DEFAULT 'Not Started', " +
							"parts_notes text DEFAULT '', invoice_notes text DEFAULT '', " +
							"payment text DEFAULT '', notes text DEFAULT '');",
		copy:  "COPY jobs FROM '" + csvPath + "/jobs.csv' CSV HEADER;",
		seq:   "CREATE SEQUENCE jobs_job_id_seq " +
							"INCREMENT 1 " +
							"MINVALUE 4000 " +
							"MAXVALUE 9223372036854775807 " +
							"START 4000 " +
							"CACHE 1;",
		pkeyseq: "ALTER TABLE jobs ALTER COLUMN job_id SET DEFAULT nextval('jobs_job_id_seq'::regclass);",
		defaultdate: "ALTER TABLE jobs ADD COLUMN createdat DATE DEFAULT CURRENT_DATE;",
		clean: "UPDATE jobs SET client = DEFAULT WHERE client IS NULL;" +
						"UPDATE jobs SET project = DEFAULT WHERE project IS NULL;" +
						"UPDATE jobs SET client_ref = DEFAULT WHERE client_ref IS NULL;" +
						"UPDATE jobs SET job_status = '' WHERE job_status IS NULL;" +
						"UPDATE jobs SET order_type = DEFAULT WHERE order_type IS NULL;" +
						"UPDATE jobs SET updatedat = DEFAULT WHERE updatedat IS NULL;" +
						"UPDATE jobs SET shipping_notes = DEFAULT WHERE shipping_notes IS NULL;" +
						"UPDATE jobs SET parts_status = '' WHERE parts_status IS NULL;" +
						"UPDATE jobs SET parts_notes = DEFAULT WHERE parts_notes IS NULL;" +
						"UPDATE jobs SET invoice_notes = DEFAULT WHERE invoice_notes IS NULL;" +
						"UPDATE jobs SET payment = DEFAULT WHERE payment IS NULL;" +
						"UPDATE jobs SET notes = DEFAULT WHERE notes IS NULL;"
	},
	job_items: {
		create: "CREATE TABLE job_items(" +
							"job_id int, " +
							"product text DEFAULT '', " +
							"description text DEFAULT '', " +
							"glass text DEFAULT '', " +
							"metal text DEFAULT '', " +
							"flex text DEFAULT '', " +
							"bulb text DEFAULT '', " +
							"qty_req int DEFAULT 0, " +
							"qty_hot int DEFAULT 0, " +
							"qty_cold int DEFAULT 0, " +
							"qty_assem int DEFAULT 0, " +
							"notes text DEFAULT '');",
		fkey: "ALTER TABLE job_items " +
						"ADD CONSTRAINT job_items_job_id_fkey FOREIGN KEY (job_id) " +
							"REFERENCES jobs (job_id) MATCH SIMPLE " +
							"ON UPDATE NO ACTION ON DELETE NO ACTION;",
		copy: "COPY job_items FROM '" + csvPath + "/job_items.csv' CSV HEADER;",
		seq: "CREATE SEQUENCE job_items_item_id_seq " +
						"INCREMENT 1 " +
						"MINVALUE 1 " +
						"MAXVALUE 9223372036854775807 " +
						"START 1 " +
						"CACHE 1;",
		pkeyseq: "ALTER TABLE job_items ADD COLUMN item_id BIGINT UNIQUE DEFAULT " +
							"nextval('job_items_item_id_seq'::regclass);",
		pkey: "ALTER TABLE job_items ADD PRIMARY KEY (item_id);",
		clean: "ALTER TABLE job_items ADD COLUMN pdf_rank INT DEFAULT 0;" +
						"UPDATE job_items SET description = DEFAULT WHERE description IS NULL;" +
						"UPDATE job_items SET glass = DEFAULT WHERE glass IS NULL;" +
						"UPDATE job_items SET metal = DEFAULT WHERE metal IS NULL;" +
						"UPDATE job_items SET flex = DEFAULT WHERE flex IS NULL;" +
						"UPDATE job_items SET bulb = DEFAULT WHERE bulb IS NULL;" +
						"UPDATE job_items SET qty_req = DEFAULT WHERE qty_req IS NULL;" +
						"UPDATE job_items SET qty_hot = DEFAULT WHERE qty_hot IS NULL;" +
						"UPDATE job_items SET qty_cold = DEFAULT WHERE qty_cold IS NULL;" +
						"UPDATE job_items SET qty_assem = DEFAULT WHERE qty_assem IS NULL;" +
						"UPDATE job_items SET notes = DEFAULT WHERE notes IS NULL;"
	},
	products: {
		create: "CREATE TABLE products(" +
							"sku text DEFAULT '', " +
							"type text DEFAULT 'Other', " +
							"name text DEFAULT '', " +
							"description text DEFAULT '', " +
							"active boolean DEFAULT true, " +
							"saleable boolean DEFAULT true);",
		copy: "COPY products FROM '" + csvPath + "/products.csv' CSV HEADER;",
		seq: "CREATE SEQUENCE products_id_seq " +
						"INCREMENT 1 " +
						"MINVALUE 1 " +
						"MAXVALUE 9223372036854775807 " +
						"START 1 " +
						"CACHE 1;",
		pkeyseq: "ALTER TABLE products ADD COLUMN id BIGINT UNIQUE DEFAULT nextval('products_id_seq'::regclass);",
		pkey: "ALTER TABLE products ADD PRIMARY KEY (id);",
		clean: "UPDATE products SET name = DEFAULT WHERE name IS NULL;" +
						"UPDATE products SET sku = DEFAULT WHERE sku IS NULL;" +
						"UPDATE products SET description = DEFAULT WHERE description IS NULL;" +
						"UPDATE products SET active = DEFAULT WHERE active IS NULL;" +
						"UPDATE products SET saleable = DEFAULT WHERE saleable IS NULL;"
	},
	selections: {
		create: "CREATE TABLE selections(" +
							"type text DEFAULT '', " +
							"label text DEFAULT '', " +
							"rank int DEFAULT 0, " +
							"active boolean DEFAULT true, " +
							"default_selected boolean DEFAULT false);",
		copy: "COPY selections FROM '" + csvPath + "/selections.csv' CSV HEADER;",
		seq: "CREATE SEQUENCE selections_id_seq " +
					"INCREMENT 1 " +
					"MINVALUE 1 " +
					"MAXVALUE 9223372036854775807 " +
					"START 1 " +
					"CACHE 1;",
		pkeyseq: "ALTER TABLE selections ADD COLUMN id BIGINT UNIQUE DEFAULT nextval('selections_id_seq'::regclass);",
		pkey: "ALTER TABLE selections ADD PRIMARY KEY (id);",

		clean: "UPDATE selections SET label = DEFAULT WHERE label IS NULL;" +
						"UPDATE selections SET default_selected = DEFAULT WHERE default_selected IS NULL;"

	},
	users: {
		create: "CREATE TABLE users(email text)"
	},
	drop: {
		all: "DROP OWNED BY test CASCADE"
	}
};
