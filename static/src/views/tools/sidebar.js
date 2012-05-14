(function() {

  define(['jquery', 'underscore', 'backbone'], function($, _, Backbone) {
    var SidebarView;
    return SidebarView = Backbone.View.extend({
      tagName: 'div',
      className: 'sidebar',
      initialize: function() {},
      events: {
        'click #select-loc': 'onSelectLocation'
      },
      render: function() {
        var _this = this;
        require(['text!templates/sidebartools.html'], function(Tools) {
          var tpl;
          tpl = _.template(Tools, "");
          return _this.$el.html(tpl);
        });
        return this;
      },
      onSelectLocation: function(evt) {
        evt.preventDefault();
        console.log("manually add a location");
        return this.trigger("selectLocation");
      }
    });
  });

}).call(this);
