"use strict";


/*===========================================================================================================
*  INFORMATION TO REACH API
===========================================================================================================*/

const localJSON = 'js/restaurants.json';
let geocoding_url = 'https://maps.googleapis.com/maps/api/geocode/json?';


/*===========================================================================================================
*  CALLBACK FUNCTIONS
===========================================================================================================*/

/** Improving device location accuracy
*****************************************************/
let geoOptions = {
  timeout: 27000,
  maximumage: 30000, // how long until we update position for more information (restaurants) 
  enableHighAccuracy: true // for best possible location results
}

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
  document.getElementById('ui-query').disabled = true;   
  document.getElementById('ui-query').style.backgroundColor = '#ddd';
  console.log(`${error.code}: Unable to retrieve your location - ${error.message}.`);
  document.getElementById('map').innerHTML = locationError;
};


/*===========================================================================================================
*  INITIALISING GOOGLE MAPS
===========================================================================================================*/

/**  Geolocation API
*****************************************************/
function initMap() { 
  // if user's browser does not support Navigator.geolocation object
  if (!navigator.geolocation) { 
    document.querySelector('#bottomSection').style.display = 'none';
    document.querySelector('.footer').style.display = 'none';
    console.log("Geolocation is not supported by your browser");
    alert('Geolocation is not supported by your browser');
  } else {
    document.querySelector('#bottomSection').style.display = 'none';
    document.getElementById('map').innerHTML = welcome_msg;
    // getCurrentPosition gets device's live location
    navigator.geolocation.getCurrentPosition(getUserLocation, handleErrors, geoOptions);
  }
} 

/** if user's browser supports Geolocation
*****************************************************/
let getUserLocation = function (position) {
  document.querySelector('#bottomSection').style.display = 'none';
  // user location coordinates - read-only properties (black box)
  let lat = position.coords.latitude; 
  let lng = position.coords.longitude;
  console.log("Google Maps API, version " + google.maps.version);
  pos = { lat: lat, lng: lng };
  createMap(pos);
}








