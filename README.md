# Restaurant Review Website

## OpenClassrooms: Front-end Web Developer, Project 7

### Project deliverables

* A Google Maps map loaded with the Google Maps API 
* The Google Maps map will focus immediately on the position of the user
* Load POIs on the map, list corresponding restaurants on the side of the map
* When the user clicks "See reviews", restaurant reviews should be shown, including a Street View picture
* A filter tool allows the display of restaurants that have between X and Y stars, the map should be updated in real-time to show result queries
* Add a restaurant by right-clicking on a specific place on the map
* Add a review about an existing restaurant
* Implement the Google Place (Search) API to find restaurants in a particular display area
* Add (Place) autocomplete feature

### Author

#### By [*Alexandre Formoso*](https://aformoso.dev)
August 2019


### See full application :point_right: [https://alexandreformoso.github.io/OC-Project7-restaurant-review-site/](https://alexandreformoso.github.io/OC-Project7-restaurant-review-site/)

![game printscreen](/images/app-preview.png)

### Example Code
```javascript

/*===========================================================================================================
*  INITIALISING GOOGLE MAPS
===========================================================================================================*/

function initMap() {
  // if user's browser does not support Navigator.geolocation object
  if (!navigator.geolocation) {
    alert('Geolocation is not supported by your browser');
  } else {
    document.querySelector('#rattings-wrapper').style.display = 'none';
    document.querySelector('#bottomSection').style.display = 'none';
    document.querySelector('#footer').style.display = 'none';
    // getCurrentLocation gets the current location of the user's device
    navigator.geolocation.getCurrentPosition(getUserLocation, handleErrors, options);
  }
}

