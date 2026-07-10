import { Button } from "../atoms/Button";
import { InfoItem } from "../molecules/InfoItem";
import { formatCurrency } from "../../utils/formatCurrency";
import { useNavigate } from "react-router-dom";

export function CampaignDetailsCard({ campaign }) {
  const navigate = useNavigate();
  const campaignName = campaign.campaignName || campaign.name || "Untitled Campaign";
  const createdDate = campaign.createdAt
    ? new Date(campaign.createdAt).toLocaleDateString("en-IN")
    : "Not available";

  return (
    <div className="max-w-3xl rounded-lg border border-gray-200 bg-white p-6 shadow-sm">

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

      <div className="mt-8 flex gap-4">

        <Button
          variant="secondary"
          onClick={() => navigate("/campaigns")}
        >
          Back
        </Button>

        <Button
          onClick={() =>
            navigate(`/campaigns/edit/${campaign.id}`)
          }
        >
          Edit
        </Button>

      </div>

    </div>
  );
}
