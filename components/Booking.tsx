import React, { ReactNode, useState, useEffect } from "react";
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

interface BookingProps {
  children: ReactNode;
}

interface TimeSlot {
  time: string;
}

function Booking({ children }: BookingProps) {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [timeSlot, setTimeSlot] = useState<TimeSlot[]>([]);

  // Selected time can be string or undefined
  const [selectedTime, setSelectedTime] = useState<string | undefined>(undefined);

  useEffect(() => {
    getTime();
  }, []);

  const getTime = (): void => {
    const timeList: TimeSlot[] = [];

    // Morning times: 10:00 AM - 12:30 AM
    for (let i = 10; i <= 12; i++) {
      timeList.push({ time: `${i}:00 AM` });
      timeList.push({ time: `${i}:30 AM` });
    }
    // Afternoon times: 1:00 PM - 6:30 PM
    for (let i = 1; i <= 6; i++) {
      timeList.push({ time: `${i}:00 PM` });
      timeList.push({ time: `${i}:30 PM` });
    }

    setTimeSlot(timeList);
  };

  const handleTimeSlotClick = (time: string) => {
    // Toggle selection if user clicks the same time again
    setSelectedTime((prev) => (prev === time ? undefined : time));
  };

  const isBookDisabled = !(selectedTime && date);

  const saveBooking=()=>{
    
  }

  return (
    <div>
      <Sheet>
        <SheetTrigger asChild>{children}</SheetTrigger>
        {/* 1️⃣ White background, padding, subtle shadow for a clean look */}
        <SheetContent className="bg-white p-6 rounded-lg shadow-md overflow-auto">
          <SheetHeader>
            <SheetTitle className="text-gray-900 text-2xl font-bold">Book a Service</SheetTitle>
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
          <h2 className="text-xl font-semibold text-gray-900 mt-6">Select a Time Slot</h2>
          <div className="flex flex-wrap gap-2 mt-4">
            {timeSlot.map((item, index) => (
              <Button
                key={index}
                variant="outline"
                onClick={() => handleTimeSlotClick(item.time)}
                // Toggle maroon style if selected
                className={`
                  border-gray-300
                  text-gray-900 
                  hover:bg-black
                  hover:text-white
                  px-4 py-2 rounded-md
                  ${
                    selectedTime === item.time 
                      ? "bg-black text-white border-black "
                      : ""
                  }
                `}
              >
                {item.time}
              </Button>
            ))}
          </div>

          {/* Footer with Cancel and Book Buttons */}
          <SheetFooter className="mt-6">
            <SheetClose asChild>
              {/* Cancel Button */}
              <Button
                variant="outline"
                className="border-gray-300 text-gray-500 hover:bg-primary hover:text-white px-4 py-2 rounded-md"
              >
                Cancel
              </Button>
            </SheetClose>

            {/* Book Button (maroon when enabled, gray when disabled) */}
            <Button
              className={`
                ml-2 px-4 py-2 rounded-md font-semibold transition-colors
                ${
                  isBookDisabled
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-[#800000] text-white hover:bg-[#8B0000]"
                }
              `}
              disabled={isBookDisabled}
              onClick={()=>saveBooking()}
            >
              Book
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}

export default Booking;
