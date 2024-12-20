const express = require("express");
const session = require("express-session")
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const app = express();

const path = require("path")
const querystring = require("querystring");
const request = require("request");
const cors = require("cors")

app.use(cors({ credentials: true }));
app.use(express.static(path.join(__dirname, '../build')))
app.use(cookieParser());

const port: any = process.env.PORT || 8080;

let spotify_redirect_uri: string | undefined = process.env.SPOTIFY_REDIRECT_URI;
let spotify_client_id: string | undefined = process.env.SPOTIFY_CLIENT_ID;
let spotify_client_secret: string | undefined = process.env.SPOTIFY_CLIENT_SECRET;
let apple_team_id: string | undefined = process.env.APPLE_TEAM_ID;
let tuneshift_base_uri: string | undefined = process.env.TUNESHIFT_BASE_URI;
let apple_key_id: string | undefined = process.env.APPLE_KEY_ID;
let apple_key_name: string | undefined = process.env.APPLE_KEY_NAME;
let spotify_access_token: string = '';
let spotify_refresh_token: string = '';

app.get('/login/spotify', (req: any, res: any) => {
  let source = req.query.source;
  let sourcePlaylistId = req.query.sourcePlaylistId;
  let sourcePlaylistName = req.query.sourcePlaylistName;

  let queryString = querystring.stringify({
    response_type: 'code',
    redirect_uri: spotify_redirect_uri,
    scope: 'user-read-private user-read-email user-library-read playlist-read-private playlist-modify-public playlist-modify-private',
    client_id: spotify_client_id,
    state: source + '&' + sourcePlaylistId + '&' + sourcePlaylistName
  })
  res.redirect('https://accounts.spotify.com/authorize?' + queryString);
})

app.get('/spotify/callback', (req, res) => {

  let code = req.query.code || null;
  let state = req.query.state;

  let [source, sourcePlaylistId, sourcePlaylistName] = state.split("&");

  let authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    form: {
      code: code,
      redirect_uri: spotify_redirect_uri,
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
    spotify_access_token = body.access_token;
    spotify_refresh_token = body.refresh_token;

    let uri = tuneshift_base_uri;

    res.cookie('access_token', spotify_access_token, {
      secure: true,
      sameSite: 'none',
    });

    if (source === "Apple Music") {
      res.redirect(`${uri}/transfer?source=${source}&sourcePlaylistId=${sourcePlaylistId}&sourcePlaylistName=${sourcePlaylistName}&target=Spotify`);
    } else {
      res.redirect(`${uri}/transfer?source=${source}`);
    }
  })
})

//apple music authentication
app.get('/login/apple', (req, res) => {
  let source = req.query.source;
  let sourcePlaylistId = req.query.sourcePlaylistId;
  let sourcePlaylistName = req.query.sourcePlaylistName;
  let target = req.query.target;

  //logic for creating jwt known as developer token
  const fs = require('fs');
  const path = require('path');
  let fullPath = path.resolve(__dirname, `../${apple_key_name}`)

  const private_key = fs.readFileSync(fullPath);
  const team_id = apple_team_id;
  const key_id = apple_key_id;
  const token = jwt.sign({}, private_key, {
    algorithm: 'ES256',
    expiresIn: '180d',
    issuer: team_id,
    header: {
      alg: 'ES256',
      kid: key_id
    }
  });
  let uri = tuneshift_base_uri;

  // Send the JWT as an HttpOnly cookie
  res.cookie('dev_token', token, { httpOnly: true, sameSite: 'Strict' });

  if (source === 'Spotify') {
    res.redirect(`${uri}/transfer?source=${source}&sourcePlaylistId=${sourcePlaylistId}&sourcePlaylistName=${sourcePlaylistName}&target=${target}`)
  } else {
    res.redirect(`${uri}/transfer?source=${source}`)
  }
})

app.get('/protected', (req, res) => {
  const token = req.cookies.dev_token;

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const fs = require('fs');
    const path = require('path');
    let fullPath = path.resolve(__dirname, `../${apple_key_name}`)
    const private_key = fs.readFileSync(fullPath);
    const decoded = jwt.verify(token, private_key);
    res.json({ message: 'Protected data', token: token });
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }

})

app.get('*', function(req, res) {
  res.sendFile('index.html', { root: path.join(__dirname, '../build/') });
});


app.listen(port, () => {
  console.log(`Listening on port ${port} 🩵`)
})
