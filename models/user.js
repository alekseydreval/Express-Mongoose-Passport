var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var timestamps = require('mongoose-timestamp');
var friendRequest = require(__dirname + '/friend_request');
var crypto = require('crypto');
var _ = require('lodash');


var user = new mongoose.Schema({
  username:      { type: String, required: true, index: true, unique: true },
  password:      { type: String, required: true },
  name:          { type: String, required: true, index: true },
  surname:       { type: String, required: true, index: true },
  friendsIds:    [ mongoose.Schema.Types.ObjectId ],
  state: String  // possible values: 'added', 'pending', 'not_added'
});

user.plugin(uniqueValidator, { message: 'Error, expected {PATH} to be unique' });
user.plugin(timestamps);

user.pre('validate', function(next) {
  if(this.password)
    this.password = this.model('user').makeHash(this.password);
  next();
});


user.methods.friends = function(cb) {
  this.model('user').find({ _id: {$in: this.friendsIds } }, cb);
};

/**
 * [Finds all income and outcome requests for user 
 *  along with people requests belong to]
 * @param  {Function} cb [Passes object as a second callback parametres 
 *                        with keys 'users' and 'ids' containing people and
 *                        friend requests respectfully]
 */
user.methods.friendsRequested = function (cb) {
  var userModel = this.model('user'),
      friendRequestModel = mongoose.model('friendRequest', friendRequest),
      friendsIds = this.friendsIds;
    
  friendRequestModel.findForUser(this._id, function(err, ids) {
    var res = {};

    if(err) {
      cb(err);
    } else {

      userModel.find({ _id: {$in: ids['_income'] } }, function(err, users) {
        res['_income'] = users || [];

        userModel.find({ _id: {$in: ids['_outcome'] } }, function(err, users) {
          res['_outcome'] = users || [];

          cb(null, { users: res, ids: ids });
        });
      });
      
    }

  });

};

/**
 * [Finds friend request between two users ]
 * @param  {ObjectId}   userId [description]
 * @param  {Function} cb     [description]
 */
user.methods.findFriendRequestFor = function(userId, cb) {
  var friendRequestModel = mongoose.model('friendRequest', friendRequest);
  
  friendRequestModel.findOne({$or: [{_income: userId, _outcome: this._id},
                                 {_income: this._id, _outcome: userId }]}, cb);
  
};

/**
 * [Ends friendship causing removal of the id from friendsIds array on both models]
 * @param  {ObjectId}   id [description]
 * @param  {Function} cb [description]
 */
user.methods.endFriendship = function(id, cb) {
  var t = this;

  t.model('user').update({ _id: t.id }, { $pull: { friendsIds: id } }, function(err) {
    if(err)
      return cb(err);

    t.model('user').update({ _id: id }, { $pull: { friendsIds: t.id } }, function(err) {
      if(err)
        return cb(err);
      else
        cb();
    });

  });
}

/**
 * [Lookup users by name terms]
 * @param  {[String]}   nameTerms [Array containing strings each of which will be matched
 *                                 against 'name' or 'surname' field]
 * @param  {Function} cb          [description]
 */
user.methods.findPeopleByNameTerms = function(nameTerms, cb) {
  var nameTerms = nameTerms.trim().split(' ');
  var userModel = this.model('user');
  var myId = this._id;
  var myFriendsIds = this.friendsIds.map(function(f){ return f.toString() });
  var friendsRequested = this.friendsRequested.bind(this);

  var filterPeople = function(err, searchResults) {
    if(err)
      return cb(err);
    else {

      // Remove the user itself from search results
      console.log(searchResults)
      searchResults = _.filter(searchResults, function(u) { return !u._id.equals(myId) });
      console.log(searchResults)

      friendsRequested(function(err, usersAndIds) {
         var reqIds = usersAndIds['ids'];

        // Convert ObjectId to String
        _.each(reqIds, function(reqs, type) {
          reqIds[type] = reqs.map(function(r){ 
            return r.toString();
          });
        });

        console.log(err, reqIds, searchResults, '------');

        // Determine relation for each person to current user
        searchResults = _.map(searchResults, function(u) {
          var userId = u._id;

          if(_.contains(myFriendsIds, userId.toString()))
            u.state = 'added';
          else if(_.contains(reqIds['_outcome'], userId.toString()))
            u.state = 'pending_out';
          else if(_.contains(reqIds['_income'], userId.toString()))
            u.state = 'pending_in';
          else
            u.state = 'not_added';

          return u;
        });

        cb(null, searchResults);
        
      });
    }

  }

  if(!nameTerms.length)
    return userModel.find({}, filterPeople);

  if(nameTerms.length == 1)
    userModel.find({$or: [{ name: { $regex: nameTerms[0], $options: 'ix' } },
                                 { surname: { $regex: nameTerms[0], $options: 'ix' } } ] }, filterPeople);

  if(nameTerms.length == 2)
    userModel.find({$or: [ { $and: [ { name: { $regex: nameTerms[0], $options: 'ix' } },
                                            { surname: { $regex: nameTerms[1], $options: 'ix' } } ] },
                           { $and: [ { name: { $regex: nameTerms[1], $options: 'ix' } },
                                     { surname: { $regex: nameTerms[0], $options: 'ix' } } ] } ] }, filterPeople );

}

user.statics.makeHash = function(string){
  return crypto.createHash('md5').update(string).digest("hex").toString();
}


module.exports = user;
