/*
  List friends - GET /api/friends
  End friendship - DESTROY /api/friends/:friend_id
 */


FriendManager.module('Entities', function (Entities, ContactManager, Backbone, Marionette, $, _) {

  Entities.Friend = Backbone.Model.extend({
    idAttribute: '_id',
    urlRoot: '/api/friends'
  });

  Entities.FriendCollection = Backbone.Collection.extend({
    url: '/api/friends',
    model: Entities.Friend,
    comparator: 'name'
  });

  var API = {

    fetchFriends: function(cb) {
      var friends = new Entities.FriendCollection;
      friends.fetch({success: cb});
    }

  }

  FriendManager.reqres.setHandler("friend:entities", API.fetchFriends);
})