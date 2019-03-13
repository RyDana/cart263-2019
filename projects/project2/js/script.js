/*****************

Title of Project
Author Name

This is a template. You must fill in the title,
author, and this description to match your project!

Manipulations with wikipedia API were learned from this tutorial:
https://www.youtube.com/watch?v=RPz75gcHj18



******************/

let query;
let counter;
let firstSentence;
let imageDisplayInterval;

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


function fancyFunction() {
    counter = 0;
    firstSentence = true;

    query = $('#caracterTxt').val();
    getWikiSearch(query);
    getImagesPix(query);



}

function getWikiSearch(query){
  let api = 'http://en.wikipedia.org/w/api.php?action=opensearch&format=json&origin=*&search=';

  let url = api + query;
  $.getJSON(url, function(data){
    console.log(data);
    let resultNb = data[1].length;
    if(resultNb === 0){
       getWikiSearch($('#caracterTxt').val());
    }
    let randomIndex = Math.floor(Math.random()*data[1].length);

    let title = data[1][randomIndex];
    let titleWeb = title.replace(/\s+/g, '_');
    let description = data[2][randomIndex];

    displayRandomSearch(title, description);


    let interval = setInterval(function(){
      if(!responsiveVoice.isPlaying()) {
        getWikiArticle(titleWeb);
        clearInterval(interval);
      }
    }, 2000);

  });
}

function getWikiArticle(query){
  let api = 'http://en.wikipedia.org/w/api.php?action=query&prop=revisions&rvprop=content&format=json&origin=*&titles=';
  let url = api + query;
  $.getJSON(url, function(data){
    console.log(data);
    let pageId = Object.keys(data.query.pages)[0];
    if(pageId === -1){
       getWikiArticle($('#caracterTxt').val());
    }
    let content = data.query.pages[pageId].revisions[0]['*'];
    //$( "<p>" + content + "</p>" ).appendTo( "#description");
    let wordRegex = /\b\w{6,}\b/g;
    // let wordRegex = /\[\[[A-Za-z0-9_\- ]+/g;
    let words = content.match(wordRegex);
    // let unfilteredWord = words[Math.floor(Math.random()*words.length)];
    // let word = unfilteredWord.substring(2, unfilteredWord.length);
    let word = words[Math.floor(Math.random()*words.length)];

    console.log(word);

    if(counter < 10){
      getWikiSearch(word);
      getImagesPix(word);
      counter++;
    }


  });

}

function displayRandomSearch(title, description){
  $('#description').empty();
  //$( "<h4>" + title + "</h4>" ).appendTo( "#description");

  if(description.length === 0){
    description = title;
  }
  if(firstSentence){
    description = "Once upon a time, " + description;
    firstSentence = false;
  } else {
    description = introToSentence[Math.floor(Math.random()*introToSentence.length)] + description;
  }

  responsiveVoice.speak(description, "UK English Male", {rate: 1.3});

  var numCharacters = description.length;

  var spansDescription = "";
  for (i = 0; i < numCharacters; i++) {
      var spansDescription = spansDescription + "<span>" + description[i] + "</span>";
  }

  $( "<div id='innerDescription'>" + spansDescription + "</div>" ).appendTo( "#description");
  textAnimation(numCharacters);
}


function getImagesPix(query){
  var api = "https://pixabay.com/api/?key=11865026-7b13955d34490b0531754ed5c&q=";
  var url = api + query + "&image_type=vector"
  $.getJSON( url, function( data ) {
      let arrayLength = data.hits.length;
      console.log(data);
      if(arrayLength === 0){
        console.log('empty');
      } else{


        let index = 0;

        imageDisplayInterval = setInterval(function(){
          if(index < arrayLength && responsiveVoice.isPlaying()){
            // position sensitive to size and document's width
            // var posx = (Math.random() * ($('#images').width())).toFixed();
            // var posy = (Math.random() * ($('#images').height())).toFixed();

            var posx = $('#images').width()/2;
            var posy = $('#images').height()/2;

            var posxFinal = (Math.random() * ($('#images').width())).toFixed();
            var posyFinal = (Math.random() * ($('#images').height())).toFixed();


            $( "<img>" )
              .attr( "src", data.hits[index].previewURL)
              .css({
                  'position':'absolute',
                  'left':posx+'px',
                  'top':posy+'px'
              })
              .appendTo( "#images")
              .fadeIn(100)
              .animate({
                left: ''+posxFinal,
                top: ''+posyFinal
              }, 2000, "easeInOutBack")
              .delay(2000)
              .fadeOut(500, function(){
                  $(this).remove();
                });
            index++;
          } else {
            clearInterval(imageDisplayInterval);
            //getImages(randomTag)
          }
        }, 1000);
      }
  });
}

function getImages(query){
  var api = "http://openclipart.org/search/json/?";
  $.getJSON( api, {
      query: query,
      // page: "1",
      amount: "10"
  }, function( data ) {
      console.log(data);
      if(data.payload.length === 0){
        console.log('empty');
      } else{

        let arrayLength = data.payload.length;
        let index = 0;
        let chosenIndex = Math.floor(Math.random()*data.payload.length);
        let randomTag = getRandomTag(data.payload[chosenIndex]);
        console.log(randomTag);

        let interval = setInterval(function(){
          if(index < arrayLength){
            // position sensitive to size and document's width
            var posx = (Math.random() * ($('#images').width())).toFixed();
            var posy = (Math.random() * ($('#images').height())).toFixed();

            $( "<img>" )
              .attr( "src", data.payload[index].svg.png_thumb )
              .css({
                  'position':'absolute',
                  'left':posx+'px',
                  'top':posy+'px'
              })
              .appendTo( "#images")
              .fadeIn(100)
              .delay(1000)
              .fadeOut(500, function(){
                  $(this).remove();
                });
            index++;
          } else {
            clearInterval(interval);
            getImages(randomTag)
          }
        }, 1000);
      }
  });
}

function getRandomTag(element){
  let chosenTagIndex = Math.floor(Math.random()*element.tags_array.length);
  return element.tags_array[chosenTagIndex];
}

function textAnimation(numCharacters){
  let theText = $('#innerDescription');
  let counter = 0;

  //$("span").removeClass("selected");
  let nextSpan = $('#innerDescription span').first();

  nextSpan.addClass("selected");

  let interval = setInterval(function(){
    if(counter < numCharacters-1){
      nextSpan = nextSpan.next();
      nextSpan.addClass("selected");
      counter++;
    } else{
      clearInterval(interval);
    }

  }, 50);

}
