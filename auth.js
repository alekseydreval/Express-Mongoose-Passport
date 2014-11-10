var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
var User = mongoose.model('user', require('./models/user.js'));

passport.serializeUser(function(user, done) {
  console.log(user)
  done(null, user._id);
});

passport.deserializeUser(function(id, done) {
  User.findOne({ _id: id }, done);
});


passport.use('loginOrSignUp', new LocalStrategy({ passReqToCallback: true },
  function(req, username, password, done) {

    var regData = req.body;

    User.findOne({username: username}, function(err, user) {
        if (err) 
          return done(err);

        if (!user) {
            User.create(regData, function(err, createdUser) {
              if(err)
                done(null, false, { message: err.errors });
              else
                done(null, createdUser);
            });
        } 
        else if(user.password != User.makeHash(password))
          done(null, false, { message: 'Invalid password' });
        else
          done(null, user);
    });
  }
));

module.exports.checkAuthorized = function(req, res, done) {
  if (req.isAuthenticated())
    done();
  else
    res.redirect('/login');
};
