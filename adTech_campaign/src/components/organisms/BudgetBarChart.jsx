
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

function CampaignBudgetTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;

  const campaign = payload[0].payload;
  return (
    <div className="rounded-md border border-gray-200 bg-white px-3 py-2 text-sm shadow-lg dark:border-slate-600 dark:bg-slate-800">
      <p className="font-semibold text-gray-900 dark:text-white">{campaign.campaignName}</p>
      <p className="mt-0.5 text-gray-600 dark:text-slate-200">Budget: {formatCurrency(campaign.budget)}</p>
    </div>
  );
}

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
    <div className="flex min-h-[320px] min-w-0 flex-col rounded-lg bg-white p-4 shadow lg:h-full lg:min-h-0">
      <h2 className="mb-3 text-lg font-bold">
        Top 5 Active Campaigns by Budget
      </h2>

      <div className="h-72 min-w-0 flex-1 sm:h-72 lg:h-auto">
        <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={topCampaigns}
          margin={{ top: 8, right: 12, bottom: 30, left: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="campaignName" interval={0} tick={{ fontSize: 11 }} tickLine={false} />
          <YAxis
            tickFormatter={(value) => new Intl.NumberFormat("en-IN", { notation: "compact", maximumFractionDigits: 1 }).format(value)}
            tick={{ fontSize: 11 }}
            tickLine={false}
            width={52}
          />

          <Tooltip content={<CampaignBudgetTooltip />} cursor={false} />

          <Bar dataKey="budget" fill="#2563eb" radius={[6, 6, 0, 0]} activeBar={false} />
        </BarChart>
      </ResponsiveContainer>
      </div>
    </div>
  );
}
