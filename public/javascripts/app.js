var FriendManager = new Marionette.Application();

FriendManager.addRegions({
	searchRegion: '#js-search',
	friendsRegion: '#js-friends',
	incomeReqRegion: '#js-income',
	outcomeReqRegion: '#js-outcome'
});

window.Behaviors = {};
Marionette.Behaviors.behaviorsLookup = function() {
  return window.Behaviors;
};


FriendManager.on("start", function() {
  if(location.href.match('/friends')) {
	FriendManager.FriendsApp.List.Controller.loadFriendshipInfo();
  } else {
  	FriendManager.SearchApp.Controller.initializeUi();
  }

});

