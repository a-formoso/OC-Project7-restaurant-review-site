//ECMAScript 5 Strict Mode
"use strict";

/*===========================================================================================================
*  SOME Map AND DOM ELEMENTS
===========================================================================================================*/
const user_geoLct = document.getElementById("ui-lct");
let myMap, iw_restDtls;
let mapOptions;
let script = document.createElement('script');
const user_mrkrIcon  = '../images/user.png';
let user_marker;
let errorDisplay = document.getElementById('error-display');
let welcome_msg = `
  <div id="welcome-card">
    <div id="welcome-msg-wrapper">
      <h4 style="color: #A09E9B; font-weight: 600; margin: 30px 0 15px 0;">Location-based Experience</h4>
      <h6 style="color: #B3B1AF;"><strong>Food Place</strong> uses location to find restaurants around you.</h6>
    </div>
  </div>`;
let error_msg =`
  <div id="error-card">
    <div id="msg-wrapper">
      <div class="logo-wrapper"> <img src="../images/no-location-marker.png" alt="user location"/> </div>
      <h4 style="color: #2E2A24; font-weight: 600; margin: 30px 0 15px 0;">Enable your location</h4>
      <h6>To enable location, please refresh your browser and respond to the prompt.</h6>
      <h6>Alternatively, see <a style="text-decoration: underline;" target="_blank" href="https://www.google.com/search?rlz=1C1CHBD_en-GBGB755GB755&ei=y4EJXZO3K9GEhbIPjNS80AU&q=how+to+enable+geolocation+&oq=how+to+enable+geolocation+&gs_l=psy-ab.3..0l10.16403.27912..28314...4.0..0.106.1961.29j1......0....1..gws-wiz.....6..0i71j35i39j0i67j0i131i67j0i131j0i10i67j0i20i263.IB3pk3dkMoY">how to enable Geolocation</a></h6> 
    </div>
  </div>`;
const myMapStyles = [
  {elementType: 'geometry', stylers: [{color: '#242f3e'}]},
  {elementType: 'labels.text.stroke', stylers: [{color: '#242f3e'}]},
  {elementType: 'labels.text.fill', stylers: [{color: '#746855'}]},
  {
    featureType: 'administrative.locality',
    elementType: 'labels.text.fill',
    stylers: [{color: '#d59563'}]
  },
  {
    featureType: 'poi',
    elementType: 'labels.text.fill',
    stylers: [{color: '#d59563'}]
  },
  {
    featureType: 'poi.park',
    elementType: 'geometry',
    stylers: [{color: '#263c3f'}]
  },
  {
    featureType: 'poi.park',
    elementType: 'labels.text.fill',
    stylers: [{color: '#6b9a76'}]
  },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [{color: '#38414e'}]
  },
  {
    featureType: 'road',
    elementType: 'geometry.stroke',
    stylers: [{color: '#212a37'}]
  },
  {
    featureType: 'road',
    elementType: 'labels.text.fill',
    stylers: [{color: '#9ca5b3'}]
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry',
    stylers: [{color: '#746855'}]
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry.stroke',
    stylers: [{color: '#1f2835'}]
  },
  {
    featureType: 'road.highway',
    elementType: 'labels.text.fill',
    stylers: [{color: '#f3d19c'}]
  },
  {
    featureType: 'transit',
    elementType: 'geometry',
    stylers: [{color: '#2f3948'}]
  },
  {
    featureType: 'transit.station',
    elementType: 'labels.text.fill',
    stylers: [{color: '#d59563'}]
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [{color: '#17263c'}]
  },
  {
    featureType: 'water',
    elementType: 'labels.text.fill',
    stylers: [{color: '#515c6d'}]
  },
  {
    featureType: 'water',
    elementType: 'labels.text.stroke',
    stylers: [{color: '#17263c'}]
  }
];
const searchBox = document.getElementById('ui-query');
let restaurantsList = []; //collection of restaurant objects
// let markers = [];
let foodReviews = [];
// let avg;
// let rtngAvg;
// let avg_mrkr = [];
// // let mrkr_icons = [];
// let fooodLocations = [];
// let rest_index;
let modal = `
 <div class="container form-wrapper" id="modalWrapper">
    <form class="modal-content" id="myForm">
      <div class="row">
        <h5 style="margin: 15px 14px 25px; padding: 0;">Add a review</h5>
      </div>
      <div class="row">
        <input type="text" id="full-name" name="full-name" placeholder="Your name">
      </div>
      <div class="row score-wrapper">
        <label for="score">Score</label>
        <select id="score" name="score">
          <option value="one">1</option>
          <option value="two">2</option>
          <option value="three">3</option>
          <option value="four">4</option>
          <option value="five">5</option>
        </select>
      </div>
      <div class="row">
        <textarea id="user-review" name="user-review" placeholder="Share your experience" style="height:120px;"></textarea>
      </div>
      <div class="row" style="display: flex; justify-content: flex-end;">
        <input id="close-review-btn" type="button" onClick="close_ReviewForm();" value="Close" />
        <input  id="add-review-btn" type="reset" value="Add Review"/>
      </div>
    </form>
  </div> `;
let distance_miles;
let pos;
let service;

/*===========================================================================================================
*  INFORMATION TO REACH API
===========================================================================================================*/
// const url = 'https://developers.google.com/maps/documentation/javascript/examples/json/earthquake_GeoJSONP.js';
let geocoding_url = 'https://maps.googleapis.com/maps/api/geocode/json?';
let apiKey = 'AIzaSyCe_PRvM5yLjmgBr6tuRH5-Dv4PmhuGVvg';
const localJSON = 'js/restaurants.json';


/*===========================================================================================================
*  CALLBACK FUNCTIONS
===========================================================================================================*/
/** Handling location errors
*****************************************************/
let handleErrors = function () {
  document.querySelector('#main-content').style.display = 'none';
  const msg_wrapper = document.getElementById('error_Display');
  console.log("Unable to retrieve your location");
  document.getElementById('error_display').innerHTML = error_msg;
};
/** Improving device location accuracy
*****************************************************/
let options = {
  timeout: 5000,
  maximumage: 3000, //how long until we update position for more information (restaurants) 
  enableHighAccuracy: true //for best possible location results
}
/** Showing Restaurant reviews
*****************************************************/
function showReviews(rest_index) {
  document.querySelector('#bottomSection').style.display = 'block';
  //restaurant info and Street View 
  document.querySelector('#rest-brief').innerHTML = foodReviews[rest_index][0];
  let panorama = new google.maps.StreetViewPanorama(document.getElementById('street-view'), {
    position: fooodLocations[rest_index][1], /*[restaurant, {lat, lng}, markerImg, popup]*/
    pov: {heading: 270, pitch: 10},
    motionTracking: false,
    fullscreenControl: false,
    linksControl: false,
    panControl: false,
    zoom: 0
  });
  let rvwsList = '<ul>'; 
  if (foodReviews[rest_index][1].length == 0) {
    rvwsList += '<li>' + 'No reviews found' + '</li>'
  }
  else {
    for (let i = 0; i < foodReviews[rest_index][1].length; i++) {
      rvwsList += '<li>' + foodReviews[rest_index][1][i] + '</li>'
    }
  }
  rvwsList += '</ul>';
  document.querySelector('#rest-reviews').innerHTML = rvwsList; 
  //pass restaurant identidier to "Add review" button
  let btn_addReview = document.getElementById('leave-review');
  btn_addReview.setAttribute('onClick', `addReview(${rest_index});`);
  //target list element on the side of the page
  let li_elem_id = '#' + rest_index;
  let elems = document.querySelectorAll('.selection.selected');
  for (let i = 0; i < elems.length; i++) { 
    elems[i].classList.remove('selected');
    elems[i].style.backgroundColor = '#fff'; //restore white background (#D9FEA2)
  }
  $(li_elem_id).addClass('selected');
  let selected = document.querySelector('.selected');
  selected.style.backgroundColor = '#D9FEA2';
}

/** Open new restaurant review form
*****************************************************/
function addReview(rest_index) {
  document.getElementById('review_dialog-box').innerHTML = modal;
  //pass restaurant identidier to "Add review" button
  let modal_addReviewBtn = document.getElementById('add-review-btn');
  modal_addReviewBtn.setAttribute('onClick', `submitReview(${rest_index});`);
}

/** Close new restaurant review form
*****************************************************/
function close_ReviewForm() {
  let modal = document.getElementById('close-review-btn').closest('#modalWrapper');
  modal.style.display = "none";
}
/** Submit new restaurant review
*****************************************************/
function submitReview(rest_index) {
  //take user input 
  const user_fName = document.getElementById('full-name').value;
  const dropdown = document.getElementById('score');
  const score = dropdown.options[dropdown.selectedIndex].text;
  let user_score = parseInt(score, 10);
  const user_comment = document.getElementById('user-review').value;
  //add review to restaurants array
  const newReview = { 
    user: user_fName,
    stars: user_score, 
    comment: user_comment
  }
  console.log(restaurantsList[rest_index]);
  restaurantsList[rest_index].ratings.push(newReview);
  console.log(restaurantsList[rest_index].ratings);
 
  //print user input on the page
  let x_rest_reviews = [];
  let rvw;
  for (let x = 0; x < restaurantsList[rest_index].ratings.length; x++) {
    let userName = `User${x+1}`;
    let rate = restaurantsList[rest_index].ratings[x].stars; //takes int
    let comment = restaurantsList[rest_index].ratings[x].comment;
    let rvw;
    if (restaurantsList[rest_index].ratings[x]) {
      if (restaurantsList[rest_index].ratings[x].user) {
        userName = restaurantsList[rest_index].ratings[x].user;
      }
      rvw = newRestReview(userName, rate, comment);
    }
    x_rest_reviews.push(rvw);
  }
  foodReviews[rest_index][1] = x_rest_reviews;
  // console.log(_rest_reviews[rest_index]);
  document.getElementById('review_dialog-box').innerHTML = "";
  showReviews(rest_index);
  // let formContent = document.getElementById('myForm');
  // formContent.innerHTML = ""; 
  //close form
  
}


/** Show restaurant details
*****************************************************/  
function restDtls(avg, xxxxxStars, numbOfReviews, restaurant, address, telephone, website) {
  return `
    <div class="col-hg" style="display: flex; align-items: center; justify-content: center;">
      <div style="width: 100%;">
        <h3 style="margin: 0 0 4px; padding: 4px 0; font-weight: 600; color: #2E2A24;">${restaurant}</h3>
        <p style="margin: 0 0 4px; padding: 0 0 4px; display: flex;">
          <span style="font-size: 15px; font-weight: 600; color: #E7711B; margin-left: 0px; padding-top: 4px;">${avg}</span> 
          <span style="font-size: 20px; margin-left: 3px;">${xxxxxStars}</span>
          <span id="noRev" style="font-size: 15px; padding-top: 5px; margin-left: 3px;">(${numbOfReviews} reviews)</span>
        </p>
        <p style="font-size: 15px; padding: 4px 0; margin: 0 0 4px;">${address}</p>
        <p style="font-size: 15px; padding: 4px 0; margin: 0 0 4px; text-decoration: none;"> <a href="tel:${telephone}"><img src="../images/telephone.png" style="width: 18px; height: 18px; padding-bottom: 3px;  margin-right: 3px;"/> ${telephone}</a> </p>
        <p id="bt-align-x" style="font-size: 15px; padding: 18px 0; margin: 0 0 4px;">
          <a id="site-btn" href="${website}" target="_blank" style="text-decoration: none;">
            <img src="../images/www-icon.png" style="width: 22px; height: 22px; padding-bottom: 2px; margin-right: 3px;"/> visit restaurant site
          </a>
        </p>
      </div> 
    </div>`;
};


/** Create restaurant review funtion
*****************************************************/
function newRestReview(userName, score, comment) {
  return `
  <div class="review_item">
    <div class="review-item-top" style="font-size: 18px; font-weight: 600; ">
      <p>${userName}</p>
      <p style="float: right;"><span style="margin-left: 6px;">${getXstars(score)}</span></p>
    </div>
    <div class="review-item-body">
      <p>${comment}</p>
    </div>
  </div>`;
};
/** Adding New Restaurant on the map
*****************************************************/
function createNewRestaurant(location) {
    //add new restaurant marker and taking marker's coordinates
    let new_rest_marker = new google.maps.Marker({
      position: location, 
      map: myMap,
      icon: '../images/new-marker.png', 
      title: 'click to open form'
    });
    const lat = location.lat();
    const lng = location.lng();
    let rest_coordinates = {lat, lng};
    let nRest_address;
    new_rest_marker.addListener('click', function() {
      let geocoder = new google.maps.Geocoder();
      let location = `${geocoding_url}$latlng=${rest_coordinates}&key=${apiKey}`;
      console.log("New marker's coordinates translation = " + rest_coordinates.lat + ", " + rest_coordinates.lng);
      //Reverse geocoding request
      geocoder.geocode({'location': rest_coordinates}, function(results, status) {
        if (status === 'OK') {
          console.log(results); 
          if (results[0]) {
            // myMap.setZoom(12);
            myMap.setCenter(rest_coordinates);
            new_rest_marker.setPosition(rest_coordinates);  
            nRest_address = results[0].formatted_address;
            console.log(nRest_address);
            //creating the HTML form for new restaurant
            let newRest_form = document.createElement('div');
            newRest_form.setAttribute('class', 'nr_popup_wrapper');
            let nr_inner_div = document.createElement('div'); 
            nr_inner_div.setAttribute('class', 'nr_inner_wrapper');
            //Heading (h5)
            let nr_heading = document.createElement('h5');
            nr_heading.setAttribute('class', 'nr_heading');
            nr_heading.textContent = 'Add New Restaurant';
            nr_inner_div.appendChild(nr_heading);
            //input (Restaurant Name)
            let nr_restName = document.createElement('input');
            nr_restName.setAttribute('type', 'text');
            nr_restName.setAttribute('name', 'newRestName');
            nr_restName.setAttribute('id', 'ui-newRest-name');
            nr_restName.setAttribute('placeholder', 'Restaurant name');
            nr_inner_div.appendChild(nr_restName);
            //select options list (Restaurant Address) 
            let select = document.createElement('select'); 
            select.setAttribute('name', 'ui-newRest-address');
            select.setAttribute('id', 'ui-newRest-address');
            let options = [];
            for (let i = 0; i < results.length; i++) {
              let rest_address = results[i].formatted_address;
              options.push(rest_address);
              let opt = options[i];
              let options_elem = document.createElement("option");
              options_elem.textContent = opt;
              options_elem.value = [i];
              select.appendChild(options_elem);
            }
            console.log(select);
            nr_inner_div.appendChild(select);
            //input (Restaurant Telephone)
            let nr_restTel = document.createElement('input');
            nr_restTel.setAttribute('type', 'tel');
            nr_restTel.setAttribute('name', 'newRestTelephone');
            nr_restTel.setAttribute('id', 'ui-newRest-telephone');
            nr_restTel.setAttribute('placeholder', 'Restaurant telephone');
            nr_inner_div.appendChild(nr_restTel);
            //input (Restaurant Website)
            let nr_restSite = document.createElement('input');
            nr_restSite.setAttribute('type', 'url');
            nr_restSite.setAttribute('name', 'newRestWebsite');
            nr_restSite.setAttribute('id', 'ui-newRest-website');
            nr_restSite.setAttribute('placeholder', 'Restaurant website');
            nr_inner_div.appendChild(nr_restSite);
            //button (Add Restaurant)
            let nr_restBtn = document.createElement('button');
            nr_restBtn.setAttribute('class', 'nr_btn');
            nr_restBtn.onclick = addNewRestaurant;
            nr_restBtn.textContent = 'Add Restaurant';
            nr_inner_div.appendChild(nr_restBtn);
            newRest_form.appendChild(nr_inner_div);
            //infowindow object will house New Restaurant form
            iw_restDtls = new google.maps.InfoWindow({
              position: rest_coordinates,
              content: newRest_form
            });
            iw_restDtls.open(myMap, new_rest_marker);

            //Add Restaurant on the map
            function addNewRestaurant() {
              //create new restaurant object based on user input
              let restName, selRestAddress, restTelephone, restWebsite, nOptions;
              restName = document.getElementById('ui-newRest-name').value;
              selRestAddress = document.getElementById('ui-newRest-address');
              let selRestAddressOption = selRestAddress.options[selRestAddress.selectedIndex].text; 
              console.log(selRestAddressOption);
              restTelephone = document.getElementById('ui-newRest-telephone').value;
              restWebsite = document.getElementById('ui-newRest-website').value;
              let newRestaurant = {
                restaurantName: restName,
                address: selRestAddressOption,
                telephone: restTelephone,
                website: restWebsite,
                lat: lat,
                long: lng,
                ratings: []
              }
              restaurantsList.push(newRestaurant);
              // showRestaurants(restaurants);    
              console.log(restaurantsList);
              let avg = newRestaurant.ratings.length.toFixed(1);
              const xxxxxStars = getXstars(avg);
              const numbOfReviews = 0;
              const new_rest_index = restaurantsList.length - 1;
              
              const popup = restPopup(avg, xxxxxStars, numbOfReviews, restName, selRestAddressOption, restTelephone, new_rest_index);
              iw_restDtls.setContent(popup);
              // document.querySelector('#bottomSection').style.display = "none";
              //for distance to place in miles
              const user_point = new google.maps.LatLng(pos.lat, pos.lng); //user point on the map
              const restaurant_point = new google.maps.LatLng(lat, lng); //restaurant point on the map
              distance_miles = getDistanceInMiles(user_point, restaurant_point);  
              console.log(distance_miles);
              const liItem = restList(avg, xxxxxStars, numbOfReviews, restName, restWebsite, distance_miles, new_rest_index); //for list

              let markerImg = '../images/0star-marker.png';
              fooodLocations.push([restName, {lat, lng}, markerImg, popup, liItem]);
              //add new marker for the newly added restaurant
              let nr_marker = new google.maps.Marker({
                title: `${fooodLocations[new_rest_index][0]}`,
                position: fooodLocations[new_rest_index][1],
                icon: fooodLocations[new_rest_index][2],/*markerImg*/ 
                map: myMap
              });
              setTimeout(function () {
                nr_marker.setAnimation(null)
              }, 3000);
              nr_marker.addListener('click', function() {
                iw_restDtls.setPosition(fooodLocations[new_rest_index][1]);
                iw_restDtls.setContent(fooodLocations[new_rest_index][3]); 
                iw_restDtls.open(myMap, nr_marker);
              });
              markers.push(nr_marker); //Add to global array, "markers"    
              //displaying restaurant on the side of the page
              $('.restaurant-list').append(fooodLocations[new_rest_index][4]);
              let x_rest_reviews = [];
              const rest_dtls = restDtls(avg, xxxxxStars, numbOfReviews, restName, selRestAddressOption, restTelephone, restWebsite);
              foodReviews.push([rest_dtls, x_rest_reviews]);

              // showPopup(nr_index);
            } //.addNewRestaurant()
          } else {
            window.alert('No results found');  //if (results[0])
          }
        } else {
          window.alert('Geocoder failed due to: ' + status); //if (status === 'OK')
        }
      });
    });
}




/*===========================================================================================================
*  INITIALISING GOOGLE MAPS
===========================================================================================================*/
function initMap() {
  //Geolocation API
  if (!navigator.geolocation) { //if user's browser does not support Navigator.geolocation object
    console.log("Geolocation is not supported by your browser");
    alert('Geolocation is not supported by your browser');
  } else {
    document.querySelector('#rattings-wrapper').style.display = 'none';
    document.querySelector('#bottomSection').style.display = 'none';
    document.querySelector('#footer').style.display = 'none';
    document.getElementById('map').innerHTML = welcome_msg;
    //getCurrentLocation gets device's live location
    navigator.geolocation.getCurrentPosition(getUserLocation, handleErrors, options);
  }
} 
/** if user's browser supports Geolocation
*****************************************************/
let getUserLocation = function (position) {
  document.querySelector('#rattings-wrapper').style.display = 'block';
  document.querySelector('#bottomSection').style.display = 'block';
  document.querySelector('#footer').style.display = 'block';
  document.querySelector('#bottomSection').style.display = 'none';
  //user location coordinates
  let lat = position.coords.latitude;
  let lng = position.coords.longitude;
  console.log("To get the location used for this project, please use LAT (52.6431335), and LNG (1.3342981999999999)");
  pos = { lat: lat, lng: lng };
  //map built-in controls
  mapOptions = {
    center: new google.maps.LatLng(lat, lng),
    zoom: 14.5,
    styles: myMapStyles,
    panControl: true,
    scaleControl: false,
    mapTypeControl: true,
    mapTypeControlOptions: {
      mapTypeIds: [google.maps.MapTypeId.ROADMAP, google.maps.MapTypeId.HYBRID/*, google.maps.MapTypeId.SATELLITE, google.maps.MapTypeId.TERRAIN*/],
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
  myMap = new google.maps.Map(document.getElementById('map'), mapOptions);
  //user marker
  user_marker = new google.maps.Marker({ 
    position: pos, 
    map: myMap, 
    icon: user_mrkrIcon, 
    draggable: true,
    animation: google.maps.Animation.BOUNCE 
  });
  setTimeout(function () {
    user_marker.setAnimation(null)
  }, 3000);

  //Adding new restaurant by clicking on the map
  google.maps.event.addListener(myMap, 'rightclick', function(event) {
    createNewRestaurant(event.latLng);
  });

  //Google Places API
  let request = {
    fields: ['name', 'geometry', 'rating', 'user_ratings_total', 'photos', 'icon', 'place_id', 'opening_hours', 'permanently_closed'],
    location: pos,
    radius: '1500',
    type: ['restaurant']
  };
  //nearbySearch
  service = new google.maps.places.PlacesService(myMap);
  service.nearbySearch(request, getRestaurants); //Place Details Requests ->  service.getDetails(request, callback);
  //Find Place from Query
  
};//.getUserLocation()

function getPhotoHTML(photo) {
  let photoURL = "https://maps.googleapis.com/maps/api/place/photo?maxwidth=200&photoreference=";
  if (photo) {
    photoURL += photo[0].photo_reference;
    photoURL += "&key=" + apiKey;
    const restIMG = "<img src='" + photoURL + "' />";
    return restIMG;
  } 
  else {
    const restIMG = "<img src='../images/restaurant.png'/>";
    return restIMG;
  }
}

let iw_content;

/** Computing the average for markers (star no)
************************************************************/
function getMarker_No(rating) {
  if (rating == null || rating === 'undefined') {
    let int = 0;
    return int;
  } 
  let int = Math.floor(rating); 
  let decimal = (rating % 1).toFixed(1); 
  if (int >= 1) {
    if (decimal >= 0.8) {
      int ++;
    }
    return int;
  }
  else {
    int = 0;
    return int;
  }   
};

/** Computing the average for (rating) stars
************************************************************/
function getXstars(rating) { 
  let int = Math.floor(rating); 
  // console.log("(rating)int: " + int);
  let decimal = (rating % 1).toFixed(1); 
  // console.log("(rating)decimal: " + decimal);
  let allStars = '<img src="../images/fStar-user-rate.png"/>';
  let counter = 0;
  if (int >= 1) {
    for (let i = 1; i < int; i++) {
      allStars = allStars + '<img src="../images/fStar-user-rate.png"/>'; //whole stars
      counter++;
    }
    if (decimal >= 0.8) {
      allStars = allStars + '<img src="../images/fStar-user-rate.png"/>'; 
      counter++;
    }
    if (decimal > 0.3 && decimal <= 0.7) {
      allStars = allStars + '<img src="../images/hStar-user-rate.png"/>'; //half star
      counter++;
    }
    if (decimal <= 0.3) {
      allStars = allStars + '<img src="../images/noStar-user-rate.png"/>'; 
      counter++;
    }
    if (counter < 5) {
      let starsRemaining = 5 - counter;
      for (let i = 1; i < starsRemaining; i++) {
        allStars = allStars + '<img src="../images/noStar-user-rate.png"/>'; //empty star(s)  
      }
      return allStars;
    }
    return allStars;
  }
  else {
    // console.log("fail - no reviews found");
    allStars = '<img src="../images/noStar-user-rate.png"/>'; //empty stars
    for (let i = 1; i < 5; i++) {
      allStars = allStars + '<img src="../images/noStar-user-rate.png"/>';
    }
    return allStars;
  }   
}; 

function getDistanceInMiles(point_a, point_b) {
  let distance_in_meters = google.maps.geometry.spherical.computeDistanceBetween(point_a, point_b);
  let distance_in_miles = distance_in_meters * 0.000621371; // converts meters to miles
  return distance_in_miles.toFixed(1);
}

const markers = [];
/** Trigger marker click event
*****************************************************/
function showPopup(rest_index) {
  google.maps.event.trigger(markers[rest_index], 'click');
};

/** Factory function
************************************************************/
const restPlace = function(name, address, telephone, website, lat, lng, rating, userRatingsTotal, reviews, icon, photos, priceLevel, restIndex) {
  //private data variables
  const rName = name;
  const rAddress = address;
  const rTelephone = telephone;
  const rWebsite = website;
  let rLat = lat;
  let rLng = lng;
  const rRating = rating;
  //dealing with no ratings
  function getRating(rRating) { 
    if (rRating == null || rRating === 'undefined') {
      rRating = 0;
      // return getMarker_No(rRating).toFixed(1);
      return getMarker_No(rRating);
    }
    else {
     return rRating;  
    }         
  };
  function getRatingsTotal(rRatingsTotal) { 
    if (rRatingsTotal == null || rRatingsTotal === 'undefined') {
      rRatingsTotal = 0;
      return rRatingsTotal;
    }
    else {
     return rRatingsTotal;  
    }         
  };
  const rRatingsTotal = userRatingsTotal;
  const rReviews = reviews;
  const rIcon = icon;
  const rPhoto = photos;
  const rPriceLevel = priceLevel;
  const rRestIndex = restIndex;

  let rAvg_mrkr = getMarker_No(rRating);
  let markerImg = '../images/' + rAvg_mrkr + 'star-marker.png';
  let xxxxxStars = getXstars(rRating);
  let rPopup = `
    <div class="popup_cttWrapper" style="width: 220px;">
      <div style="margin: auto; width: 200px; height: 100px;"><img style="width: 100%; height: 100%;" src="../images/food.png"/></div>
      <div>
        <p style="margin: 4px 0 12px; padding: 0; display: flex; justify-content: center;">
          <span style="font-size: 13px; font-weight: 600; color: #E7711B; padding-top: 2px;">${getRating(rRating)}</span> 
          <span style="margin-left: 3px;">${xxxxxStars}</span><span id="noRev" style="margin-left: 3px;">(${getRatingsTotal(rRatingsTotal)} reviews)</span>
        </p>
        <h5 style="font-size: 1rem; margin: 0 0 4px; font-weight: 600; color: #91CA00; display: block;" data-marker-title="${rName}">${rName}</h5>
        <p style=" width: 200px; display: flex; margin: 0 0 4px;">${rAddress}</p>
        <p style="font-size: 13px; margin: 0 0 4px;"> <a href="tel:${rTelephone}"><img src="../images/telephone.png" style="width: 16px; padding-bottom: 3px; height: 16px; margin-right: 3px;"/> ${rTelephone}</a> </p>
      </div>
      <div style="display: flex; justify-content: center; padding: 0px;">
        <p style="font-size: 15px; font-weight: 400; padding: 0px; margin: 16px 0px">
          <a class="see-reviews-btn" href="#bottomSection" onClick="showReviews(${rRestIndex});">See reviews</a>
        </p>
      </div>
    </div>`;
  const user_point = new google.maps.LatLng(pos.lat, pos.lng); 
  const restaurant_point = new google.maps.LatLng(lat, lng);
  const distanceInMiles = getDistanceInMiles(user_point, restaurant_point);  
  let rListItem = `
    <li id="${rRestIndex}" class="selection">
      <a onClick="showPopup(${rRestIndex});" href="#header" class="liDirectChild marker-link" data-marker-id="${rRestIndex}" data-marker-title="${rName}">
        <div class="restaurant-pic-wrapper"><img src="../images/food.png"/></div>
        <div class="restaurant-brief-wrapper">
          <h5>${rName}</h5>
          <div style="margin: 0; display: flex;"> 
            <p style="margin: 0; padding: 0;">
              <div style="font-size: 13px; font-weight: 600; color: #E7711B; padding-top: 1.5px;">${rRating}</div> 
              <span style="font-size: 13px; margin-left: 3px;">${xxxxxStars}</span>
              <span id="noRev" style="font-size: 13px; margin-left: 3px; color: #9F9E9E;">(${rRatingsTotal} reviews)</span>
            </p>
          </div> 
          <p style="display: flex; margin: 0; padding: 0;">
            <span style="width: 16px; height: 16px;"> 
              <img src="../images/location_marker.png" alt="location in miles" style="width: 100%; height: 100%;"/>
            </span>
            <span id="lct-marker" style="font-size: 13px; margin-left: 3px; padding-top: 4px; color: #9F9E9E;">${distanceInMiles} mi</span>
          </p>
        </div>
      </a>
    </li>`;
  let infowindow = new google.maps.InfoWindow;
  let marker = new google.maps.Marker({
    title: `${rName}`,
    position: {lat: rLat, lng: rLng},
    icon: markerImg,
    map: myMap
  });
 marker.addListener('click', function(e) {
        infowindow.setContent(rPopup); 
        infowindow.open(myMap, marker);
      });
 //IEFE
  return {
    //closure functions - public methods and properties
    popup: function() { 
      // console.log(`RESTAURANT: ${rName}, VALOR DE MARKER = ${rAvg_mrkr}, VALOR DE INDEX = ${rRestIndex}`);
      $('.restaurant-list').append(rListItem);
      // applying styles to active <li> elems 
      $('.restaurant-list li').click(function(e) {
        document.querySelector('#bottomSection').style.display = "none";
        let elems = document.querySelectorAll('.selection.selected');
        for (let i = 0; i < elems.length; i++) {
          elems[i].classList.remove('selected');
          elems[i].style.backgroundColor = '#fff'; //overrides previous (green) 
        }
        $(this).addClass('selected');
        let selected = document.querySelector('.selected');
        selected.style.backgroundColor = '#D9FEA2';
        e.preventDefault();
      });

    }
    // list: function() {
    //   $('.restaurant-list').append(rListItem);

    //   // applying styles to active <li> elems 
    //   $('.restaurant-list li').click(function(e) {
    //     // document.querySelector('#bottomSection').style.display = "none";
    //     let elems = document.querySelectorAll('.selection.selected');
    //     for (let i = 0; i < elems.length; i++) {
    //       elems[i].classList.remove('selected');
    //       elems[i].style.backgroundColor = '#fff'; //overrides previous (green) 
    //     }
    //     $(this).addClass('selected');
    //     let selected = document.querySelector('.selected');
    //     selected.style.backgroundColor = '#D9FEA2';
    //     e.preventDefault();
    //   });
    // } //.list
  };

}

function getRestaurants(results, status) { //(Array<PlaceResult>, PlacesServiceStatus, PlaceSearchPagination)
  if (status == google.maps.places.PlacesServiceStatus.OK) {
    // console.info(JSON.stringify(results, null, ' '));
    console.log(results); 
    //loop through returned results
    $.each(results, function(i, entry) {
      // console.log(i);
       getRestaurants_details(i, entry);
    });
    
  } else if (status == google.maps.places.PlacesServiceStatus.ZERO_RESULTS) {
    let noRestFound_msg =`
      <div id="error-card">
        <div id="msg-wrapper">
          <div class="logo-wrapper"> <img src="../images/no-location-marker.png" alt="no restaurants"/> </div>
          <h4 style="color: #2E2A24; font-weight: 600; margin: 30px 0 15px 0;">No restaurants found at your current location</h4>
        </div>
      </div>`;
    document.getElementById('error_display').innerHTML = noRestFound_msg;
    console.log('No restaurants found at your current location');
  } else if (status == google.maps.places.PlacesServiceStatus.OVER_QUERY_LIMIT) {
    console.log('The app\'s exceeded its request usage limits. Give it a few seconds or try within the next 24 hours.'); //error code 403 or 429
  } else if (status == google.maps.places.PlacesServiceStatus.REQUEST_DENIED || status == google.maps.places.PlacesServiceStatus.INVALID_REQUEST) {
    console.log('Request denied. Request query parameter(s) either invalid or missing.');
  } else {
    console.log('Server-side error. Please try again.'); //UNKNOWN_ERROR
  }
}

function getRestaurants_details(i, place) {
  //Place Details Requests - to get place reviews, regionally converted phone numbers, website, etc
  var request = {
      placeId : place.place_id,
  };
  service = new google.maps.places.PlacesService(myMap);
  service.getDetails(request, function(results, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      // console.log(results.url +' > ' + results.name);
      console.log(results);
      //factory function
      const restaurant = restPlace(results.name, results.formatted_address, results.formatted_phone_number, 
        results.website, results.geometry.location.lat(), results.geometry.location.lng(), results.rating, 
        results.user_ratings_total, results.reviews, results.icon, results.photos, results.price_level, i
      );
      restaurantsList[restaurantsList.length] = restaurant;
    } 
    else if (status === google.maps.GeocoderStatus.OVER_QUERY_LIMIT) {
      //Asynchronous programming 
      /*******************************************************************************
        * Because Place Details requests only lets you query 10 results per second, 
        * we're using setTimeout() to get around the OVER_QUERY_LIMIT issue
        **************************************************************************/    
      setTimeout(function() {
        getRestaurants_details(i, place);
      }, 2000);
    }
  }); 
  //show restaurants
  showLocalRestaurants();

}//.getRestaurantsMoreInfo() 

let xyz = 0;
function showLocalRestaurants() {
  for (let i = 0; i < restaurantsList.length; i++) {
    //closure
    restaurantsList[i].popup();
    // restaurantsList[i].list();
    console.log(xyz + 1); //tracks the number of times the loop runs
  }
}


function showRestaurants(data) {
   console.log("Parsed JSON: ",   data);
  /** Finding avarage of restaurants' reviews 
  *****************************************************/
  for (let i = 0; i < data.length; i++) {
    // let lat = data[i].lat;
    // let lng = data[i].long;
    let ratings = data[i].ratings;
    let website = data[i].website;
    let restaurant = data[i].restaurantName;
    let telephone = data[i].telephone;
    let address = data[i].address;
    rest_index = i;
    let values = []; //stores starred rating values
    let sum = 0;
    let numbOfReviews = 0;
    let x_rest_reviews = [];

    for (let j = 0; j < ratings.length; j++) {
      let rate = ratings[j].stars; //takes int
      values.push(rate);
      sum += rate;
      numbOfReviews ++; 
      let comment = ratings[j].comment;
      let rvw;
      let userName = `User${j+1}`;
      if (ratings[j]) {
        rvw = newRestReview(userName, rate, comment);
      }
      x_rest_reviews.push(rvw);
    }
    //calculating rating avarages
    rtngAvg = sum / values.length; //eg: 1.3333333333333333
    console.log("===rtngAvg===" + rtngAvg);
    avg = rtngAvg.toFixed(1); //eg: 1.3
    console.log("===avg===" + avg);
    //avg_mrkr is upon execution of getXstars(avg) 
    avg_mrkr[i] = rtngAvg.toFixed(0); //initial value 
    console.log("===avg_mrkr===" + avg_mrkr[i]);

    /** if no reviews found
    *****************************************************/
    if (isNaN(avg_mrkr[i]) || isNaN(avg)) {
      let noReviews = 0;
      avg_mrkr[i] = noReviews;
      avg = noReviews.toFixed(1);
      console.log("avg_mrkr (for map markers) assumes ---> " + avg_mrkr[i]);
      console.log("avg (for li elems) assumes ---> " + avg);
    }
    //call xxxxxStars
    console.log("-----RESTAURANT[" + [i] + "] avg = " + avg);        
    const xxxxxStars = getXstars(avg); //xxxxxStars holds number of stars being printed on the page, avg is 0.0 when no reviews found 

    /** Getting distance in miles using Geometry library
    // *****************************************************/
    // const user_point = new google.maps.LatLng(pos.lat, pos.lng); //user point on the map
    // console.log("USER POINT ON THE MAP: " + pos.lat + ", " + pos.lng);
    // const restaurant_point = new google.maps.LatLng(lat, lng); //restaurant point on the map
    // console.log("RESTAURANT POINT ON THE MAP: " + lat + ", " + lng);
    // distance_miles = getDistanceInMiles(user_point, restaurant_point);  
    // console.log( "The distance between USER POINT and RESTAURANT POINT = " + distance_miles.toFixed(1) + " miles" );

    /** Data to be loaded on the page and on the map 
    *****************************************************/ 
    // const popup = restPopup(avg, xxxxxStars, numbOfReviews, restaurant, address, telephone, i); //for infowindow content
    // const liItem = restList(avg, xxxxxStars, numbOfReviews, restaurant, website, distance_miles, i); //for list 
    const rest_dtls = restDtls(avg, xxxxxStars, numbOfReviews, restaurant, address, telephone, website); //for bottom section
    
    //updating global variables
    // let markerImg = '../images/' + avg_mrkr[i] + 'star-marker.png';
    // console.log( " -- UDATE: avg_mrkr = " + avg_mrkr[i]);
    
    fooodLocations.push([restaurant, {lat, lng}, markerImg, popup, liItem]); //bidimentional array
    // restaurantsList += liItem;
    foodReviews.push([rest_dtls, x_rest_reviews]);

  } //outer for loop

  iw_restDtls = new google.maps.InfoWindow;
  //placing restaurant marker, li items and applying click events to each marker
  for (let i = 0; i < fooodLocations.length; i++) { 
    //creating marker and applying click event to show correspondent infowindow content
    let marker = new google.maps.Marker({
      title: `${fooodLocations[i][0]}`,
      position: fooodLocations[i][1],
      icon: fooodLocations[i][2],/*markerImg*/ 
      map: myMap
    });
    marker.addListener('click', function(e) {
      // iw_restDtls.setPosition(fooodLocations[i][1]);
      iw_restDtls.setContent(fooodLocations[i][3]); 
      iw_restDtls.open(myMap, marker);
    });
    //update markers arr
    markers.push(marker);
    //displaying restaurants on the side of the page
    $('.restaurant-list').append(fooodLocations[i][4]);
  } 
   // adding styles to active <li> elements 
  $('.restaurant-list li').click(function(e) {
    // document.querySelector('#bottomSection').style.display = "none";
    let elems = document.querySelectorAll('.selection.selected');
    //remove all pre-existing active classes
    for (let i = 0; i < elems.length; i++) {
      elems[i].classList.remove('selected');
      elems[i].style.backgroundColor = '#fff'; //remove '#D9FEA2' (green) background
    }
    //add the active class to clicked <li>
    $(this).addClass('selected');
    let selected = document.querySelector('.selected');
    selected.style.backgroundColor = '#D9FEA2';
    e.preventDefault();
  });

}//.showRestaurants(data)

