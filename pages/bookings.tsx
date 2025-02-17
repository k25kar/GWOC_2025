"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { Navbar } from "@/components/Navbar";
import Footer from "@/components/Footer";

interface Booking {
  _id: string;
  serviceName: string;
  date: string;
  time: string;
  address: string;
  pincode: string;
  price: number;
  paymentStatus: "pending" | "paid";
  serviceProviderName: string;
  serviceProviderContact: string;
}

const BookingsPage: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session?.user?._id) {
      fetch(`/api/bookings/active?userId=${session.user._id}`)
        .then((res) => res.json())
        .then((data) => setBookings(data))
        .catch((err) =>
          console.error("Error fetching active bookings", err)
        );
    }
  }, [session?.user?._id]);

  const handlePayNow = (bookingId: string) => {
    // Redirect to a pay-now page (implement payment logic as needed)
    router.push(`/pay-now?bookingId=${bookingId}`);
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white">
      <Navbar />
      <div className="max-w-5xl mx-auto p-6 mt-12">
        <h1 className="text-3xl font-bold mb-6">Your Bookings</h1>
        {bookings.length === 0 ? (
          <p className="text-gray-400">No active bookings found.</p>
        ) : (
          bookings.map((booking) => (
            <div
              key={booking._id}
              className="border border-gray-700 p-4 rounded mb-6 flex flex-col md:flex-row justify-between items-start md:items-center"
            >
              {/* Left Section: Service Info */}
              <div className="flex-1">
                <h2 className="text-2xl font-semibold mb-2">
                  {booking.serviceName}
                </h2>
                <p className="text-sm text-gray-300 mb-1">
                  Date: {new Date(booking.date).toLocaleDateString()} | Time:{" "}
                  {booking.time}
                </p>
                <p className="text-sm text-gray-300 mb-1">
                  Address: {booking.address}, {booking.pincode}
                </p>
                <div className="mt-2">
                  {booking.serviceProviderName ? (
                    <>
                      <p className="text-sm text-gray-300">
                        Service Provider: {booking.serviceProviderName}
                      </p>
                      <p className="text-sm text-gray-300">
                        Contact: {booking.serviceProviderContact}
                      </p>
                    </>
                  ) : (
                    <p className="text-sm text-gray-300">
                      We'll assign a service provider shortly.
                    </p>
                  )}
                </div>
              </div>
              {/* Right Section: Payment Info */}
              <div className="mt-4 md:mt-0 md:ml-4 flex flex-col items-end">
                <p
                  className={`text-lg font-bold mb-2 ${
                    booking.paymentStatus === "paid"
                      ? "text-green-500"
                      : "text-yellow-500"
                  }`}
                >
                  {booking.paymentStatus === "paid"
                    ? "Payment Done"
                    : "Payment Pending"}
                </p>
                {booking.paymentStatus === "pending" && (
                  <Button
                    onClick={() => handlePayNow(booking._id)}
                    className="bg-[#800000] text-white hover:bg-[#8B0000] px-4 py-2 rounded"
                  >
                    Pay Now
                  </Button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
      <Footer />
    </div>
  );
};

export default BookingsPage;
