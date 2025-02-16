"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import {Navbar} from "@/components/Navbar";
import Footer from "@/components/Footer";

interface Booking {
  _id: string;
  serviceName: string;
  date: string;
  time: string;
  price: number;
  paymentStatus?: string; // "pending" or "paid"
  serviceProvider?: string;
}

const BookingsPage: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    // Optionally, you might filter by the current user on the server.
    fetch("/api/bookings/active")
      .then((res) => res.json())
      .then((data) => setBookings(data))
      .catch((err) => console.error("Error fetching active bookings", err));
  }, []);


  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white">
      <Navbar />
      <div className="max-w-5xl mx-auto p-6 mt-12">
        
        <h1 className="text-3xl font-bold mb-6">Your Bookings</h1>
        {bookings.length === 0 ? (
          <p className="text-gray-400">No active bookings found.</p>
        ) : (
          bookings.map((booking) => (
            <div key={booking._id} className="border border-gray-700 p-4 rounded mb-4">
              <h2 className="text-2xl font-semibold">{booking.serviceName}</h2>
              <p className="text-sm text-gray-300">
                Date: {new Date(booking.date).toLocaleDateString()} | Time: {booking.time}
              </p>
              <p className="text-sm text-gray-300">Price: ₹{booking.price}</p>
              <p className="text-sm">
                Payment Status:{" "}
                <span
                  className={`font-semibold ${
                    booking.paymentStatus === "paid" ? "text-green-500" : "text-yellow-500"
                  }`}
                >
                  {booking.paymentStatus || "pending"}
                </span>
              </p>
              <p className="text-sm text-gray-300">
                Service Provider:{" "}
                {booking.serviceProvider || "assigning service provider shortly!"}
              </p>
            </div>
          ))
        )}
      </div>
      <Footer />
    </div>
  );
};

export default BookingsPage;
