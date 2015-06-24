// Edit headers to match defined ones
// NOTE: DELETE COLUMNS IN GOOGLE SHEETS WHICH ARE EMPTY/NOT USED
// remove Outsourced
// add flex, bulb, bespoke as 'Other'
// non-saleable flex & bulb products

CREATE TABLE jobs(
	job_id bigint PRIMARY KEY NOT NULL UNIQUE,
	client text DEFAULT '',
	project text DEFAULT '',
	client_ref text DEFAULT '',
	job_status text DEFAULT '',
	order_type text DEFAULT '',
	updatedat date DEFAULT CURRENT_DATE,
	shipping_date date,
	shipping_notes text DEFAULT '',
	parts_status text DEFAULT 'Not Started',
	parts_notes text DEFAULT '',
	invoice_notes text DEFAULT '',
	payment text DEFAULT '',
	notes text DEFAULT ''
);

ALTER TABLE jobs ADD PRIMARY KEY (job_id);
ALTER TABLE jobs ALTER COLUMN job_id SET NOT NULL;

COPY jobs FROM '~/Downloads/rnb/jobs.csv' CSV HEADER;
SELECT MAX(job_id) FROM jobs;

CREATE SEQUENCE jobs_job_id_seq
	INCREMENT 1
	MINVALUE 4000
	MAXVALUE 9223372036854775807
	START 4000
	CACHE 1;

ALTER TABLE jobs ALTER COLUMN job_id SET DEFAULT nextval('jobs_job_id_seq'::regclass);
ALTER TABLE jobs ADD COLUMN createdat DATE DEFAULT CURRENT_DATE;


-------------------------

CREATE TABLE job_items(
	job_id int,
	product text DEFAULT '',
	description text DEFAULT '',
	glass text DEFAULT '',
	metal text DEFAULT '',
	flex text DEFAULT '',
	bulb text DEFAULT '',
	qty_req int DEFAULT 0,
	qty_hot int DEFAULT 0,
	qty_cold int DEFAULT 0,
	qty_assem int DEFAULT 0,
	notes text DEFAULT ''
);

ALTER TABLE job_items
	ADD CONSTRAINT job_items_job_id_fkey FOREIGN KEY (job_id)
			REFERENCES jobs (job_id) MATCH SIMPLE
			ON UPDATE NO ACTION ON DELETE NO ACTION;


COPY jobs FROM '~/Downloads/rnb/job_items.csv' CSV HEADER;

CREATE SEQUENCE job_items_item_id_seq
	INCREMENT 1
	MINVALUE 1
	MAXVALUE 9223372036854775807
	START 1
	CACHE 1;

ALTER TABLE job_items ADD COLUMN item_id BIGINT UNIQUE DEFAULT nextval('job_items_item_id_seq'::regclass);
ALTER TABLE job_items ADD PRIMARY KEY (item_id) NOT NULL;

CREATE OR REPLACE FUNCTION function_stamp() RETURNS TRIGGER AS
$BODY$
BEGIN
    UPDATE jobs
    		SET updatedat=NOW()
    			WHERE job_id=OLD.job_id;
    			RETURN new;
END;
$BODY$
language plpgsql;

CREATE TRIGGER trig_stamp
     AFTER UPDATE ON job_items
     FOR EACH ROW
     EXECUTE PROCEDURE function_stamp();

-------------------------

CREATE TABLE products(
	SKU text DEFAULT '',
	type text DEFAULT '',
	name text DEFAULT '',
	description text DEFAULT '',
	active boolean DEFAULT true,
	saleable boolean DEFAULT true
);

COPY products FROM '~/Downloads/rnb/products.csv' CSV HEADER;

CREATE SEQUENCE products_id_seq
	INCREMENT 1
	MINVALUE 1
	MAXVALUE 9223372036854775807
	START 1
	CACHE 1;

ALTER TABLE products ADD COLUMN id BIGINT UNIQUE DEFAULT nextval('products_id_seq'::regclass);
ALTER TABLE products ADD PRIMARY KEY (id);

UPDATE products
SET name = DEFAULT
WHERE
	name IS NULL;

-----------------------

CREATE TABLE selections(
	type text DEFAULT 'Other',
	label text DEFAULT '',
	rank int DEFAULT 0,
	active boolean DEFAULT true,
	default_selected boolean DEFAULT false
);

COPY selections FROM '~/Downloads/rnb/selections.csv' CSV HEADER;

CREATE SEQUENCE selections_id_seq
	INCREMENT 1
	MINVALUE 1
	MAXVALUE 9223372036854775807
	START 1
	CACHE 1;

ALTER TABLE selections ADD COLUMN id BIGINT UNIQUE DEFAULT nextval('selections_id_seq'::regclass);
ALTER TABLE selections ADD PRIMARY KEY (id);

UPDATE selections
SET label = DEFAULT
WHERE
	label IS NULL;

------------------------

CREATE TABLE contacts(
	type text,
	name text,
	active boolean
);
COPY contacts FROM '~/Downloads/rnb/contacts.csv' CSV HEADER;

CREATE SEQUENCE contacts_id_seq
	INCREMENT 1
	MINVALUE 1
	MAXVALUE 9223372036854775807
	START 1
	CACHE 1;

ALTER TABLE contacts ADD COLUMN id BIGINT UNIQUE DEFAULT nextval('contacts_id_seq'::regclass);
ALTER TABLE contacts ADD PRIMARY KEY (id);

-------------------------
