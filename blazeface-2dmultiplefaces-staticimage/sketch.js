//Example using mediapipe's 3d facemesh detection (2020) with a static image (drag and drop into the canvas)
//Based on lingdong's mediapipe-hand-p5-tf174-handv1 + https://blog.tensorflow.org/2020/03/face-and-hand-tracking-in-browser-with-mediapipe-and-tensorflowjs.html
//-
//David Chatting - davidchatting.com -  29th December 2022

p5.disableFriendlyErrors = true;

var blazefaceModel = null;
var foundfaces = [];

var canvas;
var frame = null;

blazeface.load().then(function(_model){
  console.log("blazeface model loaded.")
  blazefaceModel = _model;
})

function setup() {
  canvas = createCanvas(800, 800, WEBGL);
  canvas.drop(onFileDropped);
}

function onFileDropped(file) {
  console.log("onFileDropped");
  frame = createImg(file.data, "alt", "", findFaces);
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
    drawFace(foundfaces);
    pop();
  }
}

async function findFaces() {  
  foundfaces = await blazefaceModel.estimateFaces(frame.elt, false);
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
