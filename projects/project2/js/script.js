/*****************

Storytime
Dana Ryashy

This is a game where one reads out loud, accompanied by a digitally-generated
voice, a story that was generated from a subject of their choosing.

Manipulations with wikipedia API were learned from this tutorial:
https://www.youtube.com/watch?v=RPz75gcHj18

Changing of the letter colors were learned from this website:
https://css-tricks.com/examples/HighlightCharacters/

Animation of images was taken from this StackOverlow answer:
https://stackoverflow.com/questions/4796743/random-position-of-divs-in-javascript


******************/

//program variables
let ogQuery; //original query submitted by the user
let counter; //counter of laps of exurpts to be read
let firstSentence;//boolean indicating if an exurpt is the first lap
let imageDisplayInterval; //interval of image animation and display
let micInputInterval; //interval checking microphone input
let mic; //microphone
let MIN_READING_VOLUME = 0.002; //player's required reading volume
let NB_EXURPT = 10; //amount of exurpts to generate

//Phrases to put in the beginning of each exurpt to link them together
let introToSentence = [
  'But then, ',
  'The next day, ',
  'What happened next was that ',
  'A week later, ',
  'A few years later, ',
  'That night, ',
  'By everyone\'s surprise, ',
  'You could\'ve guessed what happened after. ',
  'During the day, ',
  'Right after that, ',
  'Because of this, '
];

//when the document is ready
$(document).ready(function(){

  //Show title modal
  $('#title').show();

  // Create an Audio input
  mic = new p5.AudioIn();

  //when buton in title modal has been clicked on
  $('#titleButton').on('click', function(){
    $('#title').hide(); //close titl modal
    $('#query').show(); //open modal asking for a query

    annyang.start(); //start annyang to listen for query
  });
});

//adding commands into annyang
if (annyang) {
  var commands = {
    //listen for a query
    "Tell me about *tag": function(tag){

      //fill the query text box for the said query
      $('#queryBox p').text(tag);

      //verify the validity of a query with a regular expression
      //(3 or more letter word/words)
      let tagRegex = /[A-Za-z_\- ]{3,}/g
      if(tag.match(tagRegex)){

        //show a div indicating that the query is accepted
        $('#confirmedDiv').css("visibility", "visible");

        //after a few milliseconds
        setTimeout(function(){

          //close annyang
          annyang.abort();

          //hide the query modal
          $('#query').hide();

          //transfer the heard query into a program variable
          ogQuery = tag;

          //start the generated story
          startStory();
        }, 700);
      }
    }
  };

  //add the commands to annyang
  annyang.addCommands(commands);
  //annyang.start();
}

//startStory()
//
//Starts the loop generaating the story
//Verifies if the player is reading aloud (or making noise)
function startStory() {

    //set the counter for counting generated exurpts
    counter = 0;
    //set that the next generated exurpt will be the first one
    firstSentence = true;

    //Serch the query on MediaWiki (and generate an exurpt)
    getWikiSearch(ogQuery);

    //Search the query ob Pixabay (and generate images)
    getImagesPix(ogQuery);

    // start the Audio Input.
    mic.start();

    //retrieve the 'read' modal from the document
    let $readModal = $('#read');

    //start interval verifying for mic input
    micInputInterval = setInterval(function(){
      // Get the overall volume (between 0 and 1.0) from mic
      let vol = mic.getLevel();
      console.log(vol);

      //if the player is not making enough noise and the 'read' modal is invisible
      if (vol < MIN_READING_VOLUME && $readModal.css("display") === 'none'){

        //show the 'read' modal asking to make more noise
        $readModal.css("display", 'block');

      //if the player is making enough noise and the 'read' modal is visible
      }else if( vol >= MIN_READING_VOLUME && $readModal.css("display") === 'block'){

        //hide the 'read' modal
        $readModal.css("display", 'none');
      }
    }, 1000);

}

//getWikiSearch()
//
//Search a query using MediaWiki api
//returns a list of related Wikipedia articles and a brief description of them
//Chooses one random article from the list and sends it to getWikiArticle()
function getWikiSearch(query){
  //WikiMedia api, looks for a list of articles related to query, return is in JSON format
  let api = 'http://en.wikipedia.org/w/api.php?action=opensearch&format=json&origin=*&search=';

  //create a full url that integrates the query with the api adress
  let url = api + query;

  //gets the JSON response
  $.getJSON(url, function(data){
    console.log(data);

    //Amount of search results found
    let resultNb = data[1].length;

    //If it is empty, search again with the original query
    if(resultNb === 0){
       getWikiSearch(ogQuery);
    }

    //Choose a random index from the search results
    let randomIndex = Math.floor(Math.random()*data[1].length);

    //Article title of the random search result
    let title = data[1][randomIndex];

    //The URL of Wikipedia articles ends with the Wikipedia article title
    //but with every 'space' replaced by a '_'
    let titleWeb = title.replace(/\s+/g, '_');

    //Brief description of the random article
    let description = data[2][randomIndex];

    //send title and description to be displayed
    displayRandomSearch(title, description);

    //Checking if responsiveVoice is playing every 2 seconds
    let interval = setInterval(function(){
      //if the voice is not playing anymore
      if(!responsiveVoice.isPlaying()) {

        //Searches for the specific Wikipedia article from the chosen title
        getWikiArticle(titleWeb);

        //To display a new set of images for the new query
        //clear the interval that was generating images for the previous one
        if(imageDisplayInterval){
          clearInterval(imageDisplayInterval);
        }

        //clear this specific interval (since it will be set on the next round)
        clearInterval(interval);
      }
    }, 2000);

  });
}

//getWikiArticle()
//
//Search a specific article page on wikipedia
//choose a random word from that article
//set is as the new query for the next round and sends it back to getSearchWiki
function getWikiArticle(query){
  //WikiMedia api, looks for one article page with the given article title, return is in JSON format
  let api = 'http://en.wikipedia.org/w/api.php?action=query&prop=revisions&rvprop=content&format=json&origin=*&titles=';
  let url = api + query;

  //gets the JSON response
  $.getJSON(url, function(data){
    console.log(data);

    //The article contents are under a key that represents the article numbered ID
    //this id changes for every article thus it is not possible to access the contents
    //with data.query.pages[???]. But the pageID is the first child of data.query.pages
    //Retrieve page ID suing checking the value of the key.
    let pageId = Object.keys(data.query.pages)[0];

    //if the pageID is -1, no pages were found.
    if(pageId === -1){
      //Use the original query to re-start the rounds
       getWikiArticle(ogQuery);
    }

    //Content of a wikipedia page
    let content = data.query.pages[pageId].revisions[0]['*'];

    //Using a regular expression, find all 6+ letter words in that article
        //(the original idea was to use the page's hyperlinks, but they were not
        //random enough)
        // let wordRegex = /\[\[[A-Za-z0-9_\- ]+/g;
        // let words = content.match(wordRegex);
        // let unfilteredWord = words[Math.floor(Math.random()*words.length)];
        // let word = unfilteredWord.substring(2, unfilteredWord.length);
    let wordRegex = /\b\w{6,}\b/g;
    let words = content.match(wordRegex);

    //choose a random word from the generated list
    let word = words[Math.floor(Math.random()*words.length)];
    console.log(word);

    //if the end of the game has not been reached (10 laps)
    if(counter < 10){

      //send the randomly chosen word to be searched on Wikipedia again
      getWikiSearch(word);

      //generate pictures from that word
      getImagesPix(word);

      //increase counter of number of laps
      counter++;

    //if the end of the game has been reached
    } else{

      //display empty text (will be replaced by 'the end.')
      displayRandomSearch("", "");

      //stop checking for microphone input
      clearInterval(micInputInterval);
      mic.stop();

      //check if the read modal is displayed. if yes, hide it.
      let $readModal = $('#read');
      if( $readModal.css("display") === 'block'){
        $readModal.css("display", 'none');
      }

      //show the end card modal
      $('#done').show();
    }
  });
}

//displayRandomSearch()
//
//Displays the article summary (or title if empty) to be read by responsivevoice
//prepares the text for its animation
function displayRandomSearch(title, description){
  //empty the description div from its previous content
  $('#description').empty();

  //if Wikipedia has no summary for a specific article
  if(description.length === 0){
    //replace the description with the article's title
    description = title;
  }

  //if it is the first lap of the game,
  if(firstSentence){
    //add 'once upon a time' before the first sentence
    description = "Once upon a time, " + description;
    firstSentence = false; //avoids triggering on subsequent laps
  //if it is not the first lap of the game
  } else {
    //if the description is still empty (only happends when 10 laps are reached)
    if(description.length === 0){
      //deplace description by 'the end.'
      description = "The End."
    } else{

      //if the player is in the middle of the game, add a random phrase before the description
      description = introToSentence[Math.floor(Math.random()*introToSentence.length)] + description;
    }
  }

  //make responsive voice read the description
  responsiveVoice.speak(description, "UK English Male", {rate: 1.3});

  //store the length of the description
  let numCharacters = description.length;

  //create an empty string onto which the transformed description will be stored
  let spansDescription = "";

  //flank each caracter of the description text with a <span> element and attach
  //it to the transformed description string
  for (i = 0; i < numCharacters; i++) {
      spansDescription = spansDescription + "<span>" + description[i] + "</span>";
  }

  //place the transformed string in a new <div> and append it to the description <div>
  $( "<div id='innerDescription'>" + spansDescription + "</div>" ).appendTo( "#description");

  //start animation of the newly generated text
  textAnimation(numCharacters);
}

//getImagesPix()
//
//Retrieves images from Pixabay using the given query
//display images in an animation
function getImagesPix(query){
  //Pixabay API (please don't steal my key)
  //TODO: hide key
  var api = "https://pixabay.com/api/?key=11865026-7b13955d34490b0531754ed5c&q=";

  //combine with query and filter to obtain vector images only
  var url = api + query + "&image_type=vector"

  //gets the JSON response
  $.getJSON( url, function( data ) {
    console.log(data);

    //Store amounth of returned images
    let arrayLength = data.hits.length;

    //if no amount of images returned, try with original query
    if(arrayLength === 0){
      getImagesPix(ogQuery);
    } else{

      //initiate an index to cycle through the returned images
      let index = 0;

      //start an interval that displays images every second
      imageDisplayInterval = setInterval(function(){
        if(index < arrayLength){

          //initial positions of the image (bottom right corner of its <div>)
          var posx = $('#images').width();
          var posy = $('#images').height();

          //final positions of the image
          var posxFinal = (Math.random() * ($('#images').width()))+100;
          var posyFinal = (Math.random() * ($('#images').height()/2));

          //create image element
          $( "<img>" )
            //with its source being a result from JSON data
            .attr( "src", data.hits[index].previewURL)
            //with the initial position on bottom right corner of its <div>
            .css({
                'position':'absolute',
                'left':posx+'px',
                'top':posy+'px'
            })
            //append it to the said <div>
            .appendTo( "#images")
            //appear in a fade in
            .fadeIn(100)
            //move upwards and to the left in an easeOutBack easing
            .animate({
              left: ''+posxFinal,
              top: ''+posyFinal
            }, 2000, "easeOutBack")
            //delay the fade out by 2 seconds
            .delay(2000)
            //fade out and remove image after
            .fadeOut(500, function(){
                $(this).remove();
              });

          //increse index
          index++;
        } else {

          //clear interval once all the images have been desplayed
          clearInterval(imageDisplayInterval);
        }
      }, 1000);
    }
  });
}

//textAnimation()
//
//animates a text by chaging the color of each caracter sequentially
function textAnimation(numCharacters) {
  //create a counter
  let counter = 0;

  //retrieve the first span (first caracter) from the description text
  let nextSpan = $('#innerDescription span').first();

  //add a class to it that changes its color
  nextSpan.addClass("selected");

  //interval that will cycle to the next span every 50ms
  let interval = setInterval(function(){

    //if the end of the text has not been reached
    if(counter < numCharacters-1){
      //go to the next span (next caracter)
      nextSpan = nextSpan.next();
      //change its color
      nextSpan.addClass("selected");
      //increase counter
      counter++;
    } else{
      //clear interval once done
      clearInterval(interval);
    }
  }, 50);
}

//=====KEPT FOR PERSONAL PURPOSES: NOT TO GRADE===//

// function getImages(query){
//   var api = "http://openclipart.org/search/json/?";
//   $.getJSON( api, {
//       query: query,
//       // page: "1",
//       amount: "10"
//   }, function( data ) {
//       console.log(data);
//       if(data.payload.length === 0){
//         console.log('empty');
//       } else{
//
//         let arrayLength = data.payload.length;
//         let index = 0;
//         let chosenIndex = Math.floor(Math.random()*data.payload.length);
//         let randomTag = getRandomTag(data.payload[chosenIndex]);
//         console.log(randomTag);
//
//         let interval = setInterval(function(){
//           if(index < arrayLength){
//             // position sensitive to size and document's width
//             var posx = (Math.random() * ($('#images').width())).toFixed();
//             var posy = (Math.random() * ($('#images').height())).toFixed();
//
//             $( "<img>" )
//               .attr( "src", data.payload[index].svg.png_thumb )
//               .css({
//                   'position':'absolute',
//                   'left':posx+'px',
//                   'top':posy+'px'
//               })
//               .appendTo( "#images")
//               .fadeIn(100)
//               .delay(1000)
//               .fadeOut(500, function(){
//                   $(this).remove();
//                 });
//             index++;
//           } else {
//             clearInterval(interval);
//             getImages(randomTag)
//           }
//         }, 1000);
//       }
//   });
// }
//
// function getRandomTag(element){
//   let chosenTagIndex = Math.floor(Math.random()*element.tags_array.length);
//   return element.tags_array[chosenTagIndex];
// }
