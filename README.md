# chandelier
production management for people who produce

## Run
You will need a credentials file of the format outlined in credentials.example.json.

```
git clone https://github.com/foundersandcoders/chandelier.git
cd chandelier
npm install
npm build
npm start
```

## Test
```
// all
npm test
// frontend
npm test:front
```

## Scripts
```
npm build
npm run build:watch
npm run lint
npm run serve
```

## Build tools
[__babel__](https://babeljs.io/) -  In our case, transpiles ES6 and JSX code to JS.
							`babel srcFile

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
[__karma-browserify__](https://www.npmjs.com/package/karma-browserify) - Browserify integration for Karma.

---
[__live-reload__](https://www.npmjs.com/package/live-reload) - watches a directory for changes, and refreshes any HTML page currently open with a script tag pointing to the server.

              `live-reload watchPath --port 9081`

---
[__JSXHint__](https://github.com/STRML/JSXHint/) - lint your tings

---
[__Mocha__](http://mochajs.org/) - test framework for front- and back-end.

---
[__Karma__](https://karma-runner.github.io/0.12/index.html) - test runner for browsers

---
