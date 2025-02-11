import Layout from './components/Layout';
import styles from './components/Layout.module.css';

export default function Services() {
  return (
    <Layout>
      <div className={styles.servicesHeader}>
        <h2>Services</h2>
        <button className={styles.addServiceButton}>
          + Add Service
        </button>
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
            {/* Example static row - replace with dynamic data */}
            <tr>
              <td>Service Name 1</td>
              <td>Service Description 1</td>
              <td>$50.00</td>
              <td>
                <span className={styles.activeStatus}>Active</span>
              </td>
              <td>
                <button className={styles.actionButton}>Edit</button>
                <button className={styles.actionButton}>Delete</button>
              </td>
            </tr>
            {/* Add more rows dynamically here */}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}