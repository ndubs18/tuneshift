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
        scope: 'user-read-private user-read-email user-library-read',
        client_id: spotify_client_id
    })
    res.redirect('https://accounts.spotify.com/authorize?' + queryString);
})

app.get('/spotify/callback', (req, res) => {

})

//apple music authentication
app.get('/login/applemusic', (req : any, res : any) => {

})


app.listen(port, () => {
    console.log(`Listening on port ${port} 🩵`)
})

export {};