"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { DollarSign, Users, Star, TrendingUp } from "lucide-react";

const metrics = [
  {
    title: "Total Revenue",
    value: "$12,345",
    change: "+12%",
    icon: DollarSign,
  },
  {
    title: "Active Partners",
    value: "123",
    change: "+5%",
    icon: Users,
  },
  {
    title: "Avg. Rating",
    value: "4.8",
    change: "+0.2%",
    icon: Star,
  },
  {
    title: "Referrals",
    value: "45",
    change: "+15%",
    icon: TrendingUp,
  },
];

export function DashboardMetrics() {
  return (
    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {metrics.map((metric, index) => (
        <motion.div
          key={metric.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card className="bg-[#141414] text-white">
            <CardHeader>
              <CardTitle>{metric.title}</CardTitle>
              <metric.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-500">{metric.change}</span> from last month
              </p>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}