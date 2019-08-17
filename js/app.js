// ECMAScript 5 Strict Mode
"use strict";

/*===========================================================================================================
*  SOME Map AND DOM ELEMENTS
===========================================================================================================*/
const user_geoLct = document.getElementById("ui-lct");
let myMap;
let mapOptions;
let script = document.createElement('script');
const user_mrkrIcon  = 'images/user.png';
let user_marker;
let errorDisplay = document.getElementById('error-display');
let welcome_msg = `
  <div id="welcome-card">
    <div id="welcome-msg-wrapper">
      <h4 style="color: #A09E9B; font-weight: 600; margin: 30px 0 15px 0;">Location-based Experience</h4>
      <h6 style="color: #B3B1AF;"><strong>Food Spot</strong> uses location to find restaurants around you.</h6>
    </div>
  </div>`;
let error_msg =`
  <div id="error-card">
    <div id="msg-wrapper">
      <div class="logo-wrapper"> <img src="images/no-location-marker.png" alt="user location"/> </div>
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
let restaurantsList = []; // collection of restaurant objects
let foodReviews = [];
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
  const msg_wrapper = document.getElementById('msg_Display');
  console.log("Unable to retrieve your location");
  document.getElementById('msg_display').innerHTML = error_msg;
};
/** Improving device location accuracy
*****************************************************/
let options = {
  timeout: 5000,
  maximumage: 3000, // how long until we update position for more information (restaurants) 
  enableHighAccuracy: true // for best possible location results
}

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
  let allStars = '<img src="images/fStar-user-rate.png"/>';
  let counter = 0;
  if (int >= 1) {
    for (let i = 1; i < int; i++) {
      allStars = allStars + '<img src="images/fStar-user-rate.png"/>'; // whole stars
      counter++;
    }
    if (decimal >= 0.8) {
      allStars = allStars + '<img src="images/fStar-user-rate.png"/>'; 
      counter++;
    }
    if (decimal > 0.3 && decimal <= 0.7) {
      allStars = allStars + '<img src="images/hStar-user-rate.png"/>'; // half star
      counter++;
    }
    if (decimal <= 0.3) {
      allStars = allStars + '<img src="images/noStar-user-rate.png"/>'; 
      counter++;
    }
    if (counter < 5) {
      let starsRemaining = 5 - counter;
      for (let i = 1; i < starsRemaining; i++) {
        allStars = allStars + '<img src="images/noStar-user-rate.png"/>'; // empty star(s)  
      }
      return allStars;
    }
    return allStars;
  }
  else {
    // console.log("fail - no reviews found");
    allStars = '<img src="images/noStar-user-rate.png"/>'; // empty stars
    for (let i = 1; i < 5; i++) {
      allStars = allStars + '<img src="images/noStar-user-rate.png"/>';
    }
    return allStars;
  }   
}; 

function getUserScore(score) { 
  let int = score; 
  let allStars = '<img src="images/fStar-user-rate.png"/>';
  let counter = 0;
  if (int >= 1) {
    for (let i = 1; i < int; i++) {
      allStars = allStars + '<img src="images/fStar-user-rate.png"/>'; // whole stars
      counter++;
    }
    if (counter < 5) {
      let starsRemaining = 5 - counter;
      for (let i = 1; i < starsRemaining; i++) {
        allStars = allStars + '<img src="images/noStar-user-rate.png"/>'; // empty star(s)  
      }
      return allStars;
    }
    return allStars;
  }
  else {
    // console.log("fail - no reviews found");
    allStars = '<img src="images/noStar-user-rate.png"/>'; // empty stars
    for (let i = 1; i < 5; i++) {
      allStars = allStars + '<img src="images/noStar-user-rate.png"/>';
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
const infowindows = [];
/** marker click event
*****************************************************/
function showPopup(rest_index) {
  infowindows.forEach(infowindow => infowindow.close());
  google.maps.event.trigger(markers[rest_index], 'click');
  // target list element on the side of the page
  let li_elem_id = '#' + rest_index;
  $(this).click(function(e) {
    // remove all pre-existing active classes
    elems = document.querySelectorAll('.selection.selected');
    for (let i = 0; i < elems.length; i++) { 
      elems[i].classList.remove('selected');
      elems[i].style.backgroundColor = '#fff'; // restore white background (#D9FEA2)
    }
    // add styles to correspondent <li>
    $(li_elem_id).addClass('selected');
    let selected = document.querySelector('.selected');
    selected.style.backgroundColor = '#D9FEA2';
  });
};

function getNoRating(rRating) { 
  if (rRating == null || rRating === 'undefined') {
    rRating = 0;
    return getMarker_No(rRating);
  } else {
    return rRating;  
  }         
}

function getNoRatingsTotal(rRatingsTotal) { 
  if (rRatingsTotal == null || rRatingsTotal === 'undefined') {
    rRatingsTotal = 0;
    return rRatingsTotal;
  } else {
    return rRatingsTotal;  
  }         
}
/** restaurant popup
*****************************************************/  
function rest_popup(rPhoto, getRating, xxxxxStars, getRatingsTotal, rName, rAddress, rTelephone, rRestIndex) {
  return `
  <div class="popup_cttWrapper" style="width: 220px;">
    <div style="margin: auto; width: 200px; height: 100px;">${rPhoto}</div>
    <div>
      <p style="margin: 4px 0 12px; padding: 0; display: flex; justify-content: center;">
        <span style="font-size: 13px; font-weight: 600; color: #E7711B; padding-top: 2px;">${getRating.toFixed(1)}</span> 
        <span style="margin-left: 3px;">${xxxxxStars}</span><span id="noRev" style="margin-left: 3px;">(${getRatingsTotal} reviews)</span>
      </p>
      <h5 style="font-size: 1rem; margin: 0 0 4px; font-weight: 600; color: #91CA00; display: block;" data-marker-title="${rName}">${rName}</h5>
      <p style=" width: 200px; display: flex; margin: 0 0 4px;">${rAddress}</p>
      <p style="font-size: 13px; margin: 0 0 4px;"> <a href="tel:${rTelephone}"><img src="images/telephone.png" style="width: 16px; padding-bottom: 3px; height: 16px; margin-right: 3px;"/> ${rTelephone}</a> </p>
    </div>
    <div style="display: flex; justify-content: center; padding: 0px;">
      <p style="font-size: 15px; font-weight: 400; padding: 0px; margin: 16px 0px">
        <a class="see-reviews-btn" href="#bottomSection" onClick="showReviews(${rRestIndex});">See reviews</a>
      </p>
    </div>
  </div>`;
}
/** restaurant list element
*****************************************************/  
function rest_liElem(rRestIndex, rPhoto, rName, getRating, xxxxxStars, getRatingsTotal, distanceInMiles, displayLi) {
  return `
  <li id="${rRestIndex}" class="selection" style="display:${displayLi};" data-avgrating="${getRating}">
    <a onclick="showPopup(${rRestIndex});" href="#header" class="liDirectChild marker-link" data-marker-id="${rRestIndex}" data-marker-title="${rName}">
      <div class="restaurant-pic-wrapper">${rPhoto}</div>
      <div class="restaurant-brief-wrapper">
        <h5>${rName}</h5>
        <div style="margin: 0; display: flex;"> 
          <p style="margin: 0; padding: 0;">
            <div style="font-size: 13px; font-weight: 600; color: #E7711B; padding-top: 1.5px;">${getRating.toFixed(1)}</div> 
            <span style="font-size: 13px; margin-left: 3px;">${xxxxxStars}</span>
            <span id="noRev" style="font-size: 13px; margin-left: 3px; color: #9F9E9E;">(${getRatingsTotal} reviews)</span>
          </p>
        </div> 
        <p style="display: flex; margin: 0; padding: 0;">
          <span style="width: 16px; height: 16px;"> 
            <img src="images/location_marker.png" alt="location in miles" style="width: 100%; height: 100%;"/>
          </span>
          <span id="lct-marker" style="font-size: 13px; margin-left: 3px; padding-top: 4px; color: #9F9E9E;">${distanceInMiles} miles</span>
        </p>
      </div>
    </a>
  </li>`;
}
/** restaurant brief
*****************************************************/ 
function rest_dtls(rName, isRestOpen, getRating, xxxxxStars, getRatingsTotal, rAddress, rTelephone, rWebsite) {
  let bck, color, isItOpen;
  isItOpen = isRestOpen;
  if (isItOpen === true) {
    isItOpen = 'Open now';
    bck = '#9DC95A';
    color = 'white'; /*'#4CB510';*/
  } else {
    isItOpen = 'Closed now';
    color = 'white'; /*'#561D25';*/
    bck = '#DC493A';
  }
  return `
  <div class="col-hg" style="display: flex; align-items: center; justify-content: center;">
    <div style="width: 100%;">
      <h3 style="display: flex; align-items: center; margin: 0 0 4px; padding: 4px 0; font-weight: 600; color: #2E2A24;">${rName}
        <span style="font-size: 12px; font-weight: 600; padding: 5px; margin-left: 5px; background-color: ${bck}; color: ${color};">${isItOpen}</span>
      </h3>
      <p style="margin: 0 0 4px; padding: 0 0 4px; display: flex;">
        <span style="font-size: 18px; font-weight: 600; color: #E7711B; margin-left: 0px; padding-top: 4px;">${getRating.toFixed(1)}</span> 
        <span style="font-size: 20px; margin-left: 3px;">${xxxxxStars}</span>
        <span id="noRev" style="font-size: 15px; padding-top: 5px; margin-left: 3px;">(${getRatingsTotal} reviews)</span>
      </p>
      <p style="font-size: 18px; padding: 4px 0; margin: 0 0 4px;">${rAddress}</p>
      <p style="font-size: 18px; padding: 4px 0; margin: 0 0 4px; text-decoration: none;"> <a href="tel:${rTelephone}"><img src="../images/telephone.png" style="width: 18px; height: 18px; padding-bottom: 3px;  margin-right: 3px;"/> ${rTelephone}</a> </p>
      <p id="bt-align-x" style="font-size: 18px; padding: 18px 0; margin: 0 0 4px;">
        <a id="site-btn" href="${rWebsite}" target="_blank" style="text-decoration: none;">
          <img src="../images/www-icon.png" style="width: 22px; height: 22px; padding-bottom: 2px; margin-right: 3px;"/> visit restaurant site
        </a>
      </p>
    </div> 
  </div>`;
}
/** list restaurant reviews
*****************************************************/
function newRestReview(user, time, score, comment) {
  return `
  <div class="review_item">
    <div class="review-item-top" style="font-size: 18px; font-weight: 600;">
      <p>${user}
        <span style="padding: 0; margin: 0; font-size: 12px; font-weight: normal; color: #9A9A9A;"> - ${time}</span></p>
      <p style="float: right;"><span style="margin-left: 6px;">${score}</span></p>
    </div>
    <div class="review-item-body">
      <p>${comment}</p>
    </div>
  </div>`;
};
/** Adding New Restaurant on the map
*****************************************************/
function createNewRestaurant(location) {
    // add new restaurant marker and taking marker's coordinates
    let new_rest_marker = new google.maps.Marker({
      position: location, 
      map: myMap,
      icon: 'images/new-marker.png', 
      title: 'click to open form'
    });
    const lat = location.lat();
    const lng = location.lng();
    let rest_coordinates = {lat, lng};
    let nRest_address;
    new_rest_marker.addListener('click', function() {
      let geocoder = new google.maps.Geocoder();
      let location = `${geocoding_url}$latlng=${rest_coordinates}&key=${apiKey}`;
      console.log("New restaurant's marker coordinates: \n" + rest_coordinates.lat + ", " + rest_coordinates.lng);
      // Reverse geocoding request
      geocoder.geocode({'location': rest_coordinates}, function(results, status) {
        if (status === 'OK') {
          console.log('Geocoding results: \n', results);
          if (results[0]) {
            myMap.setCenter(rest_coordinates);
            new_rest_marker.setPosition(rest_coordinates);  
            // nRest_address = results[0].formatted_address;
            // console.log(nRest_address);
            // FORM HTML FOR NEW RESTAURANT
            // Containers (div)
            let newRest_form = document.createElement('div');
            newRest_form.setAttribute('class', 'nr_popup_wrapper');
            let nr_inner_div = document.createElement('div'); 
            nr_inner_div.setAttribute('class', 'nr_inner_wrapper');
            // Heading (h5)
            let nr_heading = document.createElement('h5');
            nr_heading.setAttribute('class', 'nr_heading');
            nr_heading.textContent = 'Add New Restaurant';
            nr_inner_div.appendChild(nr_heading);
            // input (Restaurant Name)
            let nr_restName = document.createElement('input');
            nr_restName.setAttribute('type', 'text');
            nr_restName.setAttribute('name', 'newRestName');
            nr_restName.setAttribute('id', 'ui-newRest-name');
            nr_restName.setAttribute('placeholder', 'Restaurant name');
            nr_inner_div.appendChild(nr_restName);
            // select options list (Restaurant Address) 
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
            console.log('Select options list: \n', select);
            nr_inner_div.appendChild(select);
            // input (Restaurant Telephone)
            let nr_restTel = document.createElement('input');
            nr_restTel.setAttribute('type', 'tel');
            nr_restTel.setAttribute('name', 'newRestTelephone');
            nr_restTel.setAttribute('id', 'ui-newRest-telephone');
            nr_restTel.setAttribute('placeholder', 'Restaurant telephone');
            nr_inner_div.appendChild(nr_restTel);
            // input (Restaurant Website)
            let nr_restSite = document.createElement('input');
            nr_restSite.setAttribute('type', 'url');
            nr_restSite.setAttribute('name', 'newRestWebsite');
            nr_restSite.setAttribute('id', 'ui-newRest-website');
            nr_restSite.setAttribute('placeholder', 'Restaurant website');
            nr_inner_div.appendChild(nr_restSite);
            // button (Add Restaurant)
            let nr_restBtn = document.createElement('button');
            nr_restBtn.setAttribute('class', 'nr_btn');
            nr_restBtn.onclick = addNewRestaurant;
            nr_restBtn.textContent = 'Add Restaurant';
            nr_inner_div.appendChild(nr_restBtn);
            newRest_form.appendChild(nr_inner_div);
            
            // infowindow object houses New Restaurant form
            const iw_restDtls = new google.maps.InfoWindow({
              position: rest_coordinates,
              content: newRest_form
            });
            iw_restDtls.open(myMap, new_rest_marker);

            // onClick function - add new restaurant on the map
            function addNewRestaurant() {
              // create new restaurant object based on user input
              let restName, selRestAddress, restTelephone, restWebsite, nrRating, nrTotalRatings, nrReviews, nrIcon, nrPhotos, nrPriceLevel, nrIndexPos, isRestOpen;
              restName = document.getElementById('ui-newRest-name').value;
              selRestAddress = document.getElementById('ui-newRest-address');
              let selRestAddressOption = selRestAddress.options[selRestAddress.selectedIndex].text; 
              console.log(selRestAddressOption);
              restTelephone = document.getElementById('ui-newRest-telephone').value;
              restWebsite = document.getElementById('ui-newRest-website').value;
              nrRating = 0;
              nrTotalRatings = 0;
              const nr_getRating = getNoRating(nrRating);
              const nr_getRatingsTotal = getNoRatingsTotal(nrTotalRatings);
              nrReviews = []; // {author_name: __, rating: __, text: ___},
              // nrIcon = "https://maps.gstatic.com/mapfiles/place_api/icons/restaurant-71.png"; // ...mapfiles/place_api/icons/shopping-71.png
              nrIcon = '../images/restaurant.png';
              /** ****************************************************************************************************************************
              ** A more viable way to add photos when creating a new restaurant would be to give the user the option 
              ** to add their own photo by accessing the file either on their local machine or on their mobile phones.
              ** 
              ** To achieve this I'd we could integrate the >> HTML5 File API + AJAX + Backend PHP (or other language) << 
              ** to send data to the backend and return it on the page once the user submits the form.
              ******************************************************************************************************************************/
              nrPhotos = [
                // properties randomly copied from the results of getDetails request, photos[0] 
                {
                //   height: 4608, 
                //   html_attributions: ["<a href='https://maps.google.com/maps/contrib/102455675478533544119/photos'>Alexandre</a>"], 
                //   width: 2592, 
                //   customised property - because 
                  getUrl: function() {
                    return nrIcon; // processed in get_iw_Photo(photos, icon)
                  }
                } 
              ];
              nrPriceLevel = 1;
              nrIndexPos = restaurantsList.length;
              isRestOpen = true;
              // instantiating restaurant object
              const restaurant = restPlace(restName, selRestAddressOption, restTelephone, 
                restWebsite, rest_coordinates.lat, rest_coordinates.lng, nr_getRating, 
                nr_getRatingsTotal, nrReviews, nrIcon, nrPhotos, nrPriceLevel, nrIndexPos, isRestOpen
              );
              restaurantsList.push(restaurant);
              iw_restDtls.close(myMap, restaurant.marker);
              showPopup(nrIndexPos);
              showRestaurantList();
            } // .addNewRestaurant()
          } else {
            window.alert('No results found');  
          }
        } else {
          window.alert('Geocoder failed due to: ' + status);
        }
      });
    });
}


/*===========================================================================================================
*  INITIALISING GOOGLE MAPS
===========================================================================================================*/
function initMap() {
  // Geolocation API
  if (!navigator.geolocation) { // if user's browser does not support Navigator.geolocation object
    console.log("Geolocation is not supported by your browser");
    alert('Geolocation is not supported by your browser');
  } else {
    document.querySelector('#rattings-wrapper').style.display = 'none';
    document.querySelector('#bottomSection').style.display = 'none';
    document.querySelector('#footer').style.display = 'none';
    document.getElementById('map').innerHTML = welcome_msg;
    // getCurrentPosition gets device's live location
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
  // user location coordinates - read-only properties (black box)
  let lat = position.coords.latitude; // position.coords.latitude 
  let lng = position.coords.longitude;
  console.log("To get the location used for this project, please use LAT (52.6431335), and LNG (1.3342981999999999)");
  pos = { lat: lat, lng: lng };
  createMap(pos);
}

function createMap(pos) {
  let lat = pos.lat;
  let lng = pos.lng;
  // map built-in controls
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
  // user marker
  user_marker = new google.maps.Marker({ 
    position: pos, 
    map: myMap, 
    icon: user_mrkrIcon, 
    draggable: false,
    animation: google.maps.Animation.BOUNCE 
  });
  setTimeout(function () {
    user_marker.setAnimation(null)
  }, 3000);

  // Adding new restaurant by clicking on the map
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
  let loading_status =`
  <div class="loading_status" style="background-color: #201D19;">
    <div id="msg-wrapper">
      <div style="width: 220px; height: 70px; display: block;"> <img src="images/logo-01.png" style="width: 100%; height: 100%;"/> </div>
    </div>
  </div>`;
  document.getElementById('msg_display').innerHTML = loading_status;
  service.nearbySearch(request, getRestaurants); //Place Details Requests ->  service.getDetails(request, callback);
  
};//.createMap()

// Google Place Photos service
function get_iw_Photo(photos, icon) {
  if (photos) {
    let photoURL = photos[0].getUrl({
      maxWidth: 200,
      maxHeight: 100
    });
    const restIMG = `<img src='${photoURL}' style='width: 100%; height: 100%;'/>`;
    return restIMG;
  } 
  else {
    const restIMG = `<img src='${icon}' style='width: 100%; height: 100%;'/>`;
    return restIMG;
  }
}

// Google Place Photos service
function get_LI_Photo(photos, icon) {
  if (photos) {
    let photoURL = photos[0].getUrl({
      maxWidth: 200,
      maxHeight: 100
    });
    console.log('Photo Reference: \n' + photoURL);
    const restIMG = `<img id="photoURL" src='${photoURL}' id="get_LI_Photo"/>`;
    return restIMG;
  } 
  else {
    const restIMG = `<img id="iconIMG" src='${icon}' id="get_LI_Icon"/>`;
    return restIMG;
  }
}

/** Sort By: show restaurants by user selection
*****************************************************/
let showRated = [0, 1, 2, 3, 4, 5];

function getSelect(selectEl) {
  infowindows.forEach(infowindow => infowindow.close());
  console.log(selectEl);
  showRated = JSON.parse(selectEl.value);
  for(let i = 0; i < markers.length; i++) {
    if (showRated.indexOf(markers[i].restaurantRating) < 0) {
      markers[i].setVisible(false);
    } else {
      markers[i].setVisible(true);
    }
  }
  let restaurantLiEls = document.querySelectorAll(".restaurant-list li"); //returns collection
  for (let j = 0; j < restaurantLiEls.length; j++) {
    let avgRating = parseInt(restaurantLiEls[j].getAttribute("data-avgrating"));
    if (showRated.indexOf(avgRating) < 0) {
      restaurantLiEls[j].style.display = "none";
    } else {
      restaurantLiEls[j].style.display = "list-item"; //"list-item"
    }
  }
}

/** Factory function
************************************************************/
function restPlace(name, address, telephone, website, lat, lng, rating, userRatingsTotal, reviews, icon, photos, priceLevel, restIndex, isOpen) {
  // private data variables
  const rName = name;
  const rAddress = address;
  const rTelephone = telephone;
  const rWebsite = website;
  const rLat = lat;
  const rLng = lng;
  const rRating = rating;
  const rRatingsTotal = userRatingsTotal;
  let rReviews = reviews;
  const rIcon = icon;
  const rPhotos = photos;
  const rPriceLevel = priceLevel;
  const rRestIndex = restIndex;
  const rIsRestOpen = isOpen; // true/false

  const popup_IMG = get_iw_Photo(rPhotos, rIcon);
  const list_IMG = get_LI_Photo(rPhotos, rIcon);
  const user_point = new google.maps.LatLng(pos.lat, pos.lng); 
  const restaurant_point = new google.maps.LatLng(lat, lng);
  const distanceInMiles = getDistanceInMiles(user_point, restaurant_point);
  const getRating = getNoRating(rRating);
  const getRatingsTotal = getNoRatingsTotal(rRatingsTotal);
  const rAvg_mrkr = getMarker_No(rRating);
  const markerImg = 'images/' + rAvg_mrkr + 'star-marker.png';
  const xxxxxStars = getXstars(rRating);
  const displayLi = showRated.indexOf(parseInt(getRating)) >= 0 ? "list-item" : "none";
  const rPopup = rest_popup(popup_IMG, getRating, xxxxxStars, getRatingsTotal, rName, rAddress, rTelephone, rRestIndex); 
  const rListItem = rest_liElem(rRestIndex, list_IMG, rName, getRating, xxxxxStars, getRatingsTotal, distanceInMiles, displayLi);
  const rBrief = rest_dtls(rName, rIsRestOpen, getRating, xxxxxStars, getRatingsTotal, rAddress, rTelephone, rWebsite);
  const rInfowindow = new google.maps.InfoWindow;
  
  const marker = new google.maps.Marker({
    title: `${rName}`,
    position: {lat: rLat, lng: rLng},
    icon: markerImg,
    map: myMap
  });
  marker.restaurantRating = parseInt(getRating);
  if(showRated.indexOf(marker.restaurantRating) < 0) {
    marker.setVisible(false);
  }
  marker.addListener('click', function(e) {
    infowindows.forEach(infowindow => infowindow.close());
    rInfowindow.setContent(rPopup); 
    rInfowindow.open(myMap, marker);
    // myMap.setCenter({lat: rLat, lng: rLng});
  });

  infowindows.push(rInfowindow);
  markers.push(marker);
  // IEFE
  return {
    // closure functions - public methods and properties
    list: function() {
      $('.restaurant-list').append(rListItem);
      $('.restaurant-list li').click(function(e) {
        document.querySelector('#bottomSection').style.display = "none";
        let elems = document.querySelectorAll('.selection.selected');
        for (let i = 0; i < elems.length; i++) {
          elems[i].classList.remove('selected');
          elems[i].style.backgroundColor = '#fff'; // overrides previous (green) 
        }
        $(this).addClass('selected');
        let selected = document.querySelector('.selected');
        selected.style.backgroundColor = '#D9FEA2';
        e.preventDefault();
      });

    },
    brief: function() {
      // show restaurant brief
      document.querySelector('#rest-brief').innerHTML = rBrief;
       // show Street View panorama
      let panorama = new google.maps.StreetViewPanorama(document.getElementById('street-view'), {
        position: {lat: rLat, lng: rLng},
        pov: {heading: 270, pitch: 10},
        motionTracking: false,
        fullscreenControl: false,
        linksControl: false,
        panControl: false,
        zoom: 0
      });
    }, // .brief
    reviews: function() {
      let rvwsList = '<ul>';
      for (let i = 0; i < rReviews.length; i++) {
        console.log('User: ' + rReviews[i].author_name + '\nReview Time: ' 
          + rReviews[i].relative_time_description + '\nRating: ' + rReviews[i].rating + '\nReview: ' + rReviews[i].text);
        const user_name = rReviews[i].author_name;
        const user_review = rReviews[i].text;
        const review_time = rReviews[i].relative_time_description;
        const user_xxxxxStars = getUserScore(rReviews[i].rating);
        // create review
        const review = newRestReview(user_name, review_time, user_xxxxxStars, user_review);
        rvwsList += '<li>' + review + '</li>'
      }
      rvwsList += '</ul>';
      document.querySelector('#rest-reviews').innerHTML = rvwsList; 
    }, // .reviews
    housing: function(newReview) {
      console.log('user: ' + newReview.author_name + '\nscore: ' + newReview.rating + '\nreview: \n' + newReview['text']);
      rReviews.unshift(newReview);
    }
  }; // .iefe
} // .restPlace

function getRestaurants(results, status) { // (Array<PlaceResult>, PlacesServiceStatus, PlaceSearchPagination)

  if (status == google.maps.places.PlacesServiceStatus.OK) {
    // console.log('NEARBY RESULTS'); 
    // console.info(JSON.stringify(results); //console.info(JSON.stringify(results, null, ' '));
    console.log('NEARBY DETAILED RESULTS'); 

    getRestaurants_details(results);

  } else if (status == google.maps.places.PlacesServiceStatus.ZERO_RESULTS) {
    let noRestFound_msg =`
      <div id="error-card">
        <div id="msg-wrapper">
          <div class="logo-wrapper"> <img src="images/no-location-marker.png" alt="no restaurants"/> </div>
          <h4 style="color: #2E2A24; font-weight: 600; margin: 30px 0 15px 0;">No restaurants found at your current location</h4>
        </div>
      </div>`;
    document.getElementById('msg_display').innerHTML = noRestFound_msg;
    console.log('No restaurants found at your current location');
  } else if (status == google.maps.places.PlacesServiceStatus.OVER_QUERY_LIMIT) {
    console.log('The app\'s exceeded its request usage limits. Give it a few seconds or try within the next 24 hours.'); // error code 403 or 429
  } else if (status == google.maps.places.PlacesServiceStatus.REQUEST_DENIED || status == google.maps.places.PlacesServiceStatus.INVALID_REQUEST) {
    console.log('Request denied. Request query parameter(s) either invalid or missing.');
  } else {
    console.log('Server-side error. Please try again.'); // UNKNOWN_ERROR
  }
}

let currentRestaurant = null;
let loopCounter = 0;

function showRestaurantList() {
  document.getElementById('msg_display').style.display = 'none';
  console.log("All restaurants have been processed. Dumping restaurantsList below:");
  for (let i = 0; i < restaurantsList.length; i++) {
    restaurantsList[i].list();
  }
}

function getRestaurants_details(restPlaces) {
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
      getRestaurants_details(restPlaces);
    } 
    else if (status === google.maps.GeocoderStatus.OVER_QUERY_LIMIT) {
      // Asynchronous programming 
      /*******************************************************************************
        * Because Place Details requests only lets you query 10 results per second, 
        * we're using setTimeout() to get around the OVER_QUERY_LIMIT issue
        **************************************************************************/
      console.log("OVER_QUERY_LIMIT ... Waiting 200ms to retry");
      setTimeout(function() {
        getRestaurants_details(restPlaces);
      }, 200);
    }
  }); 
}

/** Mobile-only Carousel
************************************************************/
function myCarousel(mql) {
  if (mql.matches) { // If media query matches
    // document.body.style.backgroundColor = 'yellow';

    // Container carousel and cell elems
    let ulElm = document.querySelector('ul.restaurant-list');
    let liElms = document.getElementsByClassName('selection');
    ulElm.className += ' main-carousel'; // adds new class, "main-carousel"
    for (let i = 0; i < liElms.length; i++) {
      // liElms[i].setAttribute('class', 'selection carousel-cell');
      liElms[i].className += ' carousel-cell';
    }
    // Carousel is created using the css classes created above

    //add swipe icons
    // const node = document.getElementsByClassName('restaurants-list-wrapper');
    const node = document.getElementsByClassName('swipe-wrapper');
    //check if class 'icons-wrapper' exists (to avoid appending it twice whenever user switches to mobile view)
    // if ($(node).hasClass('icons-wrapper')) {
    //   console.log("Element with className of 'icons-wrapper' exists.");
    // } else {
      //create swipe icons
      const iconsWrapper = document.createElement('div');
      iconsWrapper.className = 'icons-wrapper';
      const icons =`
          <span style='display: border: 1px solid green; width: 40px; height: 40px;' class="swipe-L-icon"><img src='../images/swipe-L-icon.png'/></span>
          <span  style='display: border: 1px solid green; width: 40px; height: 40px;' class="swipe-R-icon"><img src='../images/swipe-R-icon.png'/></span>`;
      $(iconsWrapper).append(icons);
      $(node).append(iconsWrapper);
    // }
  }
  // else {
  //   // document.body.style.backgroundColor = 'pink';
  // }
}
const mql = window.matchMedia('(max-width: 767px)'); // The Window interface's matchMedia() method returns a new MediaQueryList object 
myCarousel(mql);
mql.addListener(myCarousel); // Attach listener function on state changes



/** Showing Restaurant reviews
*****************************************************/
function showReviews(rest_index) {
  document.querySelector('#bottomSection').style.display = 'block';
  // show restaurant brief and Street View
  for (let i = 0; i < restaurantsList.length; i++) {
    if (i === rest_index) {
      restaurantsList[i].brief();
      restaurantsList[i].reviews();
    }
  }
  // target list element on the side of the page
  let li_elem_id = '#' + rest_index;
  $(this).click(function(e) {
    // remove all pre-existing active classes
    elems = document.querySelectorAll('.selection.selected');
    for (let i = 0; i < elems.length; i++) { 
      elems[i].classList.remove('selected');
      elems[i].style.backgroundColor = '#fff'; // restore white background (#D9FEA2)
    }
    // add styles to correspondent <li>
    $(li_elem_id).addClass('selected');
    let selected = document.querySelector('.selected');
    selected.style.backgroundColor = '#D9FEA2';
  });
  //passing onClick function to a button
  const modalBtn = document.getElementById('leave-review');
  modalBtn.setAttribute('onClick', `addReview(${rest_index});`);
} // .showReviews


/** Adding a new review
*****************************************************/
//Open modal form
function addReview(rest_index) {
  document.getElementById('review_dialog-box').innerHTML = modal;
  //passing onClick function to a button
  let modal_addReviewBtn = document.getElementById('add-review-btn');
  modal_addReviewBtn.setAttribute('onClick', `submitReview(${rest_index});`);
}
//Close review form
let close_ReviewBtn = document.getElementById('close-review-btn');
function close_ReviewForm() {
  let modal = document.getElementById('close-review-btn').closest('#modalWrapper');
  modal.style.display = "none";
}
//submit review form
function submitReview(rest_index) {
  document.getElementById('full-name').required;
  document.getElementById('user-review').required;
  // take user input 
  const user_fName = document.getElementById('full-name').value;
  const dropdown = document.getElementById('score');
  const score = dropdown.options[dropdown.selectedIndex].text;
  let user_score = parseInt(score, 10);
  const user_comment = document.getElementById('user-review').value;
  // add review to restaurantsList array
  const newReview = { 
    author_name: user_fName,
    rating: user_score, 
    relative_time_description: 'added today', // setInterval,
    text: user_comment
  }
  for (let i = 0; i < restaurantsList.length; i++) {
    if (i === rest_index) {
      restaurantsList[i].housing(newReview);
      restaurantsList[i].reviews();
    }
  }
  close_ReviewForm(); 
}

/** Find Place from Query
*****************************************************/
function codeAddress() {
  // hide any existing li elems
  let restaurantLiEls = document.querySelectorAll(".restaurant-list li"); //returns collection
  for (let j = 0; j < restaurantLiEls.length; j++) {
    restaurantLiEls[j].style.display = "none";
  }
  // prepare global arrays for new values
  restaurantsList = []; 
  markers.length = 0;
  loopCounter = 0;

  let userQuery = document.getElementById('ui-query').value;
  console.log(userQuery);
  let request = {
    query: userQuery,
    fields: ['name', 'geometry']
  };
  let service = new google.maps.places.PlacesService(myMap);
  service.findPlaceFromQuery(request, function(results, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      for (let i = 0; i < results.length; i++) {
        // createMarker(results[i]);
        console.log('number of results: ' + results.length);
        console.log(results[i]);
        const lat = results[i].geometry.location.lat();
        const lng = results[i].geometry.location.lng();
        console.log('latitude: ' + lat + ', longitude: ' + lng); //undefined 
        const coords = {
          lat: lat,
          lng: lng
        };
        createMap(coords);
      }
    }
  });
  console.log(restaurantsList);
}

// function geolocate() {
//   // if (navigator.geolocation) {
//   //   navigator.geolocation.getCurrentPosition(function(position) {
//   //     const geolocation = {
//   //       lat: position.coords.latitude,
//   //       lng: position.coords.longitude
//   //     };
//   //     const circle = new google.maps.Circle(
//   //       { center: geolocation, radius: position.coords.accuracy });
//   //     autocomplete.setBounds(circle.getBounds());
//   //   });
//   // }
// }
