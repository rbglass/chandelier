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
notes text DEFAULT '');

ALTER TABLE job_items 
	ADD CONSTRAINT job_items_job_id_fkey FOREIGN KEY (job_id) 
	REFERENCES jobs (job_id) MATCH SIMPLE 
	ON UPDATE NO ACTION ON DELETE NO ACTION;

COPY job_items FROM 'D:\Apps\chandelier\test\api\models\csv\job_items.csv' CSV HEADER;

CREATE SEQUENCE job_items_item_id_seq 
		INCREMENT 1 
		MINVALUE 1 
		MAXVALUE 9223372036854775807 
		START 1 
		CACHE 1;

ALTER TABLE job_items ADD COLUMN item_id BIGINT UNIQUE DEFAULT nextval('job_items_item_id_seq'::regclass);

ALTER TABLE job_items ADD PRIMARY KEY (item_id);

CREATE TRIGGER update_jobitem_updatetime BEFORE UPDATE ON job_items FOR EACH ROW EXECUTE PROCEDURE update_updatedat_column();

ALTER TABLE job_items ADD COLUMN pdf_rank INT DEFAULT 0;
UPDATE job_items SET description = DEFAULT WHERE description IS NULL;
UPDATE job_items SET glass = DEFAULT WHERE glass IS NULL;
UPDATE job_items SET metal = DEFAULT WHERE metal IS NULL;
UPDATE job_items SET flex = DEFAULT WHERE flex IS NULL;
UPDATE job_items SET bulb = DEFAULT WHERE bulb IS NULL;
UPDATE job_items SET qty_req = DEFAULT WHERE qty_req IS NULL;
UPDATE job_items SET qty_hot = DEFAULT WHERE qty_hot IS NULL;
UPDATE job_items SET qty_cold = DEFAULT WHERE qty_cold IS NULL;
UPDATE job_items SET qty_assem = DEFAULT WHERE qty_assem IS NULL;
UPDATE job_items SET notes = DEFAULT WHERE notes IS NULL;