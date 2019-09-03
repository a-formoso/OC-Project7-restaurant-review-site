/*===========================================================================================================
*  CALLBACK FUNCTIONS
===========================================================================================================*/


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

/** For when queried restaurants have no rating value
*****************************************************/
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

/** info tabs - instructions for enabling location
*****************************************************/
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
const mql = window.matchMedia('(max-width: 767px)'); // The Window interface's matchMedia() method returns a new MediaQueryList object 
mobileCarousel(mql);
mql.addListener(mobileCarousel); // Attach listener function on state changes