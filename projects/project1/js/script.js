/*****************

Crappy Nails
Dana Ryashy

A drag and drop game that never ends.
Drag the picture frames onto the wall to hang them.
The only problem is that they fall to the floor soon after.
But it's okay, try again!
Made using JQuery and JQuery UI.

hang sound source: https://freesound.org/people/snakebarney/sounds/138134/
fall sound source: https://freesound.org/people/cjosephwalker/sounds/94859/
music source: https://www.youtube.com/watch?v=HuABhumm6fY

******************/
//audio variables
let music;
let fallSFX;
let hangSFX;

$(document).ready(function(){

  //creation of audio objects
  music = new Audio('assets/sounds/jeoprady_music.mp3');
  fallSFX = new Audio('assets/sounds/wood_fall.wav');
  hangSFX = new Audio('assets/sounds/hang.mp3');
  //Setting volume and looping for music
  music.volume = 0.6;
  music.loop = true;

  //Custom cursor
  $('body').css('cursor','url(assets/images/hand.png),auto');

  //Hide intro, play music and reveal game container on play button press
  $('#playText').on('click', function(){
    $('.intro').hide();
    $('.container').show();
    music.play();
  });

  //Setting up the draggable picture frames
  $( ".draggable" ).draggable({
    //contained in window
    containment: "window",
    //cursor change when grabbed
    cursor: "url(assets/images/hand2.png),auto",
    //z-index regulation with the other draggables (put on top)
    stack: ".draggable",
    //called when dragging starts
    start: function(event, ui) {
        //Use of helper to detect superposition with the appropriate
        //droppable. Initiated in false state since draggable is not
        //on desired droppable if dragging possible (when not on droppable)
        //(Technique obtained through StackExchange. URL:
        //https://stackoverflow.com/questions/8092771/jquery-drag-and-drop-checking-for-a-drop-outside-a-droppable)
        ui.helper.data('dropped', false);

        let $this = $(this);

        //wobble animation on the image inside the selected draggable div
        $this.children().animate( {
          height: '+=40px',
          width: '+=40px'
        }, 500, "easeOutElastic" );
        $this.children().animate( {
          height: '-=40px',
          width: '-=40px'
        },200, "easeOutQuart" );
    },
    //called when draggable is released
    stop: function( event, ui ) {
      //Helper verifies if draggable is over the appropriate droppable
      //if it is not (===false), perform a falling animation onto the floor
      if(ui.helper.data('dropped') === false){
        let $this = $(this);
        $this.position({
          //position the bottom of the frame
          my: "center bottom",
          //at the bottom of the window, at the same x coordinate of its release
          at: "left+" +
            ($this.position().left + $this.width()/2 ) +
            " bottom",
          of: window,
          //using a "easeOutBounce" easing and playing sound
          using: function(pos) {
            $this.animate(pos, 800, "easeOutBounce");
            fallSFX.play();
          }
        });
      }
    }
  });

  //Setting up the droppables on the wall
  $( ".droppable" ).droppable({
    //accept draggables that have the same 'num' attribute than it
    accept: function(item){
      return $(this).attr('num') === item.attr('num');
    },
    //called when the appropriate draggable has been received
    drop: function( event, ui ) {
      //notify the ui helper (i.e. turn 'dropped' attribute true)
      //so that appropriate functions are performed in
      //the draggable (prevent frame from falling on the floor)
      ui.helper.data('dropped', true);

      //play a picture frame hanging sound
      hangSFX.play();

      //store the received draggable in a variable
      let dragged = ui.draggable;

      //disable the draggable
      dragged.draggable( "disable" );

      //move the draggable at the center of the droppable
      dragged.position({
        my: "center",
        at: "center",
        of: $(this),
        using: function(pos) {
          $(this).animate(pos, 200, "linear");

        }
      });

      //make the picture frame fall after 3000ms
      setTimeout(function(){
        //enable the picture frame to be dragged again
        dragged.draggable( "enable" );

        //perform the falling animation
        dragged.position({
          my: "center bottom",
          at: "left+" +
            (dragged.position().left + dragged.width()/2 ) +
            " bottom",
          of: window,
          using: function(pos) {
            $(this).animate(pos, 800, "easeOutBounce");
            fallSFX.play();
          }
        });
      }, 3000);
    }
  });
});
