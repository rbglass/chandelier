#Workflow

The development workflow for this app goes something like this

Pull from dev ->
  create new (suitably named) branch ->
    work on local machine w/ local data, committing at meaningful checkpoints w/ meaningful messages
    write & run tests as you go, writing the test before the feature
    make sure to run the full suite before committing so you know you haven't broken something ->
      push to remote branch of the same name as local branch ->
        review changes and make pull request to dev ->
         if changes are all good, merge request to dev, which automatically builds and deploys

Typically I will have 3-4 terminals open:
1. npm run devserve -- this runs nodemon, watching /api
2. npm run build:watch -- this runs the css and js build tools, watching /src
3. tests
4. text editor

In this way, the project automatically builds on save, and testing is quick.