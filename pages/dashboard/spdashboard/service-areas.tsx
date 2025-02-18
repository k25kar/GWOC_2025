// pages/dashboard/spdashboard/service-areas.tsx

import { useState } from "react";
import Layout from "./components/Layout";
import styles from "./components/Layout.module.css";
import db from "@/lib/dbConnect";
import Partner from "@/src/models/Partner";
import { getSession } from "next-auth/react";
import { GetServerSideProps } from "next";

interface Pincode {
  code: string;
  activeStatus: boolean;
}

interface ServiceAreasProps {
  servicePincodes: Pincode[];
  email: string;
}

export default function ServiceAreas({ servicePincodes, email }: ServiceAreasProps) {
  const [pincodes, setPincodes] = useState<Pincode[]>(servicePincodes);
  const [showAddInput, setShowAddInput] = useState<boolean>(false);
  const [newPincode, setNewPincode] = useState<string>("");

  // Function to add a new pincode
  const handleAddPincode = async () => {
    if (!newPincode) return;
    try {
      const res = await fetch("/api/partner/pincode", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, pincode: newPincode }),
      });
      if (res.ok) {
        const data = await res.json();
        setPincodes(data.servicePincodes);
        setNewPincode("");
        setShowAddInput(false);
      } else {
        console.error("Failed to add pincode");
      }
    } catch (error) {
      console.error("Error adding pincode:", error);
    }
  };

  // Function to toggle activeStatus
  const handleTogglePincode = async (code: string, currentStatus: boolean) => {
    try {
      const res = await fetch("/api/partner/pincode", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, pincode: code, activeStatus: !currentStatus }),
      });
      if (res.ok) {
        const data = await res.json();
        setPincodes(data.servicePincodes);
      } else {
        console.error("Failed to toggle pincode status");
      }
    } catch (error) {
      console.error("Error toggling pincode:", error);
    }
  };

  // Function to remove a pincode
  const handleRemovePincode = async (code: string) => {
    try {
      const res = await fetch("/api/partner/pincode", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, pincode: code }),
      });
      if (res.ok) {
        const data = await res.json();
        setPincodes(data.servicePincodes);
      } else {
        console.error("Failed to remove pincode");
      }
    } catch (error) {
      console.error("Error removing pincode:", error);
    }
  };

  return (
    <Layout>
      <div className={styles.servicesHeader}>
        <h2>Service Areas</h2>
        <button
          className={styles.addServiceButton}
          onClick={() => setShowAddInput(!showAddInput)}
        >
          + Add PIN Code
        </button>
      </div>

      {showAddInput && (
        <div className={styles.addPincodeContainer}>
          <input
            type="text"
            placeholder="Enter 6-digit PIN Code"
            value={newPincode}
            onChange={(e) => setNewPincode(e.target.value)}
            className={styles.pincodeInput}
          />
          <div className={styles.addPincodeActions}>
            <button
              onClick={() => {
                setShowAddInput(false);
                setNewPincode("");
              }}
              className={styles.cancelPincodeButton}
            >
              Cancel
            </button>
            <button
              onClick={handleAddPincode}
              className={styles.submitPincodeButton}
              disabled={!/^\d{6}$/.test(newPincode)} // Only enable if 6-digit numeric
            >
              Add
            </button>
          </div>
        </div>
      )}

      <div className={styles.tableContainer}>
        <div className={styles.sectionCard}>
          <h3>PIN Codes</h3>
          <div className={styles.pinCodeGrid}>
            {pincodes && pincodes.length > 0 ? (
              pincodes.map((pin, index) => (
                <div key={index} className={styles.pinCodeItem}>
                  <span>{pin.code}</span>
                  {/* Toggle switch and remove button in a single container */}
                  <div className={styles.actionButtons}>
                    <label className={styles.switch}>
                      <input
                        type="checkbox"
                        checked={pin.activeStatus}
                        onChange={() => handleTogglePincode(pin.code, pin.activeStatus)}
                      />
                      <span className={styles.slider}>
                        {/* Optional text to show Active / Inactive inside the slider */}
                        {pin.activeStatus ? "Active" : "Inactive"}
                      </span>
                    </label>
                    <button
                      onClick={() => handleRemovePincode(pin.code)}
                      className={styles.removeButton}
                    >
                      Remove
                    </button>
                  </div>
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

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);
  if (!session) {
    return {
      redirect: { destination: "/login", permanent: false },
    };
  }

  try {
    await db.connect();

    const partner = (await Partner.findOne({ email: session.user.email }).lean()) as
      | { servicePincodes?: { code: string; activeStatus: boolean }[] }
      | null;

    await db.disconnect();

    const servicePincodes = partner?.servicePincodes || [];

    return {
      props: {
        servicePincodes: JSON.parse(JSON.stringify(servicePincodes)),
        email: session.user.email,
      },
    };
  } catch (error) {
    console.error("Error fetching service areas:", error);
    return {
      props: { servicePincodes: [], email: session.user.email },
    };
  }
};
