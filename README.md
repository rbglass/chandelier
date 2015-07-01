# chandelier
production management for people who produce

[![Code Climate](https://codeclimate.com/github/foundersandcoders/chandelier/badges/gpa.svg)](https://codeclimate.com/github/foundersandcoders/chandelier) [![Test Coverage](https://codeclimate.com/repos/559478e1e30ba0765b000d9e/badges/837db3f95f63ec25a2d9/coverage.svg)](https://codeclimate.com/repos/559478e1e30ba0765b000d9e/coverage) [![Build Status](https://travis-ci.org/foundersandcoders/chandelier.svg?branch=dev)](https://travis-ci.org/foundersandcoders/chandelier)

## Run
You will need a creds file of the format outlined in creds.example.json. You will also need postgres installed, a db called 'test' with a user called 'test' and a password of 'test' (if you want to populate it with dummy data) and use the url for that local postgres db in the creds file.

```
git clone https://github.com/foundersandcoders/chandelier.git
cd chandelier
npm install
npm run build
npm start
```

If you wish to populate the db with dummy data and be able to log in, go to `test/api/helpers/helpers`, comment in the 3 lines at the bottom, and run the following:
```
EMAIL=insert_your_google_email_for_login WHY=TRYING_IT_OUT node test/api/helpers/helpers.js
```

## Test
```
// all
npm test
// frontend
npm test:front
// backend
npm test:back
```

## Dev Scripts
```
npm run lint
npm run build:watch
npm run live-reload
npm run devserve
```

## Build tools
[__babel__](https://babeljs.io/) -  In our case, transpiles ES6 and JSX code to JS.

							`babel srcFile`

[__browserify__](http://browserify.org/) - lets you use the CommonJS `require` pattern in your frontend JS.
Trundles recursively through your 'requires', starting from an entry point, and outputs a single bundle of js containing all your code. Ask for that file in your HTML page, and you'll be good to go.

             `browserify srcFile -o destFile`

---
[__watchify__](https://www.npmjs.com/package/watchify) - browserify, but smarter. Only rebundles the changed parts of your
code.
             Watches your entry point for any changes and rebundles incrementally when it sees them.

              `watchify srcFile -o destFile`

---
[__babelify__](https://www.npmjs.com/package/babelify) - Babel transform for browserify.

              `browserify -t babelify srcFile -o destFile`
              `watchify -t babelify srcFile -o destFile`

---
[__live-reload__](https://www.npmjs.com/package/live-reload) - watches a directory for changes, and refreshes any HTML page currently open with a script tag pointing to the server.

              `live-reload watchPath --port 9081`

---
[__eslint__](http://eslint.org/) - lint your tings

---
[__Mocha__](http://mochajs.org/) - test framework for front- and back-end.

---
[__JSDom__]() - dom simulation for testing

---
[__rewire__]() - lets us access/set private variables in modules. Used for testing flux stores

---
[__sinon__]() - mocking, stubbing and spying tools for testing

---
[__istanbul__]() - test coverage

---


