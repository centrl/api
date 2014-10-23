var express = require('express');
var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var yaml = require('js-yaml');
var fs = require('fs');
var util = require('util');

var app = express();


module.exports = function(db) {

    var usersController = require('./users')(db);
    var configFile = yaml.safeLoad(fs.readFileSync('./config/config.yml', 'utf8'));
    // Hard coding environment for now...
    var config = configFile.local;

    passport.serializeUser(function(user, done) {
        done(null, user.uid);
    });

    passport.deserializeUser(function(uid, done) {
        usersController.findOne(uid, function(err, user) {
            if (err) {
                return done(err);
            }

            done(null, user);
        });
    });

    passport.use(new GoogleStrategy({
        clientID: config.providers.google.clientID,
        clientSecret: config.providers.google.clientSecret,
        callbackURL: 'http://localhost:3000/' + config.auth.callback
    },function(accessToken, refreshToken, profile, done) {
        var json = profile._json;
        var userObj = {
            uid: json.id,
            provider: profile.provider,
            name: json.name,
            email: json.email,
            picture: json.picture,
            gender: json.gender,
            locale: json.locale,
            dateJoined: new Date().getTime(),
            lastUpdated: new Date().getTime(),
            lastVisit: new Date().getTime(),
            accessToken: accessToken,
            refreshToken: refreshToken,
            projects: []
        };

        process.nextTick(function() {
            usersController.findOrCreate(userObj, function(err, user) {
                if (err) {
                    return done(err);
                }

                return done(null, user);
            });
        });
    }));

    return {
        callback: function(req, res) {
            res.redirect('/auth/success');
        },

        success: function(req, res) {
            res.send(req.user);
        },

        fail: function(req, res) {
            res.send(':(');
        },

        logout: function(req, res) {
            req.logout();

            res.redirect('/');
        },

        ensureAuthenticated: function(req, res, next) {
            if (req.isAuthenticated()) {
                return next();
            }

            res.redirect('/');
        }
    };
};
