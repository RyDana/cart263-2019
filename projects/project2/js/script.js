/*****************

Title of Project
Author Name

This is a template. You must fill in the title,
author, and this description to match your project!

******************/


// {
//  "error": {
//   "errors": [
//    {
//     "domain": "global",
//     "reason": "required",
//     "message": "Required parameter: q",
//     "locationType": "parameter",
//     "location": "q"
//    }
//   ],
//   "code": 400,
//   "message": "Required parameter: q"
//  }
// }

// let yourUrl = "https://openclipart.org/developers/search/json/?query=play"
//
// function Get(yourUrl){
//     var Httpreq = new XMLHttpRequest(); // a new request
//     Httpreq.open("GET",yourUrl,false);
//     Httpreq.send(null);
//     return Httpreq.responseText;
// }
//
// var json_obj = JSON.parse(Get(yourUrl));
// console.log("Result: "+json_obj);

// $.getJSON(
//     'https://openclipart.org/developers/search/json/?query=play',
//     function(data) {
//       console.log(data)
//     }
// );


//Source: https://stackoverflow.com/questions/20241408/parse-openclipart-api-json-to-html
let mostDwnld;
let mostDwnldIndex;
let query;


function fancyFunction() {
    mostDwnld = 0;
    mostDwnldIndex = 0;

    query = $('#caracterTxt').val();

    var api = "http://openclipart.org/search/json/?";
    $.getJSON( api, {
        query: query,
        // page: "1",
        amount: "30"
    }, function( data ) {
        console.log(data);
        if(data.payload.length === 0){
          console.log('empty');
        } else{

          let arrayLength = data.payload.length;
          let index = 0;

          let interval = setInterval(function(){
            if(index < arrayLength){
              $( "<img>" ).attr( "src", data.payload[index].svg.png_thumb ).appendTo( "#images");
              index++;
            } else {
              clearInterval(interval);
            }
          }, 1000);


          // $.each( data.payload, function( i, item ) {
          //
          //     setTimeout(function(){
          //         $( "<img>" ).attr( "src", item.svg.png_thumb ).appendTo( "#images");
          //     }, 3000);
          //
          //
          //     // if(item.total_favorites > mostDwnld){
          //     //   console.log(item.total_favorites + ">" + mostDwnld)
          //     //   mostDwnld = item.total_favorites;
          //     //   mostDwnldIndex = i;
          //     // }
          // });
          // $( "<img>" ).attr( "src", data.payload[mostDwnldIndex].svg.png_thumb ).appendTo( "#images");
          //$( "<img>" ).attr( "src", data.payload[0].svg.png_thumb ).appendTo( "#images");
          findSynonym();
        }
    });
}

function findSynonym(){
  query = $('#caracterTxt').val();

  var api = "https://api.datamuse.com/words?ml=";
  var url = api + query;
  $.getJSON(url, function(data) {
      console.log('data returned', data);
  });



  // $.getJSON( api, {
  //     query: query
  //     // page: "1",
  //     // amount: "20"
  // }).done(function( data ) {
  //     console.log(data);
  //     // if(data.payload.length === 0){
  //     //   console.log('empty');
  //     // } else{
  //     //   $( "<img>" ).attr( "src", data.payload[0].svg.png_thumb ).appendTo( "#images");
  //     // }
  // });
}
