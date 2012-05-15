(function() {

  define(['jquery', 'underscore', 'backbone', 'views/map/MapView', 'views/tools/sidebar', 'collections/VoteCollection'], function($, _, Backbone, MapView, Sidebar, VoteCollection) {
    var ViewManager;
    return ViewManager = Backbone.View.extend({
      el: $('#container'),
      render: function() {
        var mv,
          _this = this;
        dojo.require("esri.dijit.Popup");
        mv = new MapView();
        this.$el.append(mv.render().el);
        this.voteCount = 0;
        dojo.addOnLoad(function() {
          mv.ready();
          return mv.on("mapLoaded", function(map) {
            var collection, sidebar;
            _this.map = map;
            console.log("map has been loaded", _this.map);
            _this.map.infoWindow.resize(130, 30);
            sidebar = new Sidebar();
            _this.$el.prepend(sidebar.render().el);
            sidebar.on('selectLocation', function() {
              return _this.addLocation();
            });
            collection = new VoteCollection();
            return collection.fetch({
              data: $.param({
                type: "esri"
              }),
              success: function() {
                console.log("jquery fetched!", collection);
                return collection.each(function(model) {
                  return require(['views/infowindows/location'], function(LocationView) {
                    var feat, g, geom, info, mp, sym, template;
                    feat = model.toJSON();
                    geom = esri.geometry.fromJson(feat.geometry);
                    mp = esri.geometry.geographicToWebMercator(geom);
                    sym = new esri.symbol.PictureMarkerSymbol(_this.getMarker(feat.attributes.votes));
                    g = new esri.Graphic(mp, sym, feat.attributes);
                    info = new LocationView();
                    console.log("info template content", info);
                    template = new esri.InfoTemplate('Vote!', info.render(feat.attributes).el);
                    g.setInfoTemplate(template);
                    _this.map.graphics.add(g);
                    return info.on("upVote", function(count) {
                      model.set({
                        attributes: {
                          votes: count
                        }
                      });
                      g.setSymbol(new esri.symbol.PictureMarkerSymbol(_this.getMarker(count)));
                      return model.save({}, {
                        success: function(m) {
                          return console.log("vote saved!", m.toJSON());
                        }
                      });
                    });
                  });
                });
              }
            });
          });
        });
        return this;
      },
      getMarker: function(votes) {
        votes = parseInt(votes);
        console.log("votes", votes);
        return {
          url: votes < 10 ? "img/gpsmapicons06_blue.png" : "img/gpsmapicons06_red.png",
          height: votes < 5 ? 32 : 42,
          width: votes < 5 ? 32 : 42,
          yoffset: votes < 5 ? 16 : 21,
          type: "esriPMS"
        };
      },
      addLocation: function() {
        var handle,
          _this = this;
        console.log('add new location to map', this.map);
        return handle = dojo.connect(this.map, 'onClick', function(evt) {
          dojo.disconnect(handle);
          return require(['views/infowindows/location', 'models/Vote'], function(LocationView, Vote) {
            var attr, data, gd, graphic, info, pms, pt, symbol, template, vote;
            console.log('map click', evt);
            pms = _this.getMarker(1);
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
            data = {};
            data.geometryType = "esriGeometryPoint";
            pt = esri.geometry.webMercatorToGeographic(evt.mapPoint);
            data._id = "" + (Math.abs(pt.y)) + (Math.abs(pt.x));
            data._id = data._id.replace(/\./g, "");
            console.log("graphic added, show json", graphic.toJson());
            gd = graphic.toJson();
            gd.attributes._id = data._id;
            data.attributes = gd.attributes;
            data.geometry = pt;
            vote = new Vote();
            vote.save(data, {
              success: function(m) {
                return console.log("vote was saved successfully", m.toJSON());
              }
            });
            return info.on("upVote", function(count) {
              vote.set({
                attributes: {
                  votes: count
                }
              });
              graphic.setSymbol(new esri.symbol.PictureMarkerSymbol(_this.getMarker(count)));
              return vote.save({}, {
                success: function(m) {
                  return console.log("vote saved!", m.toJSON());
                }
              });
            });
          });
        });
      }
    });
  });

}).call(this);
