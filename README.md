# Restaurant Review Website

## OpenClassrooms: Front-end Web Developer, Project 7

### Project deliverables

* A Google Maps map loaded with the Google Maps API 
* The Google Maps map will focus immediately on the position of the user
* A list of restaurants is provided as JSON data in a separate file
* A list of restaurants on the right side of the page that are within the area displayed on the map
* When you click on a restaurant, the list of reviews should be shown
* Also show the Google Street View photo via the corresponding API
* A filter tool allows the display of restaurants that have between X and Y stars
* Add a restaurant by [right-clicking] on a specific place on the map
* Add a review about an existing restaurant
* [Interate Google Paces] to display additional restaurants and reviews on your map

### Author

#### By [*Alexandre Formoso*](https://aformoso.dev) - August 2019

### See full application 
#### :point_right: [https://aformoso.github.io/OC-Project7-restaurant-review-site/](https://aformoso.github.io/OC-Project7-restaurant-review-site/)

![game printscreen](/images/app-preview.png)

### Example Code
```javascript

/*===========================================================================================================
*  INITIALISING GOOGLE MAPS
===========================================================================================================*/

/**  Geolocation API
*****************************************************/
function initMap() { 
  document.querySelector('#bottomSection').style.display = 'none';
  // if user's browser does not support Navigator.geolocation object
  if (!navigator.geolocation) { 
    console.log("Geolocation is not supported by your browser");
    alert('Geolocation is not supported by your browser');
  } else {
    document.getElementById('rattings-wrapper').style.display = 'none';
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

