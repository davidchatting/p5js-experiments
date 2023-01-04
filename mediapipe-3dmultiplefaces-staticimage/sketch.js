//Example using mediapipe's 3d facemesh detection (2020) with a static image (drag and drop into the canvas)
//Based on lingdong's mediapipe-hand-p5-tf174-handv1 + https://blog.tensorflow.org/2020/03/face-and-hand-tracking-in-browser-with-mediapipe-and-tensorflowjs.html
//-
//David Chatting - davidchatting.com -  29th December 2022

p5.disableFriendlyErrors = true;

var facemeshModel = null;
var foundfaces = [];

var canvas;
var frame = null;

var facemeshConfig = {
                      maxContinuousChecks: Infinity,
                      detectionConfidence: 0.75,
                      maxFaces: 7,
                      iouThreshold: 0.05,
                      scoreThreshold: 0.5
                     };

facemesh.load(facemeshConfig).then(function(_model){
  console.log("facemesh model loaded.")
  facemeshModel = _model;
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

function findFaces() {
  console.log("estimateFaces");
  if (facemeshModel && frame){
    //Pass the HTML image element
    facemeshModel.estimateFaces(frame.elt).then(function(_faces){
      foundfaces = _faces;
    })
  }
}

function drawFace(faces){
  fill(255,255,255);
  stroke(255,255,255);
  
  for (var i = 0; i < faces.length; i++){
    var face = faces[i].scaledMesh;
    for(var j = 0; j < face.length; j++){
      point(face[j][0], face[j][1], -face[j][2]);  //correcting the orientation of the face in z
    }
  }
}
