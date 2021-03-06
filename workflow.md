#Workflow  

My development workflow for this app goes something like this

Pull from dev -> create new (suitably named) branch -> work on local machine w/ local data, run tests as you go -> push to remote -> review changes and make pull request to dev -> if changes are all good, merge request to dev, which automatically builds and deploys to heroku

Typically I will have 3-4 terminals open: 1. npm run devserve -- this runs nodemon, watching /api 2. npm run build:watch -- this runs the css and js build tools, watching /src 3. tests 4. text editor  

This leads to files building on save.

Services used:  
Hosting: Heroku  
Authentication: Google  
Database: Heroku Postgres  


#Architecture  
The frontend is built with the flux design pattern, with the most significant stores immutable.  
Immutability is used for performance (`shouldComponentUpdate`).  
It uses superagent for HTTP requests. Generally data from a row is saved when that row loses focus.  
See the pivotal tracker board for a bug related to this.    

Resources are requested when a page-switch occurs (e.g. from jobs to a single job).

The backend is a hapi server, with models and handlers generated by functions found in `utils``.   
The generated models and handlers can have their methods overwritten if more specificity is required.    

Follow the instructions in the readme to populate the db with some dummy data so you can play around with the app.  
