/*
  List friend requests - GET /api/friend_requests
  Create friend request - POST /api/friend_requests
  Approve or decline friend request - DELETE /api/friend_requests?approve=true
 */

FriendManager.module('Entities', function (Entities, ContactManager, Backbone, Marionette, $, _) {

  Entities.FriendRequest = Backbone.Model.extend({
    idAttribute: '_id',
    urlRoot: '/api/friend_requests'
  });

  Entities.FriendRequestCollection = Backbone.Collection.extend({
    url: '/api/friend_requests',
    model: Entities.FriendRequest
  });

  var API = {

    fetchReqs: function(cb) {
      var reqs = new Entities.FriendRequestCollection;
      reqs.fetch({success: cb});
    }

  }

  FriendManager.reqres.setHandler("friendRequest:entities", API.fetchReqs);
})