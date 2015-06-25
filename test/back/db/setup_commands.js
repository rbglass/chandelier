"use strict";

// TODO: change to just create - copy - edit;
module.exports = {
	jobs: {
		create: "CREATE TABLE jobs(" +
							"job_id bigint PRIMARY KEY NOT NULL UNIQUE, " +
							"client text DEFAULT '', project text DEFAULT '', " +
							"client_ref text DEFAULT '', job_status text DEFAULT '', " +
							"order_type text DEFAULT '', updatedat date DEFAULT CURRENT_DATE, " +
							"shipping_date date, shipping_notes text DEFAULT '', " +
							"parts_status text DEFAULT 'Not Started', " +
							"parts_notes text DEFAULT '', invoice_notes text DEFAULT '', " +
							"payment text DEFAULT '', notes text DEFAULT '');",
		copy:  "\COPY jobs FROM '/home/james/Coding/wesort/chandelier/test/back/db/csv/jobs.csv' CSV HEADER;",
		seq:   "CREATE SEQUENCE jobs_job_id_seq " +
							"INCREMENT 1 " +
							"MINVALUE 4000 " +
							"MAXVALUE 9223372036854775807 " +
							"START 4000 " +
							"CACHE 1;",
		pkeyseq: "ALTER TABLE jobs ALTER COLUMN job_id SET DEFAULT nextval('jobs_job_id_seq'::regclass);",
		defaultdate: "ALTER TABLE jobs ADD COLUMN createdat DATE DEFAULT CURRENT_DATE;"
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
		copy: "\COPY jobs FROM '/home/james/Coding/wesort/chandelier/test/back/db/csv/job_items.csv' CSV HEADER;",
		seq: "CREATE SEQUENCE job_items_item_id_seq " +
						"INCREMENT 1 " +
						"MINVALUE 1 " +
						"MAXVALUE 9223372036854775807 " +
						"START 1 " +
						"CACHE 1;",
		pkeyseq: "ALTER TABLE job_items ADD COLUMN item_id BIGINT UNIQUE DEFAULT " +
							"nextval('job_items_item_id_seq'::regclass);",
		pkey: "ALTER TABLE job_items ADD PRIMARY KEY (item_id) NOT NULL;"
	},
	products: {
		create: "CREATE TABLE products(" +
							"SKU text DEFAULT '', " +
							"type text DEFAULT '', " +
							"name text DEFAULT '', " +
							"description text DEFAULT '', " +
							"active boolean DEFAULT true, " +
							"saleable boolean DEFAULT true);",
		copy: "\COPY products FROM '/home/james/Coding/wesort/chandelier/test/back/db/csv/products.csv' CSV HEADER;",
		seq: "CREATE SEQUENCE products_id_seq " +
						"INCREMENT 1 " +
						"MINVALUE 1 " +
						"MAXVALUE 9223372036854775807 " +
						"START 1 " +
						"CACHE 1;",
		pkeyseq: "ALTER TABLE products ADD COLUMN id BIGINT UNIQUE DEFAULT nextval('products_id_seq'::regclass);",
		pkey: "ALTER TABLE products ADD PRIMARY KEY (id);",
		clean: "UPDATE products " +
						"SET name = DEFAULT " +
						"WHERE name IS NULL;"
	},
	selections: {
		create: "CREATE TABLE selections(" +
							"type text DEFAULT 'Other', " +
							"label text DEFAULT '', " +
							"rank int DEFAULT 0, " +
							"active boolean DEFAULT true, " +
							"default_selected boolean DEFAULT false);",
		copy: "\COPY selections FROM '/home/james/Coding/wesort/chandelier/test/back/db/csv/selections.csv' CSV HEADER;",
		seq: "CREATE SEQUENCE selections_id_seq " +
					"INCREMENT 1 " +
					"MINVALUE 1 " +
					"MAXVALUE 9223372036854775807 " +
					"START 1 " +
					"CACHE 1;",
		pkeyseq: "ALTER TABLE selections ADD COLUMN id BIGINT UNIQUE DEFAULT nextval('selections_id_seq'::regclass);",
		pkey: "ALTER TABLE selections ADD PRIMARY KEY (id);",

		clean: "UPDATE selections " +
						"SET label = DEFAULT " +
						"WHERE label IS NULL;"
	},
	drop: {
		all: "DROP TABLE IF EXISTS jobs CASCADE;" +
					"DROP TABLE IF EXISTS job_items CASCADE;" +
					"DROP TABLE IF EXISTS products CASCADE;" +
					"DROP TABLE IF EXISTS selections CASCADE;"
	}
};
