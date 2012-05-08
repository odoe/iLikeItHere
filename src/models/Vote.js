(function() {

  define(['jquery', 'underscore', 'backbone'], function($, _, Backbone) {
    var Vote;
    return Vote = Backbone.Model.extend({
      url: function() {
        return "documents/" + (this.id ? this.id : '');
      }
    });
  });

}).call(this);
