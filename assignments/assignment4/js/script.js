"use strict";

/*****************

Eat Up
Dana Ryashy

Using jQuery UI's draggable and droppable methods to
feed a hungry mouth!

Sounds:
Buzzing: https://freesound.org/people/soundmary/sounds/194931/
Chewing: https://freesound.org/people/InspectorJ/sounds/412068/

******************/

// Sound effects for the experience
let buzzSFX = new Audio("assets/sounds/buzz.mp3");
let crunchSFX = new Audio("assets/sounds/crunch.wav");
let yuckSFX = new Audio("assets/sounds/yuck.wav");
let ahSFX = new Audio("assets/sounds/ah.wav");

// Variable to hold our two key elements
let $mouth;
let $fly;
let $maggot;

let flyPosition;
let NB_EDIBLES = 150;

$(document).ready(setup);

function setup() {

  flyPosition = Math.floor(Math.random() * (NB_EDIBLES+1));

  for(let i = 0; i < NB_EDIBLES; i++){
    if (i === flyPosition){
      let flyImg = document.createElement('img');
      flyImg.setAttribute('id','fly');
      flyImg.setAttribute('src','assets/images/real_fly.png');
      flyImg.setAttribute('width','200px');
      $('body').append(flyImg);
    }
    let maggotImg = document.createElement("img");
    maggotImg.setAttribute('class','maggot');
    maggotImg.setAttribute('src','assets/images/maggot.png');
    maggotImg.setAttribute('width','200px');
    $('body').append(maggotImg);
  }



  // Get the mouth element from the page
  $mouth = $('#mouth');
  // Make it droppable
  $mouth.droppable({
    // The drop option specifies a function to call when a drop is completed
    drop: function flyDropped (event,ui) {

      if(ui.draggable.attr('id') === 'fly'){
        ui.draggable.remove(); // $fly.remove() would work here too

        $(this).attr('src','assets/images/real_mouth-closed.jpg');
        // Now the fly is gone we should stop its buzzing
        buzzSFX.pause();
        // And start the crunching sound effect of chewing
        crunchSFX.play();
        // Use a setInterval to call the chew() function over and over
        let chewing = setInterval(chew,250);
        setTimeout(function(){
          clearInterval(chewing);
          $('#mouth').attr('src','assets/images/real_mouth-open.jpg');
          crunchSFX.pause();
          ahSFX.play();
          setTimeout(function(){
            $('#mouth').attr('src','assets/images/real_mouth-closed.jpg');
          },1000);
        },2250);
      } else{
        $(this).attr('src','assets/images/ew_mouth.jpg');
        yuckSFX.play();
        setTimeout(function(){
          $('#mouth').attr('src','assets/images/real_mouth-closed.jpg');
        },1000);
      }
    },
    over: function(event,ui){
      $(this).attr('src','assets/images/real_mouth-open.jpg');
    },
    out: function(event,ui){
      $(this).attr('src','assets/images/real_mouth-closed.jpg');
    }
  });

  // Get the fly element from the page
  $fly = $('#fly');
  // Make it draggable
  $fly.draggable({
    start: function( event, ui ) {
      // Start up the buzzing of the fly
      buzzSFX.loop = true;
      buzzSFX.play();
    },
    stop: function( event, ui ) {
      buzzSFX.pause();
    }
  });

  $maggot = $('.maggot');
  $maggot.draggable({
    revert: "valid"
  });

}

// chew()
//
// Swaps the mouth image between closed and open and plays the crunching SFX
function chew () {
  // We can use .attr() to check the value of an attribute to
  // In this case we check if the image is the open mouth
  if ($mouth.attr('src') === 'assets/images/real_mouth-open.jpg') {
    // If it is, we set the 'src' attribute to the closed mouth
    $mouth.attr('src','assets/images/real_mouth-closed.jpg');
    // and play the crunching
    crunchSFX.play();
  }
  else {
    // Otherwise the 'src' attribute must have been the closed mouth
    // so we swap it for the open mouth
    $mouth.attr('src','assets/images/real_mouth-open.jpg');
  }
}
