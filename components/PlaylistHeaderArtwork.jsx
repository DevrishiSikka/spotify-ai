import { useEffect, useState } from "react";
import Image from "next/image";

export default function PlaylistHeaderArtwork() {
  const [selectedImage, setSelectedImage] = useState(null);
  
  useEffect(() => {
    // Array of available artwork images
    const artworkImages = [
      {
        src: "/images/1.webp",
        alt: "Artwork 1"
      },
      {
        src: "/images/2.webp",
        alt: "Artwork 2"
      },
      {
        src: "/images/3.webp",
        alt: "Artwork 3"
      },
      {
        src: "/images/4.webp",
        alt: "Artwork 4"
      }
    ];
    
    // Randomly select one of the images
    const randomIndex = Math.floor(Math.random() * artworkImages.length);
    setSelectedImage(artworkImages[randomIndex]);
  }, []);

  if (!selectedImage) {
    return (
      <div className="w-48 h-48 bg-gray-700 flex items-center justify-center rounded-md">
        <span className="text-white text-sm">Loading...</span>
      </div>
    );
  }

  return (
    <div className="w-48 h-48 rounded-md shadow-lg overflow-hidden">
      <Image
        src={selectedImage.src}
        alt={selectedImage.alt}
        width={192}
        height={192}
        className="w-full h-full object-cover"
        priority
      />
    </div>
  );
}