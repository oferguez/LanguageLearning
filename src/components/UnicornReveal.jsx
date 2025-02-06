import { useState, useEffect } from "react";
import {fetchCropAndSaveImage, IMAGE_KEY} from "../service/photoFetcher";

export default function UnicornReveal({ counter, steps }) {

  if (steps==undefined) {
    console.log('steps is undefined, counter is', counter);
    return;
  }
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
  }, [counter, steps]); 

  const revealPercentage = counter / steps;
  const image = localStorage.getItem(IMAGE_KEY);
   
  const maskStyle = {
    width: "100vw",
    height: "100vh",
    top: 0,
    left: 0,
    position: 'fixed', 
    pointerEvents: "none", 
    backgroundImage: image ? `url(${image})` : "none",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    mixBlendMode: "overlay",
    WebkitMaskImage: `linear-gradient(to bottom, rgba(0, 0, 0, 1) ${revealPercentage * 100}%, rgba(0, 0, 0, 0) ${revealPercentage * 120}%)`,
    maskImage: `linear-gradient(to bottom, rgba(0, 0, 0, 1) ${revealPercentage * 100}%, rgba(0, 0, 0, 0) ${revealPercentage * 120}%)`,
    transition: "opacity 0.5s ease-out, filter 0.5s ease-out"
  };
     
  return <div style={maskStyle}></div>;
}