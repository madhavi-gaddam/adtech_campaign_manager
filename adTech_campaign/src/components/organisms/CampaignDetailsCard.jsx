import { Button } from "../atoms/Button";
import { InfoItem } from "../molecules/InfoItem";
import { formatCurrency } from "../../utils/formatCurrency";
import { useNavigate } from "react-router-dom";

export function CampaignDetailsCard({ campaign, onDelete, editPath, canManage = true }) {
  const navigate = useNavigate();
  const campaignName = campaign.campaignName || campaign.name || "Untitled Campaign";
  const createdDate = campaign.createdAt
    ? new Date(campaign.createdAt).toLocaleDateString("en-IN")
    : "Not available";
  const updatedDate = campaign.updatedAt
    ? new Date(campaign.updatedAt).toLocaleString("en-IN")
    : "Not updated yet";

  return (
    <div className="w-full min-w-0 max-w-3xl overflow-hidden rounded-lg border-2 border-slate-300 bg-white p-4 shadow-md dark:border-slate-600 sm:p-6">

      <h2 className="mb-6 text-2xl font-bold">
        Campaign Details
      </h2>

      <InfoItem
        label="Campaign ID"
        value={campaign.id}
      />

      <InfoItem
        label="Campaign Name"
        value={campaignName}
      />

      <InfoItem
        label="Platform"
        value={campaign.platform}
      />

      <InfoItem
        label="Budget"
        value={formatCurrency(campaign.budget)}
      />

      <InfoItem
        label="Status"
        value={campaign.status}
      />

      <InfoItem
        label="Age Group"
        value={campaign.ageGroup}
      />

      <InfoItem
        label="Created Date"
        value={createdDate}
      />

      <InfoItem
        label="Last Updated"
        value={updatedDate}
      />

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:gap-4">

        <Button
          variant="secondary"
          className="campaign-details-back-button w-full sm:w-auto"
          onClick={() => navigate("/campaigns")}
        >
          Back
        </Button>

        {canManage && <Button
          className="w-full sm:w-auto"
          onClick={() =>
            navigate(editPath || `/campaigns/edit/${campaign.id}`)
          }
        >
          Edit
        </Button>}

        {canManage && <Button
          variant="danger"
          className="w-full sm:w-auto"
          onClick={onDelete}
        >
          Delete
        </Button>}

      </div>

    </div>
  );
}
