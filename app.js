var markers = [];

function initialize() {
  
  var mapOptions = {
    center: {lat: -34.397, lng: 150.644},
    zoom: 8
  };
  
  var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
  
  google.maps.event.addListener(map, 'click', function(event){
    markers.push(new google.maps.Marker({
      position: event.latLng,
      map: map
    }));
  });
}

google.maps.event.addDomListener(window, 'load', initialize);
