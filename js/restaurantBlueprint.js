/*===========================================================================================================
*  FACTORY PATTERN 
===========================================================================================================*/


/** (new) restaurant blueprint
************************************************************/
function restPlace(name, address, telephone, website, lat, lng, rating, userRatingsTotal, reviews, icon, photos, priceLevel, restIndex, isOpen) {
  // private data variables
  const rName = name;
  const rAddress = address;
  const rTelephone = telephone;
  const rWebsite = website;
  const rLat = lat;
  const rLng = lng;
  const rRating = rating;
  const rRatingsTotal = userRatingsTotal;
  let rReviews = reviews;
  const rIcon = icon;
  const rPhotos = photos;
  const rPriceLevel = priceLevel;
  const rRestIndex = restIndex;
  const rIsRestOpen = isOpen; // true/false

  const popup_IMG = getPopuPhoto(rPhotos, rIcon);
  const list_IMG = getLiElemPhoto(rPhotos, rIcon);
  const user_point = new google.maps.LatLng(pos.lat, pos.lng); 
  const restaurant_point = new google.maps.LatLng(lat, lng);
  const distanceInMiles = getDistanceInMiles(user_point, restaurant_point);
  const getRating = getNoRating(rRating);
  const getRatingsTotal = getNoRatingsTotal(rRatingsTotal);
  const rAvg_mrkr = getMarker_No(rRating);
  const markerImg = 'images/' + rAvg_mrkr + 'star-marker.png';
  const xxxxxStars = getXstars(rRating);
  const displayLi = showRated.indexOf(parseInt(getRating)) >= 0 ? "list-item" : "none";
  const rPopup = restPopup(popup_IMG, getRating, xxxxxStars, getRatingsTotal, rName, rAddress, rTelephone, rRestIndex); 
  const rListItem = restLiElm(rRestIndex, list_IMG, rName, getRating, xxxxxStars, getRatingsTotal, distanceInMiles, displayLi);
  const rBrief = restDtls(rName, rIsRestOpen, getRating, xxxxxStars, getRatingsTotal, rAddress, rTelephone, rWebsite);
  const rInfowindow = new google.maps.InfoWindow;
  
  const marker = new google.maps.Marker({
    title: `${rName}`,
    position: {lat: rLat, lng: rLng},
    icon: markerImg,
    map: myMap
  });
  marker.restaurantRating = parseInt(getRating);
  if(showRated.indexOf(marker.restaurantRating) < 0) {
    marker.setVisible(false);
  }
  marker.addListener('click', function(e) {
    infowindows.forEach(infowindow => infowindow.close());
    rInfowindow.setContent(rPopup); 
    rInfowindow.open(myMap, marker);
    // myMap.setCenter({lat: rLat, lng: rLng});
  });

  infowindows.push(rInfowindow);
  markers.push(marker);
  // IEFE
  return {
    // closure functions - public methods and properties
    list: function() {
      $('.restaurant-list').innerHTML = ""; 
      $('.restaurant-list').append(rListItem);
      $('.restaurant-list li').click(function(e) {
        document.querySelector('#bottomSection').style.display = "none";
        let elems = document.querySelectorAll('.selection.selected');
        for (let i = 0; i < elems.length; i++) {
          elems[i].classList.remove('selected');
          elems[i].style.backgroundColor = '#fff'; 
        }
        $(this).addClass('selected');
        let selected = document.querySelector('.selected');
        selected.style.backgroundColor = '#D9FEA2';
        e.preventDefault();
      });

    },
    brief: function() {
      // brief info about the restaurant
      document.querySelector('#rest-brief').innerHTML = rBrief;
       // Street View picture
      let panorama = new google.maps.StreetViewPanorama(document.getElementById('street-view'), {
        position: {lat: rLat, lng: rLng},
        pov: {heading: 270, pitch: 10},
        motionTracking: false,
        fullscreenControl: false,
        linksControl: false,
        panControl: false,
        zoom: 0
      });
    }, //.brief
    reviews: function() {
      let rvwsList = '<ul>';
      if (!rReviews) {
        document.getElementById('rest-reviews').innerHTML = 'No reviews found';
      }
      for (let i = 0; i < rReviews.length; i++) {
        console.log('User: ' + rReviews[i].author_name + '\nReview Time: ' 
          + rReviews[i].relative_time_description + '\nRating: ' + rReviews[i].rating + '\nReview: ' + rReviews[i].text);
        const user_name = rReviews[i].author_name;
        const user_review = rReviews[i].text;
        const review_time = rReviews[i].relative_time_description;
        const user_xxxxxStars = getUserScore(rReviews[i].rating);
        // create review
        const review = newRestReview(user_name, review_time, user_xxxxxStars, user_review);
        rvwsList += '<li>' + review + '</li>'
      }
      rvwsList += '</ul>';
      document.querySelector('#rest-reviews').innerHTML = rvwsList; 
    }, //.reviews
    housing: function(newReview) {
      console.log('user: ' + newReview.author_name + '\nscore: ' + newReview.rating + '\nreview: \n' + newReview['text']);
      rReviews.unshift(newReview);
    }
  }; //.iefe
} //.restPlace
