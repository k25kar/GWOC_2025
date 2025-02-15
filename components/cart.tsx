import { FC, ReactNode } from "react";
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

interface Props {
  /** Controls whether the sheet is open or closed */
  visible?: boolean;
  /** Called when the user tries to close the sheet */
  onRequestClose?: () => void;
  /** The cart icon (or any trigger) passed in */
  children?: ReactNode;
}

const SideCart: FC<Props> = ({ visible, onRequestClose, children }) => {
  return (
    <Sheet 
      open={visible} 
      onOpenChange={() => onRequestClose?.()}  // close if user clicks backdrop or close button
    >
      {/* 1️⃣ Wrap your children with <SheetTrigger> so they open the cart */}
      <SheetTrigger asChild>{children}</SheetTrigger>

      {/* 2️⃣ The actual side cart content */}
      <SheetContent side="right" className="w-96 bg-white min-h-screen flex flex-col z-50">
        <SheetHeader>
          <SheetTitle>Cart</SheetTitle>
          <SheetDescription>Your selected items</SheetDescription>
        </SheetHeader>

        {/* Cart Items */}
        <div className="p-4 flex justify-between">
          <h1 className="font-semibold uppercase text-gray-600">Cart</h1>
          <button className="uppercase text-sm">Clear</button>
        </div>
        <div className="w-full h-0.5 bg-gray-200" />

        <div className="p-4">
          <div className="flex space-x-4">
            <img
              src="https://images.unsplash.com/photo-1604671748253-e683240e7efa?q=80&w=2664&auto=format&fit=crop"
              alt=""
              className="w-16 aspect-square rounded object-cover"
            />
            <div className="flex-1">
              <h2 className="font-semibold">Smartphone Case</h2>
              <div className="flex text-gray-400 text-sm space-x-1">
                <span>1</span>
                <span>x</span>
                <span>100</span>
              </div>
            </div>

            <div className="ml-auto">
              <button className="text-xs uppercase hover:underline">Remove</button>
              <div className="flex items-center justify-between mt-2">
                <button>-</button>
                <span className="text-xs">1</span>
                <button>+</button>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full h-0.5 bg-gray-200" />

        {/* Footer with Checkout and Close */}
        <SheetFooter className="mt-auto p-4">
          <div className="py-4">
            <h1 className="font-semibold text-xl uppercase">Total</h1>
            <p className="font-semibold">
              <span className="text-gray-400 font-normal">
                The total of your cart is:
              </span>{" "}
              ${100}
            </p>
          </div>

          <button className="border-2 border-orange-600 py-2 w-full rounded text-orange-600 uppercase">
            Checkout
          </button>

          {/* Use SheetClose to handle the "Close" button behavior */}
          <SheetClose asChild>
            <button
              onClick={onRequestClose}
              className="outline-none block mt-4 text-center w-full uppercase"
            >
              Close
            </button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default SideCart;
