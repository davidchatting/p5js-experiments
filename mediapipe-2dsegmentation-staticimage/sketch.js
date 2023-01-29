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
    if(outputImage) {
      push();
      translate(outputImage.width, 0);
      scale(-1,1);
      image(outputImage, 0, 0);
      pop();
    }
    pop();
  }
}

async function findForeground(imageElement) {
  console.log("findForeground");
  await selfieSegmentation.send({ image: imageElement });
}

function onFindForegroundResults(results) {
  console.log("onFindForegroundResults");
  
  outputImage = createImage(results.segmentationMask.width, results.segmentationMask.height);
  imageBitmapToP5Image(results.segmentationMask, outputImage);
}

function imageBitmapToP5Image(bitmap, image) {
  //bitmap to canvas
  let tempCanvas = document.createElement('canvas');
  tempCanvas.id = 'tempCanvas';
  tempCanvas.width = bitmap.width;
  tempCanvas.height = bitmap.height
  tempCanvas.classList.add('hide');
  document.body.appendChild(tempCanvas);
  const ctx = tempCanvas.getContext('2d');
  ctx.drawImage(bitmap, 0, 0, bitmap.width, bitmap.height);
  
  //canvas to image
  const imageData = ctx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
  image.loadPixels();
  for (n = 0; n < image.pixels.length; n++) {
    image.pixels[n] = imageData.data[n];  //Uint8ClampedArray
  }
  image.updatePixels();
  
  tempCanvas.remove();
}