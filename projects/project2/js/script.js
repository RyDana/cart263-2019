/*****************

Title of Project
Author Name

This is a template. You must fill in the title,
author, and this description to match your project!

Manipulations with wikipedia API were learned from this tutorial:
https://www.youtube.com/watch?v=RPz75gcHj18



******************/

//Source: https://stackoverflow.com/questions/20241408/parse-openclipart-api-json-to-html
let mostDwnld;
let mostDwnldIndex;
let query;
let counter;


function fancyFunction() {
    mostDwnld = 0;
    mostDwnldIndex = 0;
    counter = 0;

    query = $('#caracterTxt').val();
    getWikiSearch(query);
    //getImages(query);

    // var api = "http://openclipart.org/search/json/?";
    // $.getJSON( api, {
    //     query: query,
    //     // page: "1",
    //     amount: "10"
    // }, function( data ) {
    //     console.log(data);
    //     if(data.payload.length === 0){
    //       console.log('empty');
    //     } else{
    //
    //       let arrayLength = data.payload.length;
    //       let index = 0;
    //       let chosenIndex = Math.floor(Math.random()*data.payload.length);
    //
    //       console.log(getRandomTag(data.payload[chosenIndex]));
    //
    //       let interval = setInterval(function(){
    //         if(index < arrayLength){
    //           $( "<img>" ).attr( "src", data.payload[index].svg.png_thumb ).appendTo( "#images");
    //           index++;
    //         } else {
    //           clearInterval(interval);
    //         }
    //       }, 500);
    //
    //
    //       // $.each( data.payload, function( i, item ) {
    //       //
    //       //     setTimeout(function(){
    //       //         $( "<img>" ).attr( "src", item.svg.png_thumb ).appendTo( "#images");
    //       //     }, 3000);
    //       //
    //       //
    //       //     // if(item.total_favorites > mostDwnld){
    //       //     //   console.log(item.total_favorites + ">" + mostDwnld)
    //       //     //   mostDwnld = item.total_favorites;
    //       //     //   mostDwnldIndex = i;
    //       //     // }
    //       // });
    //       // $( "<img>" ).attr( "src", data.payload[mostDwnldIndex].svg.png_thumb ).appendTo( "#images");
    //       //$( "<img>" ).attr( "src", data.payload[0].svg.png_thumb ).appendTo( "#images");
    //       findSynonym();
    //     }
    // });
}

function getWikiSearch(query){
  let api = 'http://en.wikipedia.org/w/api.php?action=opensearch&format=json&origin=*&search=';

  let url = api + query;
  $.getJSON(url, function(data){
    console.log(data);
    let resultNb = data[1].length;
    let randomIndex = Math.floor(Math.random()*data[1].length);

    let title = data[1][randomIndex];
    let titleWeb = title.replace(/\s+/g, '_');
    let description = data[2][randomIndex];

    displayRandomSearch(titleWeb, description);

    setTimeout(function(){
      getWikiArticle(titleWeb);
    }, 10000);
    //getWikiArticle(titleWeb);
  });
}

function getWikiArticle(query){
  //let api = 'http://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=Craig%20Noone&format=jsonfm';
  let api = 'http://en.wikipedia.org/w/api.php?action=query&prop=revisions&rvprop=content&format=json&origin=*&titles=';
  let url = api + query;
  $.getJSON(url, function(data){
    console.log(data);

    let pageId = Object.keys(data.query.pages)[0];
    let content = data.query.pages[pageId].revisions[0]['*'];
    //$( "<p>" + content + "</p>" ).appendTo( "#description");
    let wordRegex = /\b\w{4,}\b/g;
    let words = content.match(wordRegex);
    let word = words[Math.floor(Math.random()*words.length)];

    console.log(words);
    console.log(word);

    if(counter < 10){
      getWikiSearch(word);
      counter++;
    }


  });

}

function displayRandomSearch(title, description){
  $('#description').empty();
  $( "<h4>" + title + "</h4>" ).appendTo( "#description");

  var numCharacters = description.length;

  var spansDescription = "";
  for (i = 0; i < numCharacters; i++) {
      var spansDescription = spansDescription + "<span>" + description[i] + "</span>";
  }

  $( "<div id='innerDescription'>" + spansDescription + "</div>" ).appendTo( "#description");
  console.log(spansDescription);
  textAnimation(numCharacters);
}

function findSynonym(){
  query = $('#caracterTxt').val();

  var api = "https://api.datamuse.com/words?ml=";
  var url = api + query;
  $.getJSON(url, function(data) {
      console.log('data returned', data);
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
            $( "<img>" ).attr( "src", data.payload[index].svg.png_thumb ).appendTo( "#images");
            index++;
          } else {
            clearInterval(interval);
            getImages(randomTag)
          }
        }, 500);
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
