define [
  'jquery'
  'underscore'
  'backbone'
], ($, _, Backbone) ->
  MapView = Backbone.View.extend
    id: 'map'
    tagName: 'div'
    className: 'claro'

    initialize: ->

    render: ->
      console.log 'render the map'
      @

    ready: ->
      console.log 'ready for map'
      map = new esri.Map @.id

      tms = new esri.layers.ArcGISTiledMapServiceLayer "http://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer"
      map.addLayer tms
      supportsOrientationChange = "onorientationchange" in window
      orientationEvent = if supportsOrientationChange then "orientationchange" else "resize"
      window.addEventListener orientationEvent, ->
        map?.reposition()
        map?.resize()
