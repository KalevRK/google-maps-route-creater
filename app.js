var rendererOptions = {
  draggable: true
};

var directionsService = new google.maps.DirectionsService();
var directionsDisplay = new google.maps.DirectionsRenderer(rendererOptions);
var distanceService = new google.maps.DistanceMatrixService();
var map;
var markers = [];
var totalDistance = 0;

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
      label: markers.length.toString(),
      map: map,
      draggable: true
    }));

    google.maps.event.addListener(markers[markers.length-1], 'dragend', generateRoute);

  });

  google.maps.event.addDomListener(document.getElementById('generate'), 'click', generateRoute);
  google.maps.event.addDomListener(document.getElementsByName('units')[0], 'click', calculateDistanceInUnits);
  google.maps.event.addDomListener(document.getElementsByName('units')[1], 'click', calculateDistanceInUnits);
  google.maps.event.addDomListener(document.getElementById('clear'), 'click', clearRoute);
}

google.maps.event.addDomListener(window, 'load', initialize);

function generateRoute() {

  if (markers.length > 1) {
    var beginning = new google.maps.LatLng(markers[0].getPosition().lat(),markers[0].getPosition().lng());
    var end = new google.maps.LatLng(markers[markers.length-1].getPosition().lat(),markers[markers.length-1].getPosition().lng());
  }

  var request;

  // generate list of waypoints if more than two markers are placed on map
  if (markers.length > 2) {
    var waypoints = [];
    markers.slice(1,markers.length-1).forEach(function(waypoint, index) {
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
  } else if (markers.length > 1) {
    request = {
      origin: beginning,
      destination: end,
      travelMode: google.maps.TravelMode.WALKING
    };
  }

  console.log(request);

  if (markers.length > 1) {
    directionsService.route(request, function(response, status) {
      if (status == 'OK') {

        calculateDistance(response);

        directionsDisplay.setMap(map);
        directionsDisplay.setOptions({ suppressMarkers: true });
        directionsDisplay.setDirections(response);

      } else {
        console.error('Directions request failed');
      }
    });
  }

}

function clearRoute() {

  // clear markers from map
  markers.forEach(function(marker) {
  marker.setMap(null);
  });

  // clear markers array
  markers = [];

  // clear directions display on map
  directionsDisplay.setMap(null);

  // reset total distance of route
  totalDistance = 0;

  // clear distance display
  document.getElementById('distance').textContent = '';
}

function calculateDistance(response) {
  // Calculate the total distance of the route
  totalDistance = response.routes[0].legs.reduce(function(dist, leg) {
    return dist + leg.distance.value;
  }, 0);

  calculateDistanceInUnits();
}

function calculateDistanceInUnits() {
  if (totalDistance > 0) {
    var distance;
    // If miles radio button is checked then convert meters to miles
    if (document.getElementsByName('units')[0].checked) {
      distance = parseFloat((totalDistance * 3.28084) / 5280).toFixed(3);
      document.getElementById('distance').textContent = distance + ' miles';
    } else {
      // Otherwise convert meters to kilometers
      distance = parseFloat(totalDistance / 1000).toFixed(3);
      document.getElementById('distance').textContent = distance + ' kilometers';
    }
  }
}