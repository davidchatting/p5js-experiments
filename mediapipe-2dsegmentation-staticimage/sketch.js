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
    inputImage.remove();
  });
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
      if(outputImage) image(outputImage, 0, 0);
    pop();
  }
}

async function findForeground(image) {
  console.log("findForeground");
  if (!selfieSegmentation) {
    console.warn("selfieSegmentation not ready");
    return;
  }

  const imgEl = image.elt;
  const w = imgEl.naturalWidth || imgEl.width;
  const h = imgEl.naturalHeight || imgEl.height;

  // create an offscreen canvas and draw a flipped copy (horizontal)
  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = w;
  tempCanvas.height = h;
  const ctx = tempCanvas.getContext('2d');

  // flip horizontally
  ctx.save();
  ctx.translate(w, 0);
  ctx.scale(-1, 1);
  ctx.drawImage(imgEl, 0, 0, w, h);
  ctx.restore();

  try {
    await selfieSegmentation.send({ image: tempCanvas });
  } catch (err) {
    console.error("selfieSegmentation.send error:", err);
  } finally {
    tempCanvas.remove();
  }
}

function onFindForegroundResults(results) {
  console.log("* onFindForegroundResults", results);

  // create an <img> showing the segmentationMask (ImageBitmap)
  if (results && results.segmentationMask) {
    const maskBitmap = results.segmentationMask;
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = maskBitmap.width;
    tempCanvas.height = maskBitmap.height;
    const ctx = tempCanvas.getContext('2d');
    ctx.drawImage(maskBitmap, 0, 0);

    const dataUrl = tempCanvas.toDataURL(); // PNG data URL

    let maskImg = document.getElementById('segmentationMaskImg');
    if (!maskImg) {
      maskImg = document.createElement('img');
      maskImg.id = 'segmentationMaskImg';
      // append next to p5 canvas container
      const container = document.getElementById('p5jsCanvas') || document.body;
      container.appendChild(maskImg);
    }
    maskImg.src = dataUrl;

    tempCanvas.remove();
  }

  outputImage = createImage(results.segmentationMask.width, results.segmentationMask.height);
  imageBitmapToP5Image(results.segmentationMask, outputImage, {flipX: true, flipY: false});
  outputImage.filter(GRAY);
}