//Example using mediapipe's 3d facemesh detection (2020) with a static image (drag and drop into the canvas)
//Based on lingdong's mediapipe-hand-p5-tf174-handv1 + https://blog.tensorflow.org/2020/03/face-and-hand-tracking-in-browser-with-mediapipe-and-tensorflowjs.html
//-
//David Chatting - davidchatting.com -  29th December 2022

var blazefaceModel = null;
var foundfaces = [];

var canvas;
var outputImage = null;

blazeface.load().then(function(_model){
  console.log("blazeface model loaded.")
  blazefaceModel = _model;
})

function setup() {
  p5.disableFriendlyErrors = true;

  canvas = createCanvas(800, 800);
  canvas.parent("p5jsCanvas");
  canvas.drop(onFileDropped);
}

function onFileDropped(file) {
  console.log("onFileDropped");
  outputImage = createImg(file.data, "alt", "", findFaces);
  outputImage.style('visibility', 'hidden');  //because we need to keep the dimensions - can't use outputImage.hide()
}

function draw() {
  background(200);
  
  if(outputImage) {
    push();
    translate(width/2, height/2); 
    scale(min(width/outputImage.width, height/outputImage.height));  //scale the image to fit the canvas
    translate(-outputImage.width/2, -outputImage.height/2);          //centre the image
    image(outputImage, 0, 0, outputImage.width, outputImage.height);
    drawFace(foundfaces);
    pop();
  }
}

async function findFaces() {  
  foundfaces = await blazefaceModel.estimateFaces(outputImage.elt, false);
};

function drawFace(faces){
  stroke(255,255,255);
  noFill();
  
  for (var i = 0; i < faces.length; i++){
    console.log(faces[i]);
    var x = faces[i].topLeft[0];
    var y = faces[i].topLeft[1];
    var w = faces[i].bottomRight[0] - x;
    var h = faces[i].bottomRight[1] - y;
    rect(x,y,w,h);
    
    var faceLandmarks = faces[i].landmarks;
    for(var j = 0; j < faceLandmarks.length; j++){
      point(faceLandmarks[j][0], faceLandmarks[j][1]);
    }
  }
}
