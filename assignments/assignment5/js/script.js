"use strict";

/*****************

Slamina
yhsayR anaD

A simple guessing game based on voice synthesis. The computer reads out an
animal name, but it reads it backwards. The user selects the animal they
think it is and either gets it right or wrong. If right, a new level is generated.
If wrong, the voice reads it out again.

Uses:

ResponsiveVoice
https://responsivevoice.org/

Animal names from:
https://github.com/dariusk/corpora/blob/master/data/animals/common.json

******************/
let animals = [
  "aardvark",
  "alligator",
  "alpaca",
  "antelope",
  "ape",
  "armadillo",
  "baboon",
  "badger",
  "bat",
  "bear",
  "beaver",
  "bison",
  "boar",
  "buffalo",
  "bull",
  "camel",
  "canary",
  "capybara",
  "cat",
  "chameleon",
  "cheetah",
  "chimpanzee",
  "chinchilla",
  "chipmunk",
  "cougar",
  "cow",
  "coyote",
  "crocodile",
  "crow",
  "deer",
  "dingo",
  "dog",
  "donkey",
  "dromedary",
  "elephant",
  "elk",
  "ewe",
  "ferret",
  "finch",
  "fish",
  "fox",
  "frog",
  "gazelle",
  "gila monster",
  "giraffe",
  "gnu",
  "goat",
  "gopher",
  "gorilla",
  "grizzly bear",
  "ground hog",
  "guinea pig",
  "hamster",
  "hedgehog",
  "hippopotamus",
  "hog",
  "horse",
  "hyena",
  "ibex",
  "iguana",
  "impala",
  "jackal",
  "jaguar",
  "kangaroo",
  "koala",
  "lamb",
  "lemur",
  "leopard",
  "lion",
  "lizard",
  "llama",
  "lynx",
  "mandrill",
  "marmoset",
  "mink",
  "mole",
  "mongoose",
  "monkey",
  "moose",
  "mountain goat",
  "mouse",
  "mule",
  "muskrat",
  "mustang",
  "mynah bird",
  "newt",
  "ocelot",
  "opossum",
  "orangutan",
  "oryx",
  "otter",
  "ox",
  "panda",
  "panther",
  "parakeet",
  "parrot",
  "pig",
  "platypus",
  "polar bear",
  "porcupine",
  "porpoise",
  "prairie dog",
  "puma",
  "rabbit",
  "raccoon",
  "ram",
  "rat",
  "reindeer",
  "reptile",
  "rhinoceros",
  "salamander",
  "seal",
  "sheep",
  "shrew",
  "silver fox",
  "skunk",
  "sloth",
  "snake",
  "squirrel",
  "tapir",
  "tiger",
  "toad",
  "turtle",
  "walrus",
  "warthog",
  "weasel",
  "whale",
  "wildcat",
  "wolf",
  "wolverine",
  "wombat",
  "woodchuck",
  "yak",
  "zebra"
];
let correctAnimal;
let answers = [];
let score;
let voiceTries;
const NUM_OPTIONS = 5;

$(document).ready(setup);

function setup() {
  $('#click-to-begin').on('click',startGame);
}


function startGame() {
  $('#click-to-begin').remove();
  $('#scoreDiv').show();
  score = 0;
  newRound();
}

function newRound() {
  voiceTries = 0;
  answers = [];
  for (let i = 0; i < NUM_OPTIONS; i++) {
    let answer = animals[Math.floor(Math.random() * animals.length)];
    addButton(answer);
    answers.push(answer);
  }

  correctAnimal = answers[Math.floor(Math.random() * answers.length)];
  speakAnimal(correctAnimal);
}

function speakAnimal(name) {

  let reverseAnimal = name.split('').reverse().join('');

  let options = {
    pitch: Math.random(),
    rate: Math.random()
  };
  responsiveVoice.speak(reverseAnimal,'UK English Male',options);
}

function addButton(label) {
  let $button = $('<div class="guess"></div>');
  $button.text(label);
  $button.button();
  $button.on('click',function () {
    if ($(this).text() === correctAnimal) {
      $('.guess').remove();
      score++;
      $('#score').text(score);
      setTimeout(newRound,1000);
    }
    else {
      $(this).effect('shake');
      speakAnimal(correctAnimal);
      score = 0;
      $('#score').text(score);
    }
  });

  $('body').append($button);
}

if (annyang) {
  var commands = {
    'I give up': function() {
      $('.guess').each(function(){
        if($(this).text() === correctAnimal){
          $(this).effect('shake');
        }
      });

      setTimeout(function(){
        $('.guess').remove();
        score = 0;
        $('#score').text(score);
        setTimeout(newRound,1500);
      },1000);
    },
    'Say it again': function() {
      speakAnimal(correctAnimal);
    },
    "I think it's *tag": function(tag){
      if(tag === correctAnimal){
        score++;
        $('#score').text(score);
        $('.guess').remove();
        setTimeout(newRound,1000);
      } else {
        if (voiceTries === 0){
          responsiveVoice.speak("I probably misunderstood. Either say it again or click on the answer with your mouse",'UK English Male');
          voiceTries++;
        } else if (voiceTries === 1){
          responsiveVoice.speak("I didn't understand. Click on the answer with your mouse or you might loose your score",'UK English Male');
          voiceTries++;
        } else if (voiceTries === 2){
          responsiveVoice.speak("Incorrect",'UK English Male');
          setTimeout(function(){
            $('.guess').remove();
            score = 0;
            $('#score').text(score);
            setTimeout(newRound,1500);
          },1000);
        }
        // $('.guess').each(function(){
        //   if($(this).text() === correctAnimal){
        //     $(this).effect('shake');
        //   }
        // });

      }
    }

  };

  annyang.addCommands(commands);
  annyang.start();
}
