# Restaurant Review Website

## OpenClassrooms: Front-end Web Developer, Project 7

### Project deliverables

* A Google Maps map loaded with the Google Maps API 
* The Google Maps map will focus immediately on the position of the user
* Load POIs on the map, list corresponding restaurants on the side of the map
* When you click on a restaurant, the list of reviews should be shown
* A filter tool allows the display of restaurants that have between X and Y stars
* Add a restaurant by right-clicking on a specific place on the map
* Add a review about an existing restaurant
* Implement the Google Place (Search) API to find restaurants in a particular display area
* Add (Place) autocomplete feature

### Author

#### By [*Alexandre Formoso*](https://aformoso.dev) - August 2019

### See full application 
#### :point_right: [https://alexandreformoso.github.io/OC-Project7-restaurant-review-site/](https://alexandreformoso.github.io/OC-Project7-restaurant-review-site/)

![game printscreen](/images/app-preview.png)

### Example Code
```javascript

/*===========================================================================================================
*  INITIALISING GOOGLE MAPS
===========================================================================================================*/

function initMap() {
  // Geolocation API - if user's browser does not support Navigator.geolocation object
  if (!navigator.geolocation) { 
    console.log("Geolocation is not supported by your browser");
    alert('Geolocation is not supported by your browser');
  } else {
    document.querySelector('#rattings-column').style.display = 'none';
    document.querySelector('#bottomSection').style.display = 'none';
    document.querySelector('.footer').style.display = 'none';
    document.getElementById('map').innerHTML = welcomeMsg;
    // getCurrentPosition gets device's live location
    navigator.geolocation.getCurrentPosition(getUserLocation, handleErrors, geoOptions);
  }
}

