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
  // Initialize with current date; note: Calendar's disabled callback will prevent past date selection.
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [timeSlot, setTimeSlot] = useState<TimeSlot[]>([]);
  const [selectedTime, setSelectedTime] = useState<string | undefined>(
    undefined
  );
  const [showMessage, setShowMessage] = useState(false); // State for success message

  const { addToCart } = useCart();

  useEffect(() => {
    getTime();
  }, []);

  // Prepare the list of available time slots
  const getTime = (): void => {
    const timeList: TimeSlot[] = [];
    // Morning times (10:00 AM to 12:30 PM)
    for (let i = 9; i <= 11; i++) {
      timeList.push({ time: `${i}:00 AM` });
      timeList.push({ time: `${i}:30 AM` });
    }
    timeList.push({ time: `12:00 PM` });
    timeList.push({ time: `12:30 PM` });
    // Afternoon times (1:00 PM to 6:30 PM)
    for (let i = 1; i <= 6; i++) {
      timeList.push({ time: `${i}:00 PM` });
      timeList.push({ time: `${i}:30 PM` });
    }
    setTimeSlot(timeList);
  };

  // Parse a time slot string (e.g. "10:30 AM") and combine it with the selected date.
  const parseTimeSlot = (time: string, selectedDate: Date): Date => {
    const [timePart, period] = time.split(" ");
    const [hourStr, minuteStr] = timePart.split(":");
    let hour = parseInt(hourStr, 10);
    const minute = parseInt(minuteStr, 10);
    if (period === "PM" && hour !== 12) {
      hour += 12;
    } else if (period === "AM" && hour === 12) {
      hour = 0;
    }
    const result = new Date(selectedDate);
    result.setHours(hour, minute, 0, 0);
    return result;
  };

  // Determine if a time slot should be disabled.
  // If the selected date is today, we disable any time slot that falls before current time + 2 hours.
  const isTimeSlotDisabled = (time: string): boolean => {
    if (!date) return false;

    const now = new Date();
    const threshold = new Date(now);
    threshold.setHours(threshold.getHours() + 2);

    // Only restrict if the selected date is today.
    const selectedDateOnly = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    );
    const todayOnly = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );
    if (selectedDateOnly.getTime() !== todayOnly.getTime()) {
      return false;
    }

    const bookingDateTime = parseTimeSlot(time, date);
    return bookingDateTime < threshold;
  };

  // Handle toggling the selected time slot.
  const handleTimeSlotClick = (time: string) => {
    if (isTimeSlotDisabled(time)) return; // Prevent selection if disabled
    setSelectedTime((prev) => (prev === time ? undefined : time));
  };

  // Determine if the "Add to Cart" (Book) button should be disabled.
  const isBookDisabled: boolean =
    !selectedTime ||
    !date ||
    (selectedTime ? isTimeSlotDisabled(selectedTime) : false);

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
              <div className="text-gray-700 text-medium mb-2 mt-3">
              Select a date and time slot for the service
              </div>
              {/* Informational message */}
              <div className="mb-4 text-sm text-red-500 font-medium">
                Please note: Bookings must be made at least 2 hours in advance
                for seamless service.
              </div>
            </SheetDescription>
          </SheetHeader>

          {/* Calendar Section */}
          <div className="flex flex-col gap-4 mt-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Select a Date
            </h2>
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              // Disable any date before today:
              disabled={(d: Date) =>
                d < new Date(new Date().setHours(0, 0, 0, 0))
              }
              className="rounded-md border text-gray-900"
            />
          </div>

          {/* Time Slots Section */}
          <h2 className="text-xl font-semibold text-gray-900 mt-6">
            Select a Time Slot
          </h2>
          <div className="flex flex-wrap gap-2 mt-4">
            {timeSlot.map((item, index) => {
              const isDisabled = isTimeSlotDisabled(item.time);
              return (
                <Button
                  key={index}
                  variant="outline"
                  onClick={() => handleTimeSlotClick(item.time)}
                  disabled={isDisabled}
                  className={`border-gray-300 text-gray-900 hover:bg-black hover:text-white px-4 py-2 rounded-md ${
                    selectedTime === item.time
                      ? "bg-black text-white border-black"
                      : ""
                  } ${isDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  {item.time}
                </Button>
              );
            })}
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
                Add to Cart
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
