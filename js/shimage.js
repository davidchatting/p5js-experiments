//shimage - image shims
//David Chatting - davidchatting.com -  29th January 2023

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
  
  //copy and mirror pixels
  for (var y = 0; y < imageData.height; ++y) {
    for (var x = 0; x < imageData.width; ++x) {
      var a = getIndex(x,y,imageData.width,4);
      var b = getIndex(imageData.width - x,y,imageData.width,4);
      
      image.pixels[a+0] = imageData.data[b+0];  //Uint8ClampedArray
      image.pixels[a+1] = imageData.data[b+1];
      image.pixels[a+2] = imageData.data[b+2];
      image.pixels[a+3] = imageData.data[b+3];
    }
  }
  image.updatePixels();
  
  tempCanvas.remove();
}

function getIndex(x, y, width, channels) {
  return(((width * y) + x) * channels);
}