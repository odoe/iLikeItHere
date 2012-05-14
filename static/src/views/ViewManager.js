(function() {

  define(['jquery', 'underscore', 'backbone', 'views/map/MapView', 'views/tools/sidebar'], function($, _, Backbone, MapView, Sidebar) {
    var ViewManager;
    return ViewManager = Backbone.View.extend({
      el: $('#container'),
      render: function() {
        var mv,
          _this = this;
        dojo.require("esri.dijit.Popup");
        mv = new MapView();
        this.$el.append(mv.render().el);
        dojo.addOnLoad(function() {
          mv.ready();
          return mv.on("mapLoaded", function(map) {
            var sidebar;
            _this.map = map;
            console.log("map has been loaded", _this.map);
            _this.map.infoWindow.resize(130, 30);
            sidebar = new Sidebar();
            _this.$el.prepend(sidebar.render().el);
            return sidebar.on('selectLocation', function() {
              return _this.addLocation();
            });
          });
        });
        return this;
      },
      addLocation: function() {
        var getMarker, handle,
          _this = this;
        getMarker = function(votes) {
          return {
            url: votes < 10 ? "img/gpsmapicons06_blue.png" : "img/gpsmapicons06_red.png",
            height: votes < 5 ? 32 : 42,
            width: votes < 5 ? 32 : 42,
            yoffset: votes < 5 ? 16 : 21,
            type: "esriPMS"
          };
        };
        console.log('add new location to map', this.map);
        return handle = dojo.connect(this.map, 'onClick', function(evt) {
          dojo.disconnect(handle);
          return require(['views/infowindows/location'], function(LocationView) {
            var attr, graphic, info, pms, symbol, template;
            console.log('map click', evt);
            pms = getMarker(1);
            symbol = new esri.symbol.PictureMarkerSymbol(pms);
            attr = {
              votes: 1
            };
            info = new LocationView();
            console.log("info template content", info);
            template = new esri.InfoTemplate('Vote!', info.render(attr).el);
            graphic = new esri.Graphic(evt.mapPoint, symbol, attr);
            graphic.setInfoTemplate(template);
            _this.map.graphics.add(graphic);
            console.log("graphic added", graphic);
            return info.on("upVote", function(count) {
              return graphic.setSymbol(new esri.symbol.PictureMarkerSymbol(getMarker(count)));
            });
          });
        });
      }
    });
  });

}).call(this);
