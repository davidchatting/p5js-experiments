//David Chatting - davidchatting.com -  23rd January 2023

var canvas;
var inputImage = null;
var outputImage = null;

function setup() {
  p5.disableFriendlyErrors = true;
  
  canvas = createCanvas(800, 800);
  canvas.parent("p5jsCanvas");
  
  canvas.drop(onFileDropped);
}

function onFileDropped(file) {
  inputImage = createImg(file.data, "alt", "", function () {
    findEdges(inputImage.elt);
    inputImage.remove();
  } );
  inputImage.elt.classList.add('hide');  //because we need to keep the dimensions - can't use frame.hide()
}

function draw() {
  background(200);

  if(outputImage) {
    push();
      translate(width/2, height/2); 
      scale(min(width/outputImage.width, height/outputImage.height));  //scale the image to fit the canvas
      translate(-outputImage.width/2, -outputImage.height/2);          //centre the image
      image(outputImage, 0, 0, outputImage.width, outputImage.height);
    pop();
  }
}

function findEdges(imageElement) {
  let mat = cv.imread(imageElement);
  cv.cvtColor(mat, mat, cv.COLOR_RGB2GRAY, 0);
  cv.Canny(mat, mat, 50, 100, 3, false);
  
  let resultSize = mat.size();
  outputImage = createImage(resultSize.width, resultSize.height);
  cvMatToP5Image(mat, outputImage);
  mat.delete();
}