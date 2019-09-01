/*===========================================================================================================
*  SEARCHING FOR RESTAURANT PLACES
===========================================================================================================*/


/** nearBy Search
************************************************************/
function getRestaurants(results, status) { // (Array<PlaceResult>, PlacesServiceStatus, PlaceSearchPagination)
  if (status == google.maps.places.PlacesServiceStatus.OK) {
    // console.log('NEARBY RESULTS'); 
    // console.info(JSON.stringify(results); //console.info(JSON.stringify(results, null, ' '));
    console.log('NEARBY DETAILED RESULTS'); 
    
    getRestaurantsDetails(results); //getDetails

  } else if (status == google.maps.places.PlacesServiceStatus.ZERO_RESULTS) {
    document.getElementById('msg_display').innerHTML = ""; 
    document.getElementById('rattings-wrapper').style.display = 'none';
    document.getElementById('ui-query').disabled = false;   
    document.getElementById('ui-query').style.backgroundColor = 'white';
    let noResultsts = `
      <div id="welcome-card">
        <div id="welcome-msg-wrapper">
          <h4 style="color: #A09E9B; font-weight: 600; margin: 30px 0 15px 0;">No restaurants found</h4>
          <h6 style="color: #B3B1AF;">No restaurants found at this location. 
            Please use the search box to query a different place or restaurant</h6>
        </div>
      </div>`;
    document.getElementById('ui-query').disabled = false;   
    document.getElementById('ui-query').style.backgroundColor = 'white';
    document.getElementById('map').innerHTML = noResultsts;
    console.log('No restaurants found at this location. Please search a different place.');
  } 
  else if (status == google.maps.places.PlacesServiceStatus.OVER_QUERY_LIMIT) {
    document.getElementById('msg_display').innerHTML = "";
    document.getElementById('ui-query').disabled = false;   
    document.getElementById('ui-query').style.backgroundColor = 'white';
    let overQueryLimit = `
      <div id="welcome-card">
        <div id="welcome-msg-wrapper">
          <h4 style="color: #A09E9B; font-weight: 600; margin: 30px 0 15px 0;">Quota exceeded</h4>
          <h6 style="color: #B3B1AF;">The app's exceeded its request usage limits. Give it a minute or try within the next 24 hours</h6>
        </div>
      </div>`;
    document.getElementById('ui-query').disabled = false;   
    document.getElementById('ui-query').style.backgroundColor = 'white';
    document.getElementById('map').innerHTML = overQueryLimit;
    console.log('The app\'s exceeded its request usage limits. Give it a minute or try within the next 24 hours'); // error code 403 or 429
  } 
  else if (status == google.maps.places.PlacesServiceStatus.REQUEST_DENIED || status == google.maps.places.PlacesServiceStatus.INVALID_REQUEST) {
    document.getElementById('msg_display').innerHTML = "";
    document.getElementById('ui-query').disabled = false;   
    document.getElementById('ui-query').style.backgroundColor = 'white';
    let requestDenied = `
      <div id="welcome-card">
        <div id="welcome-msg-wrapper">
          <h4 style="color: #A09E9B; font-weight: 600; margin: 30px 0 15px 0;">Request denied</h4>
          <h6 style="color: #B3B1AF;">Request query parameter(s) either invalid or missing</h6>
        </div>
      </div>`;
    document.getElementById('ui-query').disabled = false;   
    document.getElementById('ui-query').style.backgroundColor = 'white';
    document.getElementById('map').innerHTML = requestDenied;
    console.log('Request denied. Request query parameter(s) either invalid or missing.');
  } 
  else {
    document.getElementById('msg_display').innerHTML = "";
    document.getElementById('ui-query').disabled = false;   
    document.getElementById('ui-query').style.backgroundColor = 'white';
    let requestDenied = `
      <div id="welcome-card">
        <div id="welcome-msg-wrapper">
          <h4 style="color: #A09E9B; font-weight: 600; margin: 30px 0 15px 0;">Server-side error</h4>
          <h6 style="color: #B3B1AF;">Your request could not be processed due to a server error. The request may succeed if you try again.</h6>
        </div>
      </div>`;
    document.getElementById('ui-query').disabled = false;   
    document.getElementById('ui-query').style.backgroundColor = 'white';
    document.getElementById('map').innerHTML = requestDenied;
    console.log('Server-side error. Please try again.'); // UNKNOWN_ERROR
  }
}

/** getDetails Search
************************************************************/
function getRestaurantsDetails(restPlaces) {
  // When we reach the end of the loop
  if (restPlaces.length < 1 && currentRestaurant == null) {
    showRestaurantList();
    return false;
  }
  // While in the loop, get current restaurant
  currentRestaurant = currentRestaurant == null ? restPlaces.splice(0, 1)[0] : currentRestaurant;
  // Place Details Requests - to get place reviews, regionally converted phone numbers, website, etc
  var request = {
    placeId : currentRestaurant.place_id,
  };
  service = new google.maps.places.PlacesService(myMap);
  service.getDetails(request, function(results, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      console.log(results);
      let isRestOpen;
      if (results.opening_hours) { 
        isRestOpen = results.opening_hours.isOpen();
        console.log('isRestOpen: ' + isRestOpen);
      } 
      else {
        isRestOpen = false;
        console.log('isRestOpen does not exist. isRestOpen = ' + isRestOpen);
      }
      const restaurant = restPlace(results.name, results.formatted_address, results.formatted_phone_number, 
        results.website, results.geometry.location.lat(), results.geometry.location.lng(), results.rating, 
        results.user_ratings_total, results.reviews, results.icon, results.photos, results.price_level, loopCounter, isRestOpen
      );
      restaurantsList.push(restaurant);
      currentRestaurant = null;
      console.log('value of loopCounter = ' + loopCounter);
      loopCounter++;
      getRestaurantsDetails(restPlaces);
    } 
    else if (status === google.maps.GeocoderStatus.OVER_QUERY_LIMIT) {
      // Asynchronous programming 
      /*******************************************************************************
        * Because Place Details requests only lets you query 10 results per second, 
        * we're using setTimeout() to get around the OVER_QUERY_LIMIT issue
        **************************************************************************/
      console.log("OVER_QUERY_LIMIT ... Waiting 200ms to retry");
      setTimeout(function() {
        getRestaurantsDetails(restPlaces);
      }, 200);
    }
  }); 
}

/** Search - Find Place from Query (search box)
*****************************************************/
function codeAddress(lat, lng) { 
  document.querySelector('#bottomSection').style.display = 'none';
  // prepare global arrays for new values
  document.querySelector("ul.restaurant-list").innerHTML = ""; 
  restaurantsList = []; 
  infowindows = [];
  for(let i = 0; i < markers.length; i++) {
    markers[i].setVisible(false);
    markers[i].setMap(null);
  }
  markers.length = 0;
  loopCounter = 0;  
  //create map and load results
  const pos = { 
    lat: lat, 
    lng: lng 
  };
  createMap(pos);
}