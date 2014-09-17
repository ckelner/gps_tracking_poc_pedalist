app.googleMaps = {}
app.googleMaps.geocoder = new google.maps.Geocoder();

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
}
