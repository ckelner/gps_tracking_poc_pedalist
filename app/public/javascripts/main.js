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
  app.trackUser();
}
app.trackUser = function(){
  if (navigator.geolocation) {
    var geo_options = {
      enableHighAccuracy: true, 
      maximumAge        : 30000, 
      timeout           : 5000
    };
    // will update as the user moves
    navigator.geolocation.watchPosition(
      app.trackSuccess,
      app.trackFail,
      geo_options
    );
  } else {
    // fuck we ain't tracking shit!
    // since this is POC...
    console.log("Your old browser sucks!");
  }
}
app.trackSuccess = function(location) {
  var d = new Date();
  var utc = d.toUTCString();
  app.userTrack.push(
    {
      "lat": location.coords.latitude,
      "lon": location.coords.longitude,
      "accuracy": location.coords.accuracy,
      "altitude": location.coords.altitude,
      "altitudeAccuracy": location.coords.altitudeAccuracy,
      "heading": location.coords.heading,
      "speed": location.coords.speed,
      "timestamp": utc
    }
  )
}
app.trackFail = function(msg) {
  console.log("Failed to get coords: " + msg);
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
