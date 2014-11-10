FriendManager.module('SearchApp', function (SearchApp, FriendManager, Backbone, Marionette, $, _) {

  SearchApp.SearchItemView = Marionette.ItemView.extend({
  	
  	template: '#search-list-item',
  	tagName: 'li',

  	modelEvents: {
  	  'destroy': 'remove'
  	},

  	events: {
  	  'click .js-remove': 'endFriendship',
  	  'click .js-add': 'proposeFriendship'
  	},

  	endFriendship: function() {
  		this.model.destroy();
  	},

  	proposeFriendship: function() {
  		var t = this;
  		var friendRequest = new FriendManager.Entities.FriendRequest();

  		friendRequest.set('_income', t.model.id);
  		friendRequest.save({}, { success: function(){ t.model.destroy() } });
  	}


  });
  
  SearchApp.SearchGlobalView = Marionette.CompositeView.extend({
  	tagName: 'div',
  	className: 'grid-container',
  	template: '#search',
  	childView: SearchApp.SearchItemView,
  	childViewContainer: '#search-list',

  	events: {
  	  'keyup #js-search': 'findFriends'
  	},

  	findFriends: function(e) {
  		var query = $(e.target).val();
  		var t = this;

  		t.collection.fetch({ reset: true, data: { q: query } });
  	},
  });

});