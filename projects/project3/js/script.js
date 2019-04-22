"use strict";

/*****************

Sharks are fond of Junk food
Dana Ryashy

A VR game where the player feeds sharks with various junk foods to prevent them
from eating him. Done with A-Frame.

Sources:
The first steps of the project were done with this tutorial by Josh Marinacci:
https://hacks.mozilla.org/2018/03/immersive-aframe-low-poly/

All 3D models, apart from the shark, were done by Google and available on:
https://poly.google.com/

The 3D shark was done by AlienDev and found on:
https://sketchfab.com/3d-models/low-poly-shark-58eddd6fbc2448c38efd1e3df3d0f342


The caustics gif was made by combining the two following images:
sand:
https://imgur.com/gallery/v74pT
caustics:
https://www.artstation.com/artwork/vdvaA


******************/
let score = 0; //player's score
let overBasket = false; //check if cursor is over basket
let overPlay= false; //check if cursor is over "click to play"
let inHand = false; //check if a projectile is in hand
let numberOfSharks = 10; //number of sharks in water
let sharkMaxLife = 0.5; //max level of shark's satiety
let sharkLifeLoss = 0.0005; //satiety lost per frame
let gameOver = true; //check if game over
let forceOfTrow = 8; //force at which projectile is thrown
let distCameraProjectile = 2 //distance between camera and projectile


//array of food models, their necessary scaling and their necessary repositioning
let foodId = [
  ["#pizza-gltf", {x:0.005, y:0.005, z:0.005}, {x:0, y:0, z:0}],
  ["#hotdog-gltf", {x:0.04, y:0.04, z:0.04},{x:0, y:-0.2, z:0}],
  ["#burger-gltf", {x:0.05, y:0.05, z:0.05},{x:0, y:-0.2, z:0}],
  ["#pretzel-gltf", {x:0.005, y:0.005, z:0.005},{x:0, y:-0.5, z:0}]
];
let foodInHandId; //index of food that has been grabbed

//touch event for mobile
window.addEventListener('touchstart', function() {
  //throw projectile if has been grabbed from basket
  if(inHand){
    throwBall();
    inHand=false;
  //if cursor over the basket, grab the projectile
  } else if (overBasket){
    ballInHand();
    inHand = true;
  //if cursor is over "click to play", make text dissapear and stop gameOver state
  } else if (overPlay){
    let startScreen = document.querySelector("#startScreen");
    startScreen.parentNode.removeChild(startScreen);
    gameOver = false;
  }
});

//keypress event (spacebar) for desktop (similar to touch event listener)
window.addEventListener('keypress', function(e){
  //throw projectile if has been grabbed from basket
  if(e.keyCode === 32 && inHand){
    throwBall();
    inHand=false;
  //if cursor over the basket, grab the projectile
  } else if (e.keyCode === 32 && overBasket){
    ballInHand();
    inHand = true;
  //if cursor is over "click to play", make text dissapear and stop gameOver state
  } else if (e.keyCode === 32 && overPlay){
    let startScreen = document.querySelector("#startScreen");
    startScreen.parentNode.removeChild(startScreen);
    gameOver = false;
  }
});

//throws the projectile towards cursor
function throwBall(){
  //remove the immobile projectile in hand
  let ballToRemove = document.querySelector("#ballInHand");
  ballToRemove.parentNode.removeChild(ballToRemove);

  //create a new moving projectile
  let ball = document.createElement('a-entity');
  let model = document.createElement('a-entity');

  //set the 3D model, its scaling and necessary repositioning
  //using the index of the food that was in hand
  model.setAttribute('gltf-model', foodId[foodInHandId][0]);
  model.setAttribute('scale', foodId[foodInHandId][1]);
  model.setAttribute('position', foodId[foodInHandId][2]);

  //set the ID and physics (& collider) of the projectile
  ball.setAttribute('id','ball');
  ball.setAttribute('dynamic-body', {
    shape: 'box',
    mass: 10,
    linearDamping: 0.1
  });
  ball.setAttribute('angularVelocity', {x: 0, y: 0, z: 0});

  //append the 3D model to the projectile
  //(the model needed to be repositionned to be at the center of the projectile element)
  ball.appendChild(model);

  //get the x and y rotation of the camera
  let camera = document.querySelector('a-entity');
  let theta = camera.getAttribute('rotation').x + 270;
  let phi = -camera.getAttribute('rotation').y + 90;

  //calculate the position of the projectile considering camera's orientation
  //and the distance it should be away from the camera
  let position = positionAndVelocityCalculator(distCameraProjectile, theta, phi);

  //calculate the velocity of the projectile considering camera's orientation
  //and the "force" at which it should be thrown
  let velocity = positionAndVelocityCalculator(forceOfTrow, theta, phi);

  //set the psition and velocity of projectile to the calculated values
  ball.setAttribute('position', {
    x: position[0],
    y: position[1] + 1.5, // y position slightly higher than camera level
    z: position[2]
  });

  ball.setAttribute('velocity', {
    x: velocity[0],
    y: velocity[1],
    z: velocity[2]
  });

  //append the projectile to the scene
  document.querySelector('a-scene').append(ball);

  //remove the projectile from the scene after 2sec, if existant
  setTimeout(function(){
    if(ball.parentNode != null){
      ball.parentNode.removeChild(ball);
    }
  }, 2000);
}

//funtcion called when player clicks on the basket. Puts a random food item
//in front of the camera
function ballInHand(){
  //select a random food item index amongst the array
  foodInHandId = Math.floor(Math.random()*foodId.length);

  //create the immobile projectile entity and the model entity
  let ball = document.createElement('a-entity');
  let model = document.createElement('a-entity');

  //attribute a 3D model, a scaling and repositionning of the randomly selected
  //food item to the model entity
  model.setAttribute('gltf-model', foodId[foodInHandId][0]);
  model.setAttribute('scale', foodId[foodInHandId][1]);
  model.setAttribute('position', foodId[foodInHandId][2]);

  //append the 3D model to the immobile projectile entity
  ball.appendChild(model);

  //attribute an ID, a position (slighlty below the cursor) and a rotation
  //to the immobile projectile
  ball.setAttribute('id', 'ballInHand');
  ball.setAttribute('position', {
    x: 0,
    y: -0.5,
    z: -2
  });
  ball.setAttribute('rotation',{
    x: 0,
    y: 40,
    z: 20
  });

  //append the immobile projectile to the camera
  document.querySelector('#camera').append(ball);
}

//calculates both the position and velocity of a projectile considering
//the orientation of the camera. The multiplier is either the distance of the
//projectile from the camera or the "force" of the velocity vector
function positionAndVelocityCalculator(multiplier, theta, phi){
  var xx = multiplier * Math.sin(Math.PI * theta / 180) * Math.cos(Math.PI * phi / 180);
  var zz = multiplier * Math.sin(Math.PI * theta / 180) * Math.sin(Math.PI * phi / 180);
  var yy = multiplier * Math.cos(Math.PI * theta / 180);

  return [xx, yy, zz];
}

//Event listeners registered to the basket entity, when cursor enters or leaves the entity
AFRAME.registerComponent('handle-take', {
  //init is called once at the beginning of the game
  init: function () {
    let el = this.el; //entities posessing the "handle-take" attribute in the html file (i.e. the basket)
    el.addEventListener('mouseenter', basketME);
    el.addEventListener('mouseleave', basketML);
  }
});

//When cursor enters the basket entity, scale it up and turn variable checking for
//the cursor being over the basket true.
function basketME(){
  this.setAttribute('scale', {x:0.6, y:0.6, z:0.6} );
  overBasket=true;
}

//When cursor leaves the basket entity, scale it down and turn variable checking for
//the cursor being over the basket false.
function basketML(){
  this.setAttribute('scale', {x:0.5, y:0.5, z:0.5} );
  overBasket=false;
}

//Event listener registered to the shark heads, when something collides with them
AFRAME.registerComponent('handle-eat', {
  init: function () {
    let el = this.el; //the shark head entities
    el.addEventListener('collide', sharkFoodCollision);
  }
});

//function called when something collided with the shark's head
function sharkFoodCollision(e){
  let body = e.detail.body.el; //the body that has collided with the shark
  let shark = this; //the shark head
  if(body){ //if body is still existant
    if(body.id === 'ball'){ //if the body that has collided is a projectile

      //temporarily remove the collision event listener (for 1second)
      //to disable detection of sibsequent collisions
      shark.removeEventListener('collide',sharkFoodCollision);
      setTimeout(function(){
        shark.addEventListener('collide',sharkFoodCollision);
      }, 1000);

      //remove the projectile from the scene after 100ms
      //(removing it immediately makes the physics engine throw an error)
      setTimeout(function(){
        body.parentNode.removeChild(body);
      }, 100);

      //if the player has started the game (not a practice round)
      if(!gameOver){

        //increase the satiety status bar length to its max
        shark.parentNode.nextElementSibling.nextElementSibling.setAttribute('geometry',{
          primitive:'box',
          width:0.1,
          depth: sharkMaxLife,
          height:0.1
        });

        //increase the score and display it below the cursor
        score++;
        document.getElementById('score').setAttribute('text','value',score);
      }

      //animate the shark eating the food
      animateShark(shark);
    }
  }
}

//handlers registered to every shark's satiety status bar
//The length of the bar represent their satiety level and decreases at every Frame
//Game over when one of the shark's satiety bar has reached 0
AFRAME.registerComponent('handle-life', {
  //'tick' is called every frame
  tick: function(){
    let el = this.el; //the satiety bar
    let color = 'green'; //the initial color of the bar

    //if this is not a practice round and the game is not over
    if(!gameOver){

      //get the length of the shark's satiety bar
      let life = el.getAttribute("geometry").depth;
      //decrease satiety level
      life -= sharkLifeLoss;

      //if satiety has gone below zero
      if(life < 0){

        //the game is over
        gameOver = true;

        //create game over text entity
        let gameOverText = document.createElement('a-entity');
        //position it in front of camera
        gameOverText.setAttribute('position', {x:-2, y:0, z:-5});
        //give a value, size and 3D geometry to the text
        gameOverText.setAttribute('text-geometry', {
          value:'GAME OVER',
          font:"#exoFont",
          bevelEnabled:true,
          bevelSize:0.05,
          bevelThickness:0.05,
          curveSegments:0.01,
          size:0.5,
          height:0.5
        });
        //give a dark-pink color to the text
        gameOverText.setAttribute('material', {color:"#EF2D5E"});
        //append the text to the camera entity
        document.querySelector('#camera').appendChild(gameOverText);

      //if the game is not over and it is not a practice round
      } else{
        //change the color value of the status bar according to
        //the shark's satiety level
        if(life < 0.2){
          color = 'red'
        } else if(life < 0.4){
          color = 'yellow'
        } else {
          color = 'green'
        }

        //set the length of the shark's status bar to the satiety level
        el.setAttribute('geometry',{
          primitive:'box',
          width:0.1,
          depth: life,
          height:0.1
        });
        //set the color of the shark's status bar
        el.setAttribute('material',{color: color});
      }
    }
  }
});

//animates the shark when a collision with food has occured
function animateShark(shark){
  //get the different body parts of the shark
  let sharkTopHead = shark.parentNode;
  let sharkJaw = sharkTopHead.nextElementSibling;
  let sharkWholeHead = sharkTopHead.parentNode;
  let sharkBody = sharkWholeHead.nextElementSibling;
  let sharkTail = sharkBody.lastElementChild;

  //make the body flick upwards and the jaw move faster
  sharkWholeHead.setAttribute('animation',"to: -25 0 0; dur: 500;");
  sharkJaw.setAttribute("rotation","2 0 0");
  sharkJaw.setAttribute("animation","to: -10 0 0; dur: 150;");
  sharkBody.setAttribute("animation", "to: -20 0 0; dur: 500;");
  sharkTail.setAttribute("animation", "to: -20 0 0; dur: 500;");

  //return to initial position after 1.2seconds
  setTimeout(function(){
    sharkWholeHead.setAttribute('animation',"to: 0 4 0; dur:300;");
    sharkBody.setAttribute("animation", "to: 0 -4 0; dur:300;");
    sharkTail.setAttribute("animation", "to: 0 -4 0; dur:300;");
  }, 1200);

  //start the usual undulating animation of the shark after 1.5 seconds
  setTimeout(function(){
    sharkWholeHead.setAttribute('animation',"to: 0 -4 0; dur:1000;");
    sharkBody.setAttribute("animation", "to: 0 4 0; dur:1000;");
    sharkTail.setAttribute("animation", "to: 0 4 0; dur:1000;");
  }, 1500);

  //reset the position of the jaw after 3 seconds
  setTimeout(function(){
    sharkJaw.setAttribute("animation","to: 2 0 0; dur: 100;");
  }, 3000);

  //start the usual slow open-close animation of the jaw after 3.1 seconds
  setTimeout(function(){
    sharkJaw.setAttribute("animation","to: -10 0 0; dur: 3000;");
  }, 3100);
}

//event handlers registered to the "Click to play" text, the text changes color when
//the cursor enters or leaves it
AFRAME.registerComponent('handle-events', {
  init: function () {
    var el = this.el;  // <a-box>
    el.addEventListener('mouseenter', changeColorME);
    el.addEventListener('mouseleave', changeColorML);
  }
});

//change color of "Click to play" text to a pale blue when cursor above it
//sets the variable checking if cursor is over text to true
function changeColorME() {
  this.setAttribute('material', 'color:#24CAFF');
  overPlay = true;
}

//change color of "Click to play" text to a dark pink when cursor above it
//sets the variable checking if cursor is over text to false
function changeColorML() {
  this.setAttribute('material', 'color:#EF2D5E');
  overPlay = false;
}
