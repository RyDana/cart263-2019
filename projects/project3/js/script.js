"use strict";

/*****************

Title of Project
Author Name

This is a template. You must fill in the title,
author, and this description to match your project!

******************/
let score = 0;
let overBasket = false;
let overPlay= false;
let inHand = false;
let numberOfSharks = 10;
let sharkMaxLife = 0.5;
let sharkLifeLoss = 0.0005;
let gameOver = true;
let foodId = [
  ["#pizza-gltf", {x:1, y:1, z:1}],
  ["#hotdog-gltf", {x:0.05, y:0.05, z:0.05}],
  ["#burger-gltf", {x:0.05, y:0.05, z:0.05}],
  ["#pretzel-gltf", {x:0.005, y:0.005, z:0.005}]
];
let foodInHandId;

// document.addEventListener('DOMContentLoaded', function() {
//   let sharkHTML = "";
//   let i;
//   for(i = 0; i<numberOfSharks;i++){
//     let positionY = getRandom(-10,4);
//     let distFromCamera = getRandom(5,25);
//     let lapTime = getRandom(8000,30000);
//     let initLife = getRandom(0.5,0.8);
//     sharkHTML += "<a-entity mixin='rotate' position='0 " + positionY + " 0' animation='to: 0 -360 0; dur: "+lapTime+"; easing: linear'><a-entity position='"+distFromCamera+" 0 0'><a-entity mixin='flap' rotation='0 4 0' animation='to: 0 -4 0' pivot='0 0 1' ><a-entity><a-entity obj-model='obj: #head-obj; mtl: #head-mtl' static-body handle-eat></a-entity></a-entity><a-entity mixin='flap' rotation='2 0 0' animation='to: -10 0 0; dur: 3000;'' pivot='0 0 1'><a-entity obj-model='obj: #jaw-obj; mtl: #jaw-mtl' static-body></a-entity></a-entity><a-entity geometry='primitive:box; width:0.1; depth:"+initLife+"; height:0.1' position='0 0.5 1.5' material='color:green;' handle-life></a-entity></a-entity><a-entity mixin='flap' rotation='0 -4 0' animation='to: 0 4 0' pivot='0 0 1'><a-entity><a-entity obj-model='obj: #body-obj; mtl: #body-mtl' static-body></a-entity></a-entity><a-entity mixin='flap' rotation='0 -4 0' animation='to: 0 4 0' pivot='0 0 0'><a-entity obj-model='obj: #tail-obj; mtl: #tail-mtl' static-body></a-entity></a-entity></a-entity></a-entity></a-entity>"
//   }
//   document.querySelector('a-scene').innerHTML += sharkHTML;
// });

// function getRandom(min, max) {
//   return (Math.random() * (max - min) ) + min;
// }

window.addEventListener('touchstart', function() {
  if(inHand){
    throwBall();
    inHand=false;
  } else if (overBasket){
    ballInHand();
    inHand = true;
  }
});

window.addEventListener('keypress', function(e){
  // console.log("inHand: " + inHand);
  // console.log("overBasket: " + overBasket);
  if(e.keyCode === 32 && inHand){
    throwBall();
    inHand=false;
  } else if (e.keyCode === 32 && overBasket){
    ballInHand();
    inHand = true;
  } else if (e.keyCode === 32 && overPlay){
    let startScreen = document.querySelector("#startScreen");
    startScreen.parentNode.removeChild(startScreen);
    gameOver = false;
  }

});

function throwBall(){
  let ballToRemove = document.querySelector("#ballInHand");
  ballToRemove.parentNode.removeChild(ballToRemove);

  let ball = document.createElement('a-entity');
  ball.setAttribute('id','ball');
  ball.setAttribute('gltf-model', foodId[foodInHandId][0]);
  // ball.setAttribute('obj-model', {
  //   obj: '#pizza-obj',
  //   mtl: '#pizza-mtl'
  // });
  ball.setAttribute('scale', foodId[foodInHandId][1]);;
  ball.setAttribute('dynamic-body', {
    shape: 'box',
    //sphereRadius:0.3,
    mass: 10,
    linearDamping: 0.1
  });
  ball.setAttribute('angularVelocity', {x: 0, y: 0, z: 0});


  let camera = document.querySelector('a-entity');
  let theta = camera.getAttribute('rotation').x + 270;
  let phi = -camera.getAttribute('rotation').y + 90;

  let r = 2
  let position = positionAndVelocityCalculator(r, theta, phi);

  let force = 8
  let velocity = positionAndVelocityCalculator(force, theta, phi);

  ball.setAttribute('position', {
    x: position[0],
    y: position[1] + 1.5,
    z: position[2]
  });

  ball.setAttribute('velocity', {
    x: velocity[0],
    y: velocity[1],
    z: velocity[2]
  });

  document.querySelector('a-scene').append(ball);
  setTimeout(function(){
    if(ball.parentNode != null){
      ball.parentNode.removeChild(ball);
    }
  }, 2000);
}

function ballInHand(){
  foodInHandId = Math.floor(Math.random()*foodId.length);
  console.log(foodInHandId);
  let ball = document.createElement('a-entity');
  ball.setAttribute('id', 'ballInHand');
  ball.setAttribute('gltf-model', foodId[foodInHandId][0]);
  ball.setAttribute('position', {
    x: 0,
    y: -0.5,
    z: -2
  });
  ball.setAttribute('scale', foodId[foodInHandId][1]);
  ball.setAttribute('rotation',{
    x: 0,
    y: 90,
    z: 20
  })
  document.querySelector('#camera').append(ball);
}

function positionAndVelocityCalculator(multiplier, theta, phi){
  var xx = multiplier * Math.sin(Math.PI * theta / 180) * Math.cos(Math.PI * phi / 180);
  var zz = multiplier * Math.sin(Math.PI * theta / 180) * Math.sin(Math.PI * phi / 180);
  var yy = multiplier * Math.cos(Math.PI * theta / 180);

  return [xx, yy, zz];
}

AFRAME.registerComponent('handle-take', {
  init: function () {
    let el = this.el;
    el.addEventListener('mouseenter', basketME);
    el.addEventListener('mouseleave', basketML);
  }
});

function basketME(){
  this.setAttribute('scale', {x:0.6, y:0.6, z:0.6} );
  overBasket=true;
}

function basketML(){
  this.setAttribute('scale', {x:0.5, y:0.5, z:0.5} );
  overBasket=false;
}

AFRAME.registerComponent('handle-eat', {
  init: function () {
    let el = this.el;
    el.addEventListener('collide', sharkFoodCollision);
  }
});

AFRAME.registerComponent('handle-life', {
  tick: function(){
    let el = this.el;
    let color = 'green';
    if(!gameOver){
      let life = el.getAttribute("geometry").depth;
      life -= sharkLifeLoss;
      //console.log(life);
      if(life < 0){
        gameOver = true;
      } else{
        if(life < 0.2){
          color = 'red'
        } else if(life < 0.4){
          color = 'yellow'
        } else {
          color = 'green'
        }
        el.setAttribute('geometry',{
          primitive:'box',
          width:0.1,
          depth: life,
          height:0.1
        });
        el.setAttribute('material',{color: color});
      }
    }
  }
});

function sharkFoodCollision(e){
  let body = e.detail.body.el;
  let shark = this;
  if(body){
    //console.log(body);
    if(body.id === 'ball'){
      shark.removeEventListener('collide',sharkFoodCollision);
      setTimeout(function(){
        shark.addEventListener('collide',sharkFoodCollision);
      }, 1000);
      setTimeout(function(){
        body.parentNode.removeChild(body);
      }, 100);
      shark.parentNode.nextElementSibling.nextElementSibling.setAttribute('geometry',{
        primitive:'box',
        width:0.1,
        depth: sharkMaxLife,
        height:0.1
      });
      score++;
      document.getElementById('score').setAttribute('text','value',score);
      animateShark(shark);
    }
  }
}

function animateShark(shark){
  let sharkTopHead = shark.parentNode;
  let sharkJaw = sharkTopHead.nextElementSibling;
  let sharkWholeHead = sharkTopHead.parentNode;
  let sharkBody = sharkWholeHead.nextElementSibling;
  let sharkTail = sharkBody.lastElementChild;
  sharkWholeHead.setAttribute('animation',"to: -25 0 0; dur: 500;");
  sharkJaw.setAttribute("rotation","2 0 0");
  sharkJaw.setAttribute("animation","to: -10 0 0; dur: 150;");
  sharkBody.setAttribute("animation", "to: -20 0 0; dur: 500;");
  sharkTail.setAttribute("animation", "to: -20 0 0; dur: 500;");

  //return to initial position
  setTimeout(function(){
    sharkWholeHead.setAttribute('animation',"to: 0 4 0; dur:300;");
    sharkBody.setAttribute("animation", "to: 0 -4 0; dur:300;");
    sharkTail.setAttribute("animation", "to: 0 -4 0; dur:300;");
  }, 1200);

  setTimeout(function(){
    //sharkWholeHead.setAttribute('rotation',"0 4 0");
    sharkWholeHead.setAttribute('animation',"to: 0 -4 0; dur:1000;");
    //sharkBody.setAttribute("rotation", "0 -4 0");
    sharkBody.setAttribute("animation", "to: 0 4 0; dur:1000;");
    //sharkTail.setAttribute("rotation", "0 -4 0");
    sharkTail.setAttribute("animation", "to: 0 4 0; dur:1000;");
  }, 1500);

  setTimeout(function(){
    sharkJaw.setAttribute("animation","to: 2 0 0; dur: 100;");
  }, 3000);

  setTimeout(function(){
    //sharkJaw.setAttribute("rotation","2 0 0");
    sharkJaw.setAttribute("animation","to: -10 0 0; dur: 3000;");
  }, 3100);
}

AFRAME.registerComponent('handle-events', {
  init: function () {
    var el = this.el;  // <a-box>
    el.addEventListener('mouseenter', changeColorME);
    el.addEventListener('mouseleave', changeColorML);
  }
});

function changeColorME() {
  this.setAttribute('material', 'color:#24CAFF');
  overPlay = true;
}
function changeColorML() {
  this.setAttribute('material', 'color:#EF2D5E');
  overPlay = false;
}
function changeColorCollision(){
  this.setAttribute('color', '#42f465');
  this.removeEventListener('mouseenter',changeColorME);
  this.removeEventListener('mouseleave',changeColorML);
  this.removeEventListener('collide',changeColorCollision);
  score++;
  document.getElementById('score').setAttribute('text','value',score);
  let element = this;
  setTimeout(function(){
    element.setAttribute('color', '#EF2D5E');
    element.addEventListener('mouseenter', changeColorME);
    element.addEventListener('mouseleave', changeColorML);
    element.addEventListener('collide', changeColorCollision);
  },2000);
}

/**sources:
Collision between camera and object:
https://stackoverflow.com/questions/53119373/collision-between-camera-and-objects-in-a-frame

Change appearance on mouse hover
https://glitch.com/~aframe-school-cursor-handler/

Building minecraft:
https://aframe.io/docs/0.9.0/guides/building-a-minecraft-demo.html

*/
