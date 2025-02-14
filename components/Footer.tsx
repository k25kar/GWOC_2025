import React from 'react';
import Link from "next/link";
import { Facebook, Instagram, Linkedin, Twitter, Youtube } from "lucide-react";

export default function Footer() {
  return (
    <>
      <footer className="bg-black text-white pt-16 pb-8">
        <div className="container mx-auto px-6 max-w-7xl">
          {/* Main Footer Content */}
          <div className="grid grid-cols-12 gap-8 mb-16">
            {/* Brand and Social Section */}
            <div className="col-span-12 md:col-span-3">
              <h2 className="text-xl font-bold mb-4">HelperBuddy</h2>
              <p className="text-gray-400 mb-6 text-sm">Your digital service buddy</p>
              <div className="flex gap-4">
                <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Twitter className="h-5 w-5" />
                </Link>
                <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Linkedin className="h-5 w-5" />
                </Link>
                <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Instagram className="h-5 w-5" />
                </Link>
                <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Youtube className="h-5 w-5" />
                </Link>
              </div>
            </div>

            {/* Quick Links Sections */}
            <div className="col-span-12 md:col-span-6 grid grid-cols-3 gap-8">
              {/* Address Section */}
              <div>
                <h3 className="text-sm font-semibold mb-4">Address</h3>
                <p className="text-gray-400 text-sm mb-2">
                  Amroli Cross Rd, near Santosh Electronics,Bhagu
                  <br />
                  Nagar-1, Amroli, Surat, Gujarat 394107
                </p>
              </div>

              {/* Contact Section */}
              <div>
                <h3 className="text-sm font-semibold mb-4">Contacts</h3>
                <Link href="tel:6359398479" className="block text-gray-400 text-sm hover:text-white mb-2">
                  6359398479
                </Link>
                <Link href="mailto:hello@helperbuddy.in" className="block text-gray-400 text-sm hover:text-white">
                  hello@helperbuddy.in
                </Link>
              </div>

              {/* Contact Form */}
              <div>
                <h3 className="text-sm font-semibold mb-4">Contact Us</h3>
                <form className="space-y-3">
                  <input
                    type="text"
                    name="fullname"
                    placeholder="Full name"
                    className="w-full p-2 rounded-lg bg-white/10 text-white border border-white/20 focus:outline-none focus:border-white/40 transition-colors text-sm"
                    required
                  />
                  
                  <input
                    type="email"
                    name="email"
                    placeholder="Your email address"
                    className="w-full p-2 rounded-lg bg-white/10 text-white border border-white/20 focus:outline-none focus:border-white/40 transition-colors text-sm"
                    required
                  />
                  
                  <textarea
                    name="message"
                    placeholder="Enter your message"
                    rows={3}
                    className="w-full p-2 rounded-lg bg-white/10 text-white border border-white/20 focus:outline-none focus:border-white/40 transition-colors resize-none text-sm"
                    required
                  />
                  
                  <button
                    type="submit"
                    className="w-full bg-white text-black py-2 px-4 rounded-lg hover:bg-gray-100 transition-colors text-sm font-medium"
                  >
                    Submit
                  </button>
                </form>
              </div>
            </div>

            {/* Map Section */}
            <div className="col-span-12 md:col-span-3">
              <div className="w-full aspect-square rounded-lg overflow-hidden">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3719.6772172544987!2d72.84631471744384!3d21.242586499999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be04ed5fe81bc01%3A0xc5378fbf0b8874c8!2sBhagu%20Nagar-1%2C%20Amroli%2C%20Surat%2C%20Gujarat%20394107!5e0!3m2!1sen!2sin!4v1676456789012!5m2!1sen!2sin"
                  width="100%"
                  height="100%"
                  allowFullScreen={true}
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-full border-0 iframe-map"
                  title="Location map"
                />
              </div>
            </div>
          </div>

          {/* Bottom Copyright Section */}
          <div className="pt-8 border-t border-white/10">
            <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
              <div>
                © 2024 HelperBuddy. All rights reserved.
              </div>
              <div className="flex gap-6 mt-4 md:mt-0">
                <Link href="#" className="hover:text-white transition-colors">Terms & Conditions</Link>
                <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
                <Link href="#" className="hover:text-white transition-colors">Cookie Policy</Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}