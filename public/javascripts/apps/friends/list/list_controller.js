FriendManager.module('FriendsApp.List', function (List, FriendManager, Backbone, Marionette, $, _) {

  List.Controller = {

  	loadFriendshipInfo: function() {

      var friendsCollection;
  		
  		FriendManager.request('friend:entities', function(friends) {
        friendsCollection = friends;
  			var friendsListView = new List.Friends({ collection: friends });
  			FriendManager.friendsRegion.show(friendsListView);  			
  		});

  		$.getJSON('/api/friend_requests', '', function(requests) {
        var income = new FriendManager.Entities.FriendRequestCollection(requests._income);
        var outcome = new FriendManager.Entities.FriendRequestCollection(requests._outcome);

  			var incomeListView = new List.Friends({ collection: income, 
                                                 childView: List.IncomeRequest,
                                               friendsColl: friendsCollection });

  			var outcomeListView = new List.Friends({ collection: outcome,
                                                  childView: List.OutcomeRequest });

  			FriendManager.incomeReqRegion.show(incomeListView);
  			FriendManager.outcomeReqRegion.show(outcomeListView);
  		});
  	}
  }
})
