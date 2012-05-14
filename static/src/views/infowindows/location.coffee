define [
  'jquery'
  'underscore'
  'backbone'
  'text!templates/infowindows/location.html'
], ($, _, Backbone, locationTemplate) ->
  LocationView = Backbone.View.extend
    tagName: 'div'
    className: 'infoView'

    events:
      "click #btnVote": "onVote"

    render: (@attr) ->
      info = _.template locationTemplate, @attr
      @$el.html info
      @

    onVote: ->
      @attr.votes++
      if  @attr.votes > 5 then @trigger "upVote", @attr.votes
      @render @attr
