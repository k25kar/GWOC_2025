"use client";

import { FC, ReactNode, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import { useCart } from "@/src/context/CartContext";
import { Button } from "./ui/button";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface Props {
  visible?: boolean;
  onRequestClose?: () => void;
  children?: ReactNode;
}

const SideCart: FC<Props> = ({ visible, onRequestClose, children }) => {
  const { cart, removeFromCart } = useCart();
  // Make sure your CartContext has a removeFromCart function

  const [showBookingMessage, setShowBookingMessage] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();

  // Handle logout logic
  const handleLogout = () => {
    // If user is NOT logged in, go to login page
    if (!session?.user) {
      router.push("/login");
    } else {
      // If user IS logged in, show success message for 5 seconds
      setShowBookingMessage(true);
      setTimeout(() => {
        setShowBookingMessage(false);
      }, 5000);
    }
  };

  // Calculate subtotal
  const subtotal = cart.reduce(
    (sum, item) => sum + Number(item.service.price),
    0
  );

  return (
    <>
      <Sheet open={visible} onOpenChange={() => onRequestClose?.()}>
        <SheetTrigger asChild>{children}</SheetTrigger>

        {/* Updated styling to match Booking.tsx */}
        <SheetContent
          side="right"
          className="bg-white p-6 rounded-lg shadow-md overflow-auto w-96 min-h-screen flex flex-col z-50"
        >
          <SheetHeader>
            <SheetTitle className="text-gray-900 text-2xl font-bold">
              Cart
            </SheetTitle>
            <SheetDescription className="text-gray-700">
              Your selected items
            </SheetDescription>
          </SheetHeader>

          {/* Cart Items */}
          <div className="flex flex-col gap-4 mt-6">
            {cart.length === 0 ? (
              <p className="text-gray-600">Your cart is empty.</p>
            ) : (
              cart.map((item, index) => (
                <div key={index} className="border p-4 rounded bg-gray-50">
                  <h3 className="font-semibold text-gray-800">
                    {item.service.name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Date: {item.date.toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-600">Time: {item.time}</p>
                  <p className="text-sm text-gray-600">
                    Price: ₹{item.service.price}
                  </p>
                  {/* Remove item from cart */}
                  <button
                    className="text-red-500 text-xs mt-2 hover:underline"
                    onClick={() => removeFromCart(index)}
                  >
                    Remove
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Footer with Subtotal, Checkout, Close, and Logout */}
          <SheetFooter className="mt-auto">
            {/* Subtotal */}
            <div className="py-4">
              <h1 className="font-semibold text-xl uppercase text-gray-800">
                Subtotal
              </h1>
              <p className="font-semibold text-gray-700">₹{subtotal}</p>
            </div>

            {/* Close Button */}
            <SheetClose asChild>
              <Button
                onClick={onRequestClose}
                className="outline-none block mt-4 text-center w-full uppercase border border-gray-300 text-gray-500 hover:bg-gray-100"
              >
                Close
              </Button>
            </SheetClose>

            {/* Logout Button */}
            <Button
              onClick={handleLogout}
              className="outline-none block mt-4 text-center w-full uppercase bg-gray-300 text-gray-700 hover:bg-gray-400"
            >
              Checkout
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* 5-second success message */}
      {showBookingMessage && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-md shadow-lg transition-opacity duration-300">
          Booking successful, we'll assign you a Service Provider shortly!
        </div>
      )}
    </>
  );
};

export default SideCart;
