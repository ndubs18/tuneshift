#  🎧 TuneShift 🎧

### Description

TuneShift is a web app created to ease the process of transferring music between Spotify and Apple Music.

## Structure

This repo is comprised of a front end client and authorization server in order to 
authenticate with the Spotify api (via OAuth2.0) and Apple's music api (MusicKit)

**backend /** folder is where the authorization server code exists

Everything else is related to the front end react client

## Environment variables

**Rename the *.env.template* to *.env* and change the values**

#### Client `.env.template`

| Key | Description |
| :--- | --- |
| REACT_APP_SERVER_URI | The uri of you server |

#### Server `/.env.template`

| Key | Description |
| :--- | --- |
| SPOTIFY_CLIENT_ID | The client id of your registered Spotify app |
| SPOTIFY_CLIENT_SECRET | The client secret |
| SPOTIFY_REDIRECT_URI | Registered redirect uri for to retrieve access token |
| TUNESHIFT_BASE_URI | The uri to redirect the client after successfull authentication |
| APPLE_TEAM_ID | Apple developer account team id |
| APPLE_KEY_ID | The id of the key created for your registered app on your Apple developer account |
| APPLE_KEY_NAME | Name of the key you created |

## For Development
**Make sure the values of respective environment variables align with webpack dev server and express server host:port**
1. Execute `npm install` in both client and server folders
2. Run `npm run build` in backend/ folder
3. Run both the client and server separately by executing
   - backend/: `node --env-file=.env auth/server.js`
   - Client folder: `npm run start`

## Available Scripts

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm run build`

Builds the app for production to the `backend/build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.
