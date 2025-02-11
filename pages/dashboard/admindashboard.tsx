import { DashboardLayout } from "@/components/layout/dashboard_layout" 
import { DashboardMetrics } from "@/components/dashboard/metrics"
import { RevenueChart } from "@/components/dashboard/revenue_chart"
import { PartnerPerformance } from "@/components/dashboard/partner_performance"
import { ReferralStats } from "@/components/dashboard/referral_stats"

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Dashboard Overview</h1>
        <DashboardMetrics />
        <div className="grid gap-6 lg:grid-cols-2">
          <RevenueChart />
          <PartnerPerformance />
        </div>
        <ReferralStats />
      </div>
    </DashboardLayout>
  )
}

