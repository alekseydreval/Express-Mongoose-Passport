FriendManager.module('SearchApp', function (SearchApp, FriendManager, Backbone, Marionette, $, _) {

  SearchApp.Controller = {

    initializeUi: function() {
      var searchView = new SearchApp.SearchGlobalView({ collection: new FriendManager.Entities.FriendCollection() });
      FriendManager.searchRegion.show(searchView);        
    }
  };
});