app.pause = false;
app.sliderDiv = null;
app.radar = true;
app.userId = null;
app.userTrack = [];
app.trackIntervalId = null;
app.init = function() {
  app.fillMapHeight();
  app.googleMaps.initialize();
  //app.loadTweetDataFromDB();
  //app.setupTweetStreamSocket();
  //app.pausePlayDiv();
  //app.initBigDataDiv();
  //app.initSlider();
  //app.setupRadarButtonToggle();
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
  //app.storeUserTracking(location.coords.latitude,location.coords.longitude);
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
  // oh yuo, shtop it!
  clearInterval(app.trackIntervalId);
}
/*app.setupRadarButtonToggle = function() {
  $("#toggle_button").click(function() {
    app.radar = (app.radar == false ? true : false)
    app.googleMaps.loadOverlay();
  });
}*/
app.setupStoreButton = function() {
  $("#store_button").click(function() {
    app.storeUserTracking();
  });
}
/*app.pausePlayDiv = function() {
  $("#pause_play").click(function() {
    app.pause = (app.pause == false ? true : false)
    if( app.pause ) {
      $("#pause_play").css( "background-color", "red" );
    } else {
      $("#pause_play").css( "background-color", "green" );
    }
  });
}*/
/*app.initBigDataDiv = function() {
  $("#big_data").click(function() {
    $("#big_data").css( "background-color", "red" );
    app.initBigData();
  });
}*/
// sorry ass JS hack to set the map height... 
// 50% in css doesn't seem to work
app.fillMapHeight = function() {
  $("#container").css("height", $(window).height() ); //- $(window).height() / 4);
}
// get 24hrs of data
/*app.initBigData = function() {
  $.ajax( "/recentposts/" + (24 * 60) ).done(
    function( data ) {
      app.googleMaps.closeOpenMarkers();
      app.googleMaps.removeMarkers();
      var dataLen = data.length;
      for(var y=0;y<dataLen;y++) {
        var tweet = data[y];
        if( tweet.coordinates ){
          var tweetLatLng = new google.maps.LatLng(
            tweet.coordinates.coordinates[1],
            tweet.coordinates.coordinates[0]
          );
          var html = app.processTweetData(tweet, true);
          app.createMapMarker( html, tweetLatLng, tweet.created_at, null );
          app.map.allMarkers.forEach( function(el) {
            el.setVisible(false);
          });
        }
      }
      app.pause=true;
      $("#big_data").css( "background-color", "green" );
    }
  );
}*/
/*app.initSlider = function() {
  $(function() {
    app.sliderDiv = $("#slider");
    app.sliderDiv.rangeSlider();
    app.sliderDiv.rangeSlider("option", "bounds", {min: 15, max: (24*60)});
    app.sliderDiv.rangeSlider("option", "defaultValues", {min: 15, max: 30});
    app.sliderDiv.on( "valuesChanging",
      function( event, ui ) {
        var vals = app.sliderDiv.rangeSlider("values");
        var min = vals.min;
        var max = vals.max;
        var curDate = new Date();
        var minOldTime = new Date(curDate.getTime() - (min * 1000 * 60));
        var maxOldTime = new Date(curDate.getTime() - (max * 1000 * 60));
        app.map.allMarkers.forEach( function(el) {
          var createdAt = el.created_at;
          var markerDate = new Date(createdAt);
          var minOldMS = minOldTime.getTime();
          var maxOldMS = maxOldTime.getTime();
          var markMS = markerDate.getTime();
          if(markMS <= minOldMS && markMS >= maxOldMS) {
            el.setVisible(true);
          } else {
            el.setVisible(false);
          }
        });
        // this takes way too long to load... I think we need to have all the tweet data in memory...
        var val = app.sliderDiv.slider( "value" );
        $.ajax( "/recentposts/" + val ).done(
          function( data ) {
            app.googleMaps.closeOpenMarkers();
            app.googleMaps.removeMarkers();
            var dataLen = data.length;
            for(var y=0;y<dataLen;y++) {
              app.processTweetData(data[y]);
            }
          }
        );
      }
    );
  });
}*/
