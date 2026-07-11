import { useContext, useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { CampaignContext } from "../context/CampaignContextValue";

import { Button } from "../components/atoms/Button";
import { Input } from "../components/atoms/Input";
import { SelectField } from "../components/atoms/SelectField";
import { CampaignTable } from "../components/organisms/CampaignTable";
import { PageHeader } from "../components/molecules/PageHeader";
import { PageShell } from "../components/templates/PageShell";

export default function Campaigns() {
  const { campaigns, deleteCampaign, toggleCampaignStatus } =
    useContext(CampaignContext);
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [ageFilter, setAgeFilter] = useState("__all");
  const [platformFilter, setPlatformFilter] = useState("All");
  const [budgetSort, setBudgetSort] = useState("newest");
  const [campaignToDelete, setCampaignToDelete] = useState(null);
  const ageGroups = [...new Set(campaigns.map((campaign) => campaign.ageGroup).filter(Boolean))];
  const platforms = [...new Set(campaigns.map((campaign) => campaign.platform).filter(Boolean))];

  const filteredCampaigns = useMemo(() => {
    const filtered = campaigns.filter((campaign) => {
      const campaignName = campaign.campaignName || campaign.name || "";
      const nameMatch = campaignName
        .toLowerCase()
        .includes(searchText.toLowerCase());
      const idMatch = String(campaign.id || "")
        .toLowerCase()
        .includes(searchText.toLowerCase());
      const statusMatch =
        statusFilter === "All" || campaign.status === statusFilter;
      const ageMatch =
        ageFilter === "__all" || campaign.ageGroup === ageFilter;
      const platformMatch =
        platformFilter === "All" || campaign.platform === platformFilter;

      return (nameMatch || idMatch) && statusMatch && ageMatch && platformMatch;
    });

    return [...filtered].sort((firstCampaign, secondCampaign) => {
      if (budgetSort === "budgetHigh") {
        return secondCampaign.budget - firstCampaign.budget;
      }

      if (budgetSort === "budgetLow") {
        return firstCampaign.budget - secondCampaign.budget;
      }

      return String(secondCampaign.id).localeCompare(String(firstCampaign.id));
    });
  }, [ageFilter, budgetSort, campaigns, platformFilter, searchText, statusFilter]);

  function handleDelete(id) {
    const selectedCampaign = campaigns.find((campaign) => campaign.id === id);
    setCampaignToDelete(selectedCampaign);
  }

  function confirmDelete() {
    if (!campaignToDelete) {
      return;
    }

    try {
      deleteCampaign(campaignToDelete.id);
      toast.error("Campaign deleted successfully.");
      setCampaignToDelete(null);
    } catch {
      toast.error("Unable to delete campaign.");
    }
  }

  return (
    <PageShell>
      <PageHeader
        eyebrow="Campaigns"
        title="Campaign List"
        description="View all created campaigns."
        actions={
          <Button as={Link} to="/campaigns/create">
            <Plus size={18} aria-hidden="true" />
            Create
          </Button>
        }
      />

      <div className="grid gap-3 rounded-lg border border-gray-200 bg-white p-4 shadow-sm sm:grid-cols-2 xl:grid-cols-[minmax(240px,1fr)_160px_160px_180px_190px]">
        <Input
          value={searchText}
          placeholder="Search by campaign ID or name"
          aria-label="Search campaigns by ID or name"
          onChange={(event) => setSearchText(event.target.value)}
        />

        <SelectField
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
        >
          <option value="All">All Status</option>
          <option value="Active">Active</option>
          <option value="Paused">Paused</option>
        </SelectField>

        <SelectField
          value={ageFilter}
          onChange={(event) => setAgeFilter(event.target.value)}
        >
          <option value="__all">All Ages</option>
          {ageGroups.map((age) => <option key={age} value={age}>{age}</option>)}
        </SelectField>

        <SelectField
          value={platformFilter}
          onChange={(event) => setPlatformFilter(event.target.value)}
        >
          <option value="All">All Platforms</option>
          {platforms.map((platform) => <option key={platform} value={platform}>{platform}</option>)}
        </SelectField>

        <SelectField
          value={budgetSort}
          onChange={(event) => setBudgetSort(event.target.value)}
        >
          <option value="newest">Newest First</option>
          <option value="budgetLow">Budget: Low to High</option>
          <option value="budgetHigh">Budget: High to Low</option>
        </SelectField>
      </div>

      <CampaignTable
        campaigns={filteredCampaigns}
        onDelete={handleDelete}
        onEdit={(id) => navigate(`/campaigns/edit/${id}`)}
        onToggleStatus={toggleCampaignStatus}
      />
      {campaignToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            <h2 className="text-lg font-bold text-gray-900">
              Delete campaign?
            </h2>

            <p className="mt-2 text-sm text-gray-600">
              Are you sure you want to delete{" "}
              <span className="font-bold">
                {campaignToDelete.campaignName ||
                  campaignToDelete.name ||
                  "this campaign"}
              </span>
              ? This action cannot be undone.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <Button
                variant="secondary"
                onClick={() => setCampaignToDelete(null)}
              >
                Cancel
              </Button>

              <Button variant="danger" onClick={confirmDelete}>
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </PageShell>
  );
}
