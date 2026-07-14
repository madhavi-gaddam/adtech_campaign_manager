import { PageShell } from '../components/templates/PageShell'
import { PageHeader } from "../components/molecules/PageHeader";
import { CampaignForm } from "../components/organisms/CampaignForm";
import { useParams } from "react-router-dom";

export function CreateCampaign() {
  const { id } = useParams();
  const isEditMode = Boolean(id);

  return (
    <PageShell>
      <PageHeader
        title={isEditMode ? "Edit Campaign" : "Create Campaign"}
      />

      <CampaignForm />
    </PageShell>
  );
}
