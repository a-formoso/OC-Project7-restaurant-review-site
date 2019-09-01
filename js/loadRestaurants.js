/*===========================================================================================================
*  LOADING RESTAURANTS ON THE PAGE
===========================================================================================================*/


function showRestaurantList() {
  /** AJAX Request - retrieving local data
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

        /** Listing all restaurant
        *****************************************************/
        // document.getElementById('msg_display').style.display = 'none';
        console.log("All restaurants have been processed. Dumping restaurantsList below:");
        for (let i = 0; i < restaurantsList.length; i++) {
          restaurantsList[i].list();
        }
        document.getElementById('ui-query').disabled = false;   
        document.getElementById('ui-query').style.backgroundColor = 'white';
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
