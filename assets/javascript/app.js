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

var currentTime = moment();
console.log(currentTime._d);

$('#current-time').text(currentTime._d);

$("#submit-train").on("click", function(e) {
    e.preventDefault();

    var name = $('#train-input').val().trim();
    var dest = $('#destination-input').val().trim();
    var time = $('#time-input').val().trim();
    var freq = $('#frequency-input').val().trim();

    console.log(name);
    console.log(dest);
    console.log(time);
    console.log(freq);

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
    var tr = $('<tr>');
    var trainName = $('<td>').text(snapshot.val().name);
    var destination = $('<td>').text(snapshot.val().destination);
    var frequency = $('<td>').text(snapshot.val().frequency);
    var nextArrival = $('<td>').text(moment()._d);
    var minutesAway = $('<td>').text('???');
    tr.append(trainName, destination, frequency, nextArrival, minutesAway);
    $('#manage-data').append(tr);
});