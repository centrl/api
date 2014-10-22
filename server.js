var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var morgan = require('morgan');
var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var mongoskin = require('mongoskin');
var yaml = require('js-yaml');
var fs = require('fs');
var util = require('util');

var configFile = yaml.safeLoad(fs.readFileSync('./config/config.yml', 'utf8'));
// Hard coding environment for now...
var config = configFile.local;

var dbConnectUrl = [
    'mongodb://',config.db.user,':',config.db.pass,'@',config.db.url,':',config.db.port,'/',config.db.name
].join('');

var db = mongoskin.db(dbConnectUrl, {
    safe: true
});

/** Controllers **/
var usersController = require('./controllers/users')(db);
var notificationController = require('./controllers/notifications');
var authController = require('./controllers/auth')(db);

var app = express();
app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({ secret: config.session }));
app.use(passport.initialize());
app.use(passport.session());

app.get('/auth',passport.authenticate('google', { scope: [
    config.providers.google.profileAP,
    config.providers.google.emailAP
]}), function(req, res) {});

app.get('/auth/callback', passport.authenticate('google', { failureRedirect: '/auth/fail'}), authController.callback);
app.get('/auth/fail', authController.fail);
app.get('/auth/success', authController.success);

app.param('project', function(req, res, next, project){
    req.collection = db.collection('notifications');
    req.project = project;

    return next();
});

/** Routing **/
app.get('/:project/notifications', notificationController.findAll);
app.get('/:project/notification/:id', notificationController.findOne);
app.post('/:project/notification', notificationController.insert);
app.post('/:project/notification/send/:id', notificationController.send);
app.put('/:project/notification/:id', notificationController.update);
app.delete('/:project/notification/:id', notificationController.delete);

/** Start Server **/
app.listen(config.api.port);
