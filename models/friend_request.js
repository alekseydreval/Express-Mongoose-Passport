var _ = require('lodash');
var mongoose = require('mongoose');
var user = require(__dirname + '/user');


var friendRequest = new mongoose.Schema({
  _income: mongoose.Schema.Types.ObjectId,
  _outcome: mongoose.Schema.Types.ObjectId
});


/**
 * [Finds all income amd outcome requests for a given user]
 * @param  {ObjectId}   user_id [description]
 * @param  {Function} cb      [Passes object as a second callback parametres 
 *                             with keys '_income' and '_outcome' containing matching requests ]
 */
friendRequest.statics.findForUser = function(user_id, cb) {
	var query = { $or: [{ _income: user_id }, 
  		                { _outcome: user_id }] };

  	this.find(query, function(err, requests) {

  		if(err) return cb(err);

  		var groupedRequests = {};
  		groupedRequests['_income'] = [];
  		groupedRequests['_outcome'] = [];

		// Group requests: requests['_income'] and requests['_outcome]
  		requests.forEach(function(req) {
	  		if(req._income.equals(user_id))
	  			groupedRequests['_income'].push(req._outcome);
	  		else
	  			groupedRequests['_outcome'].push(req._income);
  		});

	  	cb(null, groupedRequests);
  	});
}



/**
 * [Respond to request and delete this FriendRequest model]
 * @param  {Boolean}  isAccepted
 * @param  {Function} cb
 */
friendRequest.methods.respond = function(isAccepted, cb) {
	var from = this._income,
		to = this._outcome,
	    userModel = mongoose.model('user'),
	    t = this;

	if(!isAccepted)
		return t.remove(cb);
	
    userModel.findOneAndUpdate({ _id: from }, { $push: { friendsIds: to } }, function(err) {
    	if (err) return cb(err);

    	userModel.findOneAndUpdate({ _id: to }, { $push: { friendsIds: from } }, function(err) {
	    	if (err) 
	    		cb(err);
	    	else
	    		t.remove(cb);
    	});
	});

}

module.exports = friendRequest;
