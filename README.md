# Codelint - A browser based linter

[Heroku App](https://codelint.herokuapp.com/)

### To run this in your environment:
1. You will need:
   ```
   Python v3.6
   NodeJS v12.x
   nvm v0.35.3
   npm v6.4.1
   ```
2. Clone this repository by `git clone https://github.com/AnthonyTudorov/Codelint.git`
3. Install python packages by `sudo pip install -r requirements.txt` or `sudo pip3 install -r requirements.txt`
4. Install all the node packages by `npm install` 
   - If that does not work try `npm ci`
5. Create an env file named `.env` that will contain all your database credentials
   ```bash
   POSTGRES_USER='your_username'
   POSTGRES_PASSWORD='your_password'
   POSTGRES_DB='your_db_name'
   DATABASE_URL='postgresql://your_username:your_password@localhost/your_db_name'
   ```
#### Setting Up GitHub OAuth
6. Now head on over to your GitHub Account settings > Developer settings > OAuth Apps > New OAuth App.
7. Fill out the application name and application description as whatever you want. 
8. For the Homepage URL and Authorization callback URL put the URL as: `http://localhost:3000` if you did not change what port your app runs on in `app.py`
9. After you register your app, Click on Generate a new Client Secret
10. Now, copy your Client ID, Client Secret, Homepage URL and add them to the env file you created previously like:
    - If you have a different Homepage URL then replace `http://localhost:3000/` with yours.
    ```bash
    GITHUB_CLIENT_ID=your_clientid_here
    GITHUB_CLIENT_SECRET=your_clientsecret_here
    GITHUB_REDIRECT_URI=http://localhost:3000/
    ```
11. Now generate or make up random sequences of characters of any length in each sequence and put it in the env file like:
    ```
    APP_SECRET=b'\random_char_seq_1\random_char_seq_2\random_char_seq_3\random_char_seq_4\random_char_seq_5'
    ```
12. Finally, open up a python shell and do type the following commands in order:
    ```python
    from cryptography.fernet import Fernet
    f = Fernet.generate_key()
    f.decode()
    ```
    - This will generate a random a key which should look something like `'FAattgNGY88s9sh2amn9VJuceKAwB8acv7ez5kbw='`
    - Copy that key and put it in the env file **without** quotation marks:
      ```bash
      ACCESS_TOKEN_KEY=yourkeyhere
      ```
13. Your `.env` file is now finished with all the necessary credentials
14. Head over to `/src/GithubOauth.js` in your project. 
15. Change ```window.location = `${'https://github.com/login/oauth/authorize?client_id=897222f253a099754750&redirect_uri='
            + 'https://codelint.herokuapp.com/&state='}${state}&scope=repo`;```
    - Replace `897222f253a099754750` with your GitHub Client ID from your `.env` file and change `https://codelint.herokuapp.com/` to your Homepage URL from your `.env` file
16. Run the backend by `python app.py` or `python3 app.py`. This is where our server handles linting as well as authentication.
   - This should also run the front-end of the app because theres a static js file in the static folder named `bundle.min.js`
   - If you make changes to the front-end app, you will need to run `npm run watch` to observe the new changes you made
<hr />

### Deploy to Heroku:
If you don't have a Heroku account make one at https://signup.heroku.com/login.
1. Install Heroku on your system by: `npm install -g heroku`
2. Log into Heroku by `heroku login -i` and enter your credentials
3. Create a Heroku app by `heroku create`
4. Create a new file named `Procfile`
   ```heroku
   web: python app.py
       
   ```
5. To set up postgresql on Heroku
   - Go to the resources tab on Heroku's website > Click on Find more add-one > Click on heroku postgresql
6. Next, go to the settings tab in your heroku app and under the config vars enter your all these as key value pairs from your `.env` file
   ```
    GITHUB_CLIENT_ID=your_clientid_here
    GITHUB_CLIENT_SECRET=your_clientsecret_here
    GITHUB_REDIRECT_URI=your_herokulink_here
    ACCESS_TOKEN_KEY=yourkeyhere
    APP_SECRET=b'\random_char_seq_1\random_char_seq_2\random_char_seq_3\random_char_seq_4\random_char_seq_5'
    ```
7. After all this is set up run `git push heroku master` to push your app to Heroku. 
8. You should get a link from your cli, click on that and check out your app!
<hr />


#### Issues faced:
1. Implementing in app tabs was a little complicated. Rendering new tabs on new file click and opening that tab.
2. Linting from one tab would change output on all open tabs which was not ok because all tabs should have their own individual output
3. Had to spent some time on making the landing page responsive using Material UI Grid.

#### Issues resolved:
1. Finished implementing in app tabs by using Material UI. 
   - Read their documentation on how tabs work
2. Set state for the tab that requested the code to be linted. Checked that the code was sent to server by a specific tab before setting state.
   - Just debugged the problem to see what was happening and thought about this solution
3. Made page responsive by readjusting elements on the page when it resizes. 
   - Did this by reading documentation on how to use Material UI Grid.

#### Issues that still exist:
1. No issues exist that can be seen by the user on the page.
2. The file structure can be put into different folders which would help the user navigate through the code.

#### Ways to improve:
1. Add support for more linters
2. Break down `app.js` into more components to follow Downward Data Flow. 


## Work done by everyone:
### Anthony Tudorov
  - 

### Rudra Desai
- Made the landing page
- Implemented in app tabs
- Let user decide file names
- User can select theme and font size for the editor.
- Researched and implemented local storage for data persistence
- Implemented fix for eslint and pylint
- Added support for different style guide selection for eslint.
- Created the Navbar and added a dropdown component
- Added styling to the main linter page by using Material UI
- Worked with Anthony to debug problems to deploy app on Heroku

### Joel Gonzalez
- 

### Chao-Yang Cheng
- 

#### Things left to finish
- Renaming tab names when user opens a file from GitHub
