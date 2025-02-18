// pages/dashboard/spdashboard/service-areas.tsx

import Layout from './components/Layout';
import styles from './components/Layout.module.css';
import db from '@/lib/dbConnect';
import Partner from '@/src/models/Partner';
import { getSession } from 'next-auth/react';

interface ServiceAreasProps {
  servicePincodes: string[]; // Adjust type if servicePincodes is more complex
}

export default function ServiceAreas({ servicePincodes }: ServiceAreasProps) {
  return (
    <Layout>
      <div className={styles.servicesHeader}>
        <h2>Service Areas</h2>
        <button className={styles.addServiceButton}>+ Add PIN Code</button>
      </div>

      <div className={styles.tableContainer}>
        <div className={styles.sectionCard}>
          <h3>PIN Codes</h3>
          <div className={styles.pinCodeGrid}>
            {servicePincodes && servicePincodes.length > 0 ? (
              servicePincodes.map((pin, index) => (
                <div key={index} className={styles.pinCodeItem}>
                  <span>{pin}</span>
                  <span className={styles.activeStatus}>Active</span>
                </div>
              ))
            ) : (
              <div>No PIN codes found</div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

export async function getServerSideProps(context: any) {
  const session = await getSession(context);
  if (!session) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  try {
    await db.connect();

    // Cast the returned partner document to ensure TS knows it may contain servicePincodes.
    const partner = (await Partner.findOne({ email: session.user.email }).lean()) as
      | { servicePincodes?: string[] }
      | null;

    await db.disconnect();

    const servicePincodes = partner?.servicePincodes || [];

    return {
      props: {
        servicePincodes: JSON.parse(JSON.stringify(servicePincodes)),
      },
    };
  } catch (error) {
    console.error('Error fetching service areas:', error);
    return {
      props: {
        servicePincodes: [],
      },
    };
  }
}
