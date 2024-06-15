const express = require("express");
const app = express();

const querystring = require('querystring');
const request = require('request');
const cors = require('cors')
app.use(cors());

const port : any =  process.env.PORT || 8080 ;

let spotify_redirect_uri_login : string = 'http://localhost:8080/spotify/callback'
let spotify_client_id : string | undefined = process.env.SPOTIFY_CLIENT_ID;
let spotify_client_secret : string | undefined = process.env.SPOTIFY_CLIENT_SECRET;

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
    request.post(authOptions, function(error, response, body) {
      var access_token = body.access_token
      let uri = process.env.FRONTEND_URI || 'http://localhost:3000/playlist'
      console.log(`retrieved access token: ${access_token}`);

      res.redirect(uri + '?access_token=' + access_token)
    })
})

//apple music authentication
app.get('/login/applemusic', (req : any, res : any) => {

})


app.listen(port, () => {
    console.log(`Listening on port ${port} 🩵`)
})

export {};