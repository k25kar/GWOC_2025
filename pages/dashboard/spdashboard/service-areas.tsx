import Layout from './components/Layout';
import styles from './components/Layout.module.css';

export default function ServiceAreas() {
  return (
    <Layout>
      <div className={styles.servicesHeader}>
        <h2>Service Areas</h2>
        <button className={styles.addServiceButton}>
          + Add PIN Code
        </button>
      </div>

      <div className={styles.tableContainer}>
        <div className={styles.sectionCard}>
          <h3>PIN Codes</h3>
          <div className={styles.pinCodeGrid}>
            {/* Example PIN Code - replace with dynamic data */}
            <div className={styles.pinCodeItem}>
              <span>110001</span>
              <span className={styles.activeStatus}>Active</span>
            </div>
            <div className={styles.pinCodeItem}>
              <span>110002</span>
              <span className={styles.inactiveStatus}>Inactive</span>
            </div>
            {/* Add more PIN codes dynamically here */}
          </div>
        </div>
      </div>
    </Layout>
  );
}