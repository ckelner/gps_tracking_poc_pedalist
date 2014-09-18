// init
$(document).ready(function() {
  app.init();
});

var app = {};
app.userId = null;
app.userTrack = [];
app.trackWatchId = null;

app.init = function() {
  app.setupButtons();
  app.setupUser();
}
app.setupUser = function() {
  /*
    TODO: Replace with some actual userid?
    There are some nice libs out there that will generate UUID from
    certain device information and will always generate the same UUID.
  */
  app.userId = Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
}
app.startTracking = function(){
  if (navigator.geolocation) {
    var geo_options = {
      enableHighAccuracy: true, 
      maximumAge        : 30000, 
      timeout           : 5000
    };
    // will update as the user moves
    app.trackWatchId = navigator.geolocation.watchPosition(
      app.trackSuccess,
      app.trackFail,
      geo_options
    );
  } else {
    // fuck we ain't tracking shit!
    // since this is POC...
    console.log("Your old browser sucks!");
  }
  $("#tracking").css("display","block");
  $("#track_complete").css("display","none");
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
  );
}
app.trackFail = function(msg) {
  console.log("Failed to get coords: " + msg);
}
app.stopTracking = function(){
  navigator.geolocation.clearWatch( app.trackWatchId );
  $.ajax({
    type: "POST",
    url: "/coords",
    data: { 
      "id": app.userId,
      "track": app.userTrack
    }
  }).done(function( msg ){
    $("#tracking").css("display","none");
    $("#track_complete").css("display","block");
    app.userTrack = [];
  });
}
app.setupButtons = function() {
  $("#start_button").click(function() {
    app.startTracking();
  });
  $("#stop_button").click(function() {
    app.stopTracking();
  });
}
