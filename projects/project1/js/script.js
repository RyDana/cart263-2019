/*****************

Title of Project
Author Name

This is a template. You must fill in the title,
author, and this description to match your project!

hang sound source: https://freesound.org/people/snakebarney/sounds/138134/
fall sound source: https://freesound.org/people/cjosephwalker/sounds/94859/
music source: https://www.youtube.com/watch?v=HuABhumm6fY

******************/
let music;
let fallSFX;
let hangSFX;

$(document).ready(function(){

  music = new Audio('assets/sounds/jeoprady_music.mp3');
  fallSFX = new Audio('assets/sounds/wood_fall.wav');
  hangSFX = new Audio('assets/sounds/hang.mp3');
  music.volume = 0.6;
  music.loop = true;

  $('body').css('cursor','url(assets/images/hand.png),auto');

  $('#playText').on('click', function(){
    $('.intro').hide();
    $('.container').show();
    music.play();
  });

  $( ".draggable" ).draggable({
    containment: "window",
    cursor: "url(assets/images/hand2.png),auto",
    stack: ".draggable",
    start: function(event, ui) {
        ui.helper.data('dropped', false);
        let $this = $(this);
        $this.children().animate( {
          height: '+=40px',
          width: '+=40px'
        }, 500, "easeOutElastic" );
        $this.children().animate( {
          height: '-=40px',
          width: '-=40px'
        },200, "easeOutQuart" );
    },
    stop: function( event, ui ) {
      if(ui.helper.data('dropped') === false){
        let $this = $(this);
        $this.position({
          my: "center bottom",
          at: "left+" +
            ($this.position().left + $this.width()/2 ) +
            " bottom",
          of: window,
          using: function(pos) {
            $(this).animate(pos, 800, "easeOutBounce");
            fallSFX.play();
          }
        });
      }
    }
  });

  $( ".droppable" ).droppable({
    accept: function(item){
      return $(this).attr('num') === item.attr('num');
    },
    drop: function( event, ui ) {
      ui.helper.data('dropped', true);
      hangSFX.play();
      let dragged = ui.draggable;
      dragged.draggable( "disable" );
      dragged.position({
        my: "center",
        at: "center",
        of: $(this),
        using: function(pos) {
          $(this).animate(pos, 200, "linear");

        }
      });

      setTimeout(function(){
        dragged.draggable( "enable" );
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
