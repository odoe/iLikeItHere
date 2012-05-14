(function() {
  var __indexOf = Array.prototype.indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  define(['jquery', 'underscore', 'backbone', 'helpers/popuphelper', 'helpers/extentfactory'], function($, _, Backbone, popup, extents) {
    var MapView;
    return MapView = Backbone.View.extend({
      tagName: 'div',
      id: 'map',
      initialize: function() {},
      render: function() {
        console.log('render the map');
        return this;
      },
      ready: function() {
        var map, orientationEvent, supportsOrientationChange, tms,
          _this = this;
        console.log('ready for map');
        map = new esri.Map(this.id, {
          infoWindow: popup.create(),
          extent: extents.losAngeles()
        });
        dojo.connect(map, "onLoad", function(_map_) {
          return _this.trigger("mapLoaded", _map_);
        });
        tms = new esri.layers.ArcGISTiledMapServiceLayer("http://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer");
        map.addLayer(tms);
        supportsOrientationChange = __indexOf.call(window, "onorientationchange") >= 0;
        orientationEvent = supportsOrientationChange ? "orientationchange" : "resize";
        return window.addEventListener(orientationEvent, function() {
          if (map != null) map.reposition();
          return map != null ? map.resize() : void 0;
        });
      }
    });
  });

}).call(this);
