//https://codepen.io/mediapipe/pen/wvJyQpq
//-
//David Chatting - davidchatting.com -  31st December 2022

var canvas;
var inputImage = null;
var outputImage = null;
var selfieSegmentation = null;

function setup() {
  p5.disableFriendlyErrors = true;

  canvas = createCanvas(400, 400);
  canvas.parent("p5jsCanvas");
  
  canvas.drop(onFileDropped);
  createForegroundSegmenter();
}

async function createForegroundSegmenter() {
  selfieSegmentation = new SelfieSegmentation({locateFile: (file) => {
    return `https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation@latest/${file}`;
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
    findForeground(inputImage);
    //inputImage.remove();
  } );
  //inputImage.elt.classList.add('hide');  //because we need to keep the dimensions - can't use inputImage.hide()
}

function draw() {
  background(200);
  
  if(inputImage) {
    push();
      translate(width/2, height/2); 
      scale(min(width/inputImage.width, height/inputImage.height));  //scale the image to fit the canvas
      translate(-inputImage.width/2, -inputImage.height/2);          //centre the image
      image(inputImage, 0, 0, inputImage.width, inputImage.height);
      if(outputImage) image(outputImage, 0, 0);
    pop();
  }
}

async function findForeground(image) {
  console.log("findForeground");
  await selfieSegmentation.send({ image: image.elt });
}

function onFindForegroundResults(results) {
  console.log("onFindForegroundResults");
  
  outputImage = createImage(results.segmentationMask.width, results.segmentationMask.height);
  imageBitmapToP5Image(results.segmentationMask, outputImage, {flipX: true, flipY: false});
  outputImage.filter(GRAY);
}