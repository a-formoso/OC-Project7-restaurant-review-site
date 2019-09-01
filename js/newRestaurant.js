/*===========================================================================================================
*  CREATING A NEW RESTAURANT BY RIGHT-CLICKING ON THE MAP
===========================================================================================================*/


let apiKey = 'AIzaSyCe_PRvM5yLjmgBr6tuRH5-Dv4PmhuGVvg';

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
              document.querySelector("ul.restaurant-list").innerHTML = ""; 
              // showRestaurantList();
              for (let i = 0; i < restaurantsList.length; i++) {
                restaurantsList[i].list();
              }
              console.log("Total restaurants in memory: " + restaurantsList.length);
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