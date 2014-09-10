app.googleMaps = {}

// google overlay prototype
app.googleMaps.geocoder = new google.maps.Geocoder();
app.googleMaps.overlay = null;
app.googleMaps.ir_Overlay = null;
app.googleMaps.lastOverlay = [];

app.googleMaps.initialize = function() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(app.googleMaps.geoSuccess);
  } else {
    var html5Options = { enableHighAccuracy: true, timeout: 3000, maximumAge: 0 };
    geolocator.locate(app.googleMaps.geoSuccess, app.googleMaps.geoFail, true, html5Options);
  }
}
app.googleMaps.geoSuccess = function (location) {
    app.googleMaps.stepTwo(location.coords.latitude,location.coords.longitude);
}
app.googleMaps.geoFail = function (msg) {
    console.log(msg);
}
app.googleMaps.stepTwo = function(lat,lon) {
  var mapOptions = {
    center: new google.maps.LatLng(lat,lon),
    zoom: 15,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };
  var map = new google.maps.Map(document.getElementById("container"), mapOptions);
  app.googleMaps.map = map;

  google.maps.event.addListener(map, 'center_changed', function() {
    //app.googleMaps.loadOverlay();
  });
  google.maps.event.addListener(map, 'bounds_changed', function() {
    //app.googleMaps.loadOverlay();
  });
  google.maps.event.addListener(map, 'dragend', function() {
    //app.googleMaps.loadOverlay();
  });
  google.maps.event.addListener(map, 'resize', function() {
    //app.googleMaps.loadOverlay();
  });
  google.maps.event.addListener(map, 'zoom_changed', function() {
    //app.googleMaps.loadOverlay();
  });
  // reload the overlay (updated data)
  // 300 seconds... that is slow :)
  // setInterval(app.googleMaps.loadOverlay, 300000);
};

// Kelner -- we can use this for re-mapping the bike ride?  -- Was used for weather overlay [now removed]
app.googleMaps.loadOverlay = function() {
  var map = app.googleMaps.map;
  // build wunderground image api params
  var mapBounds = map.getBounds();
  var mapNE = mapBounds.getNorthEast();
  var mapSW = mapBounds.getSouthWest();
  var mapDiv = map.getDiv();
  var img = null;
  if( app.radar ) {
    img = "http://api.wunderground.com/api/ba3cc8d32973ec43/radar/image.gif?" +
      "maxlat=" + mapNE.lat() + "&maxlon=" + mapNE.lng() + "&minlat=" +
      mapSW.lat() + "&minlon=" + mapSW.lng() + "&width=" + mapDiv.offsetWidth +
      "&height=" + mapDiv.offsetHeight + "&newmaps=0&rainsnow=1&smooth=1&noclutter=1&reproj.automerc=1";
  } else {
    img = "http://api.wunderground.com/api/ba3cc8d32973ec43/satellite/image.png?" +
      "maxlat=" + mapNE.lat() + "&maxlon=" + mapNE.lng() + "&minlat=" + mapSW.lat() + 
      "&minlon=" + mapSW.lng() + "&width=" + mapDiv.offsetWidth + "&height=" + mapDiv.offsetHeight +
      "&key=sat_ir4&basemap=0";
  }
  if( app.googleMaps.overlay ) {
    app.googleMaps.lastOverlay.push(app.googleMaps.overlay);
  }
  app.googleMaps.overlay = new google.maps.GroundOverlay(img, map.getBounds());
  app.googleMaps.overlay.setMap(map);
  app.googleMaps.overlay.setOpacity(0.5);
  // remove old overlay
  // setTimeout(app.googleMaps.removeOldOverlay,1000);
};

app.googleMaps.removeOldOverlay = function() {
  var overLen = app.googleMaps.lastOverlay.length;
  for(var q=0;q<overLen;q++) {
    app.googleMaps.lastOverlay[q].setMap(null);
  }
  app.googleMaps.lastOverlay = [];
};

app.googleMaps.removeMarkers = function() {
  var len = app.map.allMarkers.length;
  // close all the other open markers, this generally should just be one other one
  for(var i=0;i<len;i++){
    var aMarker = app.map.allMarkers.pop();
    aMarker.setMap(null);
  }
  app.map.allMarkers = [];
};

app.googleMaps.closeOpenMarkers = function() {
  var len = app.map.openMarkers.length;
  // close all the other open markers, this generally should just be one other one
  for(var i=0;i<len;i++){
    var aMarker = app.map.openMarkers.pop();
    aMarker.infoWindow.close();
  }
}
