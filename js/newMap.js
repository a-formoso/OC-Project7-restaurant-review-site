/*===========================================================================================================
*  CREATING A NEW MAP
===========================================================================================================*/


/** Create map and display user' posittion
*****************************************************/
function createMap(pos) {
  let lat = pos.lat;
  let lng = pos.lng;
  mapOptions = {
    gestureHandling: 'cooperative', /*smart scrolling for mobile*/ 
    fullscreenControl: true, 
    center: new google.maps.LatLng(lat, lng),
    zoom: 14.5,
    styles: myMapStyles,
    panControl: true,
    mapTypeControl: true,
    mapTypeControlOptions: {
      mapTypeIds: [google.maps.MapTypeId.ROADMAP, google.maps.MapTypeId.HYBRID/*, google.maps.MapTypeId.SATELLITE, O*/],
      style: google.maps.MapTypeControlStyle.DROPDOWN_MENU /*.DEFAULT or HORIZONTAL_BAR*/
    },
    zoomControl: true,
    zoomControlOptions: {
      style: google.maps.ZoomControlStyle.SMALL,
      position: google.maps.ControlPosition.RIGHT_CENTER
    },
    overviewMapControl: true,
    overviewMapControlOptions: {
      opened: true
    },
    streetViewControl: false
  }
  // map object
  myMap = new google.maps.Map(document.getElementById('map'), mapOptions);
  // user marker
  userMarker = new google.maps.Marker({ 
    position: pos, 
    map: myMap, 
    icon: user_mrkrIcon, 
    draggable: false,
    animation: google.maps.Animation.BOUNCE 
  });
  setTimeout(function () {
    userMarker.setAnimation(null)
  }, 3000);

  // callback for adding new restaurant on the map
  google.maps.event.addListener(myMap, 'rightclick', function(event) {
    createNewRestaurant(event.latLng);
  });

  // Google Places API
  let request = {
    fields: ['name', 'geometry', 'rating', 'user_ratings_total', 'photos', 'icon', 'place_id', 'opening_hours', 'permanently_closed'],
    location: pos,
    radius: '1500',
    type: ['restaurant']
  };
  // nearbySearch
  service = new google.maps.places.PlacesService(myMap);
  document.getElementById('ui-query').disabled = true;   
  document.getElementById('ui-query').style.backgroundColor = '#ddd';
  service.nearbySearch(request, getRestaurants);
  
};