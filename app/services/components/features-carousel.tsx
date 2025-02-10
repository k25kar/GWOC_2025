"use client"

import { motion, useAnimation } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRef, useState } from "react"

interface FeatureCard {
  title: string
  description: string
}

const features: FeatureCard[] = [
  {
    title: "Scaling Your Site",
    description: "Learn about hosting built for scale and reliability.",
  },
  {
    title: "Optimize for SEO",
    description: "Learn how Framer can optimize your site for search engines.",
  },
  {
    title: "CMS Examples",
    description: "Get inspired by blogs, job openings, events and more.",
  },
  {
    title: "Custom Solutions",
    description: "Discover tailored solutions for your specific needs.",
  },
  {
    title: "Analytics Integration",
    description: "Track and analyze your site's performance effectively.",
  },
]

export default function FeaturesCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const carouselRef = useRef<HTMLDivElement>(null)
  const controls = useAnimation()

  const scrollToIndex = (index: number) => {
    if (!carouselRef.current) return

    const newIndex = Math.max(0, Math.min(index, features.length - 3))
    setCurrentIndex(newIndex)

    controls.start({
      x: `${-newIndex * 33.33}%`,
      transition: { duration: 0.5, ease: "easeInOut" },
    })
  }

  const next = () => scrollToIndex(currentIndex + 1)
  const prev = () => scrollToIndex(currentIndex - 1)

  return (
    <div className="relative w-full py-12">
      <div className="overflow-hidden">
        <motion.div ref={carouselRef} className="flex gap-6 md:gap-8" animate={controls} initial={{ x: 0 }}>
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="w-full flex-none md:w-1/3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="bg-white bg-opacity-10 rounded-lg overflow-hidden h-full">
                <div className="h-48 bg-[url('https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-P9VksKdsWgYcxOzH4YeQ3R3LTrE2WY.png')] bg-cover bg-center opacity-10" />
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2" style={{ color: "#E8E4D3" }}>
                    {feature.title}
                  </h3>
                  <p className="text-zinc-400 mb-4">{feature.description}</p>
                  <Button variant="secondary" size="sm">
                    Read More
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <div className="flex justify-center mt-8 gap-4">
        <Button variant="outline" size="icon" className="rounded-full" onClick={prev} disabled={currentIndex === 0}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="rounded-full"
          onClick={next}
          disabled={currentIndex >= features.length - 3}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

