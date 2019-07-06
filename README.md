# Restaurant Review Website

## OpenClassrooms: Front-end Web Developer, Project 7

### Project deliverables

#### Step 1: 
* A Google Maps map loaded with the Google Maps API 
* The Google Maps map will focus immediately on the position of the user
* A list of restaurants is provided as JSON data in a separate file
* Load data from local source and display POI on the map, list restaurants on the side of the map
* Display average reviews of each restaurant (ranging from 1 to 5 stars) 
* When you click on a restaurant, the list of reviews should be shown, including a Street View thumbnail
* A filter tool allows the display of restaurants that have between X and Y stars, the map should be updated in real-time to show result queries

#### Step 2: 
* Add a review about an existing restaurant
* Add a restaurant by clicking on a specific place on the map

#### Step 3: 
* Implement the Google Search API to find restaurants in a particular display area

#### By [*Alexandre Formoso*](https://aformoso.dev)
July 2019


### See full application here :point_right: [https://alexandreformoso.github.io/OC-Project7-restaurant-review-site/](https://alexandreformoso.github.io/OC-Project7-restaurant-review-site/)

![game printscreen](/images/app-preview.png)

### Example Code
```javascript

/*===========================================================================================================
*  INITIALISING GOOGLE MAPS
===========================================================================================================*/

function initMap() {
  //if user's browser does not support Navigator.geolocation object
  if (!navigator.geolocation) {
    alert('Geolocation is not supported by your browser');
  } else {
    document.querySelector('#rattings-wrapper').style.display = 'none';
    document.querySelector('#bottomSection').style.display = 'none';
    document.querySelector('#footer').style.display = 'none';
    //getCurrentLocation gets the current location of the device
    navigator.geolocation.getCurrentPosition(getUserLocation, handleErrors, options);
  }
}

