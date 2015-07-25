var directionsService = new google.maps.DirectionsService();
var directionsDisplay = new google.maps.DirectionsRenderer();
var map;
var markers = [];

function initialize() {
  
  var mapOptions = {
    center: {lat: 37.770, lng: -122.480},
    zoom: 13
  };
  
  map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
  
  directionsDisplay.setMap(map);

  google.maps.event.addListener(map, 'click', function(event){
    markers.push(new google.maps.Marker({
      position: event.latLng,
      map: map
    }));
  });

  google.maps.event.addDomListener(document.getElementById('generate'), 'click', generateRoute);
}

google.maps.event.addDomListener(window, 'load', initialize);

function generateRoute() {

  // clear markers from map
  markers.forEach(function(marker) {
  marker.setMap(null);
  });

  console.log(markers[0].getPosition().lat());
  console.log(markers[0].getPosition().lng());
  console.log(markers[1].getPosition().lat());
  console.log(markers[1].getPosition().lng());

  var beginning = new google.maps.LatLng(markers[0].getPosition().lat(),markers[0].getPosition().lng());
  var end = new google.maps.LatLng(markers[markers.length-1].getPosition().lat(),markers[markers.length-1].getPosition().lng());

  var request;

  // generate list of waypoints if more than two markers are placed on map
  if (markers.length > 2) {
    var waypoints = [];
    markers.slice(1,markers.length-1).forEach(function(waypoint) {
      waypoints.push({
        location: new google.maps.LatLng(waypoint.getPosition().lat(),waypoint.getPosition().lng()),
        stopover: true
      });
    });

    request = {
      origin: beginning,
      destination: end,
      waypoints: waypoints,
      travelMode: google.maps.TravelMode.WALKING
    };
  } else {
    request = {
      origin: beginning,
      destination: end,
      travelMode: google.maps.TravelMode.WALKING
    };
  }

  console.log(request);

  directionsService.route(request, function(response, status) {
    console.log('status:', status);
    console.log('response:', response);
    if (status == 'OK') {
      directionsDisplay.setDirections(response);
    } else {
      console.error('Directions request failed');
    }
  });
}
