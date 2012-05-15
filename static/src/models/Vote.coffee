define [
  'jquery'
  'underscore'
  'backbone'
], ($, _, Backbone) ->
  Vote = Backbone.Model.extend
    idAttribute: "_id"
    url: ->
      "documents/esrijs#{if @id then '/' + @id else ''}"
