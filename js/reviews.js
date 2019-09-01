/*===========================================================================================================
*  RESTAURANT REVIEWS
===========================================================================================================*/


/** Adding a new review
*****************************************************/
//Open modal form
function addReview(rest_index) {
  document.getElementById('review_dialog-box').innerHTML = modal;
  //passing new attributes to form elems
  let modal_addReviewBtn = document.getElementById('add-review-btn');
  modal_addReviewBtn.setAttribute('onClick', `submitReview(${rest_index});`);
}
//Close review form
let close_ReviewBtn = document.getElementById('close-review-btn');
function closeReviewForm() {
  let modal = document.getElementById('close-review-btn').closest('.modalWrapper');
  modal.style.display = "none";
}
//submit review form
function submitReview(rest_index) {
  const user_fName = document.getElementById('full-name').value; // take user input 
  // user name validation
  if (user_fName == "") {
    alert("Please include your name");
    return false;
  }
  const dropdown = document.getElementById('score');
  const score = dropdown.options[dropdown.selectedIndex].text;
  let user_score = parseInt(score, 10);
  const user_comment = document.getElementById('user-review').value;
  // user review validation
  if (user_comment == "") {
    alert("Please add a review.");
    return false;
  }
  // add review to restaurantsList array
  const newReview = { 
    author_name: user_fName,
    rating: user_score, 
    relative_time_description: 'added today', // setInterval
    text: user_comment
  }
  for (let i = 0; i < restaurantsList.length; i++) {
    if (i === rest_index) {
      restaurantsList[i].housing(newReview);
      restaurantsList[i].reviews();
    }
  }
  closeReviewForm(); 
  console.log('Thank you! Your review will help other people find the best places to go.');
}

/** Displaying restaurant reviews
*****************************************************/
function showReviews(rest_index) {
  const bottomSection = document.querySelector('#bottomSection').style.display = 'block';
  // show restaurant brief and Street View
  for (let i = 0; i < restaurantsList.length; i++) {
    if (i === rest_index) {
      restaurantsList[i].brief();
      restaurantsList[i].reviews();
    }
  }
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
  //passing onClick function to a button
  const modalBtn = document.getElementById('leave-review');
  modalBtn.setAttribute('onClick', `addReview(${rest_index});`);
} 