CREATE TABLE selections(
		type text DEFAULT '', 
		label text DEFAULT '',
		rank int DEFAULT 0, 
		active boolean DEFAULT true, 
		default_selected boolean DEFAULT false);

COPY selections FROM 'D:\Apps\chandelier\test\api\models\csv\selections.csv' CSV HEADER;

CREATE SEQUENCE selections_id_seq 
	INCREMENT 1 
	MINVALUE 1 
	MAXVALUE 9223372036854775807 
	START 1 
	CACHE 1;

ALTER TABLE selections ADD COLUMN id BIGINT UNIQUE DEFAULT nextval('selections_id_seq'::regclass);

ALTER TABLE selections ADD PRIMARY KEY (id);

UPDATE selections SET label = DEFAULT WHERE label IS NULL;
UPDATE selections SET default_selected = DEFAULT WHERE default_selected IS NULL;