var app = {};
app.userId = null;
app.userTrack = [];
app.trackIntervalId = null;

app.init = function() {
  app.fillMapHeight();
  app.googleMaps.initialize();
  app.setupStoreButton();
  app.setupTrackUser();
}
app.setupTrackUser = function() {
  // this id is crap for my first test run
  // but we'd need to generate a new one for each "ride/game" played
  app.userId = Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
  app.trackIntervalId = setInterval(app.trackUser, 5000);
}
app.trackUser = function(){
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(app.trackSuccess);
  } else {
    var html5Options = { enableHighAccuracy: true, timeout: 3000, maximumAge: 0 };
    geolocator.locate(app.googleMaps.trackSuccess, app.trackFail, true, html5Options);
  }
}
app.trackFail = function(msg) {
  // do nothing
}
app.trackSuccess = function(location) {
  var d = new Date();
  var utc = d.toUTCString();
  app.userTrack.push(
    {
       "lat": location.coords.latitude,
       "lon": location.coords.longitude,
       "timestamp": utc
    }
  )
}
app.storeUserTracking = function(){
  $.ajax({
    type: "POST",
    url: "/coords",
    data: { 
      "id": app.userId,
      "track": app.userTrack
    }
  })
  .done(function( msg ) {
    // do nothing
  });
  // oh yuo, stop it!
  clearInterval(app.trackIntervalId);
}
app.setupStoreButton = function() {
  $("#store_button").click(function() {
    app.storeUserTracking();
  });
}
app.fillMapHeight = function() {
  $("#container").css("height", $(window).height() );
}
