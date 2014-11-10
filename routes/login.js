var express = require('express');
var passport = require('passport');
var mongoose = require('mongoose');
var User = mongoose.model('user', require('../models/user.js'));


module.exports.loginGet = function(req, res) {
  res.render('login');
}

module.exports.loginPost = function(req, res, next) {

  passport.authenticate('loginOrSignUp', function(err, user, authErr) {

    console.log(authErr);

    if (err) 
      return next(err);

    if (!user) {
      req.flash('error', authErr.message);
      res.redirect('/login');
    } else {
      req.logIn(user, function(err) {
        if (err) 
          return next(err);

        res.redirect('/profile');
      });
    }

  })(req, res, next);
}

module.exports.logout = function(req, res) {
  req.logout();
  res.redirect('/');
}
