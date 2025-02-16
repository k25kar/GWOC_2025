"use client";

import React, { useState } from "react";
import { useCart } from "@/src/context/CartContext";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const OrderSummary: React.FC = () => {
  const { cart, removeFromCart } = useCart();
  const [remarks, setRemarks] = useState<{ [key: number]: string }>({});
  const router = useRouter();

  // Handle remark change for each cart item
  const handleRemarkChange = (index: number, value: string) => {
    setRemarks((prev) => ({ ...prev, [index]: value }));
  };

  // Calculate subtotal ensuring numerical addition
  const subtotal = cart.reduce(
    (sum, item) => sum + Number(item.service.price),
    0
  );

  const handlePayOnDelivery = () => {
    // Implement your pay on delivery functionality here
    // For now, simply redirect to a confirmation page
    router.push("/order-confirmation?method=pod");
  };

  const handlePayNow = () => {
    // Implement your pay now functionality here
    // For now, simply redirect to a confirmation page
    router.push("/order-confirmation?method=paynow");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      <div className="w-full max-w-3xl bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">
          Order Summary
        </h1>

        {cart.length === 0 ? (
          <p className="text-center text-gray-600">Your cart is empty.</p>
        ) : (
          cart.map((item, index) => (
            <div
              key={index}
              className="border p-4 rounded bg-gray-50 mb-4 flex flex-col"
            >
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-gray-800 text-lg">
                  {item.service.name}
                </h3>
                <button
                  className="text-red-500 text-sm hover:underline"
                  onClick={() => removeFromCart(index)}
                >
                  Remove
                </button>
              </div>
              <p className="text-sm text-gray-600">
                Date: {item.date.toLocaleDateString()}
              </p>
              <p className="text-sm text-gray-600">Time: {item.time}</p>
              <p className="text-sm text-gray-600">
                Price: ₹{item.service.price}
              </p>
              <div className="mt-2">
                <label
                  htmlFor={`remark-${index}`}
                  className="block text-sm font-medium text-gray-700"
                >
                  Remark (Optional)
                </label>
                <input
                  id={`remark-${index}`}
                  type="text"
                  value={remarks[index] || ""}
                  onChange={(e) =>
                    handleRemarkChange(index, e.target.value)
                  }
                  placeholder="Add a remark"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
            </div>
          ))
        )}

        <div className="py-4 border-t mt-6">
          <h2 className="font-semibold text-xl uppercase text-gray-800">
            Subtotal
          </h2>
          <p className="font-semibold text-gray-700">₹{subtotal}</p>
        </div>

        <div className="mt-6 flex gap-4">
          <Button
            onClick={handlePayOnDelivery}
            className="flex-1 outline-none block text-center uppercase border border-orange-600 text-orange-600 hover:bg-orange-100"
          >
            Pay On Delivery
          </Button>
          <Button
            onClick={handlePayNow}
            className="flex-1 outline-none block text-center uppercase bg-[#800000] text-white hover:bg-[#8B0000]"
          >
            Pay Now
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
