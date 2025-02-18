"use client"; 
// Only if you're using Next.js 13 App Router in a 'app' folder and need a client component

import React, { useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Facebook, Instagram, Linkedin, Twitter, Youtube, Star } from "lucide-react";

export default function Footer(): JSX.Element {
  // 1) Access session from NextAuth
  const { data: session } = useSession();
  // 2) Use session user name or empty string if undefined
  const sessionUserName = session?.user?.name || "";

  // Modal control
  const [showModal, setShowModal] = useState<boolean>(false);

  // Star rating & review text
  const [rating, setRating] = useState<number>(0);
  const [review, setReview] = useState<string>("");

  // For disabling Post button
  const isPostDisabled = rating === 0 || review.trim() === "";

  // Loading state & success toast
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState<boolean>(false);

  // State for "Login to leave a review" warning
  const [showLoginWarning, setShowLoginWarning] = useState<boolean>(false);

  // Handle star clicks
  const handleStarClick = (starValue: number) => {
    setRating(starValue);
  };

  // Submit testimonial to API
  const handlePost = async () => {
    if (isPostDisabled) return;
    setSubmitting(true);

    try {
      const res = await fetch("/api/testimonials", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: sessionUserName,
          rating,
          review,
          profilePic: "/user-icon.png",
        }),
      });
      if (res.ok) {
        // Close modal
        setShowModal(false);

        // Show success toast
        setShowSuccessPopup(true);

        // Reset rating & review
        setRating(0);
        setReview("");

        // Hide success popup after 3 seconds
        setTimeout(() => {
          setShowSuccessPopup(false);
        }, 3000);
      }
    } catch (error) {
      console.error("Error submitting testimonial:", error);
    } finally {
      setSubmitting(false);
    }
  };

  // Open modal if logged in; otherwise show login warning
  const handleOpenModal = () => {
    if (!sessionUserName) {
      // User not logged in
      setShowLoginWarning(true);
      setTimeout(() => {
        setShowLoginWarning(false);
      }, 3000);
    } else {
      // User logged in
      setShowModal(true);
    }
  };

  return (
    <>
      {/* Success Toast */}
      {showSuccessPopup && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-green-600 text-white py-2 px-4 rounded shadow">
          Thank you! We value your feedback.
        </div>
      )}

      {/* Login Warning Toast */}
      {showLoginWarning && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-red-600 text-white py-2 px-4 rounded shadow">
          Login to leave a review
        </div>
      )}

      {/* Modal (only if showModal === true) */}
      {showModal && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-60">
          <div className="bg-zinc-900 w-11/12 max-w-md rounded-lg p-6 relative">
            <h3 className="text-xl font-bold text-white mb-4">Write a Review</h3>

            {/* User name & icon */}
            <div className="flex items-center mb-4">
              <img
                src="/user-icon.png"
                alt="User Icon"
                className="rounded-full w-10 h-10 object-cover mr-3"
              />
              <span className="text-white">{sessionUserName}</span>
            </div>

            {/* Star Rating */}
            <div className="flex items-center mb-4">
              {[1, 2, 3, 4, 5].map((starValue) => (
                <button
                  key={starValue}
                  type="button"
                  onClick={() => handleStarClick(starValue)}
                  className="text-yellow-400 mr-1"
                >
                  <Star
                    fill={starValue <= rating ? "currentColor" : "none"}
                    stroke="currentColor"
                    className="w-6 h-6"
                  />
                </button>
              ))}
            </div>

            {/* Review Textarea */}
            <textarea
              className="w-full p-2 rounded bg-black text-white border border-white/20 focus:outline-none focus:border-white/40 transition-colors mb-4"
              rows={3}
              placeholder="Share details of your own experience..."
              value={review}
              onChange={(e) => setReview(e.target.value)}
            />

            {/* Modal Buttons */}
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="bg-zinc-700 hover:bg-zinc-600 text-white py-1 px-4 rounded"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handlePost}
                disabled={isPostDisabled || submitting}
                className={`${
                  isPostDisabled || submitting
                    ? "bg-gray-500 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-500"
                } text-white py-1 px-4 rounded`}
              >
                {submitting ? "Posting..." : "Post"}
              </button>
            </div>
          </div>
        </div>
      )}

      <footer className="bg-black text-white pt-16 pb-8">
        <div className="container mx-auto px-6 max-w-7xl">
          {/* Main Footer Content */}
          <div className="grid grid-cols-12 gap-8 mb-16">
            {/* Brand and Social Section */}
            <div className="col-span-12 md:col-span-3">
              <h2 className="text-xl font-bold mb-4">HelperBuddy</h2>
              <p className="text-gray-400 mb-6 text-sm">
                Your digital service buddy
              </p>
              <div className="flex gap-4">
                <Link
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <Twitter className="h-5 w-5" />
                </Link>
                <Link
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <Linkedin className="h-5 w-5" />
                </Link>
                <Link
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <Instagram className="h-5 w-5" />
                </Link>
                <Link
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
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
                  Amroli Cross Rd, near Santosh Electronics, Bhagu
                  <br />
                  Nagar-1, Amroli, Surat, Gujarat 394107
                </p>
              </div>

              {/* Contact Section */}
              <div>
                <h3 className="text-sm font-semibold mb-4">Contacts</h3>
                <Link
                  href="tel:6359398479"
                  className="block text-gray-400 text-sm hover:text-white mb-2"
                >
                  6359398479
                </Link>
                <Link
                  href="mailto:hello@helperbuddy.in"
                  className="block text-gray-400 text-sm hover:text-white"
                >
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
                  ></textarea>
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
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-full border-0 iframe-map"
                  title="Location map"
                />
              </div>
            </div>
          </div>

          {/* Single button that triggers modal or login warning */}
          <div className="mb-16 bg-zinc-800 p-6 rounded-lg text-center">
            <button
              onClick={handleOpenModal}
              className="bg-black text-white py-2 px-4 rounded-lg hover:bg-gray-100 hover:text-black transition-colors text-sm font-medium"
            >
              Your review helps us become better. Click here to leave one!
            </button>
          </div>

          {/* Bottom Copyright */}
          <div className="pt-8 border-t border-white/10">
            <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
              <div>© 2024 HelperBuddy. All rights reserved.</div>
              <div className="flex gap-6 mt-4 md:mt-0">
                <Link href="#" className="hover:text-white transition-colors">
                  Terms &amp; Conditions
                </Link>
                <Link href="#" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
                <Link href="#" className="hover:text-white transition-colors">
                  Cookie Policy
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
