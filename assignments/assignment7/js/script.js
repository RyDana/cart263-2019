"use strict";

/*****************

Title of Project
Author Name

This is a template. You must fill in the title,
author, and this description to match your project!

******************/
let frequencySets = [
  [27.50, 30.87, 34.65, 36.71, 41.20, 46.25, 51.91],
  [55.00, 61.74, 69.30, 73.42, 82.41, 92.50, 103.83],
  [110.00, 123.47, 138.59, 146.83, 164.81, 185.00, 207.65],
  [220.00, 246.94, 277.18, 293.66, 329.63, 369.99, 415.30]
];
let frequencies;

let kick;
let synth;
let snare;
let hihat;

let silenceThreshold;
let PLAY_MAX = 0.8;
let PLAY_MIN = 0.4;

let MIN_NOTE_LENGTH = 250;
let MAX_NOTE_DURATION = 4;

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

//let intervalSynth;
let timeoutSynth;
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

  let quadrafuzz = new Pizzicato.Effects.Quadrafuzz({
    lowGain: 0.6,
    midLowGain: 1,
    midHighGain: 0.5,
    highGain: 0.6,
    mix: 1.0
  });

  var tremolo = new Pizzicato.Effects.Tremolo({
    speed: 8,
    depth: 1,
    mix: 0.8
  });


  synth.addEffect(quadrafuzz);
  synth.addEffect(tremolo);



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
  if(Math.random() < silenceThreshold){
    synth.play();
  } else{
    synth.pause();
  }
  playNoteLoop();
}

function playNoteLoop(){
  let noteDuration = (Math.floor(Math.random()*MAX_NOTE_DURATION)+1)*MIN_NOTE_LENGTH;
  //console.log(noteDuration);
  timeoutSynth = setTimeout(playNote, noteDuration);
}

function playDrum(){
  let symbol = pattern[patternIndex];



  if(symbol.indexOf('x') !== -1){
    kick.play();
  } else if (symbol.indexOf('o') !== -1){
    snare.play();
  } else if(symbol.indexOf('*') !== -1){
    hihat.play();
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
  frequencies = frequencySets[Math.floor(Math.random()*frequencySets.length)];
  silenceThreshold = (Math.random()*(PLAY_MAX-PLAY_MIN)) + PLAY_MIN;
  console.log(silenceThreshold);
  //clearInterval(intervalSynth);
  //intervalSynth = setInterval(playNote, 500);
  clearInterval(intervalDrum);
  intervalDrum = setInterval(playDrum,250);

  clearTimeout(timeoutSynth);
  playNoteLoop();
}
