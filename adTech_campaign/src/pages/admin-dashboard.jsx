import { Activity, Banknote, Megaphone, Plus, Users } from "lucide-react";
import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { Button } from "../components/atoms/Button";
import { Input } from "../components/atoms/Input";
import { MetricCard } from "../components/atoms/MetricCard";
import { PageHeader } from "../components/molecules/PageHeader";
import { PageShell } from "../components/templates/PageShell";
import { AuthContext } from "../context/AuthContextValue";
import { CampaignContext } from "../context/CampaignContextValue";
import { getCampaignSummary } from "../features/campaigns/campaignAnalytics";
import { formatCurrency } from "../utils/formatCurrency";

export function AdminDashboard() {
  const navigate = useNavigate();
  const { users } = useContext(AuthContext);
  const { allCampaigns } = useContext(CampaignContext);
  const [search, setSearch] = useState("");
  const summary = getCampaignSummary(allCampaigns);

  const campaignsByOwner = allCampaigns.reduce((result, campaign) => {
    result[campaign.ownerId] ??= [];
    result[campaign.ownerId].push(campaign);
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

  return (
    <PageShell>
      <PageHeader
        eyebrow="Admin"
        title="Admin Dashboard"
        description="Review users and manage campaigns across the workspace."
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
            const totalCampaigns = campaignsByOwner[user.id]?.length || 0;

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
                <div className="mt-3 flex items-center justify-between gap-3 border-t border-gray-200 pt-3">
                  <div>
                    <p className="text-xs font-bold uppercase text-gray-500">Total Campaigns</p>
                    <p className="mt-1 text-lg font-extrabold text-gray-900">{totalCampaigns}</p>
                  </div>
                  <Button as={Link} to={`/admin/users/${user.id}/campaigns/create`} onClick={(event) => event.stopPropagation()} className="min-h-9 px-3 py-1.5">
                    <Plus size={16} aria-hidden="true" />
                    Create
                  </Button>
                </div>
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
          <table className="w-full min-w-[900px] border-collapse text-left text-sm">
            <thead className="border-b border-gray-200 bg-gray-100 text-xs uppercase text-gray-500">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Total Campaigns</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {visibleUsers.map((user) => {
                const totalCampaigns = campaignsByOwner[user.id]?.length || 0;

                return (
                  <tr
                    key={user.id}
                    role="button"
                    tabIndex={0}
                    aria-label={`View details for ${user.name}`}
                    onClick={() => openUserDetails(user.id)}
                    onKeyDown={(event) => handleUserRowKeyDown(event, user.id)}
                    className="cursor-pointer border-b border-gray-200 last:border-0 hover:bg-gray-50 focus:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                  >
                    <td className="px-4 py-4 font-bold text-gray-900">{user.name}</td>
                    <td className="px-4 py-4 text-gray-700">{user.email}</td>
                    <td className="px-4 py-4">
                      <span className="inline-flex rounded-md border border-blue-200 bg-blue-50 px-2 py-1 text-xs font-bold text-blue-700">
                        {user.role}
                      </span>
                    </td>
                    <td className="px-4 py-4 font-semibold text-gray-900">{totalCampaigns}</td>
                    <td className="px-4 py-4">
                      <Button as={Link} to={`/admin/users/${user.id}/campaigns/create`} onClick={(event) => event.stopPropagation()} className="min-h-9 px-3 py-1.5">
                        <Plus size={16} aria-hidden="true" />
                        Create
                      </Button>
                    </td>
                  </tr>
                );
              })}
              {!visibleUsers.length && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-gray-600">
                    No users match your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </PageShell>
  );
}
