#selection: need a table for each drop down menu

CREATE TABLE job_status(job_status text references jobs);

INSERT INTO job_status (job_status) VALUES TBC;
INSERT INTO job_status (job_status) VALUES Non-Starter;
INSERT INTO job_status (job_status) VALUES Confirmed;
INSERT INTO job_status (job_status) VALUES Packaged;
INSERT INTO job_status (job_status) VALUES Dispatched;
INSERT INTO job_status (job_status) VALUES Done;

----------------

CREATE TABLE order_type(order_type text references jobs);

INSERT INTO order_type (order_type) VALUES Standard;
INSERT INTO order_type (order_type) VALUES Bespoke;
INSERT INTO order_type (order_type) VALUES RB Parts;
INSERT INTO order_type (order_type) VALUES Outsourced;
INSERT INTO order_type (order_type) VALUES Load or Press;

----------------

CREATE TABLE parts_status(parts_status text references jobs);

INSERT INTO parts_status (parts_status) VALUES Started;
INSERT INTO parts_status (parts_status) VALUES Done;

----------------

CREATE TABLE payment(payment text references jobs);

INSERT INTO payment (payment) VALUES Awaiting payment;
INSERT INTO payment (payment) VALUES Deposit;
INSERT INTO payment (payment) VALUES Paid Card;
INSERT INTO payment (payment) VALUES Paid BACs;
INSERT INTO payment (payment) VALUES Paid Other;
INSERT INTO payment (payment) VALUES Non-Starter;


