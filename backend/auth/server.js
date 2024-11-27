var express = require("express");
var session = require("express-session");
var jwt = require("jsonwebtoken");
var cookieParser = require("cookie-parser");
var app = express();
var path = require("path");
var querystring = require("querystring");
var request = require("request");
var cors = require("cors");
app.use(cors({ credentials: true }));
//app.use(express.static(path.join(__dirname, '../build')))
app.use(cookieParser());
var port = process.env.PORT || 8080;
var spotify_redirect_uri = process.env.SPOTIFY_REDIRECT_URI;
var spotify_client_id = process.env.SPOTIFY_CLIENT_ID;
var spotify_client_secret = process.env.SPOTIFY_CLIENT_SECRET;
var spotify_access_token = '';
var spotify_refresh_token = '';
app.get('/login/spotify', function (req, res) {
    var source = req.query.source;
    var sourcePlaylistId = req.query.sourcePlaylistId;
    var sourcePlaylistName = req.query.sourcePlaylistName;
    var queryString = querystring.stringify({
        response_type: 'code',
        redirect_uri: spotify_redirect_uri,
        scope: 'user-read-private user-read-email user-library-read playlist-read-private playlist-modify-public playlist-modify-private',
        client_id: spotify_client_id,
        state: source + '&' + sourcePlaylistId + '&' + sourcePlaylistName
    });
    res.redirect('https://accounts.spotify.com/authorize?' + queryString);
});
app.get('/spotify/callback', function (req, res) {
    var code = req.query.code || null;
    var state = req.query.state;
    var _a = state.split("&"), source = _a[0], sourcePlaylistId = _a[1], sourcePlaylistName = _a[2];
    var authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        form: {
            code: code,
            redirect_uri: spotify_redirect_uri,
            grant_type: 'authorization_code'
        },
        headers: {
            'Authorization': 'Basic ' + (Buffer.from(spotify_client_id + ':' + spotify_client_secret).toString('base64'))
        },
        json: true
    };
    request.post(authOptions, function (error, response, body) {
        spotify_access_token = body.access_token;
        spotify_refresh_token = body.refresh_token;
        var uri = process.env.TUNESHIFT_BASE_URI || 'http://localhost:3000';
        res.cookie('access_token', spotify_access_token, {
            secure: true,
            sameSite: 'none',
        });
        if (source === "Apple Music") {
            res.redirect("".concat(uri, "/transfer?source=").concat(source, "&sourcePlaylistId=").concat(sourcePlaylistId, "&sourcePlaylistName=").concat(sourcePlaylistName, "&target=Spotify"));
        }
        else {
            res.redirect("".concat(uri, "/transfer?source=").concat(source));
        }
    });
});
//apple music authentication
app.get('/login/apple', function (req, res) {
    var source = req.query.source;
    var sourcePlaylistId = req.query.sourcePlaylistId;
    var sourcePlaylistName = req.query.sourcePlaylistName;
    var target = req.query.target;
    //logic for creating jwt known as developer token
    var fs = require('fs');
    var path = require('path');
    var fullPath = path.resolve(__dirname, "../AuthKey_65643T9H2N.p8");
    var private_key = fs.readFileSync(fullPath);
    var team_id = 'MU3Z747TR4';
    var key_id = '65643T9H2N';
    var token = jwt.sign({}, private_key, {
        algorithm: 'ES256',
        expiresIn: '180d',
        issuer: team_id,
        header: {
            alg: 'ES256',
            kid: key_id
        }
    });
    var uri = process.env.TUNESHIFT_BASE_URI || 'http://localhost:3000';
    // Send the JWT as an HttpOnly cookie
    res.cookie('dev_token', token, { httpOnly: true, sameSite: 'Strict' });
    if (source === 'Spotify') {
        res.redirect("".concat(uri, "/transfer?source=").concat(source, "&sourcePlaylistId=").concat(sourcePlaylistId, "&sourcePlaylistName=").concat(sourcePlaylistName, "&target=").concat(target));
    }
    else {
        res.redirect("".concat(uri, "/transfer?source=").concat(source));
    }
});
app.get('/protected', function (req, res) {
    var token = req.cookies.dev_token;
    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }
    try {
        var fs = require('fs');
        var path_1 = require('path');
        var fullPath = path_1.resolve(__dirname, "../AuthKey_65643T9H2N.p8");
        var private_key = fs.readFileSync(fullPath);
        var decoded = jwt.verify(token, private_key);
        res.json({ message: 'Protected data', token: token });
    }
    catch (err) {
        res.status(401).json({ message: 'Invalid token' });
    }
});
/*
app.get('*', function(req, res) {
  res.sendFile('index.html', { root: path.join(__dirname, '../build/') });
});
*/
app.listen(port, function () {
    console.log("Listening on port ".concat(port, " \uD83E\uDE75"));
});
