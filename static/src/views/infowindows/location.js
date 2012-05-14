(function() {

  define(['jquery', 'underscore', 'backbone', 'text!templates/infowindows/location.html'], function($, _, Backbone, locationTemplate) {
    var LocationView;
    return LocationView = Backbone.View.extend({
      tagName: 'div',
      className: 'infoView',
      events: {
        "click #btnVote": "onVote"
      },
      render: function(attr) {
        var info;
        this.attr = attr;
        info = _.template(locationTemplate, this.attr);
        this.$el.html(info);
        return this;
      },
      onVote: function() {
        this.attr.votes++;
        if (this.attr.votes > 5) this.trigger("upVote", this.attr.votes);
        return this.render(this.attr);
      }
    });
  });

}).call(this);
