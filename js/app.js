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
      <div class="logo-wrapper"> <img src="../images/no-location-marker.png" alt="satellite"/> </div>
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
let restaurants; //parsed JSON
let li_elems = ""; 
let ratings;
let website;
let restaurant;
let telephone;
let address;
let rtngAvg;
let avg;
let avg_mrkr = [];
let mrkr_icons = [];
let mrkr_locations = [];
let iw_popus = [];
let rest_dtls_collection = [];
let rest_index;
let allCompany_reviews = [];
let markers = [];
let modal = `
 <div class="container form-wrapper" id="modalWrapper">
    <form class="modal-content">
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
        <input id="close-review-btn" type="submit" onClick="close_ReviewForm();" value="Close" />
        <input  id="add-review-btn" type="submit" value="Add Review"/>
      </div>
    </form>
  </div> `;


/*===========================================================================================================
*  INFORMATION TO REACH API
===========================================================================================================*/
// const url = 'https://developers.google.com/maps/documentation/javascript/examples/json/earthquake_GeoJSONP.js';
let geocoding_url = 'https://maps.googleapis.com/maps/api/geocode/json?';
let apiKey = 'AIzaSyCe_PRvM5yLjmgBr6tuRH5-Dv4PmhuGVvg';
const jsonPath = 'js/restaurants.json';


/*===========================================================================================================
*  CALLBACK FUNCTIONS
===========================================================================================================*/

/** Handling location errors
*****************************************************/
let handleErrors = function () {
  document.querySelector('#main-content').style.display = 'none';
  // document.querySelector('#footer').style.display = 'none';

  const msg_wrapper = document.getElementById('error_Display');
  console.log("Unable to retrieve your location");
  document.getElementById('error_display').innerHTML = error_msg;
};

/** Improving device location accuracy
*****************************************************/
let options = {
  enableHighAccuracy: true //for best possible location results
}

/** Showing Restaurant reviews
*****************************************************/
function showReviews(rest_index) {
  //make bottom section visible
  document.querySelector('#bottomSection').style.display = 'block';
  //show restaurant details
  document.querySelector('#rest-brief').innerHTML = rest_dtls_collection[rest_index];
  //show Street View panorama
  let panorama = new google.maps.StreetViewPanorama(document.getElementById('street-view'), {
    position: mrkr_locations[rest_index],
    pov: {heading: 270, pitch: 10},
    motionTracking: false,
    fullscreenControl: false,
    linksControl: false,
    panControl: false,
    // enableCloseButton: true,
    zoom: 0
  });
  //show restaurant reviews
  let rvwsList = '<ul>';
  for (let i = 0; i < allCompany_reviews[rest_index].length; i++) {
    rvwsList += '<li>' + allCompany_reviews[rest_index][i] + '</li>'
  }
  rvwsList += '</ul>';
  document.querySelector('#rest-reviews').innerHTML = rvwsList; 

  //target list element on the side of the page
  let li_elem_id = '#' + rest_index;
  $(this).click(function(e) {
    //remove all pre-existing active classes
    elems = document.querySelectorAll('.selection.selected');
    for (let i = 0; i < elems.length; i++) { 
      elems[i].classList.remove('selected');
      elems[i].style.backgroundColor = '#fff'; //restore white background (#D9FEA2)
    }
    //add styles to correspondent <li>
    $(li_elem_id).addClass('selected');
    let selected = document.querySelector('.selected');
    selected.style.backgroundColor = '#D9FEA2';
  });
} //.showReviews

function showPopup(rest_index) {
  //Trigger a click event on each marker when the corresponding marker link is clicked
  console.log(markers[rest_index]);
  google.maps.event.trigger(markers[rest_index], 'click');
};

/** Searches with Geocoding
*****************************************************/
function codeAddress() {
  let geocoder = new google.maps.Geocoder();
  const queryParam1 = 'address=';
  const wordQuery = searchBox.value;  
  console.log(wordQuery);
  const queryParam2 = '&key=';
  //const endpoint = `${geocoding_url}${queryParam1}${wordQuery}${queryParam2}${apiKey}`;
  const endpoint = `${geocoding_url}${queryParam1}${wordQuery}${queryParam2}${apiKey}`;
  //Making an AJAX Request
  const xhr = new XMLHttpRequest();
  xhr.onreadystatechange = () => {
    if (xhr.readyState === /*4*/ XMLHttpRequest.DONE) {
      if (xhr.status === 200 || xhr.status === 201) {
        let data = JSON.parse(xhr.responseText); //xhr.response;
        console.log(data);
        console.log(data.results[0].place_id);
        // console.log(xhr.results); //undefined
        myMap.setCenter(data.results[0].geometry.location);
        user_marker.setPosition(data.results[0].geometry.location);  
      } //end of inner if statement
      else if (xhr.status === 404) {
        console.log('404: File not found');
      } 
      else if (xhr.status === 500) {
        console.log('500: Server had a problem');
      } 
    }
    else {
      console.log('Geocode was not successful for the following reason: ' + xhr.statusText);
    }
  } //end of onreadystatechange
  xhr.open('GET', endpoint);
  xhr.send(); 
}

const modalBtn = document.getElementById('leave-review');
let close_ReviewBtn = document.getElementById('close-review-btn');
//Open Review Form
modalBtn.addEventListener('click', function() {
  document.getElementById('review_dialog-box').innerHTML = modal;
});
//Close review form
function close_ReviewForm() {
  let modal = document.getElementById('close-review-btn').closest('#modalWrapper');
  modal.style.display = "none";
}

//New Restaurant Popup
function restPopup(avg, rtngs_xxxxx, numbOfReviews, restaurant, address, telephone, rest_index) {
  return `
    <div class="popup_cttWrapper" style="width: 220px;">
      <div style="margin: auto; width: 200px; height: 100px;"><img style="width: 100%; height: 100%;" src="../images/food.png"/></div>
      <div>
        <p style="margin: 4px 0 12px; padding: 0; display: flex; justify-content: center;">
          <span style="font-size: 13px; font-weight: 600; color: #E7711B; padding-top: 2px;">${avg}</span> 
          <span style="margin-left: 3px;">${rtngs_xxxxx}</span><span id="noRev" style="margin-left: 3px;">(${numbOfReviews} reviews)</span>
        </p>
        <h5 style="font-size: 1rem; margin: 0 0 4px; font-weight: 600; color: #91CA00; display: block;" data-marker-title="${restaurant}">${restaurant}</h5>
        <p style=" width: 200px; display: flex; margin: 0 0 4px;">${address}</p>
        <p style="font-size: 13px; margin: 0 0 4px;"> <a href="tel:${telephone}"><img src="../images/telephone.png" style="width: 16px; padding-bottom: 3px; height: 16px; margin-right: 3px;"/> ${telephone}</a> </p>
      </div>
      <div style="display: flex; justify-content: center; padding: 0px;">
        <p style="font-size: 15px; font-weight: 400; padding: 0px; margin: 16px 0px">
          <a class="see-reviews-btn" href="#bottomSection" onClick="showReviews(${rest_index});">See reviews</a>
        </p>
      </div>
    </div>`;
};

/** computing average for star ratings
*****************************************************/
function getXstars(avg, avg_mrkr) { //4.4
  let int = Math.floor(avg); //4
  console.log("(avg)int: " + int);
  let decimal = (avg % 1).toFixed(1); //eg: 0.4
  console.log("(avg)decimal: " + decimal);

  let marker_Rtng = int;

   //if no reviews found (or NaN was trown) - minimum "int" can hold is 1 regardless if only one 1star review found ("avg" would still avarage 1)
  let allStars = '<img src="../images/fStar-user-rate.png"/>';
  let counter = 0;
  if (int >= 1) {
    console.log("pass - reviews found");
    for (let i = 1; i < int; i++) {
      allStars = allStars + '<img src="../images/fStar-user-rate.png"/>'; //whole stars
      counter++;
    }
    if (decimal >= 0.8) {
      allStars = allStars + '<img src="../images/fStar-user-rate.png"/>'; //whole star
      counter++;
      //marker rating rounded by 1 when decimal of an average >= 0.8
      marker_Rtng++; 
    }
    if (decimal > 0.3 && decimal <= 0.7) {
      allStars = allStars + '<img src="../images/hStar-user-rate.png"/>'; //half star
      counter++;
    }
    if (decimal <= 0.3) {
      allStars = allStars + '<img src="../images/noStar-user-rate.png"/>'; //empty star
      counter++;
    }
    //for the map markers - assigning value for variable avg_mrkr (outside the function)
    avg_mrkr = [marker_Rtng];
    console.log("-- 'avg_mrkr' inside getXstars() = " + avg_mrkr);
    //counter after all stars have been added based on their averaged rating
    // console.log(counter);
    if (counter < 5) {
      //add empty star(s) to make it 5 total
      let starsRemaining = 5-counter;
      // console.log(starsRemaining); 
      for (let i = 1; i < starsRemaining; i++) {
        allStars = allStars + '<img src="../images/noStar-user-rate.png"/>'; //empty star(s)  
      }
      return allStars;
    }
    return allStars;
  }
  else {
    console.log("fail - no reviews found");
    allStars = '<img src="../images/noStar-user-rate.png"/>'; //empty star
    for (let i = 1; i < 5; i++) {
      allStars = allStars + '<img src="../images/noStar-user-rate.png"/>'; //empty stars
    }
    return allStars;
  }   
}; //end of getXstars()

//create restaurant review funtion
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




/*===========================================================================================================
*  INITIALISING GOOGLE MAPS
===========================================================================================================*/
function initMap() {
  /** Geolocation API
  *****************************************************/
  //if user's browser does not support Navigator.geolocation object
  if (!navigator.geolocation) {
    console.log("Geolocation is not supported by your browser");
    alert('Geolocation is not supported by your browser');
  } else {
    document.querySelector('#rattings-wrapper').style.display = 'none';
    document.querySelector('#bottomSection').style.display = 'none';
    document.querySelector('#footer').style.display = 'none';

    document.getElementById('map').innerHTML = welcome_msg;
    //getCurrentLocation gets the current location of the device
    navigator.geolocation.getCurrentPosition(getUserLocation, handleErrors, options); //navigator.geolocation.getCurrentPosition(success[, error[, [options]])
  }
} 

/** if user's browser supports Geolocation
*****************************************************/
let getUserLocation = function (position) {
  document.querySelector('#rattings-wrapper').style.display = 'block';
  document.querySelector('#bottomSection').style.display = 'block';
  document.querySelector('#footer').style.display = 'block';
  document.querySelector('#bottomSection').style.display = 'none';

  let lat = position.coords.latitude;
  let lng = position.coords.longitude;
  // console.log(`Current Latitude is ${lat} and your longitude is ${lng}`);
  console.log("To get the location used for this project, please use LAT (52.6431335), and LNG (1.3342981999999999)");
  let pos = { lat: lat, lng: lng };
  
  iw_restDtls = new google.maps.InfoWindow;
  //map built-in controls
  mapOptions = {
    center: new google.maps.LatLng(lat, lng),
    zoom: 12,
    styles: myMapStyles,
    panControl: true,
    scaleControl: false,
    mapTypeControl: true,
    // mapTypeId: google.maps.MapTypeId.ROADMAP,
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
  //creating the map
  myMap = new google.maps.Map(document.getElementById('map'), mapOptions);
  //creating user location marker
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


  /** Adding new restaurant by clicking on the map
  *****************************************************/
  google.maps.event.addListener(myMap, 'rightclick', function(event) {
    newRestaurantForm(event.latLng);
  });

  function newRestaurantForm(location) {
    //add new restaurant marker
    let new_rest_marker = new google.maps.Marker({
      position: location, 
      map: myMap,
      icon: '../images/new-marker.png', 
      title: 'click for details'
    });
    //get new restaurant's coordinates
    const lat = location.lat();
    const lng = location.lng();
    let rest_coordinates = {lat, lng};
    let nRest_address;
    
    //add new marker position to "mrkr_locations" array
    mrkr_locations.push({lat, lng});

    //take new restaurant details
    let iw_newRestaurant;
    new_rest_marker.addListener('click', function() {
      //Reverse geocoding request
      let geocoder = new google.maps.Geocoder();
      let location = `${geocoding_url}$latlng=${rest_coordinates}&key=${apiKey}`;
      // let latlngStr = rest_coordinates.toString().split('/');
      // let latlng = {lat: parseFloat(rest_coordinates.lat), lng: parseFloat(rest_coordinates.lng)};
      console.log("AYOOOO_________coordinates translation = " + rest_coordinates.lat + ", " + rest_coordinates.lng);

      //Making an AJAX Request
      geocoder.geocode({'location': rest_coordinates}, function(results, status) {
        if (status === 'OK') {
          console.log(results);
          
          if (results[0]) {
            myMap.setZoom(11);
            myMap.setCenter(rest_coordinates);
            new_rest_marker.setPosition(rest_coordinates);  
            nRest_address = results[0].formatted_address;
            console.log(nRest_address);
            
            //open infowindow/new restaurant form
            let newRest_form = document.createElement('div');
            newRest_form.setAttribute('class', 'nr_popup_wrapper');

            let nr_inner_div = document.createElement('div'); //--------------------------------------------------------
            nr_inner_div.setAttribute('class', 'nr_inner_wrapper');
            // nr_container.appendChild(nr_inner_div);

            //h5 (Heading)
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

            //select options list (Restaurant Address) <input type="text"  placeholder="Restaurant address" value="${nRest_address}"/>
            let select = document.createElement('select'); //'<select name="rating-list" id="rating-list" onchange="getSelect()"></select>';
            select.setAttribute('name', 'ui-newRest-address');
            select.setAttribute('id', 'ui-newRest-address');
            // $(select).attr("value", "ui-newRest-address");
            //select options (all returned addresses)
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

            //button (Add Restaurant button)
            let nr_restBtn = document.createElement('button');
            nr_restBtn.setAttribute('class', 'nr_btn');
            // nr_restBtn.setAttribute('onClick', 'addNewRestaurant();');
            nr_restBtn.onclick = addNewRestaurant;
            nr_restBtn.textContent = 'Add Restaurant';
            // nr_restBtn.value = 'Add Restaurant';
            nr_inner_div.appendChild(nr_restBtn);

            //container div houses inner div
            newRest_form.appendChild(nr_inner_div);

            iw_newRestaurant = new google.maps.InfoWindow({
              position: rest_coordinates,
              content: newRest_form
            });
            iw_newRestaurant.open(myMap, new_rest_marker);

            function addNewRestaurant() {
              //get user input data
              let restName, selRestAddress, restTelephone, restWebsite, nOptions;
              restName = document.getElementById('ui-newRest-name').value;
              selRestAddress = document.getElementById('ui-newRest-address');
              let selRestAddressOption = selRestAddress.options[selRestAddress.selectedIndex].text; //.value returns the index
              console.log(selRestAddressOption);
              
              // let selOption = restAddress.options[restAddress.selectedIndex];
              restTelephone = document.getElementById('ui-newRest-telephone').value;
              restWebsite = document.getElementById('ui-newRest-website').value;

              // console.log(selOption);
              let newRestaurant = {
                restaurantName: restName,
                address: selRestAddressOption,
                telephone: restTelephone,
                website: restWebsite,
                lat: lat,
                long: lng,
                ratings: []
              }
              restaurants.push(newRestaurant);

              console.log(restaurants);
              //close new restaurant form
              // iw_newRestaurant.close();
              const rest_index = restaurants.length - 1;
              let avg = NaN;
              /** if no reviews found
              *****************************************************/
              if (isNaN(avg_mrkr[rest_index]) || isNaN(avg)) { //JavaScript for Web Developers > Data Types > NaN
                let noReviews = 0;
                avg_mrkr[rest_index] = noReviews;
                avg = noReviews.toFixed(1);
                console.log("avg_mrkr (for map markers) assumes ---> " + avg_mrkr[rest_index]);
                console.log("avg (for li elems) assumes ---> " + avg);
              }
              let rtngs_xxxxx = getXstars(avg, avg_mrkr[rest_index]);
              let numbOfReviews = 0;
              //open new restaurant's newly created popup
              const popup = restPopup(avg, rtngs_xxxxx, numbOfReviews, restName, selRestAddressOption, restTelephone, rest_index);
              
              //bring new popup
              // iw_newRestaurant.setContent(popup);
              
              //add new marker for the newly added restaurant
              let new_rest_marker = new google.maps.Marker({
                position: rest_coordinates, 
                map: myMap,
                icon: '../images/0star-marker.png', 
                title: 'click for details'
              });
              //newly added restaurant marker's click event handler
              new_rest_marker.addListener('click', function() {
                iw_newRestaurant.setPosition(mrkr_locations[rest_index]);
                iw_newRestaurant.setContent(popup); // iw_restDtls.setContent(iw_popus[i]); 
                iw_newRestaurant.open(myMap, new_rest_marker);
              });
              //Update "markers" array
              markers.push(new_rest_marker);

              //trigger "click" event on newly added restaurant's marker
              showPopup(rest_index);
            }
            
          } else {
            window.alert('No results found');
          }
        } else {
          window.alert('Geocoder failed due to: ' + status);
        }
      });

    
    });
  }

  /** AJAX Request - Importing JSON data into map
  *****************************************************/
  const xhr = new XMLHttpRequest();
  // AJAX Request
  //return Promise((resolve, reject) => {
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4) {
      if (xhr.status === 200 || xhr.status === 201) {
        restaurants = JSON.parse(xhr.responseText); 
        // resolve(data);
        // console.log('response data\'s typeof: ' + typeof restaurants); //object
        console.log("Parsed JSON: ",   restaurants); //prints array of objects

        /** Finding avarage of restaurants' reviews 
        *****************************************************/
        for (let i = 0; i < restaurants.length; i++) {

          let lat = restaurants[i].lat;
          let lng = restaurants[i].long;
          ratings = restaurants[i].ratings;
          website = restaurants[i].website;
          restaurant = restaurants[i].restaurantName;
          telephone = restaurants[i].telephone;
          address = restaurants[i].address;
          rest_index = i;
          
          let values = []; //stores starred rating values
          let sum = 0;
          let numbOfReviews = 0;
          let reviews = [];

          for (let j = 0; j < ratings.length; j++) {
            let rate = ratings[j].stars; //takes int
            values.push(rate);
            sum += rate;
            numbOfReviews ++; 
            let comment = ratings[j].comment;
            let rvw;
            let userName = `User${j+1}`;
            // console.log("TYPEOF COMMENT IS ---->> " + typeof comment);
            if (comment) { //if (typeof comment === 'string' || myVar instanceof String)
              rvw =`
                <div class="review_item">
                  <div class="review-item-top" style="font-size: 18px; font-weight: 600; ">
                    <p>${userName}</p>
                    <p style="float: right;"><span style="margin-left: 6px;">${getXstars(rate)}</span></p>
                  </div>
                  <div class="review-item-body">
                    <p>${comment}</p>
                  </div>
                </div>`;
            } else {
              console.log("No Reviews Found!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
              comment = 'No Reviews Found';
              rvw ='No Reviews Found';
              reviews.push(rvw);
            }
            reviews.push(rvw);
          }
          //calculating rating avarages
          rtngAvg = sum / values.length; //holds a value with a decimal point, eg: 1.3333333333333333
          console.log("===rtngAvg===" + rtngAvg); //eg: 1.3333333333333333
          avg = rtngAvg.toFixed(1); //forces value to stay with a decimal point regardless of browser interpretation or change in score, eg: 1.3
          console.log("===avg===" + avg); //eg: 1.3
          
          //value of avg_mrkr is updated after WHEN (only aften when) function getXstars(avg) executes
          avg_mrkr[i] = rtngAvg.toFixed(0); //initial value (this is later updated when getXstars(avg) is executed)
          console.log("===avg_mrkr===" + avg_mrkr[i]);
          //console.log("AVG_MRKR (map marker variable) ---> " + avg_mrkr); //value held [BEFORE] function getXstars(avg) is used to add extra stars
          
          /** if no reviews found
          *****************************************************/
          if (isNaN(avg_mrkr[i]) || isNaN(avg)) { //JavaScript for Web Developers > Data Types > NaN
            let noReviews = 0;
            avg_mrkr[i] = noReviews;
            avg = noReviews.toFixed(1);
            console.log("avg_mrkr (for map markers) assumes ---> " + avg_mrkr[i]);
            console.log("avg (for li elems) assumes ---> " + avg);
          }

          //call rtngs_xxxxx

          console.log("-----RESTAURANT[" + [i] + "] avg = " + avg);        
          //variable to hold ratings for stars being printed on the page
          const rtngs_xxxxx = getXstars(avg); //avg is 0.0 when no reviews found 

        /** Getting distance in miles using Geometry library
        *****************************************************/
        const user_point = new google.maps.LatLng(pos.lat, pos.lng); //user point on the map
        console.log("USER POINT ON THE MAP: " + pos.lat + ", " + pos.lng);
        const restaurant_point = new google.maps.LatLng(lat, lng); //restaurant point on the map
        console.log("RESTAURANT POINT ON THE MAP: " + lat + ", " + lng);
        //Getting the distance 
        function getDistanceInMiles(point_a, point_b) {
          let distance_in_meters = google.maps.geometry.spherical.computeDistanceBetween(point_a, point_b);
          let distance_in_miles = distance_in_meters * 0.000621371; // converts meters to miles
          return distance_in_miles;
        }
        const distance_miles = getDistanceInMiles(user_point, restaurant_point);  
        console.log( "The distance between USER POINT and RESTAURANT POINT = " + distance_miles.toFixed(1) + " miles" ); //round distant to 1 decimal

        
        /** Data to be loaded on the page and on the map 
        *****************************************************/ 
        let liItem =`
          <li id="${rest_index}" class="selection">
            <a onClick="showPopup(${rest_index});" href="#header" class="liDirectChild marker-link" data-marker-id="${rest_index}" data-marker-title="${restaurant}">
              <div class="restaurant-pic-wrapper"><img src="../images/food.png"/></div>
              <div class="restaurant-brief-wrapper">
                <h5>${restaurant}</h5>
                <div style="margin: 0; display: flex;"> 
                  <p style="margin: 0; padding: 0;">
                    <div style="font-size: 13px; font-weight: 600; color: #E7711B; padding-top: 1.5px;">${avg}</div> 
                    <span style="font-size: 13px; margin-left: 3px;">${rtngs_xxxxx}</span>
                    <span id="noRev" style="font-size: 13px; margin-left: 3px; color: #9F9E9E;">(${numbOfReviews} reviews)</span>
                  </p>
                </div> 
                <p style="display: flex; margin: 0; padding: 0;">
                  <span style="width: 16px; height: 16px;"> 
                    <img src="../images/location_marker.png" alt="location in miles" style="width: 100%; height: 100%;"/>
                  </span>
                  <span id="lct-marker" style="font-size: 13px; margin-left: 3px; padding-top: 4px; color: #9F9E9E;">${distance_miles.toFixed(1)} mi</span>
                </p>
              </div>
            </a>
          </li>`;

          let rest_dtls = `
            <div class="col-hg" style="display: flex; align-items: center; justify-content: center;">
              <div style="width: 100%;">
                <h3 style="margin: 0 0 4px; padding: 4px 0; font-weight: 600; color: #2E2A24;">${restaurant}</h3>
                <p style="margin: 0 0 4px; padding: 0 0 4px; display: flex;">
                  <span style="font-size: 15px; font-weight: 600; color: #E7711B; margin-left: 0px; padding-top: 4px;">${avg}</span> 
                  <span style="font-size: 20px; margin-left: 3px;">${rtngs_xxxxx}</span>
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
       
          //show restaurant details in popup
          const popup = restPopup(avg, rtngs_xxxxx, numbOfReviews, restaurant, address, telephone, i);

          //making objects available outside the for loop
          mrkr_icons.push("../images/" + avg_mrkr[i] + "star-marker.png"); //updated value of avg_mrkr (after getXstars() is executed)
          console.log( " -- UDATE: avg_mrkr = " + avg_mrkr[i]);
          mrkr_locations.push({lat, lng});
          li_elems += liItem;
          iw_popus.push(popup);
          rest_dtls_collection.push(rest_dtls);
          allCompany_reviews.push(reviews);

        } //end of outer (main) for loop
        

        //listing restaurants on the side of the page
        document.querySelector('.restaurant-list').innerHTML = li_elems;

        //placing new markers on the map
        for (let i = 0; i < mrkr_locations.length; i++) {  
          //listing restaurants on the side of the page
          // document.querySelector('.restaurant-list').innerHTML = li_elems[i];
          // document.querySelector('.restaurant-list').append(li_elems[i]);

          let marker = new google.maps.Marker({
            //position: new google.maps.LatLng(mrkr_locations[i][i], mrkr_locations[i][i]),
            position: mrkr_locations[i],
            map: myMap,
            icon: mrkr_icons[i], 
            title: 'click for details'
          });

          //adding mouse event handlers for each marker
          /*marker.addListener('mouseover', function() {
            myMap.setZoom(13);
            iw_restDtls.setPosition(mrkr_locations[i]);
            iw_restDtls.setContent(iw_popus[i]); 
            iw_restDtls.open(myMap, marker);
          });*/

          marker.addListener('click', function(e) {
            // myMap.setCenter(marker.getPosition());
            iw_restDtls.setPosition(mrkr_locations[i]);
            iw_restDtls.setContent(iw_popus[i]); 
            iw_restDtls.open(myMap, marker);
          });
          
          markers.push(marker);
        } //.for
  
        //adding styles to selected <li> elements 
        $('.restaurant-list li').click(function(e) {
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
  
      } //end of inner if statement
      else if (xhr.status === 404) {
            console.log('404: File not found');
      } 
      else if (xhr.status === 500) {
            console.log('500: Server had a problem');
      } 
    }
    else {
      console.log(xhr.statusText); //OK
    }
  }; //end of onreadystatechange
  xhr.open('GET', jsonPath);
  xhr.send();
  //}); //end of Promise

};//end of getUserLocation function


















/** AJAX Request - Importing JSON data into map
*****************************************************/
/*

function getJSON(url, callback) {
  // AJAX Request
  //return Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.onload = 
    xhr.onload = function() {// xhr.onreadystatechange = function() {
      if (xhr.readyState === 4) {
        if (xhr.status === 200 || xhr.status === 201) {
          let restaurants = JSON.parse(xhr.responseText);
          // resolve (restaurants);
          return callback(restaurants);
        }//inner if
        else if (xhr.status === 404) {
          console.log('404: File not found');
        } 
        else if (xhr.status === 500) {
          console.log('500: Server had a problem');
        } 
      } //outer if
      else {
        console.log(xhr.statusText); //OK
      }
    }; //.load()
    xhr.send();
  //}end of Promise 
} //getJSON(url)


*/

/** Displaying data by user selection 
*****************************************************/
/*

function getSelect(data) {
  const selectElm = document.getElementById('rating-list').value;
  console.log("selectElm = " + selectElm);

  //getJSON() data **********************************************************************************************************************************************!!!!!!
  // if (selectElm === "any rating") {
  //   getJSON(jsonPath, getSelect);
  //   console.log("NEW DATA LOADED: " + data);
 
  // }
  
}//when a new <options> is selected

// getSelect();
  // if (selectElm === "any rating") {
  //   getJSON(jsonPath, getSelect);
 
  // }

*/