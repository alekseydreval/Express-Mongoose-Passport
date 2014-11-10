FriendManager.module('FriendsApp.List', function (List, FriendManager, Backbone, Marionette, $, _) {

  window.Behaviors.decline = Marionette.Behavior.extend({
    events: {
      'click .js-decline' : 'decline'
    },

    decline: function(e) {
      e.preventDefault();
      this.view.model.destroy();
    }
    
  });


  List.IncomeRequest = Marionette.ItemView.extend({
    tagName: "li",
    template: "#req-income-list-item",
    behaviors: { decline: {} },

    events: {
      'click .js-approve' : 'approve'
    },

    approve: function(e) {
      var t = this;
      e.preventDefault();
      this.model.destroy({data: 'approved=true', success: function() { 
        t.options.friendsColl.fetch(); 
      }});
    },

  });


  List.OutcomeRequest = Marionette.ItemView.extend({
    tagName: "li",
    template: "#req-outcome-list-item",
    behaviors: { decline: {} }
  });


  List.Friend = Marionette.ItemView.extend({
    tagName: "li",
    template: "#friend-list-item",
    behaviors: { decline: {} }
  });


  List.Friends = Marionette.CollectionView.extend({
    tagName: "ul",
    childView: List.Friend,

    onBeforeAddChild: function(childView){
      childView.options.friendsColl = this.options.friendsColl;
    }

  });
})
