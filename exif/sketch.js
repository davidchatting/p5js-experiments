//David Chatting - davidchatting.com -  30th December 2022

var canvas;
var frame = null;

function setup() {
  p5.disableFriendlyErrors = true;

  canvas = createCanvas(800, 800, WEBGL);
  canvas.drop(onFileDropped);
  
  nlp.plugin(compromiseDates); // load the plugin
}

function onFileDropped(file) {
  console.log("onFileDropped  " + file.name);
  //console.log(extractNames(file.name));
  frame = createImg(file.data, "alt", "", parseMetadata);
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
    pop();
  }
}

function parseMetadata() {
  exifr.parse(frame.elt, true).then(
    exif => {
      console.log(exif);
      console.log(extractNames(exif.Caption));
    }
  );
}

function extractNames(text) {
  console.log(Date.parse(nlp(text).dates().json()[0].dates.start));
  
  return(nlp(text).people().json());
}