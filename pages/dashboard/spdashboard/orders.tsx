// pages/orders.tsx
"use client";

import React, { useState, useEffect } from "react";
import Layout from "./components/Layout";
import styles from "./components/Layout.module.css";
import { useSession } from "next-auth/react";

interface Order {
  _id: string;
  userName: string;
  userPhone: string;
  serviceName: string;
  remark?: string;
  address: string;
  pincode: string;
  date: string;
  time: string;
  price: number;
  paymentStatus: "pending" | "paid";
  serviceProviderId: string | null;
  serviceProviderName: string;
  serviceProviderContact: string;
  createdAt: string;
}

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [popupMessage, setPopupMessage] = useState<string>("");
  const bannerMessage =
    "Note: Once accepted, the booking cannot be cancelled by either the user or the service provider.";
  const { data: session } = useSession();
  const providerId = session?.user?._id; // Provider's ID from session

  useEffect(() => {
    if (providerId) {
      fetch(`/api/bookings/orders?providerId=${providerId}`)
        .then((res) => res.json())
        .then((data) => setOrders(data))
        .catch((err) => console.error("Error fetching orders:", err));
    }
  }, [providerId]);

  const showPopup = (message: string) => {
    setPopupMessage(message);
    setTimeout(() => {
      setPopupMessage("");
    }, 3000);
  };

  const handleAccept = async (orderId: string) => {
    try {
      const res = await fetch(`/api/bookings/accept?bookingId=${orderId}`, {
        method: "POST",
      });
      if (res.status === 404) {
        showPopup("User has cancelled this Booking");
      } else if (res.status === 409) {
        showPopup("Service already taken");
      } else if (res.ok) {
        // Remove accepted order from view.
        setOrders((prev) => prev.filter((order) => order._id !== orderId));
      }
    } catch (error) {
      console.error("Error accepting order:", error);
    }
  };

  const handleRemove = async (orderId: string) => {
    try {
      if (!providerId) return;
      const res = await fetch(`/api/bookings/remove?bookingId=${orderId}&providerId=${providerId}`, {
        method: "POST",
      });
      if (res.ok) {
        // Remove the order from this provider's view.
        setOrders((prev) => prev.filter((order) => order._id !== orderId));
      }
    } catch (error) {
      console.error("Error removing order:", error);
    }
  };

  return (
    <Layout>
      <div className={styles.servicesHeader}>
        <h1>Orders</h1>
      </div>

      <div style={{ background: "#ffffcc", padding: "10px", marginBottom: "20px", textAlign: "center" }}>
        {bannerMessage}
      </div>

      {popupMessage && (
        <div style={{ background: "#ffcccc", padding: "10px", marginBottom: "10px", textAlign: "center" }}>
          {popupMessage}
        </div>
      )}

      <div className={styles.tableContainer}>
        <table className={styles.servicesTable}>
          <thead>
            <tr>
              <th>Customer</th>
              <th>Service</th>
              <th>Remark</th>
              <th>Phone</th>
              <th>Address</th>
              <th>Scheduled For</th>
              <th>Price</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan={9}>No orders available.</td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order._id}>
                  <td>{order.userName}</td>
                  <td>{order.serviceName}</td>
                  <td>{order.remark || ""}</td>
                  <td>{order.userPhone}</td>
                  <td>
                    {order.address}, {order.pincode}
                  </td>
                  <td>
                    {new Date(order.date).toLocaleDateString()} {order.time}
                  </td>
                  <td>₹{order.price}</td>
                  <td>{order.paymentStatus === "pending" ? "Pending" : "Paid"}</td>
                  <td>
                    <button onClick={() => handleAccept(order._id)} style={{ marginRight: "8px" }}>
                      Accept
                    </button>
                    <button onClick={() => handleRemove(order._id)}>Remove</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}
