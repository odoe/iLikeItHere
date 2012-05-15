# TODO - This can use some serious refactoring

define [
  'jquery'
  'underscore'
  'backbone'
  'views/map/MapView'
  'views/tools/sidebar'
  'collections/VoteCollection'
], ($, _, Backbone, MapView, Sidebar, VoteCollection) ->
  ViewManager = Backbone.View.extend
    el: $ '#container'

    render: ->
      dojo.require "esri.dijit.Popup"
      mv = new MapView()
      @$el.append mv.render().el
      @voteCount = 0
      dojo.addOnLoad =>
        mv.ready()
        mv.on "mapLoaded", (@map) =>
          console.log "map has been loaded", @map
          @map.infoWindow.resize 130, 30
          sidebar = new Sidebar()
          @$el.prepend sidebar.render().el
          sidebar.on 'selectLocation', =>
            @addLocation()

          collection = new VoteCollection()
          collection.fetch
            data: $.param( type:"esri" )
            success: =>
              console.log "jquery fetched!", collection
              collection.each (model) =>
                require ['views/infowindows/location'], (LocationView) =>
                  feat = model.toJSON()
                  geom = esri.geometry.fromJson feat.geometry
                  mp = esri.geometry.geographicToWebMercator geom
                  sym = new esri.symbol.PictureMarkerSymbol @getMarker feat.attributes.votes
                  g = new esri.Graphic mp, sym, feat.attributes
                  info = new LocationView()
                  console.log "info template content", info
                  template = new esri.InfoTemplate 'Vote!', info.render(feat.attributes).el
                  g.setInfoTemplate template
                  @map.graphics.add g

                  info.on "upVote", (count) =>
                    model.set
                      attributes:{ votes: count }

                    g.setSymbol new esri.symbol.PictureMarkerSymbol @getMarker count
                    model.save {}, success: (m) ->
                      console.log "vote saved!", m.toJSON()

      @

    getMarker: (votes) ->
      votes = parseInt votes
      console.log "votes", votes
      url: if votes < 10 then "img/gpsmapicons06_blue.png" else "img/gpsmapicons06_red.png"
      height: if votes < 5 then 32 else 42
      width: if votes < 5 then 32 else 42
      yoffset: if votes < 5 then 16 else 21
      type: "esriPMS"

    addLocation: ->
      console.log 'add new location to map', @map
      handle = dojo.connect @map, 'onClick', (evt) =>
        dojo.disconnect handle
        require ['views/infowindows/location', 'models/Vote'], (LocationView, Vote) =>
          console.log 'map click', evt
          pms = @getMarker 1
          symbol = new esri.symbol.PictureMarkerSymbol pms
          attr = votes: 1
          info = new LocationView()
          console.log "info template content", info
          template = new esri.InfoTemplate 'Vote!', info.render(attr).el
          graphic = new esri.Graphic evt.mapPoint, symbol, attr
          graphic.setInfoTemplate template
          @map.graphics.add graphic

          # MongoDB Spatial requires geographic coords, so
          # need to convert the point geometry
          data = {}
          data.geometryType = "esriGeometryPoint"
          pt = esri.geometry.webMercatorToGeographic evt.mapPoint
          data._id = "#{Math.abs pt.y}#{Math.abs pt.x}"
          data._id = data._id.replace /\./g,""
          console.log "graphic added, show json", graphic.toJson()
          gd = graphic.toJson()
          gd.attributes._id = data._id
          #feature = geometry: pt, attributes: gd.attributes
          #data.features = [feature]
          data.attributes = gd.attributes
          data.geometry = pt
          vote = new Vote()
          vote.save data, 
            success: (m) ->
              console.log "vote was saved successfully", m.toJSON()

          info.on "upVote", (count) =>
            vote.set
              attributes:{ votes: count }

            graphic.setSymbol new esri.symbol.PictureMarkerSymbol @getMarker count
            vote.save {}, success: (m) ->
              console.log "vote saved!", m.toJSON()
