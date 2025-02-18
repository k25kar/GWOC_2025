"use client";

import React, { useState, useEffect } from "react";
import { useCart } from "@/src/context/CartContext";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import axios from "axios";
import jsPDF from "jspdf";

interface UserDetails {
  name: string;
  email: string;
  phone: string;
  address: string;
  pincode: string;
  wallet: number;
}

const OrderSummary: React.FC = () => {
  const { cart, removeFromCart, clearCart } = useCart();
  const { data: session } = useSession();
  const router = useRouter();

  const [successMessage, setSuccessMessage] = useState("");
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);

  useEffect(() => {
    if (session?.user?._id) {
      fetch(`/api/users/${session.user._id}`)
        .then((res) => res.json())
        .then((data) => {
          setUserDetails(data);
        })
        .catch((error) =>
          console.error("Error fetching user details:", error)
        );
    }
  }, [session?.user?._id]);

  const [remarks, setRemarks] = useState<{ [index: number]: string }>({});
  const [editing, setEditing] = useState<{ [index: number]: boolean }>({});
  const [addresses, setAddresses] = useState<{ [index: number]: string }>({});
  const [pincodes, setPincodes] = useState<{ [index: number]: string }>({});

  const userName = userDetails?.name || session?.user?.name || "Your Name";
  const userEmail =
    userDetails?.email || session?.user?.email || "your.email@example.com";
  const userPhone = userDetails?.phone || session?.user?.phone || "Not set";
  const userAddress =
    userDetails?.address || session?.user?.address || "Not set";
  const userPincode =
    userDetails?.pincode || session?.user?.pincode || "Not set";

  const handleRemarkChange = (index: number, value: string) => {
    setRemarks((prev) => ({ ...prev, [index]: value }));
  };

  const handleEditAddress = (index: number) => {
    setEditing((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const handleAddressChange = (index: number, value: string) => {
    setAddresses((prev) => ({ ...prev, [index]: value }));
  };

  const handlePincodeChange = (index: number, value: string) => {
    setPincodes((prev) => ({ ...prev, [index]: value }));
  };

  // Subtotal is now a simple numerical sum from the cart
  const subtotal = cart.reduce(
    (sum, item) => sum + Number(item.service.price),
    0
  );

  // Generate Invoice / Receipt using jsPDF
  type Booking = {
    userName: string;
    userEmail: string;
    userPhone: string;
    address: string;
    pincode: string;
    serviceName: string;
    category: string;
    price: number;
  };

  type PaymentStatus = "pending" | "paid";

  const generateInvoice = (
    bookingsArray: Booking[],
    totalAmount: number,
    paymentStatus: PaymentStatus
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
    doc.text("Invoice / Receipt", 20, 20);

    // Order Date
    doc.setFontSize(12);
    doc.text(`Date of Order: ${currentDate}`, 20, 30);

    // User Information (from the first booking, assuming all bookings are from the same user)
    const user = bookingsArray[0];
    doc.text(`Name: ${user.userName}`, 20, 40);
    doc.text(`Email: ${user.userEmail}`, 20, 50);
    doc.text(`Phone: ${user.userPhone}`, 20, 60);
    doc.text(`Address: ${user.address}`, 20, 70);
    doc.text(`Pincode: ${user.pincode}`, 20, 80);

    // Service Details
    let yPosition = 90;
    doc.text("Services Purchased:", 20, yPosition);
    yPosition += 10;

    bookingsArray.forEach((item, index) => {
      doc.text(
        `${item.serviceName} (${item.category}) - ₹${item.price}`,
        20,
        yPosition
      );
      yPosition += 10;
    });

    // Total Amount
    yPosition += 10;
    doc.text(`Total Amount: ₹${totalAmount}`, 20, yPosition);

    // Payment Status
    yPosition += 10;
    doc.text(`Payment Status: ${paymentStatus}`, 20, yPosition);

    // Save the PDF
    doc.save(`Invoice_${currentDate}.pdf`);
  };

  // New function to handle placing the service order
  const handlePlaceOrder = async () => {
    if (!session?.user) {
      alert("Please log in to complete your booking.");
      return;
    }

    // Build the bookings array; note the inclusion of category from the service
    const bookingsArray = cart.map((item, index) => ({
      userId: session.user._id,
      userName,
      userEmail,
      userPhone,
      address: addresses[index] ?? userAddress,
      pincode: pincodes[index] ?? userPincode,
      serviceName: item.service.name,
      category: item.service.category, // New field for matching with partner skills
      price: item.service.price,
      remark: remarks[index] || "",
      date: item.date,
      time: item.time,
      paymentStatus: "pending", // Payment will be chosen later via the Bookings page
      serviceProviderId: null,
      serviceProviderName: "",
      serviceProviderContact: "",
    }));

    try {
      const res = await axios.post("/api/bookings/create", {
        bookings: bookingsArray,
        finalTotal: subtotal,
      });
      if (res.status === 201) {
        setSuccessMessage(
          "Booking successful! We'll assign someone within 2 hours. You can choose your payment method later from the Bookings page (accessible via your profile)."
        );
        generateInvoice(bookingsArray, subtotal, "pending");
        setTimeout(() => {
          localStorage.setItem("cart", JSON.stringify([]));
          clearCart();
          router.push("/");
        }, 3000);
      }
    } catch (error) {
      console.error("Error creating bookings", error);
      alert("Error creating bookings. Please try again later.");
    }
  };

  const handleBackHome = () => {
    router.push("/");
  };

  if (successMessage) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0f0f0f] text-white">
        <h2 className="text-xl font-bold">{successMessage}</h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f0f0f] p-6 text-white">
      <div className="max-w-5xl mx-auto">
        {/* Back Button */}
        <button
          onClick={handleBackHome}
          className="mb-4 px-4 py-2 bg-[#1a1a1a] hover:bg-[#2c2c2c] rounded text-sm"
        >
          &larr; Back to Home
        </button>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Column: Cart Items */}
          <div className="md:col-span-2 bg-[#1a1a1a] p-4 rounded shadow">
            <h1 className="text-2xl font-bold mb-4">Service Order Summary</h1>
            {cart.length === 0 ? (
              <p className="text-center text-gray-400">Your cart is empty.</p>
            ) : (
              cart.map((item, index) => {
                const isEditing = editing[index] || false;
                const currentAddress = addresses[index] ?? userAddress;
                const currentPincode = pincodes[index] ?? userPincode;

                return (
                  <div
                    key={index}
                    className="border border-gray-700 p-4 rounded mb-4"
                  >
                    <div className="flex justify-between items-center">
                      <h3 className="font-semibold text-lg">
                        {item.service.name}
                      </h3>
                      <button
                        className="text-red-400 text-sm hover:underline"
                        onClick={() => removeFromCart(index)}
                      >
                        Remove
                      </button>
                    </div>
                    <p className="text-sm text-gray-300">
                      Date: {item.date.toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-300">Time: {item.time}</p>
                    <p className="text-sm text-gray-300">
                      Price: ₹{item.service.price}
                    </p>
                    <p className="text-sm text-gray-300">
                      Category: {item.service.category}
                    </p>

                    {/* Remarks Field */}
                    <div className="mt-2">
                      <label
                        htmlFor={`remark-${index}`}
                        className="block text-sm font-medium text-gray-200"
                      >
                        Additional details:
                      </label>
                      <input
                        id={`remark-${index}`}
                        type="text"
                        value={remarks[index] || ""}
                        onChange={(e) =>
                          handleRemarkChange(index, e.target.value)
                        }
                        placeholder="Add a remark"
                        className="mt-1 block w-full rounded-md border border-gray-600 bg-[#2c2c2c] text-gray-200 p-2 focus:outline-none focus:border-[#800000]"
                      />
                    </div>

                    {/* Address / Pincode Display & Edit */}
                    <div className="mt-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-300">
                            Address: {currentAddress}
                          </p>
                          <p className="text-sm text-gray-300">
                            Pincode: {currentPincode}
                          </p>
                        </div>
                        <button
                          className="text-sm text-[#800000] hover:underline"
                          onClick={() => handleEditAddress(index)}
                        >
                          {isEditing ? "Close" : "Edit Address"}
                        </button>
                      </div>
                      {isEditing && (
                        <div className="mt-2 space-y-2">
                          <input
                            type="text"
                            value={currentAddress}
                            onChange={(e) =>
                              handleAddressChange(index, e.target.value)
                            }
                            placeholder="Enter address"
                            className="block w-full rounded-md border border-gray-600 bg-[#2c2c2c] text-gray-200 p-2 focus:outline-none focus:border-[#800000]"
                          />
                          <input
                            type="text"
                            value={currentPincode}
                            onChange={(e) =>
                              handlePincodeChange(index, e.target.value)
                            }
                            placeholder="Enter pincode"
                            className="block w-full rounded-md border border-gray-600 bg-[#2c2c2c] text-gray-200 p-2 focus:outline-none focus:border-[#800000]"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Right Column: Contact & Order Info */}
          <div className="bg-[#1a1a1a] p-4 rounded shadow flex flex-col justify-between">
            <div>
              <h2 className="text-xl font-bold mb-2">Contact Information</h2>
              <p className="text-sm text-gray-300">Name: {userName}</p>
              <p className="text-sm text-gray-300">Email: {userEmail}</p>
              <p className="text-sm text-gray-300">Phone: {userPhone}</p>

              <div className="mt-4 border-t border-gray-700 pt-4">
                <h2 className="text-xl font-bold mb-2">Default Address</h2>
                <p className="text-sm text-gray-300">Address: {userAddress}</p>
                <p className="text-sm text-gray-300">Pincode: {userPincode}</p>
              </div>
            </div>

            {/* Order Instructions */}
            <div className="mt-4 border-t border-gray-700 pt-4">
              <p className="text-sm text-gray-300">
                We'll assign someone within 2 hours. You can choose your payment
                method later from the Bookings page (accessible via your
                profile).
              </p>
              <h2 className="font-semibold text-lg uppercase mt-4">
                Subtotal: ₹{subtotal}
              </h2>
              <Button
                onClick={handlePlaceOrder}
                className="mt-4 w-full uppercase bg-[#800000] text-white hover:bg-[#8B0000]"
              >
                Place Service Order
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
