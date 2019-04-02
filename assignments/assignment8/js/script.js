"use strict";

/*****************

Title of Project
Author Name

This is a template. You must fill in the title,
author, and this description to match your project!

******************/
let position = new THREE.Vector3();
let rotation = new THREE.Euler();

$(document).on('keypress', function(e){
  if(e.keyCode === 32){
    let ball = document.createElement('a-entity')
    ball.setAttribute('geometry', {
      primitive: 'sphere',
      radius: 0.5
    });
    ball.setAttribute('dynamic-body', {
      shape: 'sphere',
      mass: 1.5,
      linearDamping: 0.005
    });
    ball.setAttribute('material', {
      color: "green"
    });
    ball.setAttribute('velocity', {x: 1, y: 5, y: 0});
    ball.setAttribute('angularVelocity', {x: 0, y: 0, z: 0});
    ball.setAttribute('position', {x: 1, y: 2, z: -3});
    $('a-scene').append(ball);
  }
});


AFRAME.registerComponent('rotation-reader', {
  /**
   * We use IIFE (immediately-invoked function expression) to only allocate one
   * vector or euler and not re-create on every tick to save memory.
   */
  tick: (function () {

    return function () {
      this.el.object3D.getWorldPosition(position);
      this.el.object3D.getWorldRotation(rotation);
      // position and rotation now contain vector and euler in world space.
    };
  })
});
/**
Collision between camera and object:
https://stackoverflow.com/questions/53119373/collision-between-camera-and-objects-in-a-frame

Change appearance on mouse hover
https://glitch.com/~aframe-school-cursor-handler/

Building minecraft:
https://aframe.io/docs/0.9.0/guides/building-a-minecraft-demo.html

*/
