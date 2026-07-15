import { useContext, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import { CampaignContext } from "../context/CampaignContextValue";

import { PageShell } from "../components/templates/PageShell";
import { PageHeader } from "../components/molecules/PageHeader";
import { CampaignDetailsCard } from "../components/organisms/CampaignDetailsCard";
import { Button } from "../components/atoms/Button";

export default function CampaignDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { campaigns, deleteCampaign } = useContext(CampaignContext);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const visibleCampaigns = campaigns;

  const campaign = visibleCampaigns.find(
    (campaign) => campaign.id === id
  );

  if (!campaign) {
    return (
      <PageShell>
        <PageHeader
          eyebrow="Campaigns"
          title="Campaign Details"
          description="Campaign not found."
        />
      </PageShell>
    );
  }

  return (
    <PageShell>

      <PageHeader
        eyebrow="Campaigns"
        title={campaign.campaignName || campaign.name || "Untitled Campaign"}
      />

      <CampaignDetailsCard
        campaign={campaign}
        onDelete={() => setIsDeleteDialogOpen(true)}
        canManage={true}
        editPath={`/campaigns/edit/${campaign.id}`}
      />

      {isDeleteDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div role="dialog" aria-modal="true" aria-labelledby="delete-dialog-title" aria-describedby="delete-dialog-description" className="w-full max-w-md rounded-lg bg-white p-4 shadow-xl sm:p-6">
            <h2 id="delete-dialog-title" className="text-lg font-bold text-gray-900">Delete campaign?</h2>
            <p id="delete-dialog-description" className="mt-2 text-sm text-gray-600">
              Are you sure you want to delete <span className="font-bold">{campaign.campaignName || campaign.name || "this campaign"}</span>? This action cannot be undone.
            </p>
            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <Button variant="secondary" className="w-full sm:w-auto" onClick={() => setIsDeleteDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="danger"
                className="w-full sm:w-auto"
                onClick={() => {
                  deleteCampaign(campaign.id);
                  toast.success("Campaign deleted successfully.");
                  navigate("/campaigns");
                }}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}

    </PageShell>
  );
}
