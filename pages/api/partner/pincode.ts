/* eslint-disable @typescript-eslint/no-explicit-any */
// pages/api/partner/pincode.ts

import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/lib/dbConnect";
import Partner from "@/src/models/Partner";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect.connect();

  const { email, pincode } = req.body;

  if (!email || !pincode) {
    res.status(422).json({ message: "Email and pincode are required" });
    return;
  }

  // Find partner document by email
  const partner = await Partner.findOne({ email });
  if (!partner) {
    res.status(404).json({ message: "Partner not found" });
    return;
  }

  if (req.method === "POST") {
    // Add pincode if it doesn't exist yet
    if (partner.servicePincodes.some((p: any) => p.code === pincode)) {
      res.status(400).json({ message: "Pincode already exists" });
      return;
    }
    // By default, new pincode is set to activeStatus = true
    partner.servicePincodes.push({ code: pincode, activeStatus: true });
    await partner.save();
    res.status(200).json({ servicePincodes: partner.servicePincodes });
  } else if (req.method === "PUT") {
    // Toggle activeStatus of a given pincode
    const { activeStatus } = req.body; // e.g. { activeStatus: false }
    const index = partner.servicePincodes.findIndex((p: any) => p.code === pincode);
    if (index === -1) {
      res.status(404).json({ message: "Pincode not found" });
      return;
    }
    partner.servicePincodes[index].activeStatus = activeStatus;
    await partner.save();
    res.status(200).json({ servicePincodes: partner.servicePincodes });
  } else if (req.method === "DELETE") {
    // Remove a pincode
    partner.servicePincodes = partner.servicePincodes.filter((p: any) => p.code !== pincode);
    await partner.save();
    res.status(200).json({ servicePincodes: partner.servicePincodes });
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
