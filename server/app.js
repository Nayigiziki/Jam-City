/**
 *Main application file
 */
 
'use strict';
var express = require('express'),
    app = express(),
    port = 8080,
    SpotifyWebApi = require('spotify-web-api-node'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    methodOverride = require('method-override'),
    session = require('express-session'),
    passport = require('passport'),
    passportSpotify=require('passport-spotify'),
    SpotifyStrategy = require('./spotifyAuth/lib/passport-spotify/index').Strategy,
    keys = require('./keys.js'),
    clientID = keys.clientID,
    clientSecret = keys.clientSecret,
    userInfo = {},

    spotifyApi = new SpotifyWebApi({
      clientId : clientID,
      clientSecret : clientSecret,
      redirectUri : 'http://jamm-city.com/callback'
    });


    passport.serializeUser(function(user, done) {
      console.log('user ', user)
      userInfo.displayName = user.displayName;
      userInfo.profilePic = user.photos[0];
      userInfo.url = user.profileUrl;
      done(null, user);
    });
    passport.deserializeUser(function(sessionUser, done) {
      done(null, sessionUser);
    });
    passport.use(new SpotifyStrategy({
      clientID: clientID,
      clientSecret: clientSecret,
      callbackURL: 'http://jamm-city.com/callback'
    }, function(accessToken, refreshToken, profile, done) {
        process.nextTick(function () {
          spotifyApi.setAccessToken(accessToken);
          return done(null, profile);
        });
    }));

    app.use(function(req, res, next){
        console.log(req.isAuthenticated());
        if (req.url === '/' && req.isAuthenticated()) {
            // var isAuth = true;
            console.log('authenticated in app use');
            res.redirect('/jamCity.html');
        } else {
            console.log('no authenticated in app use');

            next();
            // var isAuth = false;
        }
        // var isAuthenticated = {
        //     authenticated: isAuth
        // };
        // res.status(200).json({isAuthenticated, userInfo});
    });
    
    app.use(express.static(__dirname + '/../client'));
    app.use(cookieParser());
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(methodOverride());
    app.use(session({ secret: 'keyboard cat' }));
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(function(req, res, next){
      // console.log('req session obj', req.session);
      next();
    });
    require('./spotifyAuth/spotifyController.js')(app, express, passport, spotifyApi, userInfo);
    console.log('Jam City on port ', port);
    app.listen(port);
    exports = module.exports = app;
