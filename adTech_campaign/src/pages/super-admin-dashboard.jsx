import { Activity, Banknote, Megaphone, Trash2, Users } from "lucide-react";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { Button } from "../components/atoms/Button";
import { Input } from "../components/atoms/Input";
import { MetricCard } from "../components/atoms/MetricCard";
import { PageHeader } from "../components/molecules/PageHeader";
import { PageShell } from "../components/templates/PageShell";
import { AuthContext } from "../context/AuthContextValue";
import { CampaignContext } from "../context/CampaignContextValue";
import { getCampaignSummary } from "../features/campaigns/campaignAnalytics";
import { formatCurrency } from "../utils/formatCurrency";

export function SuperAdminDashboard() {
  const navigate = useNavigate();
  const { users, updateUserRole, deleteUser } = useContext(AuthContext);
  const { allCampaigns, deleteCampaignsByOwner } = useContext(CampaignContext);
  const [search, setSearch] = useState("");
  const [userToDelete, setUserToDelete] = useState(null);
  const summary = getCampaignSummary(allCampaigns);

  const campaignsByOwner = allCampaigns.reduce((result, campaign) => {
    result[campaign.ownerId] ??= { totalCampaigns: 0, totalBudget: 0 };
    result[campaign.ownerId].totalCampaigns += 1;
    result[campaign.ownerId].totalBudget += Number(campaign.budget || 0);
    return result;
  }, {});

  const visibleUsers = users.filter((user) => {
    const query = search.trim().toLowerCase();
    if (!query) return true;
    return `${user.name} ${user.email} ${user.role}`.toLowerCase().includes(query);
  });

  function openUserDetails(userId) {
    navigate(`/admin/users/${userId}`);
  }

  function handleUserRowKeyDown(event, userId) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openUserDetails(userId);
    }
  }

  function changeManagedRole(user, role) {
    if (updateUserRole(user.id, role)) {
      toast.success(`${user.name} is now ${role}.`);
    }
  }

  function removeManagedUser() {
    if (!userToDelete) return;
    if (deleteUser(userToDelete.id)) {
      deleteCampaignsByOwner(userToDelete.id);
      toast.success(`${userToDelete.name} was deleted.`);
    }
    setUserToDelete(null);
  }

  return (
    <PageShell>
      <PageHeader
        eyebrow="Super Admin"
        title="Super Admin Dashboard"
        description="Manage users, admins, campaigns, and dashboard analytics."
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        <MetricCard icon={<Megaphone size={21} aria-hidden="true" />} label="Total Campaigns" value={summary.totalCampaigns.toString()} />
        <MetricCard icon={<Activity size={21} aria-hidden="true" />} label="Active Campaigns" value={summary.activeCampaigns.toString()} />
        <MetricCard icon={<Activity size={21} aria-hidden="true" />} label="Paused Campaigns" value={summary.pausedCampaigns.toString()} />
        <MetricCard icon={<Banknote size={21} aria-hidden="true" />} label="Total Budget" value={formatCurrency(summary.totalBudget)} />
        <MetricCard icon={<Users size={21} aria-hidden="true" />} label="Total Users" value={users.length.toString()} />
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-3 shadow-sm sm:p-4">
        <Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search users by name, email, or role" aria-label="Search users" />
      </div>

      <section className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="grid gap-3 p-3 lg:hidden">
          {visibleUsers.map((user) => {
            const ownerSummary = campaignsByOwner[user.id] || { totalCampaigns: 0, totalBudget: 0 };

            return (
              <article
                key={user.id}
                role="button"
                tabIndex={0}
                aria-label={`View details for ${user.name}`}
                onClick={() => openUserDetails(user.id)}
                onKeyDown={(event) => handleUserRowKeyDown(event, user.id)}
                className="rounded-lg border border-gray-200 bg-gray-50 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h2 className="break-words text-base font-extrabold text-gray-900">{user.name}</h2>
                    <p className="mt-1 break-all text-sm text-gray-600">{user.email}</p>
                  </div>
                  <span className="shrink-0 rounded-md border border-blue-200 bg-blue-50 px-2 py-1 text-xs font-bold text-blue-700">
                    {user.role}
                  </span>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-3 border-t border-gray-200 pt-3">
                  <div>
                    <p className="text-xs font-bold uppercase text-gray-500">Total Campaigns</p>
                    <p className="mt-1 text-lg font-extrabold text-gray-900">{ownerSummary.totalCampaigns}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase text-gray-500">Total Budget</p>
                    <p className="mt-1 break-words text-lg font-extrabold text-gray-900">{formatCurrency(ownerSummary.totalBudget)}</p>
                  </div>
                </div>
                {user.role !== "Super Admin" && <div className="mt-3 grid grid-cols-[1fr_auto] gap-2">
                  <Button type="button" variant="secondary" className="min-h-9 px-3 py-1.5" onClick={(event) => { event.stopPropagation(); changeManagedRole(user, user.role === "User" ? "Admin" : "User"); }}>
                    {user.role === "User" ? "Promote" : "Demote"}
                  </Button>
                  <button type="button" aria-label={`Delete ${user.name}`} title="Delete user" onClick={(event) => { event.stopPropagation(); setUserToDelete(user); }} className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-rose-600 text-white transition hover:bg-rose-700"><Trash2 size={16} aria-hidden="true" /></button>
                </div>}
              </article>
            );
          })}
          {!visibleUsers.length && (
            <div className="rounded-lg border border-dashed border-gray-300 p-6 text-center text-sm font-medium text-gray-600">
              No users match your search.
            </div>
          )}
        </div>

        <div className="campaign-table-scroll hidden overflow-x-auto lg:block">
          <table className="w-full min-w-[760px] border-collapse text-left text-sm">
            <thead className="border-b border-gray-200 bg-gray-100 text-xs uppercase text-gray-500">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Total Campaigns</th>
                <th className="px-4 py-3">Total Budget</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {visibleUsers.map((user) => {
                const ownerSummary = campaignsByOwner[user.id] || { totalCampaigns: 0, totalBudget: 0 };

                return (
                  <tr key={user.id} role="button" tabIndex={0} aria-label={`View details for ${user.name}`} onClick={() => openUserDetails(user.id)} onKeyDown={(event) => handleUserRowKeyDown(event, user.id)} className="cursor-pointer border-b border-gray-200 last:border-0 hover:bg-gray-50 focus:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500">
                    <td className="px-4 py-4 font-bold text-gray-900">{user.name}</td>
                    <td className="px-4 py-4 text-gray-700">{user.email}</td>
                    <td className="px-4 py-4"><span className="inline-flex rounded-md border border-blue-200 bg-blue-50 px-2 py-1 text-xs font-bold text-blue-700">{user.role}</span></td>
                    <td className="px-4 py-4 font-semibold text-gray-900">{ownerSummary.totalCampaigns}</td>
                    <td className="px-4 py-4 font-semibold text-gray-900">{formatCurrency(ownerSummary.totalBudget)}</td>
                    <td className="px-4 py-4">
                      {user.role !== "Super Admin" ?
                      <div className="flex gap-2">
                        <Button type="button" variant="secondary" className="min-h-9 px-3 py-1.5" onClick={(event) => { event.stopPropagation(); changeManagedRole(user, user.role === "User" ? "Admin" : "User"); }}>
                          {user.role === "User" ? "Promote" : "Demote"}
                        </Button>
                        <button type="button" aria-label={`Delete ${user.name}`} title="Delete user" onClick={(event) => { event.stopPropagation(); setUserToDelete(user); }} className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-rose-600 text-white transition hover:bg-rose-700"><Trash2 size={16} aria-hidden="true" /></button>
                      </div> : <span className="text-xs font-semibold text-gray-500">Protected</span>}
                    </td>
                  </tr>
                );
              })}
              {!visibleUsers.length && (
                <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-600">No users match your search.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {userToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div role="dialog" aria-modal="true" className="w-full max-w-md rounded-lg bg-white p-4 shadow-xl sm:p-6">
            <h2 className="text-lg font-bold text-gray-900">Delete user?</h2>
            <p className="mt-2 text-sm text-gray-600">Delete <span className="font-bold">{userToDelete.name}</span>? Their campaigns will also be permanently removed.</p>
            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <Button variant="secondary" className="w-full sm:w-auto" onClick={() => setUserToDelete(null)}>Cancel</Button>
              <Button variant="danger" className="w-full sm:w-auto" onClick={removeManagedUser}>Delete User</Button>
            </div>
          </div>
        </div>
      )}
    </PageShell>
  );
}
