define [
  'jquery'
  'underscore'
  'backbone'
  'views/map/MapView'
], ($, _, Backbone, MapView) ->
  ViewManager = Backbone.View.extend
    el: $ '#container'

    render: ->
      mv = new MapView()
      @$el.append mv.render().el
      dojo.addOnLoad ->
        mv.ready()
      @
