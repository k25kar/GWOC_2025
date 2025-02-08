'use client';

import { useState, useEffect } from 'react';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { motion } from 'framer-motion';

interface Service {
  id: number;
  title: string;
  image: string;
}

export default function ServicesPage() {
  const [fadeIn, setFadeIn] = useState(false);
  
  useEffect(() => {
    setTimeout(() => setFadeIn(true), 300);
  }, []);

  const newServices: Service[] = [
    { id: 1, title: 'New Service 1', image: '/service1.jpg' },
    { id: 2, title: 'New Service 2', image: '/service2.jpg' }
  ];

  const bestSellers: Service[] = [
    { id: 1, title: 'Best Seller 1', image: '/bestseller1.jpg' },
    { id: 2, title: 'Best Seller 2', image: '/bestseller2.jpg' }
  ];

  return (
    <div className="flex flex-col items-center text-center p-8 space-y-12">
      {/* Our Services Section */}
      <motion.div 
        initial={{ opacity: 0, filter: 'blur(10px)' }}
        animate={{ opacity: fadeIn ? 1 : 0, filter: fadeIn ? 'blur(0px)' : 'blur(10px)' }}
        transition={{ duration: 1 }}
        className="text-3xl font-bold"
      >
        Our Services
      </motion.div>
      
      {/* Service Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
        <ServiceCarousel title="New and Trustworthy" services={newServices} />
        <ServiceCarousel title="Best Sellers" services={bestSellers} />
      </div>
      
      {/* Fading Text Section */}
      <motion.p 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="text-lg max-w-3xl"
      >
        Discover services tailored for you. Our offerings constantly evolve to bring you the latest and most trusted solutions.
      </motion.p>
    </div>
  );
}

function ServiceCarousel({ title, services }) {
  return (
    <div className="bg-gray-100 p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold mb-4">{title}</h2>
      <Carousel showThumbs={false} infiniteLoop autoPlay>
        {services.map(service => (
          <div key={service.id} className="relative">
            <img src={service.image} alt={service.title} className="rounded-lg" />
            <p className="absolute bottom-4 left-4 bg-white p-2 rounded text-sm font-medium">{service.title}</p>
          </div>
        ))}
      </Carousel>
    </div>
  );
}
