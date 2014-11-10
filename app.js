var express = require('express');
var expressSession = require('express-session');
var flash = require('connect-flash');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var _ = require('lodash');
var helpers = require('./helpers');
var auth = require('./auth')
var checkAuthorized = auth.checkAuthorized;
var passport = require('passport');
var less = require('less-middleware');

mongoose.connect('mongodb://localhost');

var index = require('./routes/index');
var login = require('./routes/login');
var profile = require('./routes/profile');
var friends = require('./routes/friends');
var search = require('./routes/search');
var friendsApi = require('./routes/api/friends');
var friendRequestsApi = require('./routes/api/friend_requests');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(expressSession({ secret: 'keyboard cat' }));
app.use(passport.initialize());
app.use(passport.session({cookie: { maxAge : 3600000 }}));
app.use(flash());
app.use(less( path.join(__dirname, 'public'), { force: true, compress: true }));
app.use(express.static(path.join(__dirname, 'public')));


// Pass some useful local variables to template
app.use(function(req, res, next) {
  res.locals = _.merge(res.locals, helpers);
  res.locals.url = req.url;
  res.locals.success_messages = req.flash('success');
  res.locals.error_messages = req.flash('error');
  next();
});

// Trim form data
app.use(function(req, res, next) {
  if(req.body) {
    _.each(req.body, function(val, key) {
        req.body[key] = val.replace(/ /g, "")
    });
  }
  next();
});

app.get('/', index);
app.get('/login', login.loginGet);
app.post('/login', login.loginPost);
app.get('/logout', login.logout);
app.get('/profile/:id?', checkAuthorized, profile);
app.get('/friends',  checkAuthorized, friends);
app.get('/search',  checkAuthorized, search);
app.use('/api/friends', checkAuthorized, friendsApi);
app.use('/api/friend_requests', checkAuthorized, friendRequestsApi);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers
app.use(function(err, req, res, next) {
    var errorExposed = app.get('env') == 'development' ? err : {};

    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: errorExposed
    });
});

app.listen(3000)
module.exports = app;
