"use strict";

/*****************

Raving Redactionist
Dana Ryashy

You are redacting a document, but it keeps coming unredacted!
Click the secret information to hide it, don't let all the
secrets become revealed!

******************/

// A place to store the jQuery selection of all spans
let $spans;

//A place to store the numer of secrets found
let numFound;

// When the document is loaded we call the setup function
$(document).ready(setup);

// setup()
//
// Sets the click handler and starts the time loop
function setup() {
  // Save the selection of all spans (since we do stuff to them multiple times)
  //$spans = $('span');

  //initiate score
  numFound = 0;

  // Set a click handler on the spans (so we know when they're clicked)
  $('span').not('.secret').on('click',spanClicked);
  // Set an interval of 500 milliseconds to update the state of the page
  setInterval(update,500);

  //mouse over handler for secret words
  $('.secret').on('mouseover', spanFound);
};

//spanFound()
//
//when a secret span is moused over
//highlight it in yellow
function spanFound(){
  console.log('found');
  //add found class and remove event handler
  $(this).addClass('found').off('mouseover');

  //increase score
  numFound++;

  //change html
  $('#secret-count').text(numFound);

}


// spanClicked()
//
// When a span is clicked we remove its revealed class and add the redacted class
// thus blacking it out
function spanClicked() {
  $(this).removeClass('revealed');
  $(this).addClass('redacted');
}

// update()
//
// Update is called every 500 milliseconds and it updates all the spans on the page
// using jQuery's each() function which calls the specified function on _each_ of the
// elements in the selection
function update() {
  $('.redacted').each(updateSpan);
}

// updateSpan()
//
// With a probability of 10% it unblanks the current span by removing the
// redacted class and adding the revealed class. Because this function is called
// by each(), "this" refers to the current element that each has selected.
function updateSpan() {
  let r = Math.random();
  if (r < 0.1) {
    $(this).removeClass('redacted');
    $(this).addClass('revealed');
  }
}

// A version using anonymous functions:

// $(document).ready(function () {
//   $spans = $('span');
//
//   $spans.on('click',function () {
//     $(this).removeClass('revealed');
//     $(this).addClass('redacted');
//   });
//
//   setInterval(function () {
//     $spans.each(function () {
//       let r = Math.random();
//       if (r < 0.1) {
//         $(this).removeClass('redacted');
//         $(this).addClass('revealed');
//       }
//     });
//   },500);
// });
