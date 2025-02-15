"use client";

import React, { ReactNode, useState, useEffect, FC } from "react";
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
import { Calendar } from "@/components/ui/calendar";
import { Button } from "./ui/button";
import { useCart, Service } from "@/src/context/CartContext"; // import our context

interface BookingProps {
  children: ReactNode;
  service: Service; // Accept the service details as a prop
}

interface TimeSlot {
  time: string;
}

const Booking: FC<BookingProps> = ({ children, service }) => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [timeSlot, setTimeSlot] = useState<TimeSlot[]>([]);
  const [selectedTime, setSelectedTime] = useState<string | undefined>(undefined);
  const [showMessage, setShowMessage] = useState(false); // State for success message

  const { addToCart } = useCart();

  useEffect(() => {
    getTime();
  }, []);

  const getTime = (): void => {
    const timeList: TimeSlot[] = [];
    // Morning times
    for (let i = 10; i <= 12; i++) {
      timeList.push({ time: `${i}:00 AM` });
      timeList.push({ time: `${i}:30 AM` });
    }
    // Afternoon times
    for (let i = 1; i <= 6; i++) {
      timeList.push({ time: `${i}:00 PM` });
      timeList.push({ time: `${i}:30 PM` });
    }
    setTimeSlot(timeList);
  };

  const handleTimeSlotClick = (time: string) => {
    setSelectedTime((prev) => (prev === time ? undefined : time));
  };

  const isBookDisabled = !(selectedTime && date);

  const saveBooking = () => {
    if (selectedTime && date) {
      addToCart({
        service,
        date,
        time: selectedTime,
      });

      // Show success message for 3 seconds
      setShowMessage(true);
      setTimeout(() => setShowMessage(false), 3000);
    }
  };

  return (
    <div>
      <Sheet>
        <SheetTrigger asChild>{children}</SheetTrigger>
        <SheetContent className="bg-white p-6 rounded-lg shadow-md overflow-auto">
          <SheetHeader>
            <SheetTitle className="text-gray-900 text-2xl font-bold">
              Book a Service
            </SheetTitle>
            <SheetDescription className="text-gray-700">
              Select a date and time slot for the service
            </SheetDescription>
          </SheetHeader>

          {/* Calendar Section */}
          <div className="flex flex-col gap-4 mt-6">
            <h2 className="text-xl font-semibold text-gray-900">Select a Date</h2>
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border text-gray-900"
            />
          </div>

          {/* Time Slots Section */}
          <h2 className="text-xl font-semibold text-gray-900 mt-6">
            Select a Time Slot
          </h2>
          <div className="flex flex-wrap gap-2 mt-4">
            {timeSlot.map((item, index) => (
              <Button
                key={index}
                variant="outline"
                onClick={() => handleTimeSlotClick(item.time)}
                className={`border-gray-300 text-gray-900 hover:bg-black hover:text-white px-4 py-2 rounded-md ${
                  selectedTime === item.time ? "bg-black text-white border-black" : ""
                }`}
              >
                {item.time}
              </Button>
            ))}
          </div>

          {/* Footer with Cancel and Book Buttons */}
          <SheetFooter className="mt-6">
  {/* Cancel button */}
  <SheetClose asChild>
    <Button
      variant="outline"
      className="border-gray-300 text-gray-500 hover:bg-primary hover:text-white px-4 py-2 rounded-md"
    >
      Cancel
    </Button>
  </SheetClose>

  {/* Book button (automatically closes the sheet on Book) */}
  <SheetClose asChild>
    <Button
      className={`ml-2 px-4 py-2 rounded-md font-semibold transition-colors ${
        isBookDisabled
          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
          : "bg-[#800000] text-white hover:bg-[#8B0000]"
      }`}
      disabled={isBookDisabled}
      onClick={saveBooking}
    >
      Book
    </Button>
  </SheetClose>
</SheetFooter>

        </SheetContent>
      </Sheet>

      {/* Success message that disappears after 3 seconds */}
      {showMessage && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-zinc-800 text-white px-6 py-3 rounded-md shadow-lg transition-opacity duration-400">
          Service added to Cart, please Checkout to Confirm Booking!
        </div>
      )}
    </div>
  );
};

export default Booking;
