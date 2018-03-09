// Initialize Firebase
var config = {
    apiKey: "AIzaSyAYorv_6NjJ4boN4-tNA9EpXY2sycHaMog",
    authDomain: "train-tracker-d7a2e.firebaseapp.com",
    databaseURL: "https://train-tracker-d7a2e.firebaseio.com",
    projectId: "train-tracker-d7a2e",
    storageBucket: "",
    messagingSenderId: "245070538117"
    };
firebase.initializeApp(config);

var database = firebase.database();
var trainName = "";
var trainDep = "";
var trainDes = "";
var currentTime = moment();

function userInput (event) {
    // Prevents the page from refreshing
    event.preventDefault();

    // Collects the user input
    var userName = $("#train-input").val().trim();
    var userDes = $("#destination-input").val().trim();
    var userDepart = $("#departure-input").val().trim();
    var userFreq = $("#freq-input").val().trim();

    // Creates an object to push to firebase

    var newTrain = {
        train: userName,
        destination: userDes,
        departure: userDepart,
        freq: userFreq
    };

    // Pushes the above array to firebase
    database.ref().push(newTrain);

    // Clears input boxes

    $("#train-input").val("");
    $("#destination-input").val("");
    $("#departure-input").val("");
    $("#freq-input").val("");
};

// Creates a fire base event for adding train info to the database
database.ref().on("child_added", function(childSnap, prevChildKey){

    // Store data in a variable
    var trnName = childSnap.val().train;
    var trnDes = childSnap.val().destination;
    var trnStart = childSnap.val().departure;
    var trnFreq = childSnap.val().freq;

    // Subtracts one year from our time to prevent any negative differences later
    var timeConverted = moment(trnStart, "HH:mm").subtract(1, "years");
    // The difference between the two times
    var timeDiff = moment().diff(moment(timeConverted), "minutes");
    // Time apart between the difference and the frequency
    var timeRemainder = timeDiff % trnFreq;
    // Minutes until next arrival
    var timeTillTrain = trnFreq - timeRemainder;
    // Next arrival time
    var nextArrival = moment().add(timeTillTrain, "minutes")
    var arrivalConverted = moment(nextArrival).format("hh:mm");

    // Creates the various html elements
    var inputRow = $("<tr>");
    var nameInput = $("<td>");
    var desInput = $("<td>");
    var freqInput = $("<td>");
    var arrInput = $("<td>");
    var nextInput = $("<td>");

    // Pushing info to the table above
    $(inputRow).append($(nameInput).text(trnName));
    $(inputRow).append($(desInput).text(trnDes));
    $(inputRow).append($(freqInput).text(trnFreq));
    $(inputRow).append($(arrInput).text(arrivalConverted));
    $(inputRow).append($(nextInput).text(timeTillTrain));
    $("#train-data").append(inputRow);

});



$(document).on("click","#submit-button",userInput);