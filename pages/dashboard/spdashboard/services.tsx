// pages/dashboard/spdashboard/services.tsx

import Layout from './components/Layout';
import styles from './components/Layout.module.css';
import db from "@/lib/dbConnect";
import Service from "@/src/models/Service";
import { getSession } from "next-auth/react";

interface ServiceType {
  _id: string;
  name: string;
  category: string;
  price: string;
  status: string;
  acceptedBy?: string | null;
}

interface ServicesProps { 
  services: ServiceType[];
}

export default function Services({ services = [] }: ServicesProps) {
  return (
    <Layout>
      <div className={styles.servicesHeader}>
        <h2>Services</h2>
        <button className={styles.addServiceButton}>+ Add Service</button>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.servicesTable}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Price</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {services && services.length > 0 ? (
              services.map((service) => (
                <tr key={service._id}>
                  <td>{service.name}</td>
                  <td>{service.category}</td>
                  <td>${service.price}</td>
                  <td>
                    <span
                      className={
                        service.status === "active"
                          ? styles.activeStatus
                          : styles.pendingStatus
                      }
                    >
                      {service.status}
                    </span>
                  </td>
                  <td>
                    <button className={styles.actionButton}>Edit</button>
                    <button className={styles.actionButton}>Delete</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5}>No services found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}

export async function getServerSideProps(context: any) {
  const session = await getSession(context);
  console.log("Session Data:", session); // Debugging

  if (!session) {
    console.log("No session found! Redirecting to login.");
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  try {
    await db.connect();
    const services = await Service.find({
      status: { $in: ["active", "pending"] },
      $or: [
        { acceptedBy: { $exists: false } },
        { acceptedBy: null },
        { acceptedBy: session.user._id }, // Ensure session.user._id exists
      ],
    }).lean();
    await db.disconnect();

    return {
      props: {
        services: JSON.parse(JSON.stringify(services)),
      },
    };
  } catch (error) {
    console.error("Error fetching services:", error);
    return {
      props: {
        services: [],
      },
    };
  }
}
