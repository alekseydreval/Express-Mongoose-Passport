var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var FriendRequest = mongoose.model('friendRequest', require('../../models/friend_request.js'));
var ObjectId = mongoose.Schema.Types.ObjectId;
var p = console.log;

// POST /api/friend_requests - Create friend request
router.post('/', function (req, res, next) {
  var cb = function(err) {
    if(err)
      next(err);
    else
      res.json({});
  };

  FriendRequest.create({ _outcome: req.user._id, _income: req.body._income }, cb);
});

// GET /api/friend_requests - list friend requests
router.get('/', function(req, res, next) {

  req.user.friendsRequested(function(err, requests) {
    if(err)
      return next(err);

    res.json(requests['users']);
  });
});

//  DELETE /api/friend_requests?approve=true - approve or decline friend request
router.delete('/:user_id', function(req, res, next) {
  var isApproved = req.body.approved;

  req.user.findFriendRequestFor(req.params.user_id, function(err, friendRequest) {
    if(err)
        return next(err);

    friendRequest.respond(isApproved, function(err) {
      if(err)
        return next(err);
      res.json({});
    });

  });
  
});

module.exports = router;
