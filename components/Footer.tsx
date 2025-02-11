import React from 'react';
import Link from "next/link";
import { DribbbleIcon as Behance, Instagram, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-black text-white py-12 px-6">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand Column */}
        <div>
          <h2 className="text-xl font-bold mb-4 text-gray-200">
            The agency
            <br />
            for impatient
            <br />
            brands®
          </h2>
        </div>

        {/* London Office */}
        <div>
          <h3 className="font-medium mb-2 text-gray-300">LONDON</h3>
          <Link href="mailto:newbusiness@wasarimpero.com" className="block hover:underline text-gray-400">
            newbusiness@wasarimpero.com
          </Link>
          <Link href="tel:+442075867571" className="block hover:underline text-gray-400">
            +44 20 7586 7571
          </Link>
          <p className="mt-2 text-gray-400">
            Unit 306, Metropolitan Wharf,
            <br />
            70 Wapping Wall, London E1W 3SS
          </p>
          <Link href="#" className="inline-block mt-4 hover:underline text-gray-400">
            SEE ON MAP →
          </Link>
        </div>

        {/* Buenos Aires Office */}
        <div>
          <h3 className="font-medium mb-2 text-gray-300">BUENOS AIRES</h3>
          <Link href="mailto:buenosaires@wasarimpero.com" className="block hover:underline text-gray-400">
            buenosaires@wasarimpero.com
          </Link>
          <Link href="tel:+541161897949" className="block hover:underline text-gray-400">
            +54 11 6189 7949
          </Link>
          <p className="mt-2 text-gray-400">
            Cabild 1459 1st floor,
            <br />
            Buenos Aires
          </p>
          <Link href="#" className="inline-block mt-4 hover:underline text-gray-400">
            SEE ON MAP →
          </Link>
        </div>

        {/* Newsletter & Social */}
        <div>
          <div className="mb-6">
            <h3 className="font-medium mb-2 text-gray-300">
              WANT TO BE THE SMARTEST
              <br />
              IN YOUR OFFICE?
            </h3>
            <Link href="#" className="hover:underline text-gray-400">
              SIGN UP FOR OUR NEWSLETTER →
            </Link>
          </div>
          <div>
            <h3 className="font-medium mb-2 text-gray-300">FOLLOW US</h3>
            <div className="flex gap-4">
              <Link href="#" className="hover:opacity-80 text-gray-400">
                <Behance className="h-5 w-5" />
                <span className="sr-only">Behance</span>
              </Link>
              <Link href="#" className="hover:opacity-80 text-gray-400">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link href="#" className="hover:opacity-80 text-gray-400">
                <Linkedin className="h-5 w-5" />
                <span className="sr-only">LinkedIn</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
