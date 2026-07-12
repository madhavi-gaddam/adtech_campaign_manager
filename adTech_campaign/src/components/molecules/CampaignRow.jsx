import { Link } from "react-router-dom";
import { Pause, Pencil, Play, Trash2 } from "lucide-react";
import { StatusBadge } from "../atoms/StatusBadge";
import { formatCurrency } from "../../utils/formatCurrency";

export function CampaignRow({
  campaign,
  onDelete,
  onToggleStatus,
  onEdit,
}) {
  const campaignName = campaign.campaignName || campaign.name || "Untitled Campaign";
  const isActive = campaign.status === "Active";

  return (
    <tr className="border-b border-gray-200 bg-gray-50 last:border-b-0 hover:bg-white">
      <td className="px-4 py-5 text-sm font-bold text-blue-900">
        <span className="inline-flex h-8 min-w-8 items-center justify-center rounded-md border border-gray-300 bg-blue-50 px-2">
          {campaign.id}
        </span>
      </td>

      <td className="px-4 py-4 text-sm font-extrabold text-gray-950 sm:text-base">
        <Link
          to={`/campaigns/${campaign.id}`}
          className="block max-w-64 whitespace-normal break-words leading-snug hover:text-blue-700 hover:underline"
        >
          {campaignName}
        </Link>
      </td>

      <td className="px-4 py-5">
        <StatusBadge status={campaign.status} />
      </td>

      <td className="px-4 py-4 text-sm font-extrabold text-gray-950 sm:text-base">
        {campaign.platform}
      </td>

      <td className="px-4 py-4 text-sm text-gray-950 sm:text-base">
        {campaign.ageGroup || "All"}
      </td>

      <td className="px-4 py-4 text-sm text-gray-950 sm:text-base">
        {formatCurrency(campaign.budget)}
      </td>

      <td className="px-4 py-5">
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label={isActive ? "Pause campaign" : "Activate campaign"}
            title={isActive ? "Pause campaign" : "Activate campaign"}
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-100 text-indigo-900 transition hover:bg-indigo-200 dark:bg-indigo-400/20 dark:text-indigo-200 dark:hover:bg-indigo-400/30"
            onClick={() => onToggleStatus(campaign.id)}
          >
            {isActive ? (
              <Pause size={20} aria-hidden="true" />
            ) : (
              <Play size={20} aria-hidden="true" />
            )}
          </button>

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
    </tr>
  );
}
