// pages/order-confirmation.tsx
import { useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

const OrderConfirmation = () => {
  const router = useRouter();

  useEffect(() => {
    // Clear the cart from localStorage when this page loads
    localStorage.removeItem("cart");
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-center p-6">
      {/* Back to Home Button */}
      <Link href="/">
        <button className="absolute top-4 left-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition">
          Back to Home
        </button>
      </Link>

      {/* Order Confirmation Content */}
      <div className="bg-white shadow-lg rounded-2xl p-8 max-w-lg w-full">
        <h1 className="text-2xl font-bold text-green-600">🎉 Order Confirmed!</h1>
        <p className="mt-2 text-gray-600">Thank you for your purchase. Your order has been successfully placed.</p>
        
        {/* Optional: Order Details */}
        <div className="mt-4 p-4 border rounded-lg bg-gray-50">
          <h2 className="text-lg font-semibold">Order Details</h2>
          <p className="text-sm text-gray-500">Check your email for confirmation and tracking details.</p>
        </div>

        {/* Continue Shopping Button */}
        <Link href="/">
          <button className="mt-6 bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition">
            Continue Shopping
          </button>
        </Link>
      </div>
    </div>
  );
};

export default OrderConfirmation;
