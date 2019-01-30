/*****************

Title of Project
Author Name

This is a template. You must fill in the title,
author, and this description to match your project!

******************/
let $draggables;
let $droppables;

$(document).ready(function(){

  $( ".draggable" ).draggable({
    containment: "window",
    cursor: "grabbing",
    stack: ".draggable",
    start: function(event, ui) {
        ui.helper.data('dropped', false);
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
          }
        });
      }, 3000);
    }
  });
});
