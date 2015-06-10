#selection: need a table for each drop down menu

CREATE TABLE selections(type text, label text);

INSERT INTO selections (type, label) VALUES ('job_status', 'TBC'), ('job_status', 'Non-Starter'), ('job_status', 'Confirmed'), ('job_status', 'Packaged'), ('job_status', 'Done'), ('order_type', 'Standard'), ('order_type', 'Bespoke'), ('order_type', 'RB Parts'), ('order_type', 'Outsourced'), ('order_type', 'Loan or Press'), ('parts_status', ' '),('parts_status', 'Started'), ('parts_status', 'Done'), ('product_type', ' '), ('product_type', 'Pendant'), ('product_type', 'Glass Colour & Style'), ('product_type', 'Metal Finish'), ('product_type', 'Flex'), ('product_type', 'Bulb'), ('product_type', 'Ceiling Plate'), ('payment', 'Awaiting Payment'), ('payment', 'Deposit'), ('payment', 'Paid Card'), ('payment', 'Paid BACS'), ('payment', 'Paid Other'), ('payment', 'Non-Starter'), ('contact_type', 'Customer'), ('contact_type', 'Supplier');

