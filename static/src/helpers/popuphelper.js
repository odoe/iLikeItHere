(function() {

  define(function() {
    return {
      create: function() {
        var fillSymbol, lineSymbol, popup, slsFillColor, slsLineColor;
        slsLineColor = new dojo.Color([255, 0, 0]);
        slsFillColor = new dojo.Color([255, 255, 0, 0.25]);
        lineSymbol = new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, slsLineColor, 1);
        fillSymbol = new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID, lineSymbol, slsFillColor);
        return popup = new esri.dijit.Popup({
          fillSymbol: fillSymbol
        }, dojo.create('div'));
      }
    };
  });

}).call(this);
