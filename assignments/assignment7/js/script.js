"use strict";

/*****************

Title of Project
Author Name

This is a template. You must fill in the title,
author, and this description to match your project!

******************/
let frequencies = [
  27.50,
  30.87,
  34.65,
  36.71,
  41.20,
  46.25,
  51.91
];

let kick;
let synth;
let snare;
let hihat;

let patterns = [
  'x*o*x*o*',
  'xxoxx*o*',
  '*oo*o*oo',
  'xxxxoxxx',
  'oxo**oox',
  'x*ooxoo*',
  '********',
  'x*xx*xxo'];
let pattern;
let patternIndex = 0;

let intervalSynth;
let intervalDrum;

// preload()
//
// Description of preload

function preload() {

}


// setup()
//
// Description of setup

function setup() {
  synth = new Pizzicato.Sound({
    source:'wave'
  });

  kick = new Pz.Sound('./assets/sounds/kick.wav');
  snare = new Pz.Sound('./assets/sounds/snare.wav');
  hihat = new Pz.Sound('./assets/sounds/hihat.wav');

}


// draw()
//
// Description of draw()

function draw() {

  //playNote();


}

function playNote(){
  synth.frequency = frequencies[Math.floor(Math.random()*frequencies.length)];
  synth.play()
}

function playDrum(){
  let symbol = pattern[patternIndex];



  if(symbol.indexOf('x') != -1){
    kick.play();
    console.log('kick');
  } else if (symbol.indexOf('o') != -1){
    snare.play();
    console.log('snare');
  } else if(symbol.indexOf('*') != -1){
    hihat.play();
    console.log('hihat');
  }

  if(patternIndex < pattern.length-1){
    patternIndex++;
  }else{
    patternIndex = 0;
  }
}

function mousePressed(){
  pattern = patterns[Math.floor(Math.random()*patterns.length)].split("");
  console.log(pattern);
  clearInterval(intervalSynth);
  clearInterval(intervalDrum);
  intervalSynth = setInterval(playNote, 500);
  intervalDrum = setInterval(playDrum,250);
}
