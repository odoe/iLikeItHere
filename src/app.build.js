({
  appDir       : "../",
  baseUrl      : "./",
  dir          : "../js",
  paths        : {
    jquery     : 'libs/jquery/jquery-1.7.2.min',
    jqueryui   : 'libs/jqueryui/jquery-ui-1.8.20.custom.min',
    underscore : 'libs/underscore/underscore-min',
    backbone   : 'libs/backbone/backbone-min',
    // require.js plugins
    order : 'libs/require/order',
    text  : 'libs/require/text'
  },

  optimize : "uglify",
  modules  : [
    {
      name: "main"
    }
  ],

  inlineText          : true,
  fileExclusionRegExp : /\.(coffee|coffee~|js~|swp)/
})
