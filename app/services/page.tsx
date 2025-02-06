'use client';

import React from 'react';

export default function Services() {
  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold mb-8">Our Services</h1>
      <ul className="space-y-4">
        <li><a href="/services/1" className="text-blue-500 hover:underline">Service 1</a></li>
        <li><a href="/services/2" className="text-blue-500 hover:underline">Service 2</a></li>
        <li><a href="/services/3" className="text-blue-500 hover:underline">Service 3</a></li>
      </ul>
    </div>
  );
}