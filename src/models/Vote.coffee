define [
  'jquery'
  'underscore'
  'backbone'
], ($, _, Backbone) ->
  Vote = Backbone.Model.extend
    url: ->
      "documents/#{if @id then @id else ''}"
