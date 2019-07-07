/*===========================================================================================================
*  SOME Map AND DOM ELEMENTS
===========================================================================================================*/
const user_geoLct = document.getElementById("ui-lct");
let myMap, infoWindow;
let script = document.createElement('script');
const user  = '../images/user.png';
let errorDisplay = document.getElementById('error-display');
let error_msg =`
  <div id="error-card">
    <div id="msg-wrapper">
      <div class="logo-wrapper"> <img src="../images/no-location-marker.png" alt="satellite"/> </div>
      <h4 style="color: #2E2A24; font-weight: 600; margin: 30px 0 15px 0;">Enable your location</h4>
      <h6><strong>Food World</strong> uses location to find restaurants around you.</h6>
      <h6>To enable location, please refresh your browser and respond to the prompt.</h6>
      <h6>Alternatively, see <a style="text-decoration: underline;" target="_blank" href="https://www.google.com/search?rlz=1C1CHBD_en-GBGB755GB755&ei=y4EJXZO3K9GEhbIPjNS80AU&q=how+to+enable+geolocation+&oq=how+to+enable+geolocation+&gs_l=psy-ab.3..0l10.16403.27912..28314...4.0..0.106.1961.29j1......0....1..gws-wiz.....6..0i71j35i39j0i67j0i131i67j0i131j0i10i67j0i20i263.IB3pk3dkMoY">how to enable Geolocation</a></h6> 
    </div>
  </div>`;


/*===========================================================================================================
*  INFORMATION TO REACH API
===========================================================================================================*/
const url = 'https://developers.google.com/maps/documentation/javascript/examples/json/earthquake_GeoJSONP.js';
const apiKey = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyCe_PRvM5yLjmgBr6tuRH5-Dv4PmhuGVvg&callback=initMap';
const jsonPath = 'js/restaurants.json';


/*===========================================================================================================
*  CALLBACK FUNCTIONS
===========================================================================================================*/

/** Handling location errors
*****************************************************/
handleErrors = function () {
  const msg_wrapper = document.getElementById('error_Display');
  console.log("Unable to retrieve your location");
  document.getElementById('error_display').innerHTML = error_msg;
};

/** Improving device location accuracy
*****************************************************/
const options = {
  enableHighAccuracy: true //for best possible location results
}


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
    //getCurrentLocation gets the current location of the device
    navigator.geolocation.getCurrentPosition(getUserLocation, handleErrors, options); //navigator.geolocation.getCurrentPosition(success[, error[, [options]])
  }
} 

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
let iw_popup = [];
let rest_dtls_collection = [];
let rest_index;
let allCompany_reviews = [];

let marker;

function showReviews(rest_index) {
  document.querySelector('#bottomSection').style.display = 'block';

  //restaurant details
  document.querySelector('#rest-brief').innerHTML = rest_dtls_collection[rest_index];
  //Street View panorama
  let panorama = new google.maps.StreetViewPanorama(document.getElementById('street-view'), {
    position: mrkr_locations[rest_index],
    pov: {heading: 165, pitch: 0},
    zoom: 14
  });
  
  let li_elem_id = '#' + rest_index;
  $(this).click(function(e) {
    //if clicked elem is a <a> tag, then select corresponding li elem on the side of the page
    if ($(e.target).is( ":contains('See reviews')" )) {
      console.log("It's an anchor tag!!");
      elems = document.querySelectorAll('.selection.selected');
      for (let i = 0; i < elems.length; i++) { //remove all pre-existing active classes
        elems[i].classList.remove('selected');
        elems[i].style.backgroundColor = '#fff'; //restore white background (#D9FEA2)
      }
      $(li_elem_id).addClass('selected');
      let selected = document.querySelector('.selected');
      selected.style.backgroundColor = '#D9FEA2';
    }
  });
}

/** if user's browser supports Geolocation
*****************************************************/
getUserLocation = function (position) {
  document.querySelector('#rattings-wrapper').style.display = 'block';
  document.querySelector('#bottomSection').style.display = 'block';
  document.querySelector('#footer').style.display = 'block';
  document.querySelector('#bottomSection').style.display = 'none';

  const lat = position.coords.latitude;
  const lng = position.coords.longitude;
  // console.log(`Current Latitude is ${lat} and your longitude is ${lng}`);
  console.log("To get the location used for this project, please use LAT (52.6431335), and LNG (1.3342981999999999)");
  let pos = { lat: lat, lng: lng };
  
  infoWindow = new google.maps.InfoWindow;
  //map built-in controls
  const mapOptions = {
    center: new google.maps.LatLng(lat, lng),
    zoom: 12,
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
  //creatin the map
  myMap = new google.maps.Map(document.getElementById('map'), mapOptions);
  //creating user location marker
  let user_marker = new google.maps.Marker({ 
    position: pos, 
    map: myMap, 
    icon: user, 
    draggable: true,
    animation: google.maps.Animation.BOUNCE 
  });
  setTimeout(function () {
    user_marker.setAnimation(null)
  }, 3000);

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
            let rvw = `
              <div class="review_item">
                <div class="review-item-top">
                  <p style="font-size: 18px;">Username ${j+1}</p>
                  <p style="margin-left: 3px; font-size: 18px;">[score: ${rate.toFixed(1)}]</p>
                </div>
                <div class="review-item-body">
                  <p style="margin: 0; padding: 0;">${ratings[j].comment}</p>
                </div>
              </div>`;
            // reviews = reviews + rvw;
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

          /** computing average for star ratings
          *****************************************************/
          function getXstars(avg) { //4.4
            let int = Math.floor(avg); //4
            console.log("(avg)int: " + int);
            decimal = (avg % 1).toFixed(1); //eg: 0.4
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
              avg_mrkr[i] = [marker_Rtng];
              console.log("-- 'avg_mrkr' inside getXstars() = " + avg_mrkr[i]);
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

          console.log("-----RESTAURANT[" + [i] + "] avg = " + avg);        
          //variable to hold ratings for stars being printed on the page
          rtngs_xxxxx = getXstars(avg); //avg is 0.0 when no reviews found 

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
          <li id="${rest_index}" class="selection" onClick="showReviews(${rest_index});" data-marker-id="${rest_index}" data-marker-title="${restaurant}">
            <a class="liDirectChild" href="#bottomSection">
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
                  <span style="font-size: 18px; font-weight: 600; color: #E7711B; margin-left: 0px; padding-top: 4px;">${avg}</span> 
                  <span style="font-size: 20px; margin-left: 3px;">${rtngs_xxxxx}</span>
                  <span id="noRev" style="font-size: 15px; padding-top: 5px; margin-left: 3px;">(${numbOfReviews} reviews)</span>
                </p>
                <p style="font-size: 18px; padding: 4px 0; margin: 0 0 4px;">${address}</p>
                <p style="font-size: 18px; padding: 4px 0; margin: 0 0 4px; text-decoration: none;"> <a href="tel:${telephone}"><img src="../images/telephone.png" style="width: 16px; padding-bottom: 3px; height: 16px; margin-right: 3px;"/> ${telephone}</a> </p>
                <p id="bt-align-x" style="font-size: 18px; padding: 18px 0; margin: 0 0 4px;">
                  <a id="site-btn" href="${website}" target="_blank" style="text-decoration: none;">visit restaurant site</a>
                </p>
              </div> 
            </div>`;
       
          //(hover) infoWindow content String 
          let popup = `
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
                <p style="margin: 0 0 4px; text-decoration: underline;"><a href="${website}">${website}</a></p> 
              </div>
              <div style="display: flex; justify-content: center; padding: 4px 0;">
                <p style="font-size: 15px; font-weight: 400; padding: 0px; margin: 12px 0;">
                  <a href="#bottomSection" style="color: #E7711B;" onClick="showReviews(${rest_index});"><i class="fa fa-md fa-angle-double-right fa-1x"></i> See reviews</a>
                </p>
              </div>
            </div>`;

          //making objects available outside the for loop
          mrkr_icons.push("../images/" + avg_mrkr[i] + "star-marker.png"); //updated value of avg_mrkr (after getXstars() is executed)
          console.log( " -- UDATE: avg_mrkr = " + avg_mrkr[i]);
          mrkr_locations.push({lat, lng});
          li_elems += liItem;
          iw_popup.push(popup);
          rest_dtls_collection.push(rest_dtls);
          allCompany_reviews.push(reviews);

        } //end of outer (main) for loop
    

        //placing new markers on the map
        for (let i = 0; i < mrkr_locations.length; i++) {  
          marker = new google.maps.Marker({
            //position: new google.maps.LatLng(mrkr_locations[i][i], mrkr_locations[i][i]),
            position: mrkr_locations[i],
            map: myMap,
            icon: mrkr_icons[i], 
            title: 'click for details'
          });

          //adding mouse event handlers for each marker
          /*marker.addListener('mouseover', function() {
            myMap.setZoom(13);
            infoWindow.setPosition(mrkr_locations[i]);
            infoWindow.setContent(iw_popup[i]); 
            infoWindow.open(myMap, marker);
          });*/

          marker.addListener('click', function(e) {
            // myMap.setCenter(marker.getPosition());
            infoWindow.setPosition(mrkr_locations[i]);
            infoWindow.setContent(iw_popup[i]); 
            infoWindow.open(myMap, marker);
          });
          
        } //.for
 
        //listing restaurants on the side of the page
        document.querySelector('.restaurant-list').innerHTML = li_elems;
        
        //click handler for li items
        $('li.selection').click({param1: rest_index}, cool_function); //it's picking up the last value of rest_index

        function cool_function(e) {
          // google.maps.event.trigger(mrkr_locations[i], 'click');
          console.log("---->>> " + e.data.param1);
          elems = document.querySelectorAll('.selection.selected');
          //remove all pre-existing active classes
          for (let i = 0; i < elems.length; i++) {
            elems[i].classList.remove('selected');
            elems[i].style.backgroundColor = '#fff'; //remove '#D9FEA2' (green) background
          }

          //load customer reviews
          // console.log(allCompany_reviews);
          // for (let x = 0; x < allCompany_reviews.length; x++) {
          //     let companyReviews = allCompany_reviews[x];
          //     for ( let y = 0; y < companyReviews.length; y++) {
          //       document.getElementById('rest-reviews').innerHTML = companyReviews[y];
          //   }
          // }

          // add the active class to clicked <li>
          $(this).addClass('selected');
          let selected = document.querySelector('.selected');
          selected.style.backgroundColor = '#D9FEA2';
          e.preventDefault();
        };
        
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


/** Displaying data by user selection 
*****************************************************/
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

