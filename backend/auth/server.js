"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var jwt = require("jsonwebtoken");
var cookieParser = require('cookie-parser');
var app = express();
var querystring = require('querystring');
var request = require('request');
var cors = require('cors');
app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));
app.use(cookieParser());
var port = process.env.PORT || 8080;
var spotify_redirect_uri_login = 'http://localhost:8080/spotify/callback';
var spotify_client_id = process.env.SPOTIFY_CLIENT_ID;
var spotify_client_secret = process.env.SPOTIFY_CLIENT_SECRET;
var spotify_access_token = '';
app.get('/', function (req, res) {
    res.send("This is the home route");
});
app.get('/login/spotify', function (req, res) {
    var source = req.query.source;
    var queryString = querystring.stringify({
        response_type: 'code',
        redirect_uri: spotify_redirect_uri_login,
        scope: 'user-read-private user-read-email user-library-read playlist-read-private',
        client_id: spotify_client_id,
        state: source
    });
    res.redirect('https://accounts.spotify.com/authorize?' + queryString);
});
app.get('/spotify/callback', function (req, res) {
    var code = req.query.code || null;
    var source = req.query.state;
    var authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        form: {
            code: code,
            redirect_uri: spotify_redirect_uri_login,
            grant_type: 'authorization_code'
        },
        headers: {
            'Authorization': 'Basic ' + (Buffer.from(spotify_client_id + ':' + spotify_client_secret).toString('base64'))
        },
        json: true
    };
    request.post(authOptions, function (error, response, body) {
        spotify_access_token = body.access_token;
        // let uri = process.env.FRONTEND_URI || 'http://localhost:3000/playlists/spotify'
        var uri = process.env.FRONTEND_URI || 'http://localhost:3000/transfer';
        res.cookie('access_token', spotify_access_token);
        if (source === "Apple Music") {
            res.redirect("".concat(uri, "?source=").concat(source, "&target=Spotify"));
        }
        else {
            res.redirect(uri + '?source=' + source);
        }
    });
});
//apple music authentication
app.get('/login/apple', function (req, res) {
    var source = req.query.source;
    var target = req.query.target;
    //logic for creating jwt known as developer token
    var fs = require('fs');
    var path = require('path');
    var fullPath = path.resolve(__dirname, "AuthKey_ZN56MFKNYV.p8");
    var private_key = fs.readFileSync(fullPath).toString();
    var team_id = 'MU3Z747TR4';
    var key_id = 'ZN56MFKNYV';
    var token = jwt.sign({}, private_key, {
        algorithm: 'ES256',
        expiresIn: '180d',
        issuer: team_id,
        header: {
            alg: 'ES256',
            kid: key_id
        }
    });
    var uri = process.env.FRONTEND_URI || 'http://localhost:3000/transfer';
    // Send the JWT as an HttpOnly cookie
    res.cookie('dev_token', token, { httpOnly: true, sameSite: 'Strict' });
    if (source === 'Spotify') {
        res.redirect(uri + "?source=".concat(source, "&target=").concat(target));
    }
    else {
        res.redirect(uri + "?source=".concat(source));
    }
});
app.get('/protected', function (req, res) {
    var token = req.cookies.dev_token;
    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }
    try {
        var fs = require('fs');
        var path = require('path');
        var fullPath = path.resolve(__dirname, "AuthKey_ZN56MFKNYV.p8");
        var private_key = fs.readFileSync(fullPath).toString();
        var decoded = jwt.verify(token, private_key);
        res.json({ message: 'Protected data', token: token });
    }
    catch (err) {
        res.status(401).json({ message: 'Invalid token' });
    }
});
app.listen(port, function () {
    console.log("Listening on port ".concat(port, " \uD83E\uDE75"));
});
