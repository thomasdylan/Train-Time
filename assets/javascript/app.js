// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyB1tK8wUvLQrlI28-adQJ89T_Ejn-HWqMA",
    authDomain: "train-time-b5a49.firebaseapp.com",
    databaseURL: "https://train-time-b5a49.firebaseio.com",
    projectId: "train-time-b5a49",
    storageBucket: "",
    messagingSenderId: "466541826684",
    appId: "1:466541826684:web:84e737a8d37614f09feff9"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

var database = firebase.database();

var currentTime = moment().format("dddd, MMMM Do YYYY, h:mm:ss a");


$('#current-time').append(currentTime);

$("#submit-train").on("click", function(e) {
    e.preventDefault();

    var name = $('#train-input').val().trim();
    var dest = $('#destination-input').val().trim();
    var time = $('#time-input').val().trim();
    var freq = $('#frequency-input').val().trim();

    database.ref().push({
        name: name,
        destination: dest,
        firstTime: time,
        frequency: freq,
        dateAdded: firebase.database.ServerValue.TIMESTAMP
    });

    $('#input-form').trigger('reset');
});

database.ref().orderByChild('dateAdded').on("child_added", function(snapshot) {
    // How many minutes till next train.
    var firstTime = snapshot.val().firstTime;
    var firstTimeConverted = moment(firstTime, "HH:mm").subtract(1, "years");
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    var tRemainder = diffTime % (snapshot.val().frequency);
    var tMinutesLeft = (snapshot.val().frequency) - tRemainder;

    //Get next arrival time.
    var arrival = moment().add(tMinutesLeft, "minutes").format('hh:mm a');

    //Display table to DOM.
    var tr = $('<tr>');
    var trainName = $('<td>').text(snapshot.val().name);
    var destination = $('<td>').text(snapshot.val().destination);
    var frequency = $('<td>').text(snapshot.val().frequency);
    var nextArrival = $('<td>').text(arrival);
    var minutesAway = $('<td>').text(tMinutesLeft);
    tr.append(trainName, destination, frequency, nextArrival, minutesAway);
    $('#manage-data').append(tr);
});