"use client"

import { useEffect, useRef } from "react"
import Image from "next/image"
import landingPhoto1 from "@/public/landing-photo1.jpg" // Import the local image

export default function InfiniteCarousel() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const scrollContainer = containerRef.current
    if (!scrollContainer) return

    let scrollInterval: NodeJS.Timeout

    const startScrolling = () => {
      scrollInterval = setInterval(() => {
        if (scrollContainer.scrollLeft + scrollContainer.clientWidth >= scrollContainer.scrollWidth) {
          scrollContainer.scrollLeft = 0
        } else {
          scrollContainer.scrollLeft += 1
        }
      }, 7)
    }

    startScrolling()

    scrollContainer.addEventListener("mouseenter", () => {
      clearInterval(scrollInterval)
    })

    scrollContainer.addEventListener("mouseleave", startScrolling)

    return () => {
      clearInterval(scrollInterval)
    }
  }, [])

  // Images including the local image
  const images = [
    landingPhoto1,
    "https://via.placeholder.com/600x800.png?text=Image+2",
    "https://via.placeholder.com/600x800.png?text=Image+3",
    "https://via.placeholder.com/600x800.png?text=Image+4",
  ]

  // Duplicate images to create infinite effect
  const duplicatedImages = [...images, ...images, ...images, ...images, ...images
    , ...images, ...images, ...images, ...images
  ]

  return (
    <div className="w-full bg-black min-h-screen flex items-center">
      <div ref={containerRef} className="flex overflow-x-hidden w-full gap-6 px-6">
        {duplicatedImages.map((image, index) => (
            <div
            key={index}
            className="relative flex-none w-[100px] sm:w-[150px] md:w-[200px] lg:w-[250px] xl:w-[300px] aspect-[3/4] rounded-2xl overflow-hidden" // Decreased sizes
            >
            <div className="absolute inset-0 rounded-2xl border-2 border-white z-10 transition-all duration-150 hover:border-4 hover:shadow-[0_0_15px_rgba(255,255,255,0.8)]" />
            <Image
              src={image}
              alt={`Carousel image ${index + 1}`}
              fill
              className="object-cover"
              sizes="(max-width: 400px) 100vw, 450px"
            />
            </div>
        ))}
      </div>
    </div>
  )
}

