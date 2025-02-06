import { useState, useEffect } from "react";
import {fetchCropAndSaveImage, IMAGE_KEY} from "../service/photoFetcher";

export default function UnicornReveal({ counter, steps }) {
  console.log(`UnicornReveal: counter=${counter}, steps=${steps}`);

  useEffect(() => {
    if (counter === 0) {
      (async () => {
        try {
          await fetchCropAndSaveImage();
        } catch (error) {
          console.error("Error in UnicornReveal:", error);
        }
      })();
    }
  }, [counter]); 

  const revealPercentage = counter / steps;
  const image = localStorage.getItem(IMAGE_KEY);
  const maskStyle = {
    width: "100%",
    height: "100%",
    position: "fixed",
    top: 0,
    left: 0,
    zIndex: -1, // Ensures it stays in the background
    pointerEvents: "none", // Prevents blocking input elements above it
    backgroundImage: image ? `url(${image})` : "none",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    WebkitMaskImage: `linear-gradient(to bottom, black ${revealPercentage * 100}%, transparent ${revealPercentage * 100}%)`,
    maskImage: `linear-gradient(to bottom, black ${revealPercentage * 100}%, transparent ${revealPercentage * 100}%)`,
    transition: "mask-image 0.5s ease-out, -webkit-mask-image 0.5s ease-out"
  };
  
  return <div style={maskStyle}></div>;
}