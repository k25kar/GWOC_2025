import { motion, useAnimation, useInView } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRef, useState, useEffect } from "react";
import Link from "next/link";

interface FeatureItem {
  title: string;
  description: string;
  link: string;
}

const features: FeatureItem[] = [
  {
    title: "AC Service",
    description: "Professional AC servicing and maintenance.",
    link: "/services/ac-service",
  },
  {
    title: "Bathroom & Kitchen",
    description: "Expert cleaning services for your bathroom and kitchen.",
    link: "/services/bathroom-kitchen-cleaning",
  },
  {
    title: "Carpenter",
    description: "Skilled carpentry services for all your needs.",
    link: "/services/carpenter",
  },
  {
    title: "Chimney",
    description: "Reliable chimney repair and maintenance services.",
    link: "/services/chimney-repair",
  },
  {
    title: "Electrician",
    description: "Certified electricians for all electrical work.",
    link: "/services/electrician",
  },
  {
    title: "Microwave",
    description: "Quick and efficient microwave repair services.",
    link: "/services/microwave-repair",
  },
  {
    title: "Plumbers",
    description: "Experienced plumbers for all plumbing issues.",
    link: "/services/plumbers",
  },
  {
    title: "Refrigerator",
    description: "Expert refrigerator repair and maintenance.",
    link: "/services/refrigerator-repair",
  },
  {
    title: "Sofa & Carpet",
    description: "Professional sofa and carpet cleaning services.",
    link: "/services/sofa-carpet-cleaning",
  },
  {
    title: "Washing Machine",
    description: "Reliable washing machine repair services.",
    link: "/services/washing-machine-repair",
  },
  {
    title: "Water Purifier",
    description: "Expert water purifier repair and maintenance.",
    link: "/services/water-purifier-repair",
  },
];

export default function FeaturesCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [maxIndex, setMaxIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const controls = useAnimation();
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);
  const ref = useRef(null);
  const inView = useInView(ref);

  useEffect(() => {
    const updateMaxIndex = () => {
      if (!carouselRef.current) return;
      
      const containerWidth = carouselRef.current.offsetWidth;
      const itemWidth = 144; // width of each item (24px * 6) including gap
      const itemsPerView = Math.floor(containerWidth / itemWidth);
      const newMaxIndex = Math.max(0, features.length - itemsPerView);
      setMaxIndex(newMaxIndex);
    };

    updateMaxIndex();
    window.addEventListener('resize', updateMaxIndex);
    return () => window.removeEventListener('resize', updateMaxIndex);
  }, []);

  const scrollToIndex = (index: number) => {
    if (!carouselRef.current) return;

    const newIndex = Math.max(0, Math.min(index, maxIndex));
    setCurrentIndex(newIndex);

    const itemWidth = 144; // Same as above
    const scrollPosition = -newIndex * itemWidth;
    
    controls.start({
      x: scrollPosition,
      transition: { duration: 0.5, ease: "easeInOut" },
    });
  };

  const next = () => scrollToIndex(currentIndex + 1);
  const prev = () => scrollToIndex(currentIndex - 1);

  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    startX.current = e.pageX - carouselRef.current!.offsetLeft;
    scrollLeft.current = carouselRef.current!.scrollLeft;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return;
    e.preventDefault();
    const x = e.pageX - carouselRef.current!.offsetLeft;
    const walk = (x - startX.current) * 2;
    carouselRef.current!.scrollLeft = scrollLeft.current - walk;
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    isDragging.current = true;
    startX.current = e.touches[0].pageX - carouselRef.current!.offsetLeft;
    scrollLeft.current = carouselRef.current!.scrollLeft;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging.current) return;
    const x = e.touches[0].pageX - carouselRef.current!.offsetLeft;
    const walk = (x - startX.current) * 2;
    carouselRef.current!.scrollLeft = scrollLeft.current - walk;
  };

  const handleTouchEnd = () => {
    isDragging.current = false;
  };

  return (
    <div className="relative w-full py-12" ref={ref}>
      <div
        className="overflow-x-auto scrollbar-hide"
        ref={carouselRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <motion.div
          className="flex gap-6 px-4 md:px-8"
          animate={controls}
          initial={{ x: 0 }}
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="flex-none"
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link href={feature.link}>
                <div className="group flex flex-col items-center gap-4 cursor-pointer transition-all duration-300">
                  <div className="w-24 h-24 bg-zinc-800 rounded-xl flex items-center justify-center group-hover:bg-zinc-700 transition-colors">
                    <div className="w-12 h-12 bg-zinc-700 group-hover:bg-zinc-600 rounded-lg" />
                  </div>
                  <span className="text-sm font-medium text-zinc-400 group-hover:text-zinc-300 text-center whitespace-nowrap">
                    {feature.title}
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <div className="flex justify-center mt-8 gap-4">
        <Button
          variant="outline"
          className="rounded-full"
          onClick={prev}
          disabled={currentIndex === 0}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          className="rounded-full"
          onClick={next}
          disabled={currentIndex >= maxIndex}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}