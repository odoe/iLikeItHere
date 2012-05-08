(function() {

  define(['jquery', 'underscore', 'backbone', 'views/map/MapView'], function($, _, Backbone, MapView) {
    var ViewManager;
    return ViewManager = Backbone.View.extend({
      el: $('#container'),
      render: function() {
        var mv;
        mv = new MapView();
        this.$el.append(mv.render().el);
        dojo.addOnLoad(function() {
          return mv.ready();
        });
        return this;
      }
    });
  });

}).call(this);
