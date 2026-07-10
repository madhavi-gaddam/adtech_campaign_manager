import { Button } from "../atoms/Button";
import { StatusBadge } from "../atoms/StatusBadge";
import { formatCurrency } from "../../utils/formatCurrency";

export function CampaignRow({ campaign, onDelete, onToggleStatus, onEdit }) {
  return (
    <tr className="border-b last:border-b-0 hover:bg-gray-50">
      <td className="px-4 py-3 text-sm font-bold text-gray-700">{campaign.id}</td>

      <td className="px-4 py-3 text-sm font-bold text-gray-900">
        {campaign.campaignName}
      </td>

      <td className="px-4 py-3 text-sm text-gray-700">
        {campaign.platform}
      </td>

      <td className="px-4 py-3 text-sm font-bold text-gray-900">
        {formatCurrency(campaign.budget)}
      </td>

      <td className="px-4 py-3">
        <StatusBadge status={campaign.status} />
      </td>

      <td className="px-4 py-3">
        <div className="flex flex-wrap gap-2">
          <Button
            variant="secondary"
            className="px-3 py-1.5"
            onClick={() => onEdit(campaign.id)}
          >
            Edit
          </Button>

          <Button
            variant="secondary"
            className="px-3 py-1.5"
            onClick={() => onToggleStatus(campaign.id)}
          >
            {campaign.status === "Active" ? "Pause" : "Active"}
          </Button>

          <Button
            variant="danger"
            className="px-3 py-1.5"
            onClick={() => onDelete(campaign.id)}
          >
            Delete
          </Button>
        </div>
      </td>
    </tr>
  );
}
