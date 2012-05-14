define [
  'jquery'
  'underscore'
  'backbone'
  'helpers/popuphelper'
  'helpers/extentfactory'
], ($, _, Backbone, popup, extents) ->
  MapView = Backbone.View.extend
    tagName: 'div'
    id: 'map'

    initialize: ->

    render: ->
      console.log 'render the map'
      @

    ready: ->
      console.log 'ready for map'
      map = new esri.Map @.id,
        infoWindow: popup.create()
        extent: extents.losAngeles()

      dojo.connect map, "onLoad", (_map_) =>
        @trigger "mapLoaded", _map_

      tms = new esri.layers.ArcGISTiledMapServiceLayer "http://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer"
      map.addLayer tms

      # This handles how the map should resize or rotate on mobile devices
      supportsOrientationChange = "onorientationchange" in window
      orientationEvent = if supportsOrientationChange then "orientationchange" else "resize"
      window.addEventListener orientationEvent, ->
        map?.reposition()
        map?.resize()
