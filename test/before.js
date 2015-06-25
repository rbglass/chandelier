"use strict";

process.env.NODE_ENV = "test";
process.env.TEST_URL = "postgres://test:test@localhost:5432/test";
console.log(process.env.NODE_ENV, process.env.TEST_URL);

