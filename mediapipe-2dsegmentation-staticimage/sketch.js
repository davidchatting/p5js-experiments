//https://codepen.io/mediapipe/pen/wvJyQpq
//-
//David Chatting - davidchatting.com -  31st December 2022

var canvas;
var inputImage = null;
var segmentedFrame = null;
var segmentationCanvas = null;
var bodySegmenter = null;
var selfieSegmentation = null;
var foundBodies = [];

function setup() {
  p5.disableFriendlyErrors = true;

  canvas = createCanvas(800, 800);
  canvas.parent("p5jsCanvas");
  
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
  inputImage = createImg(file.data, "alt", "", function () {
    findForeground(inputImage.elt);
    inputImage.remove();
  } );
  inputImage.elt.classList.add('hide');  //because we need to keep the dimensions - can't use inputImage.hide()
}

function draw() {
  background(200);
  
  if(inputImage) {
    push();
    translate(width/2, height/2); 
    scale(min(width/inputImage.width, height/inputImage.height));  //scale the image to fit the canvas
    translate(-inputImage.width/2, -inputImage.height/2);          //centre the image
    image(inputImage, 0, 0, inputImage.width, inputImage.height);
    if(segmentedFrame) {
      push();
      translate(segmentedFrame.width, 0);
      scale(-1,1);
      image(segmentedFrame, 0, 0);
      pop();
    }
    pop();
  }
}

async function findForeground(imageElement) {
  console.log("findForeground");
  segmentationCanvas = document.createElement('canvas');
  segmentationCanvas.classList.add('mediapipe-canvas');
  
  segmentationCanvas.width = imageElement.width;
  segmentationCanvas.height = imageElement.height;
  document.body.appendChild(segmentationCanvas);
  
  await selfieSegmentation.send({ image: imageElement });
}

function onFindForegroundResults(results) {
  console.log("onFindForegroundResults");
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