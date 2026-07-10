
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

import { formatCurrency } from "../../domain/campaign";

export function BudgetBarChart({ campaigns }) {
  const topCampaigns = campaigns
    .filter((campaign) => campaign.status === "Active")
    .sort((a, b) => Number(b.budget || 0) - Number(a.budget || 0))
    .slice(0, 5)
    .map((campaign) => ({
      ...campaign,
      campaignName:
        campaign.campaignName || campaign.name || "Untitled Campaign",
      budget: Number(campaign.budget || 0),
    }));

  if (topCampaigns.length === 0) {
    return (
      <div className="rounded-lg border bg-white p-6 text-center text-gray-500">
        No active campaigns available.
      </div>
    );
  }

  return (
    <div className="min-w-0 rounded-lg bg-white p-6 shadow">
      <h2 className="mb-5 text-lg font-bold">
        Top 5 Active Campaigns by Budget
      </h2>

      <div className="h-80 min-w-0">
        <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={topCampaigns}
          margin={{ top: 8, right: 16, bottom: 24, left: 32 }}
        >
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis
            dataKey="campaignName"
            interval={0}
            tick={{ fontSize: 12 }}
            tickLine={false}
          />

          <YAxis
            tickFormatter={(value) => formatCurrency(value)}
            tick={{ fontSize: 12 }}
            tickLine={false}
            width={120}
          />

          <Tooltip formatter={(value) => formatCurrency(value)} />

          <Bar dataKey="budget" fill="#2563eb" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
      </div>
    </div>
  );
}
