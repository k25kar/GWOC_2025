import Layout from './components/Layout';
import styles from './components/Layout.module.css';

export default function Orders() {
  return (
    <Layout>
      <div className={styles.servicesHeader}>
        <h2>Orders</h2>
        <button className={styles.addServiceButton}>
          Filter Orders
        </button>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.servicesTable}>
          <thead>
            <tr>
              <th>Customer</th>
              <th>Service</th>
              <th>PIN Code</th>
              <th>Scheduled For</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {/* Example rows - replace with dynamic data */}
            <tr>
              <td>John Doe</td>
              <td>Home Cleaning</td>
              <td>110001</td>
              <td>2023-08-15 14:00</td>
              <td><span className={styles.pendingStatus}>Pending</span></td>
            </tr>
            <tr>
              <td>Jane Smith</td>
              <td>AC Repair</td>
              <td>110002</td>
              <td>2023-08-16 10:00</td>
              <td><span className={styles.activeStatus}>Confirmed</span></td>
            </tr>
            {/* Add more rows dynamically here */}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}