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
    $('#camera').body.getWorldRotation(rotation);
    $('#camera').body.getWorldPosition(position);
    console.log("position:" + position.x + " Rotation: " + rotation.x);
  }
});


// AFRAME.registerComponent('rotation-reader', {
//   /**
//    * We use IIFE (immediately-invoked function expression) to only allocate one
//    * vector or euler and not re-create on every tick to save memory.
//    */
//   tick: (function () {
//
//     return function () {
//       this.el.object3D.getWorldPosition(position);
//       this.el.object3D.getWorldRotation(rotation);
//       // position and rotation now contain vector and euler in world space.
//     };
//   })
// });

// let hit = false
// let resetId = 0
// const resetBall = () => {
//     clearTimeout(resetId)
//     $("#ball").body.position.set(0, 0.6,-4)
//     $("#ball").body.velocity.set(0, 5,0)
//     $("#ball").body.angularVelocity.set(0, 0,0)
//     hit = false
//     resetId = setTimeout(resetBall,6000)
// }
//
// on($("#weapon"),'collide',(e)=>{
//     const ball = $("#ball")
//     if(e.detail.body.id === ball.body.id && !hit) {
//         hit = true
//         score = score + 1
//         clearTimeout(resetId)
//         resetId = setTimeout(resetBall,2000)
//     }
// })
//
// setTimeout(resetBall,3000)
