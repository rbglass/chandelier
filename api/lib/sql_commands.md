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
	job_status text DEFAULT 'TBC',
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

\COPY jobs FROM '/home/james/Downloads/rnb/legit/jobs.csv' CSV HEADER;
SELECT MAX(job_id) FROM jobs;

CREATE SEQUENCE jobs_job_id_seq
	INCREMENT 1
	MINVALUE 2601
	MAXVALUE 9223372036854775807
	START 2602
	CACHE 1;

ALTER TABLE jobs ALTER COLUMN job_id SET DEFAULT nextval('jobs_job_id_seq'::regclass);
ALTER TABLE jobs ADD COLUMN createdat DATE DEFAULT CURRENT_DATE;

CREATE OR REPLACE FUNCTION update_updatedat_column()
	RETURNS TRIGGER AS $BODY$
	BEGIN
		NEW.updatedat = now();
			RETURN NEW;
	END;
	$BODY$ language plpgsql;

CREATE TRIGGER update_job_updatetime
	BEFORE UPDATE ON jobs
	FOR EACH ROW EXECUTE PROCEDURE update_updatedat_column();

UPDATE jobs SET client = DEFAULT WHERE client IS NULL;UPDATE jobs SET project = DEFAULT WHERE project IS NULL;UPDATE jobs SET client_ref = DEFAULT WHERE client_ref IS NULL;UPDATE jobs SET job_status = '' WHERE job_status IS NULL;UPDATE jobs SET order_type = DEFAULT WHERE order_type IS NULL;UPDATE jobs SET updatedat = DEFAULT WHERE updatedat IS NULL;UPDATE jobs SET shipping_notes = DEFAULT WHERE shipping_notes IS NULL;UPDATE jobs SET parts_status = '' WHERE parts_status IS NULL;UPDATE jobs SET parts_notes = DEFAULT WHERE parts_notes IS NULL;UPDATE jobs SET invoice_notes = DEFAULT WHERE invoice_notes IS NULL;UPDATE jobs SET payment = DEFAULT WHERE payment IS NULL;UPDATE jobs SET notes = DEFAULT WHERE notes IS NULL;

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


\COPY job_items FROM '/home/james/Downloads/rnb/legit/job_items.csv' CSV HEADER;

CREATE SEQUENCE job_items_item_id_seq
	INCREMENT 1
	MINVALUE 1
	MAXVALUE 9223372036854775807
	START 1
	CACHE 1;

ALTER TABLE job_items ADD COLUMN item_id BIGINT UNIQUE DEFAULT nextval('job_items_item_id_seq'::regclass);
ALTER TABLE job_items ADD PRIMARY KEY (item_id);
ALTER TABLE job_items ADD COLUMN createdat DATE DEFAULT CURRENT_DATE;
ALTER TABLE job_items ADD COLUMN updatedat DATE DEFAULT CURRENT_DATE;
ALTER TABLE job_items ADD COLUMN pdf_rank INT DEFAULT 0;


CREATE OR REPLACE FUNCTION function_stamp() RETURNS TRIGGER AS
$BODY$
BEGIN
    UPDATE jobs
    		SET updatedat=NOW()
    			WHERE job_id=OLD.job_id;
    			RETURN new;
END;
$BODY$ language plpgsql;

CREATE TRIGGER trig_stamp
     BEFORE UPDATE ON job_items
     FOR EACH ROW
     EXECUTE PROCEDURE function_stamp();

CREATE TRIGGER update_jobitem_updatetime
	AFTER UPDATE ON job_items
	FOR EACH ROW EXECUTE PROCEDURE update_updatedat_column();

UPDATE job_items SET description = DEFAULT WHERE description IS NULL;UPDATE job_items SET glass = DEFAULT WHERE glass IS NULL;UPDATE job_items SET metal = DEFAULT WHERE metal IS NULL;UPDATE job_items SET flex = DEFAULT WHERE flex IS NULL;UPDATE job_items SET bulb = DEFAULT WHERE bulb IS NULL;UPDATE job_items SET qty_req = DEFAULT WHERE qty_req IS NULL;UPDATE job_items SET qty_hot = DEFAULT WHERE qty_hot IS NULL;UPDATE job_items SET qty_cold = DEFAULT WHERE qty_cold IS NULL;UPDATE job_items SET qty_assem = DEFAULT WHERE qty_assem IS NULL;UPDATE job_items SET notes = DEFAULT WHERE notes IS NULL;

-------------------------

CREATE TABLE products(
	sku text DEFAULT '',
	type text DEFAULT 'Other',
	name text DEFAULT '',
	description text DEFAULT '',
	active boolean DEFAULT true,
	saleable boolean DEFAULT true
);

\COPY products FROM '/home/james/Downloads/rnb/1000/products.csv' CSV HEADER;

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
	type text DEFAULT '',
	label text DEFAULT '',
	rank int DEFAULT 0,
	active boolean DEFAULT true,
	default_selected boolean DEFAULT false
);

\COPY selections FROM '/home/james/Downloads/rnb/1000/selections.csv' CSV HEADER;

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
\COPY contacts FROM '/home/james/Downloads/rnb/legit/contacts.csv' CSV HEADER;

CREATE SEQUENCE contacts_id_seq
	INCREMENT 1
	MINVALUE 1
	MAXVALUE 9223372036854775807
	START 1
	CACHE 1;

ALTER TABLE contacts ADD COLUMN id BIGINT UNIQUE DEFAULT nextval('contacts_id_seq'::regclass);
ALTER TABLE contacts ADD PRIMARY KEY (id);

-------------------------

CREATE TABLE users(
	email text
);

\COPY users FROM '/home/james/Downloads/rnb/legit/users.csv' CSV HEADER;

CREATE SEQUENCE users_id_seq
	INCREMENT 1
	MINVALUE 1
	MAXVALUE 9223372036854775807
	START 1
	CACHE 1;

ALTER TABLE users ADD COLUMN id BIGINT UNIQUE DEFAULT nextval('users_id_seq'::regclass);
ALTER TABLE users ADD PRIMARY KEY (id);
