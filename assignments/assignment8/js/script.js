"use strict";

/*****************

Title of Project
Author Name

This is a template. You must fill in the title,
author, and this description to match your project!

******************/

window.addEventListener('touchstart', function() {
  throwBall();
});

window.addEventListener('keypress', function(e){
  if(e.keyCode === 32){
    throwBall();
  }
});

function throwBall(){
  let ball = document.createElement('a-entity');
  ball.setAttribute('geometry', {
    primitive: 'sphere',
    radius: 0.5
  });
  ball.setAttribute('dynamic-body', {
    shape: 'sphere',
    mass: 10,
    linearDamping: 0.1
  });
  ball.setAttribute('material', {
    color: "green"
  });
  ball.setAttribute('angularVelocity', {x: 0, y: 0, z: 0});


  let camera = document.querySelector('a-entity');
  let theta = camera.getAttribute('rotation').x + 270;
  var phi = -camera.getAttribute('rotation').y + 90;

  let r = 2
  let position = positionAndVelocityCalculator(r, theta, phi);

  let force = 8
  let velocity = positionAndVelocityCalculator(force, theta, phi);

  ball.setAttribute('position', {
    x: position[0],
    y: position[1] + 2,
    z: position[2]
  });

  ball.setAttribute('velocity', {
    x: velocity[0],
    y: velocity[1],
    z: velocity[2]
  });

  document.querySelector('a-scene').append(ball);
}

function positionAndVelocityCalculator(multiplier, theta, phi){
  var xx = multiplier * Math.sin(Math.PI * theta / 180) * Math.cos(Math.PI * phi / 180);
  var zz = multiplier * Math.sin(Math.PI * theta / 180) * Math.sin(Math.PI * phi / 180);
  var yy = multiplier * Math.cos(Math.PI * theta / 180);

  return [xx, yy, zz];
}

AFRAME.registerComponent('handle-events', {
  init: function () {
    var el = this.el;  // <a-box>
    el.addEventListener('mouseenter', changeColorME);
    el.addEventListener('mouseleave', changeColorML);
    el.addEventListener('collide', changeColorCollision);
  }
});

function changeColorME() {
  this.setAttribute('color', '#24CAFF');
}
function changeColorML() {
  this.setAttribute('color', '#EF2D5E');
}
function changeColorCollision(){
  this.setAttribute('color', '#42f465');
  this.removeEventListener('mouseenter',changeColorME);
  this.removeEventListener('mouseleave',changeColorML);
  this.removeEventListener('collide',changeColorCollision);
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
