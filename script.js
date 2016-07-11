var API_KEY = "YOUR_API_KEY_GOES_HERE";

$(function(){
  $(".camera-icon").on('click', function(){
    $("input.upload").trigger("click");
  });
});

function readImage(file) {
  // A file reader to preview the image on the screen
  var displayReader = new FileReader();
  displayReader.onload = function(e) {
    displayImage(e.target.result);
  };
  displayReader.readAsDataURL(file);

  // A file reader to send image to Microsoft Cognitive Services
  var emotionReader = new FileReader();
  emotionReader.onload = function (e) {
    $("header").text("Let me see...");

    getEmotion (e.target.result, function(emotion){
      $("header").text("I sense " + emotion);
    });
  };
  emotionReader.readAsArrayBuffer(file);
}

function displayImage (image) {
  $('.pic').attr('src', image);
}

function getEmotion (image, callback) {
  if (API_KEY === "YOUR_API_KEY_GOES_HERE"){
    alert ("Please plug-in your API key for the emotion API of Microsoft Cognitive Services.");
    return;
  }

  $.ajax({
    url : 'https://api.projectoxford.ai/emotion/v1.0/recognize',
    type: 'POST',
    processData: false,
    contentType: "application/octet-stream",
    data: image,
    headers: {
      "Content-Type": "application/octet-stream",
      "Ocp-Apim-Subscription-Key": API_KEY
    },
    success: function(data) {
      var emotion = getMostLikelyEmotion(data);
      callback (emotion);
    },
    error: function(jqXHR, textStatus, errorThrown) {
      alert ("Uh-oh! Something went wrong...");
    }
  });
}

function getMostLikelyEmotion (data){
  var emotionScores = data[0].scores || {};

  var scores = Object
    .keys(emotionScores)
    .map(function(emotion){
      return emotionScores[emotion];
    });

  var highestScore = Math.max.apply(Math, scores);

  for (var emotion in emotionScores){
    if (emotionScores[emotion] === highestScore){
      return emotion;
    }
  }
}
