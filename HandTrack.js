console.log("HandTrack.js is Ready");

// console.log("ml5 version:", ml5.version);
import { modelLoad, gotResult } from "./LoadModel.js";
// import { make } from "./bodyPix.js";

const modelParams = {
  flipHorizontal: false, // flip e.g for video
  maxNumBoxes: 1, // maximum number of boxes to detect
  iouThreshold: 0.5, // ioU threshold for non-max suppression
  scoreThreshold: 0.6, // confidence threshold for predictions.
  // modelType: "ssd640fpnlite",
};
const model = await handTrack.load(modelParams);

const video = document.getElementById("videoElement");
const canvas = document.getElementById("canvas");
export var canvasimg = document.getElementById("canvasimg");
const context = canvas.getContext("2d");
const contextimg = canvasimg.getContext("2d");

// let featureExtractor = ml5.featureExtractor("MobileNet", loadModel);
// const knnClassifier = ml5.KNNClassifier();
let features;
let isVideo = false;

navigator.getUserMedia =
  navigator.getUserMedia ||
  navigator.webkitGetUserMedia ||
  navigator.mozGetUserMedia ||
  navigator.msGetUserMedia;

// Dectection Video
handTrack.startVideo(video).then(function (status) {
  console.log("video started", status);
  if (status) {
    console.log("Video started. Now tracking");
    isVideo = true;
    setInterval(runDetection, 1000);
  } else {
    console.log("Please enable video");
  }
});

// Start Video
function runDetection() {
  model.detect(video).then((predictions) => {
    console.log("Predictions: ", predictions);
    model.renderPredictions(predictions, canvas, context, video);
    toado(predictions);
    cropPicture(predictions);
  });
}
// Load the model.
handTrack.load(modelParams).then((lmodel) => {
  model = lmodel;
});

// Xác định toạ độ của phần được phát hiện
function toado(x1, x2, x3, x4) {
  const toado1 = document.getElementById("toado1");
  // console.log(x1);
  const toado2 = document.getElementById("toado2");
  // console.log(x2);
  const toado3 = document.getElementById("toado3");
  // console.log(x3);
  const toado4 = document.getElementById("toado4");
  // console.log(x4);
}

// Hiển thị phần ảnh được phát hiện
const photo = document.getElementById("showpicture");
// photo.style.visibility = "hidden";
export var imgCanvas;
export var exportBodyPix;
let imageModelURL = "https://teachablemachine.withgoogle.com/models/yR0YS0RvR/";

var classifier = ml5.imageClassifier(imageModelURL + "model.json", function () {
  console.log("Image Ready !");
});
function cropPicture(predictions) {
  let x1 = predictions[0].bbox[0];
  let x2 = predictions[0].bbox[1];
  let x3 = predictions[0].bbox[2];
  let x4 = predictions[0].bbox[3];

  // var width = x3 + 100;
  // var height = x4 + 100;
  var width = 224;
  var height = 224;

  toado(x1, x2, x3, x4, predictions);
  if (width && height) {
    canvasimg.width = width;
    canvasimg.height = height;
    contextimg.drawImage(
      video, // Video
      x1 - 50, //
      x2 - 50,
      x3 + 100,
      x4 + 120,
      0,
      0,
      224,
      224
    );
    // modelLoad();
    imgCanvas = new Image();
    imgCanvas.src = canvasimg.toDataURL();

    // exportBodyPix = imgCanvas.src;
    // console.log(exportBodyPix);
    // make();
    classifier.classify(canvasimg, 10, gotResult);
  } else {
    clearphoto();
  }
}

function clearphoto() {
  contextimg.fillStyle = "#AAA";
  contextimg.fillRect(0, 0, canvasimg.width, canvasimg.height);
}
