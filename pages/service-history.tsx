"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useCart } from "@/src/context/CartContext";
import {Navbar} from "@/components/Navbar";
import Footer from "@/components/Footer";

interface Booking {
  _id: string;
  serviceName: string;
  date: string;
  time: string;
  price: number;
}

const ServiceHistoryPage: React.FC = () => {
  const [history, setHistory] = useState<Booking[]>([]);
  const router = useRouter();
  const { addToCart } = useCart();

  useEffect(() => {
    fetch("/api/bookings/history")
      .then((res) => res.json())
      .then((data) => setHistory(data))
      .catch((err) => console.error("Error fetching booking history:", err));
  }, []);

  // Group bookings by formatted date string.
  const groupedBookings = history.reduce((acc: Record<string, Booking[]>, booking) => {
    const dateObj = new Date(booking.date);
    const formatted = dateObj.toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    if (!acc[formatted]) {
      acc[formatted] = [];
    }
    acc[formatted].push(booking);
    return acc;
  }, {});

  const handleBookAgain = (booking: Booking) => {
    const service = {
      name: booking.serviceName,
      description: "", // If available, pass along a description.
      price: booking.price,
      imageUrl: "",
    };
    const now = new Date();
    const time = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    addToCart({ service, date: now, time });
    router.push("/cart"); // Or show a notification/toast.
  };


  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white">
      <Navbar />
      <div className="max-w-5xl mx-auto p-6 mt-12">
        
        <h1 className="text-3xl font-bold mb-6">Service History</h1>
        {Object.keys(groupedBookings).length === 0 ? (
          <p className="text-gray-400">No service history found.</p>
        ) : (
          Object.entries(groupedBookings).map(([date, bookings]) => (
            <div key={date} className="mb-8">
              <h2 className="text-2xl font-semibold mb-2">{date}</h2>
              <hr className="border-gray-600 mb-4" />
              {bookings.map((booking) => (
                <div
                  key={booking._id}
                  className="border border-gray-700 p-4 rounded mb-4 flex justify-between items-center"
                >
                  <div>
                    <h3 className="font-semibold text-lg">{booking.serviceName}</h3>
                    <p className="text-sm text-gray-300">Time: {booking.time}</p>
                    <p className="text-sm text-gray-300">Price: ₹{booking.price}</p>
                  </div>
                  <Button
                    onClick={() => handleBookAgain(booking)}
                    className="bg-[#800000] text-white hover:bg-[#8B0000] px-4 py-2"
                  >
                    Book Again
                  </Button>
                </div>
              ))}
            </div>
          ))
        )}
      </div>
      <Footer />
    </div>
  );
};

export default ServiceHistoryPage;
