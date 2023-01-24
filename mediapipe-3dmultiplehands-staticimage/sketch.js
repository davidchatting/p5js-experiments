//Example using mediapipe's 3d multiple hand detection (2021) with a static image (drag and drop into the canvas)
//Based on lingdong's mediapipe-hand-p5-tf174-handv1 + https://blog.tensorflow.org/2021/11/3D-handpose.html
//-
//David Chatting - davidchatting.com -  29th December 2022

var canvas;
var frame = null;
var handposeDetector = null;
var foundHands = [];

function setup() {
  p5.disableFriendlyErrors = true;

  canvas = createCanvas(800, 800, WEBGL);
  canvas.parent("p5jsCanvas");
  canvas.drop(onFileDropped);
  createHandDetector();
}

async function createHandDetector() {
  var handposeModel = handPoseDetection.SupportedModels.MediaPipeHands;
  var handposeDetectorConfig = {
    runtime: 'tfjs', // 'tfjs' or 'mediapipe'
    modelType: 'lite',
    maxHands: 5
  };
  handposeDetector = await handPoseDetection.createDetector(handposeModel, handposeDetectorConfig);  
}

function onFileDropped(file) {
  console.log("onFileDropped");
  frame = createImg(file.data, "alt", "", findHands);
  frame.style('visibility', 'hidden');  //because we need to keep the dimensions - can't use frame.hide()
}

function draw() {
  background(200);
  orbitControl();  //allow 3d control of the image
  
  if(frame) {
    push();
    scale(min(width/frame.width, height/frame.height));  //scale the image to fit the canvas
    translate(-frame.width/2, -frame.height/2);          //centre the image
    image(frame, 0, 0, frame.width, frame.height);
    drawHands(foundHands);
    pop();
  }
}

function findHands() {
  console.log("findHands");
  if (handposeDetector && frame){
    //Pass the HTML image element
    handposeDetector.estimateHands(frame.elt).then(function(_hands){
      foundHands = _hands;
    })
  }
}

function drawHands(hands){
  fill(255,255,255);
  stroke(255,255,255);
  
  for (var i = 0; i < hands.length; i++){
    var hand = hands[i].keypoints;

    for (var j = 0; j < hand.length; j++){
      point(hand[j].x, hand[j].y);  //correcting the orientation of the hands in z
    }
  }
}