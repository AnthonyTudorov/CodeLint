# Codelint - A browser based linter

[Heroku App](http://codelint.herokuapp.com/)

- To run **frontend**: `npm run dev`
    - Alternatively use `npm run watch` if on AWS cloud9
- To run **backend**: `python app.py`

- To enable Github Oauth create an app at: <https://github.com/settings/applications/new>
    - Set homepage url and callback url to app's root
    - Create client secret
    - Store client id and client secret in .env file as GITHUB\_CLIENT\_ID and GITHUB\_CLIENT\_SECRET respectively
    - Change client id in GithubOauth.js

#### Troubleshooting:
- Change ports as needed (app.py, Socket.js)

## Work done by everyone:

### Anthony Tudorov
- Implemented github oauth
- Implemented github api
- Unit testing for github oauth, github api, and database
- Created server side socket events for github oauth, github api and user data
- Provided protection against cross-site forgery attacks through state parameter check

### Rudra Desai
- Set up the project boilerplate, set up CI/CD to automatically deploy to Heroku 
- Implemented pylint, eslint in the backend so that the user can lint their code
- Implemented dropdown menus for selecting a repo/file from GitHub
- Unit testing for `app.py`, `lint.py`
- Connected backend socket emits to frotend so that our frontend can communicate and work with backend
- Worked with Anthony to deploy the project and fix minor bugs

### Joel Gonzalez
- Made a simple and intuitive design for the front-end using a combination of React, HTML, CSS
- Created the first and second drafts of the webpage
- Implemented the link to GitHub button using Anthony's oauth work and created the simple Navbar
- Implemented the input field, (ace-editor) where all the linting takes place.

### Chao-Yang Cheng
- Implement database structure
- Combine database and with Anthony's github oauth work
- Import db to back-end and connect server calls to database

#### Things left to finish
- Implement a fix button for eslint that would automatically fix some errors in the code inputted by the user
