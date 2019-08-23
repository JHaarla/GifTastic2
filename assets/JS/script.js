$(document).ready(function(){

// SETUP VARIABLES
//==========================================
var authKey = "N28xiqV40WuGfKE0cSITDuibMbKogzMo";
var apiURLBase = "https://api.giphy.com/v1/gifs/search?api_key=" + authKey + "&limit=10&offset=0&rating=PG-13&q=";

var stillURL = "";
var animatedURL = "";

// var gifState = "still";

// array of initial values/emotions to be displayed
var emotions = ["tired", "confused", "mind blown", "hungry", "hangry", "frustrated", "relaxed", "sassy", "suspicious", "happy"];
var addedEmotions = [];

// user input to add to buttons/array
var userAddTerm = "";




// FUNCTIONS
//==========================================

//display buttons
function displayButtons() {
    clear();
    for (var j = 0; j < addedEmotions.length; j++) {
        //create button for each array item
        var btnVal = addedEmotions[j];
        // remove any spaces (not leading or trailing - those were already trimmed) from the user input. If this is not done, the API only returns values for the first term before the space
        var queryVal = btnVal.replace(/\s+/g, "");

        // var button = '<button class="btn btn-info btn-sm my-btn-margin">' + btnVal + '</button>';
        var newBtn = $("<button>").text(btnVal).attr("class", "btn btn-info btn-sm my-btn-margin my-emotion").attr("value", queryVal);

        $("#buttonsDiv").append(newBtn);
        // console.log(btnVal);
    }

}


// AJAX call function & display GIFs
// function getGIFs(){
    // var queryURL = apiURLBase + userAddTerm;
    // console.log(queryURL);
    // $.ajax({
    //     url: queryURL,
    //     method: "GET"
    // }).then(function(dataReturn) {
    //         console.log(dataReturn);
            
    //     });

// }

//empty the buttons div and rewite the buttons to the Dom with the user added button
function clear() {
    $("#buttonsDiv").empty();
    for (var i = 0; i < emotions.length; i++) {
        //create button for each array item
        var btnVal = emotions[i];
        var queryVal = btnVal.replace(/\s+/g, "");
        // var button = '<button class="btn btn-info btn-sm my-btn-margin">' + btnVal + '</button>';
        var newBtn = $("<button>").text(btnVal).attr("class", "btn btn-info btn-sm my-btn-margin my-emotion").attr("value", queryVal);

        $("#buttonsDiv").append(newBtn);
        // console.log(btnVal);
    }  
}


// MAIN PROCESS
//==========================================

// show the initial buttons
clear();

// hide gif-container until something is clicked
$(".gif-container").hide();

// on.click event for the buttons up top - call the Giphy API and return 10 GIFs to the DOM

$("#buttonsDiv").on("click", ".my-emotion", function(){ //event delegation syntax for the on.click event to read dynamically added buttons
console.log($(this).val());
// getGIFs();

var queryTerm = $(this).val();
var queryURL = apiURLBase + queryTerm;
// console.log(queryURL); 
// the ajax call and promise
$.ajax({
    url: queryURL,
    method: "GET"
}).then(function(dataReturn) {
    $(".gif-container").show();

    $(".gif-div").remove();
    // console.log(dataReturn);
    //this stores the data (the bit we're interested in) in a variable
    var results = dataReturn.data;
    //     
    // console.log(results);
    for (var k = 0; k < results.length; k++) {
        stillURL = results[k].images.fixed_height_still.url;
        animatedURL = results[k].images.fixed_height.url;
        var rating = results[k].rating;
    console.log(stillURL);
    console.log(animatedURL);

        var GIFdiv = $("<div>").addClass("gif-div");
        var paraEl = $("<p>").text("Rating: " + rating).addClass("rating");
        var emotionGIF = $("<img>");
        emotionGIF.attr("src", stillURL).attr("gif-still", stillURL).attr("gif-animated", animatedURL).attr("gif-state", "still").addClass("gif");

        GIFdiv.prepend(paraEl);
        GIFdiv.append(emotionGIF);

        $("#gifdiv").append(GIFdiv); 
    }
    });
})


// on.click event that adds another button
$("#userInputBtn").on("click", function(event) {
// $(document).on("click", "#userInputBtn", function(event) {

    // Blocks an empty button to be displayed if the user clicks it without adding any text
        //Doesn't work for some reason...boooo
    event.preventDefault();
    //Grab user input & trim it
    userAddTerm = $("#addInput").val().trim();
    // push the user added input to addedEmotions array
        // if conditional is to prevent and empty button since event.preventDefault(); didn't work...
    if (userAddTerm !== "") {
    addedEmotions.push(userAddTerm);
    console.log(userAddTerm);
    // reset input field to nothing so it can't be clicked repeadetly adding the last item over and over
    $("#addInput").val("");
    // trigger the displayButtons functions to write all buttons to DOM
    displayButtons();
    }
})

// click event to listen for click on the still image so we can toggle animate/still of the gif
$("#gifdiv").on("click", ".gif", function(){
state = $(this).attr("gif-state");

if (state === "still") {
    $(this).attr("gif-state", "animated");
    $(this).attr("src", $(this).attr("gif-animated"));
} else if (state === "animated") {
    $(this).attr("gif-state", "still");
    $(this).attr("src", $(this).attr("gif-still"));

}
});







}) //this closes the document.ready function