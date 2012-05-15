(function() {

  define(['jquery', 'underscore', 'backbone'], function($, _, Backbone) {
    var Vote;
    return Vote = Backbone.Model.extend({
      idAttribute: "_id",
      url: function() {
        return "documents/esrijs" + (this.id ? '/' + this.id : '');
      }
    });
  });

}).call(this);
