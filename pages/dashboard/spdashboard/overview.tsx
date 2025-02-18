// pages/dashboard/spdashboard/overview.tsx

import Layout from "./components/Layout";
import styles from "./components/Layout.module.css";
import db from "@/lib/dbConnect";
import Partner from "@/src/models/Partner";
import { getSession } from "next-auth/react";
import { GetServerSideProps } from "next";

interface Stats {
  pendingJobs: number;
  completedJobs: number;
  rating: number;
  responseTime: number;
  revenueGenerated: number;
}

interface OverviewProps {
  stats: Stats;
}

// Define the expected shape of the partner document
interface PartnerDoc {
  stats?: {
    pendingJobs: any;
    completedJobs: any;
    rating: any;
    responseTime: any;
    revenueGenerated: any;
  };
}

function Overview({ stats }: OverviewProps) {
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
        <p>No orders to display</p>
      </div>
    </Layout>
  );
}

// Helper function to convert Decimal128-like objects to numbers
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

    // Assert that the returned document is a single partner document
    const partner = (await Partner.findOne({ email: session.user.email }).lean()) as
      | PartnerDoc
      | null;

    await db.disconnect();

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

    return { props: { stats } };
  } catch (error) {
    console.error("Error fetching partner stats:", error);
    return {
      props: {
        stats: {
          pendingJobs: 0,
          completedJobs: 0,
          rating: 0,
          responseTime: 0,
          revenueGenerated: 0,
        },
      },
    };
  }
};

export default Overview;
