import { CampaignRow } from "../molecules/CampaignRow";

export function CampaignTable({ campaigns, onDelete, onStatusChange, onEdit, emptyMessage = "No campaigns found." }) {
  if (campaigns.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-gray-300 bg-white p-8 text-center">
        <p className="text-sm font-medium text-gray-600">
          {emptyMessage}
        </p>
      </div>
    );
  }

  return (
    <div className="w-full min-w-0 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
      <div className="campaign-table-scroll max-h-[calc(100vh-240px)] min-h-[280px] max-w-full overflow-auto overscroll-contain">
        <table className="w-full min-w-full table-fixed border-collapse md:min-w-[680px] xl:min-w-[940px]">
        <thead className="sticky top-0 z-10 border-b border-gray-200 bg-gray-100 text-xs uppercase text-gray-500">
          <tr>
            <th className="w-[24%] px-3 py-4 text-left md:w-[15%] xl:w-[10%]">ID</th>
            <th className="w-[46%] px-3 py-4 text-left md:w-[27%] xl:w-[18%]">Campaign Name</th>
            <th className="hidden px-3 py-4 text-left md:table-cell md:w-[22%] xl:w-[11%]">Status</th>
            <th className="hidden px-4 py-4 text-left xl:table-cell xl:w-[17%]">Platform</th>
            <th className="hidden px-4 py-4 text-left xl:table-cell xl:w-[16%]">Target Audience</th>
            <th className="hidden px-4 py-4 text-left xl:table-cell xl:w-[12%]">Budget</th>
            <th className="hidden px-3 py-4 text-left md:table-cell md:w-[20%] xl:w-[16%]">Actions</th>
            <th className="w-[30%] px-3 py-4 text-left md:w-[16%] xl:hidden">Details</th>
          </tr>
        </thead>

        <tbody>
          {campaigns.map((campaign) => (
            <CampaignRow
              key={campaign.id}
              campaign={campaign}
              onDelete={onDelete}
              onEdit={onEdit}
              onStatusChange={onStatusChange}
            />
          ))}
        </tbody>
        </table>
      </div>
    </div>
  );
}
