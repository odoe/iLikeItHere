define [
  'jquery'
  'underscore'
  'backbone'
  'views/map/MapView'
  'views/tools/sidebar'
], ($, _, Backbone, MapView, Sidebar) ->
  ViewManager = Backbone.View.extend
    el: $ '#container'

    render: ->
      dojo.require "esri.dijit.Popup"
      mv = new MapView()
      @$el.append mv.render().el
      dojo.addOnLoad =>
        mv.ready()
        mv.on "mapLoaded", (@map) =>
          console.log "map has been loaded", @map
          @map.infoWindow.resize 130, 30
          sidebar = new Sidebar()
          @$el.prepend sidebar.render().el
          sidebar.on 'selectLocation', =>
            @addLocation()

      @

    addLocation: ->

      getMarker = (votes) ->
        url: if votes < 10 then "img/gpsmapicons06_blue.png" else "img/gpsmapicons06_red.png"
        height: if votes < 5 then 32 else 42
        width: if votes < 5 then 32 else 42
        yoffset: if votes < 5 then 16 else 21
        type: "esriPMS"

      console.log 'add new location to map', @map
      handle = dojo.connect @map, 'onClick', (evt) =>
        dojo.disconnect handle
        require ['views/infowindows/location'], (LocationView) =>
          console.log 'map click', evt
          pms = getMarker 1
          symbol = new esri.symbol.PictureMarkerSymbol pms
          attr = votes: 1
          info = new LocationView()
          console.log "info template content", info
          template = new esri.InfoTemplate 'Vote!', info.render(attr).el
          graphic = new esri.Graphic evt.mapPoint, symbol, attr
          graphic.setInfoTemplate template
          @map.graphics.add graphic
          console.log "graphic added", graphic

          info.on "upVote", (count) =>
            graphic.setSymbol new esri.symbol.PictureMarkerSymbol getMarker count
