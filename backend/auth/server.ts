const express = require("express");
const jwt = require("jsonwebtoken");
const cookieParser = require('cookie-parser');
const app = express();

const querystring = require('querystring');
const request = require('request');
const cors = require('cors')

//app.use(cors({ credentials: true, origin: process.env.FRONTEND_URI }));

app.use(cors());
app.use(cookieParser());

const port: any = process.env.PORT || 8080;

let spotify_redirect_uri_login: string = `${process.env.AUTH_SERVICE_BASE_URL}/spotify/callback`
let spotify_client_id: string | undefined = process.env.SPOTIFY_CLIENT_ID;
let spotify_client_secret: string | undefined = process.env.SPOTIFY_CLIENT_SECRET;
let spotify_access_token: string = '';

app.get('/', (req: any, res: any) => {
  res.send("This is not a valid route");
})

app.get('/login/spotify', (req: any, res: any) => {
  let source = req.query.source;
  let sourcePlaylistId = req.query.sourcePlaylistId;
  let sourcePlaylistName = req.query.sourcePlaylistName;

  let queryString = querystring.stringify({
    response_type: 'code',
    redirect_uri: spotify_redirect_uri_login,
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
    spotify_access_token = body.access_token;

    let uri = `${process.env.FRONTEND_URI}/transfer` || 'http://localhost:3000/transfer'

    res.cookie('access_token', spotify_access_token);

    if (source === "Apple Music") {
      res.redirect(`${uri}?source=${source}&sourcePlaylistId=${sourcePlaylistId}&sourcePlaylistName=${sourcePlaylistName}&target=Spotify`);
    } else {
      res.redirect(`${uri}?source=${source}`);
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
  let fullPath = path.resolve(__dirname, "AuthKey_ZN56MFKNYV.p8")
  console.log(`FULLPATH: ${fullPath}`

  //const private_key = fs.readFileSync(fullPath).toString();
  const private_key = fs.readFileSync('/etc/secrets/AuthKey_ZN56MFKNYV.p8');
  const team_id = 'MU3Z747TR4';
  const key_id = 'ZN56MFKNYV';
  const token = jwt.sign({}, private_key, {
    algorithm: 'ES256',
    expiresIn: '180d',
    issuer: team_id,
    header: {
      alg: 'ES256',
      kid: key_id
    }
  });
  let uri = `${process.env.FRONTEND_URI}/transfer` || 'http://localhost:3000/transfer';

  // Send the JWT as an HttpOnly cookie
  res.cookie('dev_token', token, { httpOnly: true, sameSite: 'Strict' });

  if (source === 'Spotify') {
    res.redirect(uri + `?source=${source}&sourcePlaylistId=${sourcePlaylistId}&sourcePlaylistName=${sourcePlaylistName}&target=${target}`)
  } else {
    res.redirect(uri + `?source=${source}`)
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
    let fullPath = path.resolve(__dirname, "AuthKey_ZN56MFKNYV.p8")

    const private_key = fs.readFileSync(fullPath).toString();
    const decoded = jwt.verify(token, private_key);
    res.json({ message: 'Protected data', token: token });
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }

})

app.listen(port, () => {
  console.log(`Listening on port ${port} 🩵`)
})

export { };
