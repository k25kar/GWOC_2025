import { ReactNode } from 'react';
import Link from 'next/link';
import styles from './Layout.module.css';
import { Navbar } from '@/components/Navbar';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className={styles.rootContainer}>
      <Navbar />
      <div className={styles.dashboardContainer}>
        <aside className={styles.sidebar}>
          <h1>Dashboard</h1>
          <nav className={styles.sidebarNav}>
            <Link href="/dashboard/spdashboard/overview" className={styles.sidebarLink}>Overview</Link>
            <Link href="/dashboard/spdashboard/services" className={styles.sidebarLink}>Services</Link>
            <Link href="/dashboard/spdashboard/service-areas" className={styles.sidebarLink}>Service Areas</Link>
            <Link href="/dashboard/spdashboard/orders" className={styles.sidebarLink}>Orders</Link>
            <button className={styles.logoutButton}>Logout</button>
          </nav>
        </aside>
        <main className={styles.mainContent}>{children}</main>
      </div>
    </div>
  );
}