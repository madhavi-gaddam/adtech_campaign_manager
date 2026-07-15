import { Pencil, Plus, Trash2 } from "lucide-react";
import { useContext, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import { Button } from "../components/atoms/Button";
import { PageHeader } from "../components/molecules/PageHeader";
import { PageShell } from "../components/templates/PageShell";
import { AuthContext } from "../context/AuthContextValue";
import { CampaignContext } from "../context/CampaignContextValue";
import { formatCurrency } from "../utils/formatCurrency";
import { formatDateTime } from "../utils/formatDateTime";

const statusClasses = {
  Active: "border-green-300 bg-green-100 text-green-800",
  Paused: "border-amber-300 bg-amber-100 text-amber-800",
  Completed: "border-blue-300 bg-blue-100 text-blue-800",
};

export function UserDetails() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { users } = useContext(AuthContext);
  const { allCampaigns, setCampaignStatusAsAdmin, deleteCampaignAsAdmin } = useContext(CampaignContext);
  const [campaignToDelete, setCampaignToDelete] = useState(null);

  const user = users.find((item) => item.id === userId);
  const userCampaigns = allCampaigns.filter((campaign) => campaign.ownerId === userId);

  function changeStatus(campaignId, status) {
    if (setCampaignStatusAsAdmin(campaignId, status)) {
      toast.success("Campaign status updated.");
      return;
    }

    toast.error("Only admins can update this campaign.");
  }

  function confirmDeleteCampaign() {
    if (!campaignToDelete) return;

    if (deleteCampaignAsAdmin(campaignToDelete.id)) {
      toast.success("Campaign deleted successfully.");
      setCampaignToDelete(null);
      return;
    }

    toast.error("Only admins can delete this campaign.");
  }

  if (!user) {
    return (
      <PageShell>
        <PageHeader
          eyebrow="Admin Workspace"
          title="User Not Found"
          description="The selected user could not be found in the current account list."
          actions={<Button as={Link} to="/admin" variant="secondary">Back to Admin</Button>}
        />
      </PageShell>
    );
  }

  return (
    <PageShell>
      <PageHeader
        title={`Campaigns created by ${user.name}`}
        actions={
          <>
            <Button as={Link} to={`/admin/users/${user.id}/campaigns/create`}>
              <Plus size={18} aria-hidden="true" />
              Create Campaign
            </Button>
            <Button as={Link} to="/admin" variant="secondary">Back to Admin</Button>
          </>
        }
      />

      <section className="grid gap-3 rounded-lg border border-gray-200 bg-white p-4 shadow-sm sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="text-xs font-bold uppercase text-gray-500">Name</p>
          <p className="mt-1 font-bold text-gray-900">{user.name}</p>
        </div>
        <div>
          <p className="text-xs font-bold uppercase text-gray-500">Email</p>
          <p className="mt-1 break-all font-medium text-gray-700">{user.email}</p>
        </div>
        <div>
          <p className="text-xs font-bold uppercase text-gray-500">Role</p>
          <p className="mt-1 font-bold text-gray-900">{user.role}</p>
        </div>
        <div>
          <p className="text-xs font-bold uppercase text-gray-500">Total Campaigns</p>
          <p className="mt-1 font-bold text-gray-900">{userCampaigns.length}</p>
        </div>
      </section>

      <section className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="grid gap-3 p-3 sm:hidden">
          {userCampaigns.map((campaign) => {
            const campaignName = campaign.campaignName || campaign.name || "Untitled Campaign";

            return (
              <article key={campaign.id} className="rounded-lg border border-gray-200 bg-gray-50 p-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-xs font-bold uppercase text-blue-700">#{campaign.id}</p>
                    <h2 className="mt-1 break-words text-base font-extrabold text-gray-900">{campaignName}</h2>
                    <p className="mt-1 text-sm text-gray-600">{campaign.platform} · {campaign.ageGroup || "All"}</p>
                  </div>
                  <p className="shrink-0 text-sm font-extrabold text-gray-900">{formatCurrency(campaign.budget)}</p>
                </div>
                <div className="mt-3 border-t border-gray-200 pt-3">
                  <label className="text-xs font-bold uppercase text-gray-500">
                    Status
                    <select
                      value={campaign.status}
                      aria-label={`Change status for ${campaignName}`}
                      onChange={(event) => changeStatus(campaign.id, event.target.value)}
                      className={`mt-1 w-full rounded-md border px-2 py-2 text-sm font-medium outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 ${statusClasses[campaign.status] || statusClasses.Active}`}
                    >
                      <option value="Active">Active</option>
                      <option value="Paused">Paused</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </label>
                </div>
                <div className="mt-3 flex items-center justify-between gap-3">
                  <p className="text-xs text-gray-500">Created {formatDateTime(campaign.createdAt)}</p>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      aria-label={`Edit ${campaignName}`}
                      title="Edit Campaign"
                      onClick={() => navigate(`/admin/users/${user.id}/campaigns/edit/${campaign.id}`)}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-indigo-100 text-gray-950 transition hover:bg-indigo-200"
                    >
                      <Pencil size={18} aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      aria-label={`Delete ${campaignName}`}
                      title="Delete Campaign"
                      onClick={() => setCampaignToDelete(campaign)}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-rose-600 text-white transition hover:bg-rose-700"
                    >
                      <Trash2 size={18} aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
          {!userCampaigns.length && (
            <div className="rounded-lg border border-dashed border-gray-300 p-6 text-center text-sm font-medium text-gray-600">
              This user has not created any campaigns yet.
            </div>
          )}
        </div>

        <div className="campaign-table-scroll hidden overflow-x-auto sm:block">
          <table className="w-full min-w-[1080px] border-collapse text-left text-sm">
            <thead className="border-b border-gray-200 bg-gray-100 text-xs uppercase text-gray-500">
              <tr>
                <th className="px-4 py-3">Campaign ID</th>
                <th className="px-4 py-3">Campaign Name</th>
                <th className="px-4 py-3">Platform</th>
                <th className="px-4 py-3">Age Group</th>
                <th className="px-4 py-3">Budget</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Created On</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {userCampaigns.map((campaign) => {
                const campaignName = campaign.campaignName || campaign.name || "Untitled Campaign";

                return (
                  <tr key={campaign.id} className="border-b border-gray-200 last:border-0 hover:bg-gray-50">
                    <td className="px-4 py-4 font-bold text-blue-900">{campaign.id}</td>
                    <td className="px-4 py-4 font-bold text-gray-900">{campaignName}</td>
                    <td className="px-4 py-4 text-gray-700">{campaign.platform}</td>
                    <td className="px-4 py-4 text-gray-700">{campaign.ageGroup || "All"}</td>
                    <td className="px-4 py-4 font-semibold text-gray-900">{formatCurrency(campaign.budget)}</td>
                    <td className="px-4 py-4">
                      <select
                        value={campaign.status}
                        aria-label={`Change status for ${campaignName}`}
                        onChange={(event) => changeStatus(campaign.id, event.target.value)}
                        className={`w-full min-w-32 rounded-md border px-2 py-2 text-sm font-medium outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 ${statusClasses[campaign.status] || statusClasses.Active}`}
                      >
                        <option value="Active">Active</option>
                        <option value="Paused">Paused</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </td>
                    <td className="px-4 py-4 text-gray-700">{formatDateTime(campaign.createdAt)}</td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          aria-label={`Edit ${campaignName}`}
                          title="Edit Campaign"
                          onClick={() => navigate(`/admin/users/${user.id}/campaigns/edit/${campaign.id}`)}
                          className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-indigo-100 text-gray-950 transition hover:bg-indigo-200"
                        >
                          <Pencil size={18} aria-hidden="true" />
                        </button>
                        <button
                          type="button"
                          aria-label={`Delete ${campaignName}`}
                          title="Delete Campaign"
                          onClick={() => setCampaignToDelete(campaign)}
                          className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-rose-600 text-white transition hover:bg-rose-700"
                        >
                          <Trash2 size={18} aria-hidden="true" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {!userCampaigns.length && (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-gray-600">
                    This user has not created any campaigns yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {campaignToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div role="dialog" aria-modal="true" aria-labelledby="admin-delete-dialog-title" aria-describedby="admin-delete-dialog-description" className="w-full max-w-md rounded-lg bg-white p-4 shadow-xl sm:p-6">
            <h2 id="admin-delete-dialog-title" className="text-lg font-bold text-gray-900">
              Delete campaign?
            </h2>
            <p id="admin-delete-dialog-description" className="mt-2 text-sm text-gray-600">
              Are you sure you want to delete{" "}
              <span className="font-bold">
                {campaignToDelete.campaignName || campaignToDelete.name || "this campaign"}
              </span>
              ? This action cannot be undone.
            </p>
            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <Button variant="secondary" className="w-full sm:w-auto" onClick={() => setCampaignToDelete(null)}>
                Cancel
              </Button>
              <Button variant="danger" className="w-full sm:w-auto" onClick={confirmDeleteCampaign}>
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </PageShell>
  );
}
