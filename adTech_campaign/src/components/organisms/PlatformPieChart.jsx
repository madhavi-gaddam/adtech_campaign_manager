import { useId, useState } from "react";
import { Cell, Label, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

import { formatCurrency } from "../../domain/campaign";

const PLATFORM_COLORS = {
  Facebook: "#4F46E5",
  "Google Ads": "#16A34A",
  "Google Search": "#16A34A",
  Instagram: "#DB2777",
  LinkedIn: "#0891B2",
  YouTube: "#DC2626",
};
const FALLBACK_COLORS = ["#8B5CF6", "#14B8A6", "#F59E0B", "#64748B"];

const PLATFORM_NAMES = Object.fromEntries(
  Object.keys(PLATFORM_COLORS).map((platform) => [platform.toLowerCase(), platform])
);

function normalizePlatform(platform) {
  const value = String(platform || "").trim();
  return PLATFORM_NAMES[value.toLowerCase()] || value || "Unspecified";
}

function formatCompactBudget(amount) {
  const value = Number(amount) || 0;
  const units = [
    { value: 10_000_000, suffix: "Cr" },
    { value: 100_000, suffix: "L" },
    { value: 1_000, suffix: "K" },
  ];
  const unit = units.find(({ value: unitValue }) => Math.abs(value) >= unitValue);

  if (!unit) return formatCurrency(value);

  const compactValue = value / unit.value;
  const maximumFractionDigits = Math.abs(compactValue) >= 10 ? 0 : 1;
  return `₹${compactValue.toLocaleString("en-IN", { maximumFractionDigits })} ${unit.suffix}`;
}

function DonutCenterLabel({ viewBox, total }) {
  if (!viewBox) return null;

  return (
    <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
      <tspan x={viewBox.cx} dy="-0.45em" className="fill-gray-900 text-base font-extrabold dark:fill-slate-100">
        {formatCompactBudget(total)}
      </tspan>
      <tspan x={viewBox.cx} dy="1.7em" className="fill-gray-500 text-[10px] font-semibold uppercase tracking-wide dark:fill-slate-400">
        Total Budget
      </tspan>
    </text>
  );
}

function getColor(platform, index) {
  return PLATFORM_COLORS[platform] || FALLBACK_COLORS[index % FALLBACK_COLORS.length];
}

function BudgetTooltip({ active, payload, total }) {
  if (!active || !payload?.length) return null;

  const item = payload[0].payload;
  const percentage = total ? ((item.budget / total) * 100).toFixed(1) : "0.0";

  return (
    <div className="rounded-md border border-gray-200 bg-white px-3 py-2 text-sm shadow-lg">
      <p className="font-semibold text-gray-900">{item.platform}</p>
      <p className="text-gray-600">{formatCurrency(item.budget)} · {percentage}%</p>
    </div>
  );
}

export function PlatformPieChart({ campaigns }) {
  const titleId = useId();
  const [status, setStatus] = useState("All");
  const [ageGroup, setAgeGroup] = useState("All");
  const ageGroups = [...new Set(campaigns.map((campaign) => campaign.ageGroup).filter(Boolean))];
  const filteredCampaigns = campaigns.filter(
    (campaign) =>
      (status === "All" || campaign.status === status) &&
      (ageGroup === "All" || campaign.ageGroup === ageGroup)
  );
  const data = Object.values(
    filteredCampaigns.reduce((platforms, campaign) => {
      const platform = normalizePlatform(campaign.platform);
      platforms[platform] ??= { platform, budget: 0 };
      platforms[platform].budget += Number(campaign.budget) || 0;
      return platforms;
    }, {})
  );
  const total = data.reduce((sum, item) => sum + item.budget, 0);
  const hasFilters = status !== "All" || ageGroup !== "All";

  return (
    <section className="flex h-full min-h-0 flex-col rounded-lg border border-gray-200 bg-white p-4 shadow-sm" aria-labelledby={titleId}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 id={titleId} className="text-lg font-bold text-gray-900">Budget by Platform</h2>
        {hasFilters && (
          <button type="button" onClick={() => { setStatus("All"); setAgeGroup("All"); }} className="text-xs font-semibold text-blue-600 hover:underline">
            Clear filters
          </button>
        )}
      </div>

      <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <label className="text-xs font-bold uppercase tracking-wide text-gray-500">
          Status
          <select value={status} onChange={(event) => setStatus(event.target.value)} className="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-normal normal-case tracking-normal text-gray-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100">
            <option value="All">All</option>
            <option value="Active">Active</option>
            <option value="Paused">Paused</option>
          </select>
        </label>

        <label className="text-xs font-bold uppercase tracking-wide text-gray-500">
          Age
          <select value={ageGroup} onChange={(event) => setAgeGroup(event.target.value)} className="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-normal normal-case tracking-normal text-gray-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100">
            <option value="All">All</option>
            {ageGroups.filter((age) => age !== "All").map((age) => <option key={age} value={age}>{age}</option>)}
          </select>
        </label>
      </div>

      <p className="sr-only">Total budget {formatCurrency(total)}. {data.map((item) => `${item.platform}: ${formatCurrency(item.budget)}`).join("; ")}</p>
      {!data.length || total === 0 ? (
        <div className="flex h-64 items-center justify-center text-gray-500">No budget data available for these filters.</div>
      ) : (
        <>
          <div className="chart-canvas h-52 shrink-0 sm:h-56" aria-hidden="true">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={data} dataKey="budget" nameKey="platform" cx="50%" cy="50%" innerRadius="50%" outerRadius="74%" minAngle={3} paddingAngle={1} cornerRadius={2} stroke="none">
                  {data.map((item, index) => <Cell key={item.platform} fill={getColor(item.platform, index)} />)}
                  <Label content={(props) => <DonutCenterLabel {...props} total={total} />} />
                </Pie>
                <Tooltip content={<BudgetTooltip total={total} />} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <ul className="flex flex-wrap gap-x-4 gap-y-2 border-t border-gray-200 pt-3">
            {data.map((item, index) => (
              <li key={item.platform} title={`${item.platform}: ${formatCurrency(item.budget)} (${total ? ((item.budget / total) * 100).toFixed(1) : "0.0"}%)`} className={`flex min-w-0 items-center gap-1.5 text-xs ${item.budget === 0 ? "opacity-50" : ""}`}>
                <div className="flex items-center gap-1.5 font-semibold text-gray-900">
                  <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: getColor(item.platform, index) }} />
                  {item.platform}
                </div>
                <p className="hidden">
                  {formatCurrency(item.budget)} · {((item.budget / total) * 100).toFixed(1)}%
                </p>
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
}
