(function() {

  require.config({
    paths: {
      jquery: 'libs/jquery/jquery-1.7.2.min',
      jqueryui: 'libs/jqueryui/jquery-ui-1.8.20.custom.min',
      underscore: 'libs/underscore/underscore-min',
      backbone: 'libs/backbone/backbone-min',
      order: 'libs/require/order',
      text: 'libs/require/text'
    }
  });

  require(['app', 'http://serverapi.arcgisonline.com/jsapi/arcgis/?v=2.8compact'], function(App) {
    console.log('init app');
    return App.initialize();
  });

}).call(this);
