import { useState, useEffect } from "react";

const N = 10; // Define maximum counter value
const IMAGE_KEY = "rainbow_unicorn_image";

export default function RainbowUnicornReveal({ counter }) {
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

  const revealPercentage = counter / N;
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
