const express = require("express");
const jwt = require("jsonwebtoken");
const app = express();

const querystring = require('querystring');
const request = require('request');
const cors = require('cors')
app.use(cors());

const port : any =  process.env.PORT || 8080 ;

let spotify_redirect_uri_login : string = 'http://localhost:8080/spotify/callback'
let spotify_client_id : string | undefined = process.env.SPOTIFY_CLIENT_ID;
let spotify_client_secret : string | undefined = process.env.SPOTIFY_CLIENT_SECRET;
let spofify_access_token : string = '';

app.get('/', (req : any, res: any) => {
    res.send("This is the home route");
})

app.get('/login/spotify', (req : any, res : any) => {
    let queryString = querystring.stringify({
        response_type: 'code',
        redirect_uri: spotify_redirect_uri_login,
        scope: 'user-read-private user-read-email user-library-read playlist-read-private',
        client_id: spotify_client_id
    })
    res.redirect('https://accounts.spotify.com/authorize?' + queryString);
})

app.get('/spotify/callback', (req, res) => {
    let code = req.query.code || null
    let authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      form: {
        code: code,
        redirect_uri: spotify_redirect_uri_login,
        grant_type: 'authorization_code'
      },
      headers: {
        'Authorization': 'Basic ' + (Buffer.from(
            spotify_client_id + ':' + spotify_client_secret
        ).toString('base64'))
      },
      json: true
    }
    request.post(authOptions, (error, response, body) => {
      spofify_access_token = body.access_token;
      let uri = process.env.FRONTEND_URI || 'http://localhost:3000/playlists/spotify'
      res.cookie('access_token', body.access_token);
      // res.redirect(uri + '?access_token=' + spofify_access_token)
      res.redirect(uri);
    })
})

//logic for creating jwt known as developer token
const fs = require('fs');
const path = require('path');
let fullPath = path.resolve(__dirname, "AuthKey_ZCU99CVLSD.p8")

const private_key = fs.readFileSync(fullPath).toString(); 

const team_id = 'MU3Z747TR4'; 
const key_id = 'ZCU99CVLSD'; 
const token = jwt.sign({}, private_key, {
  algorithm: 'ES256',
  expiresIn: '180d',
  issuer: team_id,
  header: {
    alg: 'ES256',
    kid: key_id
  }
});

//apple music authentication
app.get('/login/apple', (req, res) => {
  let uri = process.env.FRONTEND_URI || 'http://localhost:3000/playlists/apple'
  res.redirect(uri + '?token=' + token)
  
})

app.listen(port, () => {
    console.log(`Listening on port ${port} 🩵`)
})

export {};