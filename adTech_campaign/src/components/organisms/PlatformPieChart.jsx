import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  Label,
} from "recharts";

const COLORS = [
  "#3B82F6",
  "#22C55E",
  "#F59E0B",
  "#EF4444",
  "#8B5CF6",
  "#06B6D4",
];

export function PlatformPieChart({ campaigns }) {
  const platformData = campaigns.reduce((acc, campaign) => {
    const existingPlatform = acc.find(
      (item) => item.platform === campaign.platform
    );

    if (existingPlatform) {
      existingPlatform.value += 1;
    } else {
      acc.push({
        platform: campaign.platform,
        value: 1,
      });
    }

    return acc;
  }, []);

  const totalCampaigns = platformData.reduce(
    (sum, item) => sum + item.value,
    0
  );

  if (platformData.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">
          Campaigns by Platform
        </h2>

        <div className="flex h-80 items-center justify-center text-gray-500">
          No campaign data available.
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-lg font-semibold text-gray-900">
        Campaigns by Platform
      </h2>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={platformData}
              dataKey="value"
              nameKey="platform"
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={110}
              paddingAngle={3}
              cornerRadius={6}
            >
              <Label
                value={`${totalCampaigns}\nCampaigns`}
                position="center"
                style={{
                  fontSize: "16px",
                  fontWeight: "bold",
                  fill: "#111827",
                  whiteSpace: "pre-line",
                  textAnchor: "middle",
                }}
              />

              {platformData.map((entry, index) => (
                <Cell
                  key={entry.platform}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>

            <Tooltip
              formatter={(value, name) => [
                `${value} Campaign${value > 1 ? "s" : ""}`,
                name,
              ]}
            />

            <Legend verticalAlign="bottom" />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}