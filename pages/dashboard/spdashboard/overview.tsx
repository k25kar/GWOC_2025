import Layout from './components/Layout';
import styles from './components/Layout.module.css';

export default function Overview() {
  return (
    <Layout>
      <h2>Overview</h2>
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <h3>Today’s Orders</h3>
          <p>0</p>
        </div>
        <div className={styles.statCard}>
          <h3>Upcoming</h3>
          <p>0</p>
        </div>
        <div className={styles.statCard}>
          <h3>Completed</h3>
          <p>0</p>
        </div>
      </div>
      
      <div className={styles.statsGrid}>
        <div className={styles.sectionCard}>
          <h3>Today’s Schedule</h3>
          <p>No orders to display</p>
        </div>
        <div className={styles.sectionCard}>
          <h3>Upcoming Services</h3>
          <p>No orders to display</p>
        </div>
        <div className={styles.sectionCard}>
          <h3>Recently Completed</h3>
          <p>No orders to display</p>
        </div>
      </div>
    </Layout>
  );
}