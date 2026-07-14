import { PageShell } from '../components/templates/PageShell'
import { PageHeader } from "../components/molecules/PageHeader";
import { CampaignForm } from "../components/organisms/CampaignForm";
import { useContext } from "react";
import { useParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContextValue";

export function CreateCampaign() {
  const { id, userId } = useParams();
  const { users, currentUser } = useContext(AuthContext);
  const isEditMode = Boolean(id);
  const isAdminCreate = Boolean(userId) && !isEditMode && ["Admin", "Super Admin"].includes(currentUser?.role);
  const selectedUser = isAdminCreate ? users.find((user) => user.id === userId) : null;

  return (
    <PageShell>
      <PageHeader
        title={isEditMode ? "Edit Campaign" : selectedUser ? `Create Campaign for ${selectedUser.name}` : "Create Campaign"}
      />

      <CampaignForm />
    </PageShell>
  );
}
