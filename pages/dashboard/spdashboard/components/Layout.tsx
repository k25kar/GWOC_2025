"use client";

import { ReactNode } from "react";
import Link from "next/link";
import styles from "./Layout.module.css";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Show a loading state while the session is being fetched
  if (status === "loading") {
    return <div>Loading...</div>;
  }

  // Redirect to login if no session exists
  if (!session) {
    router.push("/login");
    return null;
  }

  const handleLogout = async () => {
    await signOut();
    router.push("/");
  };

  return (
    <div className={styles.rootContainer}>
      <div className={styles.dashboardContainer}>
        <aside className={styles.sidebar}>
          <h1>Dashboard</h1>
          <nav className={styles.sidebarNav}>
            <Link
              href="/dashboard/spdashboard/overview"
              className={styles.sidebarLink}
            >
              Overview
            </Link>
            <Link
              href="/dashboard/spdashboard/services"
              className={styles.sidebarLink}
            >
              Services
            </Link>
            <Link
              href="/dashboard/spdashboard/service-areas"
              className={styles.sidebarLink}
            >
              Service Areas
            </Link>
            <Link
              href="/dashboard/spdashboard/orders"
              className={styles.sidebarLink}
            >
              Orders
            </Link>
            <button
              className={styles.logoutButton}
              onClick={handleLogout}
            >
              Logout
            </button>
          </nav>
        </aside>
        <main className={styles.mainContent}>{children}</main>
      </div>
    </div>
  );
}
