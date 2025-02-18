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
  createdAt: string; // createdAt timestamp from schema
}

const BookingsPage: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const { data: session } = useSession();
  const router = useRouter();

  // For wallet integration, read wallet balance from session user (if available)
  const walletBalance: number = (session?.user as any)?.wallet || 0;

  useEffect(() => {
    if (session?.user?._id) {
      fetch(`/api/bookings/active?userId=${session.user._id}`)
        .then((res) => res.json())
        .then((data) => setBookings(data))
        .catch((err) => console.error("Error fetching active bookings", err));
    }
  }, [session?.user?._id]);

  // Payment Handlers
  const handlePayNow = (bookingId: string) => {
    router.push(`/pay-now?bookingId=${bookingId}`);
  };

  const handlePayLater = (bookingId: string) => {
    router.push(`/pay-later?bookingId=${bookingId}`);
  };

  const handlePayWithWallet = (bookingId: string) => {
    router.push(`/pay-with-wallet?bookingId=${bookingId}`);
  };

  // Cancellation Handler: Calls DELETE on /api/bookings/cancel?bookingId=...
  const handleCancel = async (bookingId: string) => {
    try {
      const res = await fetch(`/api/bookings/cancel?bookingId=${bookingId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setBookings((prev) => prev.filter((b) => b._id !== bookingId));
      } else {
        console.error("Failed to cancel booking");
      }
    } catch (error) {
      console.error("Error cancelling booking:", error);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white">
      <Navbar />
      <div className="max-w-5xl mx-auto p-6 mt-12">
        <h1 className="text-3xl font-bold mb-6">Your Bookings</h1>
        <p className="mb-4 text-gray-400">
          Note: You can cancel a booking only within 2 hours of placing it and only
          if a service provider has not yet been assigned.
        </p>
        {bookings.length === 0 ? (
          <p className="text-gray-400">No active bookings found.</p>
        ) : (
          bookings.map((booking) => {
            const bookingCreatedAt = new Date(booking.createdAt);
            const now = new Date();
            // Allow cancellation only if no service provider is assigned and within 2 hours
            const canCancel =
              !booking.serviceProviderName &&
              now.getTime() - bookingCreatedAt.getTime() < 2 * 60 * 60 * 1000;

            return (
              <div
                key={booking._id}
                className="border border-gray-700 p-4 rounded mb-6 flex flex-col md:flex-row justify-between items-start md:items-center"
              >
                {/* Left Section: Booking Info */}
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
                        No service provider assigned yet.
                      </p>
                    )}
                  </div>
                </div>
                {/* Right Section: Actions */}
                <div className="mt-4 md:mt-0 md:ml-4 flex flex-col items-end">
                  {booking.serviceProviderName ? (
                    // When a service provider is assigned, display payment options
                    <>
                      {booking.paymentStatus === "paid" ? (
                        <p className="text-lg font-bold mb-2 text-green-500">
                          Payment Done
                        </p>
                      ) : (
                        <>
                          <p className="text-lg font-bold mb-2 text-yellow-500">
                            Payment Pending
                          </p>
                          <div className="flex gap-2 flex-wrap">
                            <Button
                              onClick={() => handlePayNow(booking._id)}
                              className="bg-[#800000] text-white hover:bg-[#8B0000] px-4 py-2 rounded"
                            >
                              Pay Now
                            </Button>
                            <Button
                              onClick={() => handlePayLater(booking._id)}
                              className="bg-[#800000] text-white hover:bg-[#8B0000] px-4 py-2 rounded"
                            >
                              Pay Later
                            </Button>
                            {walletBalance > 0 && (
                              <Button
                                onClick={() => handlePayWithWallet(booking._id)}
                                className="bg-[#800000] text-white hover:bg-[#8B0000] px-4 py-2 rounded"
                              >
                                Pay with Wallet
                              </Button>
                            )}
                          </div>
                        </>
                      )}
                    </>
                  ) : (
                    // If no service provider is assigned, display cancellation option if within allowed time.
                    <>
                      {canCancel ? (
                        <Button
                          onClick={() => handleCancel(booking._id)}
                          className="bg-red-600 text-white hover:bg-red-700 px-4 py-2 rounded"
                        >
                          Cancel Booking
                        </Button>
                      ) : (
                        <p className="text-sm text-gray-400">
                          Cancellation period expired.
                        </p>
                      )}
                    </>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
      <Footer />
    </div>
  );
};

export default BookingsPage;
