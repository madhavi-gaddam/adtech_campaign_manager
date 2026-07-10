import { useContext } from "react";
import { useParams } from "react-router-dom";

import { CampaignContext } from "../context/CampaignContext";

import { PageShell } from "../components/templates/PageShell";
import { PageHeader } from "../components/molecules/PageHeader";
import { CampaignDetailsCard } from "../components/organisms/CampaignDetailsCard";

export default function CampaignDetails() {
  const { id } = useParams();

  const { campaigns } = useContext(CampaignContext);

  const campaign = campaigns.find(
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
        description="View campaign information"
      />

      <CampaignDetailsCard
        campaign={campaign}
      />

    </PageShell>
  );
}
