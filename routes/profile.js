var mongoose = require('mongoose');
var User = mongoose.model('user', require('../models/user.js'));

module.exports = function(req, res) {
  if(!req.params.id)
    res.render('profile', { user: req.user });
  else
    User.findOne({ _id: req.params.id }, function(err, user) {
      res.render('profile', { user: user });
    });
}
