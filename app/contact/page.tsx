'use client';

import React from 'react';

export default function Contact() {
  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold mb-8">Contact Us</h1>
      <form className="space-y-4">
        <div>
          <label className="block text-lg">Name</label>
          <input type="text" className="w-full p-2 border border-gray-300 rounded" />
        </div>
        <div>
          <label className="block text-lg">Email</label>
          <input type="email" className="w-full p-2 border border-gray-300 rounded" />
        </div>
        <div>
          <label className="block text-lg">Message</label>
          <textarea className="w-full p-2 border border-gray-300 rounded"></textarea>
        </div>
        <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">Submit</button>
      </form>
    </div>
  );
}