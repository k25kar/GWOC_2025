/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { Navbar } from "@/components/Navbar";
import Footer from "@/components/Footer";
import jsPDF from "jspdf";

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

interface UserDetails {
  name: string;
  email: string;
  phone: string;
  address: string;
  pincode: string;
  wallet: number;
}

// Interface for the request body of /api/payment/verifyPayment
interface VerifyPaymentRequest {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

// Interface for the response from /api/payment/verifyPayment
interface VerifyPaymentResponse {
  success: boolean;
  message: string; // "Payment verified" or "Payment verification failed"
}

const BookingsPage: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const { data: session } = useSession();
  const router = useRouter();

  const [userWalletBalance, setUserWalletBalance] = useState<number>(0);
  const [walletUsageState, setWalletUsageState] = useState<{
    [key: string]: boolean;
  }>({});

  useEffect(() => {
    if (session?.user?._id) {
      fetch(`/api/bookings/active?userId=${session.user._id}`)
        .then((res) => res.json())
        .then((data) => setBookings(data))
        .catch((err) => console.error("Error fetching active bookings", err));
    }
  }, [session?.user?._id]);

  useEffect(() => {
    if (session?.user?._id) {
      fetch(`/api/users/${session.user._id}`)
        .then((res) => res.json())
        .then((data) => {
          setUserWalletBalance(data.wallet); // Set wallet balance from user data
        })
        .catch((error) => console.error("Error fetching user details:", error));
    }
  }, [session?.user?._id]);

  // Track wallet checkbox change per booking
  const handleWalletCheckboxChange = (
    bookingId: string,
    bookingPrice: number
  ) => {
    if (userWalletBalance === 0) {
      alert("Your wallet balance is zero.");
      return;
    }
    if (bookingPrice <= userWalletBalance) {
      // If the wallet balance is sufficient, do not allow the user to check the box
      alert(
        "Your wallet balance is sufficient. You cannot use it for this booking."
      );
      return;
    }

    // Toggle wallet usage state for the clicked booking only
    setWalletUsageState((prevState) => ({
      ...prevState,
      [bookingId]: !prevState[bookingId],
    }));
  };

  const generateInvoice = (
    bookingsArray: Booking[],
    totalAmount: number,
    paymentStatus: "pending" | "paid",
    userDetails: UserDetails // Added userDetails to the function parameters
  ) => {
    const doc = new jsPDF();

    // Get current date
    const currentDate = new Date().toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

    // Title
    doc.setFontSize(18);
    doc.text("Service Payment Receipt", 20, 20);

    // Order Date
    doc.setFontSize(12);
    doc.text(`Date of Payment: ${currentDate}`, 20, 30);

    // User Information from UserDetails
    doc.text(`Name: ${userDetails.name}`, 20, 40);
    doc.text(`Email: ${userDetails.email}`, 20, 50);
    doc.text(`Phone: ${userDetails.phone}`, 20, 60);
    doc.text(`Address: ${userDetails.address}`, 20, 70);
    doc.text(`Pincode: ${userDetails.pincode}`, 20, 80);

    // Service Details - Only the service for which payment is done
    let yPosition = 90;
    const service = bookingsArray[0]; // Assuming we're taking the first booking (for simplicity)
    doc.text("Service Purchased:", 20, yPosition);
    yPosition += 10;

    doc.text(`${service.serviceName} - ₹${service.price}`, 20, yPosition);
    yPosition += 10;

    // Total Amount
    yPosition += 10;
    doc.text(`Total Amount: ₹${totalAmount}`, 20, yPosition);

    // Payment Status
    yPosition += 10;
    doc.text(`Payment Status: ${paymentStatus}`, 20, yPosition);

    // Generate filename (using user name and service name for uniqueness)
    const filename = `${userDetails.name}_${
      service.serviceName
    }_${currentDate.replace(/\//g, "-")}.pdf`;

    // Save the PDF file
    doc.save(filename);
  };

  // Payment Handlers
  const handlePayNow = async (bookingId: string) => {
    if (!session?.user) {
      alert("Please log in to complete your booking.");
      return;
    }
  
    const booking = bookings.find((b) => b._id === bookingId);
    if (!booking) {
      alert("Booking not found.");
      return;
    }
  
    try {
      // Step 1: Initiate Razorpay Payment
      const options = {
        key: process.env.RAZORPAY_KEY, // Use environment variable for Razorpay key
        amount: booking.price * 100, // Amount in paise
        currency: "INR",
        name: "Your Company Name",
        description: `Payment for ${booking.serviceName}`,
        handler: async function (response: any) {
          // Step 2: Verify Payment
          const paymentDetails: VerifyPaymentRequest = {
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_signature: response.razorpay_signature,
          };
  
          const verifyRes = await fetch("/api/payment/verifyPayment", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(paymentDetails),
          });
  
          const verifyResponse: VerifyPaymentResponse = await verifyRes.json();
  
          if (verifyResponse.success) {
            // Step 3: Update booking status to 'paid'
            const updateBookingRes = await fetch(`/api/bookings/updatePaymentStatus`, {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                bookingId: booking._id,  // Use booking._id for the specific booking
                paymentStatus: "paid",
              }),
            });
  
            const updateBookingData = await updateBookingRes.json();
  
            if (updateBookingData.success) {
              // Payment was successful, update booking status and redirect to success page
              alert("Payment successful!");
              router.push("/payment-success"); // Redirect to success page
            } else {
              alert("Error updating booking status. Please try again.");
            }
          } else {
            alert("Payment verification failed. Please try again.");
          }
        },
        prefill: {
          name: session.user.name,
          email: session.user.email,
          contact: session.user.phone,
        },
        theme: {
          color: "#800000", // Customize Razorpay payment popup color
        },
      };
  
      const rzp1 = new (window as any).Razorpay(options);
      rzp1.open();
    } catch (error) {
      console.error("Error during payment process", error);
      alert("Error processing payment. Please try again.");
    }
  };

  const handlePayLater = async (bookingId: string) => {
    const booking = bookings.find((booking) => booking._id === bookingId);

    if (!session?.user || !booking) {
      alert("Please log in to complete your booking.");
      return;
    }

    try {
      // 1. Show pop-up/modal with the "Thank You" message
      alert("Thank you for booking our services.");

      // 2. Generate the payment receipt with payment status as "pending"
      const userDetails: UserDetails = {
        name: session.user.name || "", // Assuming user name is stored in session
        email: session.user.email || "",
        phone: session.user.phone || "",
        address: session.user.address || "",
        pincode: session.user.pincode || "",
        wallet: userWalletBalance, // Assuming the wallet balance is stored in state
      };

      generateInvoice([booking], booking.price, "pending", userDetails);
    } catch (error) {
      console.error("Error processing booking", error);
      alert("Error processing booking. Please try again later.");
    }
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
          Note: You can cancel a booking only within 2 hours of placing it and
          only if a service provider has not yet been assigned.
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

            const isUseWallet = walletUsageState[booking._id] || false;

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
                  <p className="text-sm text-gray-300">
                    Price: ₹
                    {isUseWallet && booking.price <= userWalletBalance
                      ? 0 // If wallet balance is enough, show ₹0
                      : booking.price -
                        (isUseWallet
                          ? Math.min(booking.price, userWalletBalance)
                          : 0)}{" "}
                    {/* Adjusted price */}
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
                          </div>
                          <div className="mt-4 flex items-center">
                            <input
                              type="checkbox"
                              checked={isUseWallet}
                              onChange={() =>
                                handleWalletCheckboxChange(
                                  booking._id,
                                  booking.price
                                )
                              }
                              id="use-wallet"
                              className="mr-2"
                              disabled={booking.price <= userWalletBalance} // Disable if wallet balance is enough
                            />
                            <label
                              htmlFor="use-wallet"
                              className="text-sm text-gray-300"
                            >
                              Use wallet balance (₹{userWalletBalance})
                            </label>
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
