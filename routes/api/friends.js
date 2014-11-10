var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var User = mongoose.model('user', require('../../models/user.js'));

// GET /api/friends/?q=<query> - search for friend
var friendsSearch = function (req, res, done) {
  if(typeof req.query.q == 'undefined')
    return done();

  req.user.findPeopleByNameTerms(req.query.q, function(err, users) {
    if(err)
      done(err);
    else {
      res.json(users);
    }
  });

};


// GET /api/friends - list friends
router.get('/', friendsSearch, function (req, res, done) {
  req.user.friends(function(err, friends) {
    if(err)
      done(err);
    else 
      res.json(friends);
  });
});


// DELETE /api/friends/:id - end friendship
router.delete('/:id', function(req, res, done) {
  req.user.endFriendship(req.params.id, function(err) {
    if(err)
      done(err);
    else
      res.json({});
  });
});

module.exports = router;
