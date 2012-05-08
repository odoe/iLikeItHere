define [
  'jquery'
  'underscore'
  'backbone'
  'views/ViewManager'
], ($, _, Backbone, VM) ->
  initialize = ->
    vm = new VM()
    vm.render()

    dojo.addOnLoad ->
      console.log 'dojo loaded'

  initialize: initialize
