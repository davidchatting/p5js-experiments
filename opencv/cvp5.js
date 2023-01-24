//David Chatting - davidchatting.com -  24th January 2023

function cvMatToP5Image(mat, image) {
  //mat to canvas
  let tempCanvas = document.createElement('canvas');
  tempCanvas.id = 'tempCanvas';
  tempCanvas.classList.add('hide');
  document.body.appendChild(tempCanvas);
  
  let resultSize = mat.size();
  tempCanvas.width = resultSize.width;
  tempCanvas.height = resultSize.height
  
  cv.imshow('tempCanvas', mat);
  
  //canvas to image
  const tempCanvasCtx = tempCanvas.getContext('2d');
  const imageData = tempCanvasCtx.getImageData(0, 0, resultSize.width, resultSize.height);
  
  image.loadPixels();

  for (n = 0; n < image.pixels.length; n++) {
    image.pixels[n] = imageData.data[n];     //Uint8ClampedArray
  }
  image.updatePixels();
  
  tempCanvas.remove();
}