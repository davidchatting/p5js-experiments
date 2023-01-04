//https://codepen.io/mediapipe/pen/wvJyQpq
//-
//David Chatting - davidchatting.com -  31st December 2022

var canvas;
var frame = null;
var segmentedFrame = null;
var segmentationCanvas = null;
var bodySegmenter = null;
var selfieSegmentation = null;
var foundBodies = [];

function setup() {
  p5.disableFriendlyErrors = true;

  canvas = createCanvas(800, 800, WEBGL);
  canvas.drop(onFileDropped);
  createForegroundSegmenter();
}

async function createForegroundSegmenter() {
  selfieSegmentation = new SelfieSegmentation({locateFile: (file) => {
    return `https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation@0.1/${file}`;
  }});
  var options = {
      selfieMode: true,
      modelSelection: 0,  //general
      effect: 'mask',
  };
  
  selfieSegmentation.setOptions(options);
  selfieSegmentation.onResults(onFindForegroundResults);
}

function onFileDropped(file) {
  console.log("onFileDropped");
  frame = createImg(file.data, "alt", "", findForeground);
  //frame.addClass('data-img');
}

function draw() {
  background(200);
  orbitControl();  //allow 3d control of the image
  
  if(frame) {
    push();
    scale(min(width/frame.width, height/frame.height));  //scale the image to fit the canvas
    translate(-frame.width/2, -frame.height/2);          //centre the image
    image(frame, 0, 0, frame.width, frame.height);
    if(segmentedFrame) {
      push();
      translate(segmentedFrame.width, 0);
      scale(-1,1);
      image(segmentedFrame, 0, 0);
      pop();
    }
    drawBodies(foundBodies);
    pop();
  }
}

async function findForeground() {
  console.log("findForeground");
  segmentationCanvas = document.createElement('canvas');
  segmentationCanvas.classList.add('mediapipe-canvas');
  
  segmentationCanvas.width = frame.elt.width;
  segmentationCanvas.height = frame.elt.height;
  document.body.appendChild(segmentationCanvas);
  
  await selfieSegmentation.send({ image: frame.elt });
}

function onFindForegroundResults(results) {
  console.log(results);
  console.log(results.segmentationMask);
  
  const canvasCtx = segmentationCanvas.getContext('2d');
  canvasCtx.drawImage(results.segmentationMask, 0, 0, segmentationCanvas.width, segmentationCanvas.height);
  const imageData = canvasCtx.getImageData(0, 0, segmentationCanvas.width, segmentationCanvas.height);
  
  segmentedFrame = createImage(segmentationCanvas.width, segmentationCanvas.height);
  segmentedFrame.loadPixels();
  
  for (n = 0; n < segmentedFrame.pixels.length; n++) {
    segmentedFrame.pixels[n] = imageData.data[n]; ;
  }
  segmentedFrame.updatePixels();
}

function drawBodies(bodies){
  fill(255,255,255);
  stroke(255,255,255);
  
  for (var i = 0; i < bodies.length; i++){
    console.log(bodies[i]);
//     var hand = hands[i].keypoints;

//     for (var j = 0; j < hand.length; j++){
//       point(hand[j].x, hand[j].y);  //correcting the orientation of the hands in z
//     }
  }
}

