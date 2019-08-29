"use strict";


/*===========================================================================================================
*  SOME Map AND DOM ELEMENTS
===========================================================================================================*/

let myMap, mapOptions, userMarker, pos, service;
const user_geoLct = document.getElementById("ui-lct");
const user_mrkrIcon  = 'images/user.png';
let errorDisplay = document.getElementById('error-display');
let welcome_msg = `
  <div id="welcome-card">
    <div id="welcome-msg-wrapper">
      <h4 style="color: #A09E9B; font-weight: 600; margin: 30px 0 15px 0;">Location-based Experience</h4>
      <h6 style="color: #B3B1AF;"><strong>Food Spot</strong> uses location to find restaurant places for you</h6>
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
let markers = [];
let infowindows = [];
let modal = `
 <div class="container form-wrapper modalWrapper">
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
        <input id="close-review-btn" type="button" onClick="closeReviewForm();" value="Close" />
        <input  id="add-review-btn" type="reset" value="Add Review"/>
      </div>
    </form>
  </div> `;
let currentLocation = null;
let showRated = [0, 1, 2, 3, 4, 5];
let currentRestaurant = null;
let loopCounter = 0;

/*===========================================================================================================
*  INFORMATION TO REACH API
===========================================================================================================*/

let geocoding_url = 'https://maps.googleapis.com/maps/api/geocode/json?';
let apiKey = 'AIzaSyCe_PRvM5yLjmgBr6tuRH5-Dv4PmhuGVvg';
const localJSON = 'js/restaurants.json';


/*===========================================================================================================
*  CALLBACK FUNCTIONS
===========================================================================================================*/

/** Handling location errors
*****************************************************/
let handleErrors = function (error) {
  let locationError =`
  <div id="error-card">
    <div id="msg-wrapper">
      <h4 style="color: #DC493A; font-weight: 600; margin: 15px 0;">Enable location</h4>
      <h6>Unable to retrieve your location - ${error.message}. Please see instructions 
      for sharing location on your device. When you're done, refresh the page.</h6>    
      <div class="tab geo-info-tabs">
        <button class="tablinks" onclick="openDeviceTab(event, 'apple')">iPhone</button>
        <button class="tablinks" onclick="openDeviceTab(event, 'android')">Android</button>
        <button class="tablinks" onclick="openDeviceTab(event, 'desktop')">Computer</button>
      </div>

      <div id="apple" class="tabcontent">
        <ol style="display: flex; flex-direction: column; align-items: flex-start; color: #666;">
          <li>Open Settings > Privacy > <strong>Location</strong> Services</li>
            <ul><li>Make sure Location Services are enabled</li></ul>
          <li>Find and tap your app (e.g.: <strong>Chrome</strong>)</li>
          <li>Select <strong>While Using the App</strong></li>
        </ol>
      </div>

      <div id="android" class="tabcontent">
        <ol style="display: flex; flex-direction: column; align-items: flex-start; color: #666;">
          <li>Settings > Security & privacy > <strong>Location</strong> Services</li>
            <ul><li>Make sure Location Services are enabled</li></ul>
          <li>Open the <strong>Chrome</strong> app</li>
          <li>At the top right, tap <em>More</em> > <strong>Settings</strong></li>
          <li>Tap <strong>Site settings</strong> > <strong>Location</strong></li>
          <li>Tap to turn location <strong>on</strong></li>
            <ul><li><strong>Blocked</strong> - make sure site URL is not listed here</li></ul>
        </ol>
      </div>

      <div id="desktop" class="tabcontent">
        <ol style="display: flex; flex-direction: column; align-items: flex-start; color: #666;">
          <li>Open the <strong>Chrome</strong> app</li>
          <li>At the top right, click <em>More</em> > <strong>Settings</strong></li>
          <li>At the bottom, click <strong>Advanced</strong>
          <li>Under "Privacy and security," click <strong>Site settings</strong></li>
          <li>Click <strong>Location</strong> > turn <strong>Ask before accessing</strong> on</li>
            <ul><li><strong>Block</strong> - make sure site URL is not listed here</li></ul>
        </ol>
      </div>

    </div>
  </div>`;
  console.log(`${error.code}: Unable to retrieve your location - ${error.message}.`);
  document.getElementById('map').innerHTML = locationError;
};

/** Improving device location accuracy
*****************************************************/
let geoOptions = {
  timeout: 27000,
  maximumage: 30000, // how long until we update position for more information (restaurants) 
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
  let decimal = (rating % 1).toFixed(1); 
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
    allStars = '<img src="images/noStar-user-rate.png"/>';
    for (let i = 1; i < 5; i++) {
      allStars = allStars + '<img src="images/noStar-user-rate.png"/>';
    }
    return allStars;
  }   
}; 

/** Showing user score in stars format
************************************************************/
function getUserScore(score) { 
  let int = score; 
  let allStars = '<img src="images/fStar-user-rate.png"/>';
  let counter = 0;
  if (int >= 1) {
    for (let i = 1; i < int; i++) {
      allStars = allStars + '<img src="images/fStar-user-rate.png"/>';
      counter++;
    }
    if (counter < 5) {
      let starsRemaining = 5 - counter;
      for (let i = 1; i < starsRemaining; i++) {
        allStars = allStars + '<img src="images/noStar-user-rate.png"/>'; 
      }
      return allStars;
    }
    return allStars;
  }
  else {
    allStars = '<img src="images/noStar-user-rate.png"/>';
    for (let i = 1; i < 5; i++) {
      allStars = allStars + '<img src="images/noStar-user-rate.png"/>';
    }
    return allStars;
  }   
}; 

/** Computing distance between the user and establishment
************************************************************/
function getDistanceInMiles(point_a, point_b) {
  let distance_in_meters = google.maps.geometry.spherical.computeDistanceBetween(point_a, point_b);
  let distance_in_miles = distance_in_meters * 0.000621371; // converts meters to miles
  return distance_in_miles.toFixed(1);
}

/** Triggering marker click event
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

/** restaurant popup
*****************************************************/  
function restPopup(rPhoto, getRating, xxxxxStars, getRatingsTotal, rName, rAddress, rTelephone, rRestIndex) {
  //getting only the first line of an address
  // const fullAddress = rAddress; //comma-separated
  // const addrArr = fullAddress.split(",");
  // const firstLineAddr = addrArr.splice(0,1).join("");
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
function restLiElm(rRestIndex, rPhoto, rName, getRating, xxxxxStars, getRatingsTotal, distanceInMiles, displayLi) {
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
function restDtls(rName, isRestOpen, getRating, xxxxxStars, getRatingsTotal, rAddress, rTelephone, rWebsite) {
  let bck, color, isItOpen;
  isItOpen = isRestOpen;
  if (isItOpen === true) {
    isItOpen = 'Open now';
    bck = '#9DC95A';
    color = 'white';
  } else {
    isItOpen = 'Closed now';
    color = 'white'; 
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
      <p style="font-size: 18px; padding: 4px 0; margin: 0 0 4px; text-decoration: none;"> <a href="tel:${rTelephone}"><img src="images/telephone.png" style="width: 18px; height: 18px; padding-bottom: 3px;  margin-right: 3px;"/> ${rTelephone}</a> </p>
      <p id="bt-align-x" style="font-size: 18px; padding: 18px 0; margin: 0 0 4px;">
        <a id="site-btn" href="${rWebsite}" target="_blank" style="text-decoration: none;">
          <img src="images/www-icon.png" style="width: 22px; height: 22px; padding-bottom: 2px; margin-right: 3px;"/> visit restaurant site
        </a>
      </p>
    </div> 
  </div>`;
}

/** restaurant reviews
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

/** Place autocomplete feature
*****************************************************/
function geolocate() {
  let input = document.querySelector("input[name='find']");
  let options = {
    bounds: myMap.getBounds(),
    types: ["establishment"] /* overview @ https://developers.google.com/maps/documentation/javascript/places */
  };
  let autocomplete = new google.maps.places.Autocomplete(input, options);
  google.maps.event.addListener(autocomplete, "place_changed", function() { 
    currentLocation = autocomplete.getPlace();
    console.log('NEW (Place Autocomplete) SEARCH:');
    console.log(currentLocation);
    if (!currentLocation.geometry) {
      // User entered the name of a Place that was not suggested and pressed the Enter key, or the Place Details request failed.
      let invalidQuery = `
      <div id="welcome-card">
        <div id="welcome-msg-wrapper">
          <h4 style="color: #A09E9B; font-weight: 600; margin: 30px 0 15px 0;">Invalid query</h4>
          <h6 style="color: #B3B1AF;">No details available for query, "${currentLocation.name}"</h6>
        </div>
      </div>`;
      document.getElementById('map').innerHTML = invalidQuery;
      console.log("No details available for query, '" + currentLocation.name + "'");
      // window.alert("No details available for query, '" + currentLocation.name + "'");
      return;
    } else {
      // If result comes back with property, "geometry"
      const lat = currentLocation.geometry.location.lat();
      const lng = currentLocation.geometry.location.lng();
      console.log(lat + ', ' + lng);  
      const SearchBtn = document.getElementById('ui-btn');
      SearchBtn.setAttribute('onClick', `codeAddress(${lat}, ${lng})`);
    }
  });

} //.geolocate()

/** Google Place Photos service
*****************************************************/
function getPopuPhoto(photos, icon) {
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

/** Google Place Photos service
*****************************************************/
function getLiElemPhoto(photos, icon) {
  if (photos) {
    let photoURL = photos[0].getUrl({
      maxWidth: 200,
      maxHeight: 100
    });
    console.log('Photo Reference: \n' + photoURL);
    const restIMG = `<img id="photoURL" src='${photoURL}' id="getLiElemPhoto"/>`;
    return restIMG;
  } 
  else {
    const restIMG = `<img id="iconIMG" src='${icon}' id="get_LI_Icon"/>`;
    return restIMG;
  }
}

/** Show restaurants by user selection
*****************************************************/
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
/** Adding a new restaurant on the map
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
            // NEW RESTAURANT FORM
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
            
            // infowindow
            const iw_restDtls = new google.maps.InfoWindow({
              position: rest_coordinates,
              content: newRest_form //new restaurant form
            });
            iw_restDtls.open(myMap, new_rest_marker);

            // onClick function - adds new restaurant on the page (marker and list elem)
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
              nrIcon = 'images/restaurant.png';
              nrPhotos = [
                // properties randomly copied from the results of getDetails request, photos[0] 
                {
                //   height: 4608, 
                //   html_attributions: ["<a href='https://maps.google.com/maps/contrib/102455675478533544119/photos'>Alexandre</a>"], 
                //   width: 2592, 
                //   customised property - because 
                  getUrl: function() {
                    return nrIcon; // see getPopuPhoto(photos, icon)
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
            } //.addNewRestaurant()
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
  // Geolocation API - if user's browser does not support Navigator.geolocation object
  if (!navigator.geolocation) { 
    console.log("Geolocation is not supported by your browser");
    alert('Geolocation is not supported by your browser');
  } else {
    document.querySelector('#rattings-wrapper').style.display = 'none';
    document.querySelector('#bottomSection').style.display = 'none';
    document.getElementById('map').innerHTML = welcome_msg;
    // getCurrentPosition gets device's live location
    navigator.geolocation.getCurrentPosition(getUserLocation, handleErrors, geoOptions);
  }
} 

/** if user's browser supports Geolocation
*****************************************************/
let getUserLocation = function (position) {
  document.querySelector('#rattings-wrapper').style.display = 'block';
  document.querySelector('#bottomSection').style.display = 'none';
  // user location coordinates - read-only properties (black box)
  let lat = position.coords.latitude; 
  let lng = position.coords.longitude;
  console.log("Google Maps API, version " + google.maps.version);
  pos = { lat: lat, lng: lng };
  createMap(pos);
}

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
  document.getElementById('ui-query').disabled = true; // disable search box until request is complete  
  document.getElementById('ui-query').style.backgroundColor = '#D9D8D7';
  service.nearbySearch(request, getRestaurants);
  
}; //.createMap()

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

  const popup_IMG = getPopuPhoto(rPhotos, rIcon);
  const list_IMG = getLiElemPhoto(rPhotos, rIcon);
  const user_point = new google.maps.LatLng(pos.lat, pos.lng); 
  const restaurant_point = new google.maps.LatLng(lat, lng);
  const distanceInMiles = getDistanceInMiles(user_point, restaurant_point);
  const getRating = getNoRating(rRating);
  const getRatingsTotal = getNoRatingsTotal(rRatingsTotal);
  const rAvg_mrkr = getMarker_No(rRating);
  const markerImg = 'images/' + rAvg_mrkr + 'star-marker.png';
  const xxxxxStars = getXstars(rRating);
  const displayLi = showRated.indexOf(parseInt(getRating)) >= 0 ? "list-item" : "none";
  const rPopup = restPopup(popup_IMG, getRating, xxxxxStars, getRatingsTotal, rName, rAddress, rTelephone, rRestIndex); 
  const rListItem = restLiElm(rRestIndex, list_IMG, rName, getRating, xxxxxStars, getRatingsTotal, distanceInMiles, displayLi);
  const rBrief = restDtls(rName, rIsRestOpen, getRating, xxxxxStars, getRatingsTotal, rAddress, rTelephone, rWebsite);
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
      $('.restaurant-list').innerHTML = ""; 
      $('.restaurant-list').append(rListItem);
      $('.restaurant-list li').click(function(e) {
        document.querySelector('#bottomSection').style.display = "none";
        let elems = document.querySelectorAll('.selection.selected');
        for (let i = 0; i < elems.length; i++) {
          elems[i].classList.remove('selected');
          elems[i].style.backgroundColor = '#fff'; 
        }
        $(this).addClass('selected');
        let selected = document.querySelector('.selected');
        selected.style.backgroundColor = '#D9FEA2';
        e.preventDefault();
      });

    },
    brief: function() {
      // brief info about the restaurant
      document.querySelector('#rest-brief').innerHTML = rBrief;
       // Street View picture
      let panorama = new google.maps.StreetViewPanorama(document.getElementById('street-view'), {
        position: {lat: rLat, lng: rLng},
        pov: {heading: 270, pitch: 10},
        motionTracking: false,
        fullscreenControl: false,
        linksControl: false,
        panControl: false,
        zoom: 0
      });
    }, //.brief
    reviews: function() {
      let rvwsList = '<ul>';
      if (!rReviews) {
        document.getElementById('rest-reviews').innerHTML = 'No reviews found';
      }
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
    }, //.reviews
    housing: function(newReview) {
      console.log('user: ' + newReview.author_name + '\nscore: ' + newReview.rating + '\nreview: \n' + newReview['text']);
      rReviews.unshift(newReview);
    }
  }; //.iefe
} //.restPlace

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
    let noResultsts = `
      <div id="welcome-card">
        <div id="welcome-msg-wrapper">
          <h4 style="color: #A09E9B; font-weight: 600; margin: 30px 0 15px 0;">No restaurants found</h4>
          <h6 style="color: #B3B1AF;">Areas with poor reception may affect your device's ability to retrieve information. 
            Please use the search box to query a different place or restaurant</h6>
        </div>
      </div>`;
    document.getElementById('map').innerHTML = noResultsts;
    console.log('No restaurants found at this location. Please search a different place.');
  } 
  else if (status == google.maps.places.PlacesServiceStatus.OVER_QUERY_LIMIT) {
    document.getElementById('msg_display').innerHTML = "";
    let overQueryLimit = `
      <div id="welcome-card">
        <div id="welcome-msg-wrapper">
          <h4 style="color: #A09E9B; font-weight: 600; margin: 30px 0 15px 0;">Quota exceeded</h4>
          <h6 style="color: #B3B1AF;">The app's exceeded its request usage limits. Give it a minute or try within the next 24 hours</h6>
        </div>
      </div>`;
    document.getElementById('map').innerHTML = overQueryLimit;
    console.log('The app\'s exceeded its request usage limits. Give it a minute or try within the next 24 hours'); // error code 403 or 429
  } 
  else if (status == google.maps.places.PlacesServiceStatus.REQUEST_DENIED || status == google.maps.places.PlacesServiceStatus.INVALID_REQUEST) {
    document.getElementById('msg_display').innerHTML = "";
    let requestDenied = `
      <div id="welcome-card">
        <div id="welcome-msg-wrapper">
          <h4 style="color: #A09E9B; font-weight: 600; margin: 30px 0 15px 0;">Request denied</h4>
          <h6 style="color: #B3B1AF;">Request query parameter(s) either invalid or missing</h6>
        </div>
      </div>`;
    document.getElementById('map').innerHTML = requestDenied;
    console.log('Request denied. Request query parameter(s) either invalid or missing.');
  } 
  else {
    document.getElementById('msg_display').innerHTML = "";
    let requestDenied = `
      <div id="welcome-card">
        <div id="welcome-msg-wrapper">
          <h4 style="color: #A09E9B; font-weight: 600; margin: 30px 0 15px 0;">Server-side error</h4>
          <h6 style="color: #B3B1AF;">Your request could not be processed due to a server error. The request may succeed if you try again.</h6>
        </div>
      </div>`;
    document.getElementById('map').innerHTML = requestDenied;
    console.log('Server-side error. Please try again.'); // UNKNOWN_ERROR
  }
}

function showRestaurantList() {
   /** AJAX Request - Importing local data
  *****************************************************/
  let restaurants;
  const xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4) {
      if (xhr.status === 200 || xhr.status === 201) {
        restaurants = JSON.parse(xhr.responseText); 
        console.log("Parsed JSON: ",   restaurants); 
        for (let i = 0; i < restaurants.length; i++) {
          //create restaurant object
          let opening_hours, isOpeningDay, isRestOpen, loopCounter, icon, photos;
          isRestOpen = true;
          console.log('isRestOpen = ' + isRestOpen);
          loopCounter = restaurantsList.length;
          icon = 'images/restaurant.png';
          photos = [
            {
              getUrl: function() {
                return icon; // see getPopuPhoto(photos, icon)
              }
            } 
          ];
          const restaurant = restPlace(restaurants[i].name, restaurants[i].formatted_address, restaurants[i].formatted_phone_number, 
            restaurants[i].website, restaurants[i].lat, restaurants[i].lng, restaurants[i].rating, 
            restaurants[i].user_ratings_total, restaurants[i].reviews, icon, photos, restaurants[i].price_level, loopCounter, isRestOpen
          );
          restaurantsList.push(restaurant);
          console.log('value of loopCounter = ' + loopCounter);
          loopCounter++;
        }
        // document.getElementById('msg_display').style.display = 'none';
        console.log("All restaurants have been processed. Dumping restaurantsList below:");
        for (let i = 0; i < restaurantsList.length; i++) {
          restaurantsList[i].list();
        }
        document.getElementById('ui-query').disabled = false; // disable search box until request is complete  
        document.getElementById('ui-query').style.backgroundColor = '#fff';
        console.log("Total restaurants in memory: " + restaurantsList.length);
        
      }
      else if (xhr.status === 404) {
        console.log('404: File not found');
      } 
      else if (xhr.status === 500) {
        console.log('500: Server error. Please refresh the web page');
      } 
    }
    else {
      console.log(xhr.statusText); //OK
    }
  }; //end of onreadystatechange
  xhr.open('GET', localJSON);
  xhr.send();
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

/** Mobile-only Carousel
************************************************************/
function mobileCarousel(mql) {
  if (mql.matches) { // If media query matches
    // Container carousel and cell elems
    let ulElm = document.querySelector('ul.restaurant-list');
    let liElms = document.getElementsByClassName('selection');
    ulElm.className += ' main-carousel'; // adds new class, "main-carousel"
    for (let i = 0; i < liElms.length; i++) {
      liElms[i].className += ' carousel-cell';
    }
    document.querySelector('#restaurants-list-wrapper').style.borderTop = '30px';
  }
  //else
}
const mql = window.matchMedia('(max-width: 480px)'); // The Window interface's matchMedia() method returns a new MediaQueryList object 
mobileCarousel(mql);
mql.addListener(mobileCarousel); // Attach listener function on state changes


/** Showing Restaurant reviews
*****************************************************/
function showReviews(rest_index) {
  const bottomSection = document.querySelector('#bottomSection').style.display = 'block';
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
} //.showReviews


/** Adding a new review
*****************************************************/
//Open modal form
function addReview(rest_index) {
  document.getElementById('review_dialog-box').innerHTML = modal;
  //passing new attributes to form elems
  let modal_addReviewBtn = document.getElementById('add-review-btn');
  modal_addReviewBtn.setAttribute('onClick', `submitReview(${rest_index});`);
}
//Close review form
let close_ReviewBtn = document.getElementById('close-review-btn');
function closeReviewForm() {
  let modal = document.getElementById('close-review-btn').closest('.modalWrapper');
  modal.style.display = "none";
}
//submit review form
function submitReview(rest_index) {
  const user_fName = document.getElementById('full-name').value; // take user input 
  // user name validation
  if (user_fName == "") {
    alert("Please include your name");
    return false;
  }
  const dropdown = document.getElementById('score');
  const score = dropdown.options[dropdown.selectedIndex].text;
  let user_score = parseInt(score, 10);
  const user_comment = document.getElementById('user-review').value;
  // user review validation
  if (user_comment == "") {
    alert("Please add a review.");
    return false;
  }
  // add review to restaurantsList array
  const newReview = { 
    author_name: user_fName,
    rating: user_score, 
    relative_time_description: 'added today', // setInterval
    text: user_comment
  }
  for (let i = 0; i < restaurantsList.length; i++) {
    if (i === rest_index) {
      restaurantsList[i].housing(newReview);
      restaurantsList[i].reviews();
    }
  }
  closeReviewForm(); 
  console.log('Thank you! Your review will help other people find the best places to go.');
}

/** Find Place from Query
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

// Information tabs
function openDeviceTab(e, deviceName) {
  let i, tabContent, tabLinks;
  tabContent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabContent.length; i++) {
    tabContent[i].style.display = "none";
  }
  tabLinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tabLinks.length; i++) {
    tabLinks[i].className = tabLinks[i].className.replace(" active", "");
  }
  document.getElementById(deviceName).style.display = "block";
  e.currentTarget.className += " active";
}