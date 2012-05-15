(function() {

  define(['jquery', 'underscore', 'backbone', 'models/Vote'], function($, _, Backbone, Vote) {
    var VoteCollection;
    return VoteCollection = Backbone.Collection.extend({
      model: Vote,
      url: function() {
        return "documents" + (this.id ? '/' + this.id : '');
      }
    });
  });

}).call(this);
