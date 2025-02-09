"use client"

import { motion } from "framer-motion"
import { ChevronDown } from "lucide-react"
import ImageCarousel from "./image-carousel/image-carousel"
import { Button } from "@/components/ui/button"

export default function ServicesPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="h-screen flex flex-col items-center justify-center px-4 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-6xl md:text-7xl lg:text-8xl font-bold text-zinc-100 mb-6"
        >
          Our Services
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-xl md:text-2xl text-zinc-400 max-w-2xl mb-12"
        >
          Go from design to site with Framer, the web builder for creative pros.
        </motion.p>
        <motion.div initial={{ opacity: 0.6 }} whileHover={{ opacity: 1, scale: 1.1 }} transition={{ duration: 0.2 }}>
          <Button
            variant="outline"
            size="icon"
            className="rounded-full w-12 h-12"
            onClick={() => window.scrollTo({ top: window.innerHeight, behavior: "smooth" })}
          >
            <ChevronDown className="h-6 w-6" />
          </Button>
        </motion.div>
      </section>

      {/* Services Section */}
      <section className="min-h-screen py-24 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 mb-24">
            <div className="order-2 md:order-1">
              <ImageCarousel />
            </div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="order-1 md:order-2 flex flex-col justify-center"
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-4">New and Trustworthy</h2>
              <p className="text-zinc-400 mb-8">Install the plugin and convert your designs to a responsive site.</p>
              <Button className="w-fit">Book Now</Button>
            </motion.div>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex flex-col justify-center"
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-4">Best Sellers</h2>
              <p className="text-zinc-400 mb-8">Browse dozens of templates. Click, duplicate, customize.</p>
              <Button className="w-fit">Book Now</Button>
            </motion.div>
            <div>
              <ImageCarousel />
            </div>
          </div>
        </div>
      </section>

      {/* Text Section */}
      <section className="py-24 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto text-center space-y-4 text-xl md:text-2xl text-zinc-300"
        >
          <p>Lorem ipsum dolor sit amet, consectetur.</p>
          <p>Ut enim ad minim veniam, quis nostrud laboris.</p>
          <p>Duis aute irure dolor in reprehenderit in voluptate.</p>
        </motion.div>
      </section>
    </main>
  )
}

