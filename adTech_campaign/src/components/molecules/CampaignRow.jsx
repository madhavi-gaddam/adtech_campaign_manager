import { Link } from "react-router-dom";
import { Pencil, Trash2 } from "lucide-react";
import { formatCurrency } from "../../utils/formatCurrency";

export function CampaignRow({
  campaign,
  onDelete,
  onStatusChange,
  onEdit,
  showOwner,
}) {
  const campaignName = campaign.campaignName || campaign.name || "Untitled Campaign";
  const statusClass = campaign.status === "Active"
    ? "border-green-300 bg-green-100 text-green-800"
    : campaign.status === "Paused"
      ? "border-amber-300 bg-amber-100 text-amber-800"
      : "border-blue-300 bg-blue-100 text-blue-800";
  return (
    <tr className="border-b border-gray-200 bg-gray-50 last:border-b-0 hover:bg-white">
      <td className="px-3 py-5 text-sm font-bold text-blue-900 xl:px-4">
        <span className="inline-flex h-8 min-w-8 items-center justify-center rounded-md border border-gray-300 bg-blue-50 px-2">
          {campaign.id}
        </span>
      </td>

      <td className="px-3 py-4 text-sm font-extrabold text-gray-950 sm:text-base xl:px-4">
        <Link
          to={`/campaigns/${campaign.id}`}
          className="block max-w-64 whitespace-normal break-words leading-snug hover:text-blue-700 hover:underline"
        >
          {campaignName}
        </Link>
        {showOwner && (
          <div className="mt-1 xl:hidden">
            <p className="text-xs font-semibold text-gray-700">{campaign.ownerName}</p>
            <p className="text-xs font-medium text-gray-500">{campaign.ownerRole}</p>
          </div>
        )}
      </td>

      <td className="hidden px-3 py-5 md:table-cell xl:px-4">
        <select
          value={campaign.status}
          aria-label={`Change status for ${campaignName}`}
          onChange={(event) => onStatusChange(campaign.id, event.target.value)}
          className={`w-full rounded-md border px-2 py-2 text-sm font-medium outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 ${statusClass}`}
        >
          <option value="Active">Active</option>
          <option value="Paused">Paused</option>
          <option value="Completed">Completed</option>
        </select>
      </td>

      <td className="hidden px-4 py-4 text-sm font-extrabold text-gray-950 sm:text-base xl:table-cell">
        {campaign.platform}
      </td>

      <td className="hidden px-4 py-4 text-sm text-gray-950 sm:text-base xl:table-cell">
        {campaign.ageGroup || "All"}
      </td>

      <td className="hidden px-4 py-4 text-sm text-gray-950 sm:text-base xl:table-cell">
        {formatCurrency(campaign.budget)}
      </td>

      {showOwner && (
        <td className="hidden px-4 py-4 xl:table-cell">
          <p className="break-words text-sm font-semibold text-gray-950">{campaign.ownerName}</p>
          <p className="mt-1 text-xs font-medium text-gray-500">{campaign.ownerRole}</p>
        </td>
      )}

      <td className="hidden px-3 py-5 md:table-cell xl:px-4">
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Edit campaign"
            title="Edit campaign"
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-100 text-gray-950 transition hover:bg-indigo-200 dark:bg-sky-400/20 dark:text-sky-200 dark:hover:bg-sky-400/30"
            onClick={() => onEdit(campaign.id)}
          >
            <Pencil size={20} aria-hidden="true" />
          </button>

          <button
            type="button"
            aria-label="Delete campaign"
            title="Delete campaign"
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-rose-600 text-white transition hover:bg-rose-700"
            onClick={(event) => onDelete(campaign.id, event.currentTarget)}
          >
            <Trash2 size={20} aria-hidden="true" />
          </button>
        </div>
      </td>

      <td className="px-3 py-5 md:px-3 xl:hidden">
        <Link to={`/campaigns/${campaign.id}`} className="text-sm font-bold text-blue-700 hover:underline">
          View
        </Link>
      </td>
    </tr>
  );
}
