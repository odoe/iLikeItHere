(function() {

  define(['jquery', 'underscore', 'backbone', 'views/ViewManager'], function($, _, Backbone, VM) {
    var initialize;
    initialize = function() {
      var vm;
      vm = new VM();
      vm.render();
      return dojo.addOnLoad(function() {
        return console.log('dojo loaded');
      });
    };
    return {
      initialize: initialize
    };
  });

}).call(this);
