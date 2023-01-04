//Example using mediapipe's 3d single hand detection (2020) with a static image (drag and drop into the canvas)
//Based on lingdong's mediapipe-hand-p5-tf174-handv1 + https://github.com/tensorflow/tfjs-models/blob/master/handpose/README.md
//-
//David Chatting - davidchatting.com -  29th December 2022

var handposeModel = null;
var foundHands = [];

var canvas;
var frame = null;

var handposeConfig = {
                      maxContinuousChecks: Infinity,
                      detectionConfidence: 0.8,
                      iouThreshold: 0.3,
                      scoreThreshold: 0.75
                     };

handpose.load(handposeConfig).then(function(_model){
  console.log("Model loaded.")
  handposeModel = _model;
})

function setup() {
  p5.disableFriendlyErrors = true;

  canvas = createCanvas(800, 800, WEBGL);
  canvas.drop(onFileDropped);
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
  if (handposeModel && frame){
    //Pass the HTML image element
    handposeModel.estimateHands(frame.elt).then(function(_hands){      
      foundHands = _hands;
    })
  }
}

function drawHands(hands){
  fill(255,255,255);
  stroke(255,255,255);
  
  for (var i = 0; i < hands.length; i++){
    var landmarks = hands[i].landmarks;

    var palms = [0,1,2,5,9,13,17] //landmark indices that represent the palm

    for (var j = 0; j < landmarks.length; j++){
      var [x,y,z] = landmarks[j];
      point(x, y, -z);  //correcting the orientation of the hands in z
    }
  }
}
