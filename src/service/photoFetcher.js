import { apikey } from "../data/apikey.js";
import backupPhoto from '../data/photo.jpg';
export const IMAGE_KEY = "unicorn_image";

export async function fetchCropAndSaveImage(searchWords) {
  let img = null;
  try {
    img = await downloadRandomImage(searchWords);
  }
  catch (error) {
    try {     
      console.warn("Error fetching image, falling back to backup image:", error);
      img = await getBackupImage();
    }
    catch (innerError) {
      console.error("Error fetching backup image:", innerError);
      return
    }
  }
  finally {
    if (!img) {
      console.error("Error fetching image AND using backup image");
      return; 
    }
    img = resizeImage(img); 
    localStorage.setItem(IMAGE_KEY, img);
  } 
}

async function downloadRandomImage(searchWords) {
  const queryString = searchWords.join(",");
  const response1 = await fetch(`https://api.unsplash.com/photos/random?query=${queryString}&client_id=${apikey}`);
  const jsonData = await response1.json();
  const photoUrl = jsonData.urls.regular; 
  const response2 = await fetch(photoUrl);
  const blob = await response2.blob();
  const img = await createImageBitmap(blob);
  console.log(`Downloaded Image: query=${queryString} ${img} w=${img.width} h=${img.height}`);
  return img;
}

async function getBackupImage() {
  const canvas = document.createElement("canvas");
  
  const backupImage = new Image();
  backupImage.src = backupPhoto;
  
  await new Promise((resolve, reject) => {
      backupImage.onload = resolve;
      backupImage.onerror = reject;
  });
 
  console.log(`Loaded Backup Image: ${backupImage} w=${backupImage.width} h=${backupImage.height}`);
  return backupImage;
}

function resizeImage(img) {
  const canvas = document.createElement("canvas");
  // Define 80% of screen dimensions
  const maxCanvasWidth = window.innerWidth * 0.8;
  const maxCanvasHeight = window.innerHeight * 0.8;
  
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  // Get the aspect ratios
  const imgAspect = img.width / img.height;
  const canvasAspect = maxCanvasWidth / maxCanvasHeight;
  
  let drawWidth, drawHeight, offsetX, offsetY;
  
  if (imgAspect > canvasAspect) {
      // Image is wider: Fit to max width
      drawWidth = maxCanvasWidth;
      drawHeight = img.height * (maxCanvasWidth / img.width);
  } else {
      // Image is taller: Fit to max height
      drawHeight = maxCanvasHeight;
      drawWidth = img.width * (maxCanvasHeight / img.height);
  }
  
  // Center the image in the canvas
  offsetX = (canvas.width - drawWidth) / 2;
  offsetY = (canvas.height - drawHeight) / 2;

  const ctx = canvas.getContext("2d");
  ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
  img = canvas.toDataURL("image/png"); // Now `img` is correctly assigned
  return img;
}
