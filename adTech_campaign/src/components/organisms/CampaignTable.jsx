import { CampaignRow } from "../molecules/CampaignRow";

export function CampaignTable({ campaigns, onDelete, onToggleStatus, onEdit }) {
  if (campaigns.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-gray-300 bg-white p-8 text-center">
        <p className="text-sm font-medium text-gray-600">
          No campaigns found.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full min-w-0 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
      <div className="campaign-table-scroll max-h-[calc(100vh-280px)] min-h-[320px] max-w-full overflow-auto">
        <table className="w-full min-w-[1120px] table-fixed border-collapse">
        <thead className="sticky top-0 z-10 border-b border-gray-200 bg-gray-100 text-xs uppercase text-gray-500">
          <tr>
            <th className="w-[10%] px-4 py-4 text-left">Campaign ID</th>
            <th className="w-[18%] px-4 py-4 text-left">Campaign Name</th>
            <th className="w-[11%] px-4 py-4 text-left">Status</th>
            <th className="w-[17%] px-4 py-4 text-left">Platform</th>
            <th className="w-[16%] px-4 py-4 text-left">Target Audience</th>
            <th className="w-[12%] px-4 py-4 text-left">Budget</th>
            <th className="w-[16%] px-4 py-4 text-left">Actions</th>
          </tr>
        </thead>

        <tbody>
          {campaigns.map((campaign, index) => (
            <CampaignRow
              key={campaign.id}
              campaign={campaign}
              rowNumber={index + 1}
              onDelete={onDelete}
              onEdit={onEdit}
              onToggleStatus={onToggleStatus}
            />
          ))}
        </tbody>
        </table>
      </div>
    </div>
  );
}
