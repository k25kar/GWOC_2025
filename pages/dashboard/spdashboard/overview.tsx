/* eslint-disable @typescript-eslint/no-explicit-any */
// pages/dashboard/spdashboard/overview.tsx
import React, { useState } from "react";
import Layout from "./components/Layout";
import styles from "./components/Layout.module.css";
import db from "@/lib/dbConnect";
import Partner from "@/src/models/Partner";
import Booking from "@/src/models/Booking";
import { getSession } from "next-auth/react";
import { GetServerSideProps } from "next";

interface Stats {
  pendingJobs: number;
  completedJobs: number;
  rating: number;
  responseTime: number;
  revenueGenerated: number;
}

interface ScheduleOrder {
  _id: string;
  userName: string;
  serviceName: string;
  date: string; // ISO string
  time: string;
  price: number;
}

interface OverviewProps {
  stats: Stats;
  scheduleOrders: ScheduleOrder[];
}

// Define the partner document type
interface PartnerDoc {
  _id: string;
  email: string;
  stats?: {
    pendingJobs: any;
    completedJobs: any;
    rating: any;
    responseTime: any;
    revenueGenerated: any;
  };
}

function Overview({ stats, scheduleOrders: initialScheduleOrders }: OverviewProps) {
  const [scheduleOrders, setScheduleOrders] = useState<ScheduleOrder[]>(initialScheduleOrders);

  const handleDone = async (orderId: string) => {
    try {
      const res = await fetch(`/api/bookings/complete?bookingId=${orderId}`, {
        method: "POST",
      });
      if (res.ok) {
        setScheduleOrders((prev) => prev.filter((order) => order._id !== orderId));
      }
    } catch (error) {
      console.error("Error marking order as done", error);
    }
  };

  return (
    <Layout>
      <h2>Overview</h2>
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <h3>Pending Orders</h3>
          <p>{stats.pendingJobs}</p>
        </div>
        <div className={styles.statCard}>
          <h3>Rating</h3>
          <p>{stats.rating}</p>
        </div>
        <div className={styles.statCard}>
          <h3>Completed</h3>
          <p>{stats.completedJobs}</p>
        </div>
      </div>

      <div className={styles.sectionCard}>
        <h3>Today’s Schedule</h3>
        {scheduleOrders.length === 0 ? (
          <p>No orders to display</p>
        ) : (
          <table className={styles.servicesTable}>
            <thead>
              <tr>
                <th>Customer</th>
                <th>Service</th>
                <th>Scheduled For</th>
                <th>Price</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {scheduleOrders.map((order) => (
                <tr key={order._id}>
                  <td>{order.userName}</td>
                  <td>{order.serviceName}</td>
                  <td>
                    {new Date(order.date).toLocaleDateString()} {order.time}
                  </td>
                  <td>₹{order.price}</td>
                  <td>
                    <button onClick={() => handleDone(order._id)}>Done</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </Layout>
  );
}

const normalizeDecimal = (val: any): number => {
  if (typeof val === "object" && val !== null && "$numberDecimal" in val) {
    return parseFloat(val.$numberDecimal);
  }
  return Number(val) || 0;
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);
  if (!session) {
    return { redirect: { destination: "/login", permanent: false } };
  }
  try {
    await db.connect();
    // Fetch partner document based on session email.
    const partner = (await Partner.findOne({ email: session.user.email }).lean()) as PartnerDoc | null;
    const rawStats = partner?.stats || {
      pendingJobs: 0,
      completedJobs: 0,
      rating: 0,
      responseTime: 0,
      revenueGenerated: 0,
    };
    const stats: Stats = {
      pendingJobs: normalizeDecimal(rawStats.pendingJobs),
      completedJobs: normalizeDecimal(rawStats.completedJobs),
      rating: normalizeDecimal(rawStats.rating),
      responseTime: normalizeDecimal(rawStats.responseTime),
      revenueGenerated: normalizeDecimal(rawStats.revenueGenerated),
    };

    // Define today's start and end times.
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    // Fetch accepted orders for today (where serviceProviderId matches partner._id)
    const scheduleOrdersRaw = (await Booking.find({
      serviceProviderId: partner?._id,
      date: { $gte: todayStart, $lte: todayEnd },
    }).sort({ date: 1, time: 1 }).lean()) as any[];

    await db.disconnect();

    const scheduleOrders: ScheduleOrder[] = scheduleOrdersRaw.map((order) => ({
      _id: order._id.toString(),
      userName: order.userName,
      serviceName: order.serviceName,
      date: order.date.toISOString(),
      time: order.time,
      price: order.price,
    }));

    return { props: { stats, scheduleOrders } };
  } catch (error) {
    console.error("Error fetching overview data:", error);
    return {
      props: {
        stats: { pendingJobs: 0, completedJobs: 0, rating: 0, responseTime: 0, revenueGenerated: 0 },
        scheduleOrders: [],
      },
    };
  }
};

export default Overview;
