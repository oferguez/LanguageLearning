import { useState, useEffect } from "react";
import { apikey } from "../data/apikey.js";
const IMAGE_KEY = "unicorn_image";

async function fetchCropAndSaveImage() {
  let img = null;
  try {
    throw new Error("Test Error");
    const response = await fetch(`https://api.unsplash.com/photos/random?query=unicorn&client_id=${apikey}`);
    const jsonData = await response.json();
    const photoUrl = jsonData.urls.regular; 

    const response2 = await fetch(photoUrl);
    const blob = await response2.blob();
    img = await createImageBitmap(blob);
    console.log(`Downloaded Image: ${croppedImage} w=${canvas.width} h=${canvas.height}`);
  }
  catch (error) {
    console.warn("Error fetching image, falling back to backup image:", error);

    const backupImage = new Image();
    backupImage.src = '../data/photo.jpg';
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    backupImage.onload = () => {
      ctx.drawImage(backupImage, 0, 0, canvas.width, canvas.height);
      img = canvas.toDataURL("image/png");
    };

    const canvas = document.createElement("canvas");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    img = canvas.toDataURL("image/png");
    console.log(`Backup Image: ${croppedImage} w=${canvas.width} h=${canvas.height}`);
  }
  finally {
    if (!img) {
      console.error("Error fetching image AND using backup image");
      return;
    }
    localStorage.setItem(IMAGE_KEY, img);

  } 
}

export default function UnicornReveal({ counter, steps }) {
  console.log(`UnicornReveal: counter=${counter}, steps=${steps}`);
  if (counter === 0) {
    fetchCropAndSaveImage();
  }
  const revealPercentage = counter / steps;
  const image = localStorage.getItem(IMAGE_KEY);
  const maskStyle = {
    width: "100%",
    height: "100%",
    position: "fixed",
    top: 0,
    left: 0,
    backgroundImage: image ? `url(${image})` : "none",
    backgroundSize: "cover",
    WebkitMaskImage: `linear-gradient(to bottom, black ${revealPercentage * 100}%, transparent ${revealPercentage * 100}%)`,
    maskImage: `linear-gradient(to bottom, black ${revealPercentage * 100}%, transparent ${revealPercentage * 100}%)`,
    transition: "mask-image 0.5s ease-out, -webkit-mask-image 0.5s ease-out"
  };

  return <div style={maskStyle}></div>;


  return <div className="stats-container" >UnicornReveal: counter={counter}, steps={steps}</div>;
}

export function UnicornReveal1({ counter, steps }) {

  console.log(`UnicornReveal: counter=${counter}, steps=${steps}`);

  const [image, setImage] = useState(localStorage.getItem(IMAGE_KEY));

  useEffect(() => {
    async function fetchAndCropImage() {
      try {
        const response = await fetch("https://api.unsplash.com/photos/random?query=unicorn&client_id=H6ll9IQKkde6fQWZQFXzHAx3RSduEtqf8j0L6pkCUbM");
        const jsonData = await response.json();
        const photoUrl = jsonData.urls.regular; 

        const response2 = await fetch(photoUrl);
        const blob = await response2.blob();
        const img = await createImageBitmap(blob);

        const canvas = document.createElement("canvas");
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        const croppedImage = canvas.toDataURL("image/png");
        localStorage.setItem(IMAGE_KEY, croppedImage); // Cache the new image
        setImage(croppedImage); // Update state
      } catch (error) {
        console.error("Error fetching image:", error);
      }
    }

    if (counter === 0) {
      fetchAndCropImage();
    } else {
      // Load cached image when counter > 0
      const storedImage = localStorage.getItem(IMAGE_KEY);
      if (storedImage) {
        setImage(storedImage);
      }
    }
  }, [counter]); // Re-run effect when counter changes

  const revealPercentage = counter / steps;
  const maskStyle = {
    width: "100%",
    height: "100%",
    position: "fixed",
    top: 0,
    left: 0,
    backgroundImage: image ? `url(${image})` : "none",
    backgroundSize: "cover",
    backgroundPosition: `center ${(1 - revealPercentage) * 100}%`,
    transition: "background-position 0.5s ease-out"
  };

  return <div style={maskStyle}></div>;
}
