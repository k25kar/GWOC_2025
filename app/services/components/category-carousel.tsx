import { motion, useAnimation, useInView } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRef, useState, useEffect } from "react";
import axios from "axios";
import Booking from "@/components/Booking";


interface FeaturesCarouselProps {
  onCategorySelect: (category: string) => void;
}

const FeaturesCarousel: React.FC<FeaturesCarouselProps> = ({ onCategorySelect }) => {
  const [categories, setCategories] = useState<string[]>([]);
  const [services, setServices] = useState<{ name: string; description: string; price: number }[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const controls = useAnimation();
  const ref = useRef(null);
  const inView = useInView(ref);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("/api/services/categories");
        setCategories(response.data.categories || []);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    if (!carouselRef.current) return;
    const containerWidth = carouselRef.current.offsetWidth;
    const itemWidth = 144;
    const itemsPerView = Math.floor(containerWidth / itemWidth);
    setCurrentIndex(0);
  }, [categories]);

  const fetchServices = async (category: string) => {
    try {
      const response = await axios.get(`/api/services?category=${category}`);
      setServices(response.data.services || []);
    } catch (error) {
      console.error("Error fetching services:", error);
    }
  };

  const scrollToIndex = (index: number) => {
    if (!carouselRef.current) return;
    const newIndex = Math.max(0, Math.min(index, categories.length - 1));
    setCurrentIndex(newIndex);
    const itemWidth = 144;
    const scrollPosition = -newIndex * itemWidth;
    controls.start({ x: scrollPosition, transition: { duration: 0.5, ease: "easeInOut" } });
  };

  const next = () => scrollToIndex(currentIndex + 1);
  const prev = () => scrollToIndex(currentIndex - 1);

  const handleCategoryClick = (category: string) => {
    onCategorySelect(category);
    setSelectedCategory(category);
    fetchServices(category);
  };

  return (
    <div className="relative w-full py-12" ref={ref}>
      <div className="overflow-x-auto scrollbar-hide" ref={carouselRef}>
        <motion.div className="flex gap-6 px-4 md:px-8" animate={controls} initial={{ x: 0 }}>
          {categories.length > 0 ? (
            categories.map((category, index) => (
              <motion.div
                key={category}
                className="flex-none"
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ delay: index * 0.1 }}
              >
                <button
                  onClick={() => handleCategoryClick(category)}
                  className="w-auto min-w-[150px] min-h-[50px] px-4 py-2 bg-zinc-800 rounded-xl flex items-center justify-center group-hover:bg-gray-600 transition-colors"
                >
                  <span className="text-white text-sm font-medium whitespace-nowrap">{category}</span>
                </button>
              </motion.div>
            ))
          ) : (
            <div>Loading categories...</div>
          )}
        </motion.div>
      </div>

      <div className="flex justify-center mt-8 gap-4">
        <Button variant="outline" className="rounded-full" onClick={prev} disabled={currentIndex === 0}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button variant="outline" className="rounded-full" onClick={next} disabled={currentIndex >= categories.length - 1}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {selectedCategory && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-white text-center mb-6">{selectedCategory} Services</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {services.length > 0 ? (
              services.map((service, index) => (
                <motion.div
                  key={index}
                  className="bg-zinc-900 rounded-xl p-4 shadow-lg text-white flex flex-col justify-between"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div>
                    <h3 className="text-lg font-semibold">{service.name}</h3>
                    <p className="text-sm text-gray-300 mt-2">{service.description}</p>
                    <p className="text-md font-bold text-green-400 mt-2">₹{service.price}</p>
                  </div>
                  <Booking>
                  <Button variant="primary" className="mt-4 w-full bg-zinc-800 hover:bg-gray-600 text-white rounded-lg py-2">
                    Book Now
                  </Button>
                  </Booking>
                </motion.div>
              ))
            ) : (
              <div className="text-center text-white">No services available.</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FeaturesCarousel;
