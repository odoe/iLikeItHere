define [
  'jquery'
  'underscore'
  'backbone'
], ($, _, Backbone) ->
  SidebarView = Backbone.View.extend
    tagName: 'div'
    className: 'sidebar'

    initialize: ->

    events:
      'click #select-loc': 'onSelectLocation'

    render: ->
      #console.log 'render the sidebar', @map
      require ['text!templates/sidebartools.html'], (Tools) =>
        tpl = _.template Tools, ""
        @$el.html tpl
      @

    onSelectLocation: (evt) ->
      evt.preventDefault()
      console.log "manually add a location"
      @trigger "selectLocation"
