import { useState, useEffect } from "react";

const N = 10; // Define maximum counter value
const IMAGE_KEY = "rainbow_unicorn_image";

export default function RainbowUnicornReveal({ counter }) {
  const [image, setImage] = useState(null);

  useEffect(() => {
    async function fetchAndCropImage() {
    const storedImage = localStorage.getItem(IMAGE_KEY);
      if (storedImage) {
        setImage(storedImage);
        return;
      }

      try {       
        const response = await fetch("https://api.unsplash.com/photos/random?query=unicorn&client_id=H6ll9IQKkde6fQWZQFXzHAx3RSduEtqf8j0L6pkCUbM");
        const jsonData = await response.json();
        const photoUrl = jsonData.urls.regular; // Extracting the URL of the first photo
        const response2 = await fetch(photoUrl);
        const blob = await response2.blob();
        const img = await createImageBitmap(blob);

        const canvas = document.createElement("canvas");
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        const croppedImage = canvas.toDataURL("image/png");
        localStorage.setItem(IMAGE_KEY, croppedImage);
        setImage(croppedImage);
      } catch (error) {
        console.error("Error fetching image:", error);
      }
    }

    fetchAndCropImage();
  }, []);

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
