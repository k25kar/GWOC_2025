'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/Navbar'; // Import the Navbar component

const AdminDashboard: React.FC = () => {
  const [services, setServices] = useState<any[]>([]);
  const [partners, setPartners] = useState<any[]>([]);
  const [blogs, setBlogs] = useState<any[]>([]);
  const [referrals, setReferrals] = useState<any[]>([]);
  const [walletStats, setWalletStats] = useState<any[]>([]);

  const addService = (service: any) => {
    setServices([...services, service]);
  };

  const managePartner = (partner: any) => {
    setPartners([...partners, partner]);
  };

  const addBlog = (blog: any) => {
    setBlogs([...blogs, blog]);
  };

  return (
    <div>
      <Navbar /> {/* Include the Navbar component */}
      <div className="p-8">
        <h1 className="text-4xl font-bold mb-8">Admin Dashboard</h1>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Add Services</h2>
          {/* Form to add services */}
          <button
            onClick={() => addService({ name: 'New Service' })}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Add Service
          </button>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Manage Service Partners</h2>
          {/* Form to manage partners */}
          <button
            onClick={() => managePartner({ name: 'New Partner' })}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Add Partner
          </button>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Traffic Analysis and Sales Report</h2>
          {/* Traffic and sales analytics components */}
          <p>Traffic Analysis and Sales Report will be displayed here.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Add Blog Content</h2>
          {/* Form to add blog content */}
          <button
            onClick={() => addBlog({ title: 'New Blog' })}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Add Blog
          </button>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Referral and Wallet Statistics</h2>
          {/* Referral and wallet statistics components */}
          <p>Referral and Wallet Statistics will be displayed here.</p>
        </section>
      </div>
    </div>
  );
};

export default AdminDashboard;