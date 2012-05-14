# bootstrap with require.js
require.config
  paths        :
    jquery     : 'libs/jquery/jquery-1.7.2.min'
    jqueryui   : 'libs/jqueryui/jquery-ui-1.8.20.custom.min'
    underscore : 'libs/underscore/underscore-min'
    backbone   : 'libs/backbone/backbone-min'
    # require.js plugins
    order     : 'libs/require/order'
    text      : 'libs/require/text'
    templates : '../templates'

# If using the ArcGIS JS API, require in this
# section here and it will go global for you.
require [
    'app'
    'http://serverapi.arcgisonline.com/jsapi/arcgis/?v=2.8compact'
  ], (App) ->
    console.log 'init app'
    App.initialize()
