define [
  'jquery'
  'underscore'
  'backbone'
  'models/Vote'
], ($, _, Backbone, Vote) ->
  VoteCollection = Backbone.Collection.extend
    model: Vote
    url: ->
      "documents#{if @id then '/' + @id else ''}"
