import { useContext, useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { CampaignContext } from "../context/CampaignContext";

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
  const [sortBy, setSortBy] = useState("newest");

  const filteredCampaigns = useMemo(() => {
    const filtered = campaigns.filter((campaign) => {
      const nameMatch = campaign.campaignName
        .toLowerCase()
        .includes(searchText.toLowerCase());
      const statusMatch =
        statusFilter === "All" || campaign.status === statusFilter;

      return nameMatch && statusMatch;
    });

    return [...filtered].sort((firstCampaign, secondCampaign) => {
      if (sortBy === "budgetHigh") {
        return secondCampaign.budget - firstCampaign.budget;
      }

      if (sortBy === "budgetLow") {
        return firstCampaign.budget - secondCampaign.budget;
      }

      if (sortBy === "name") {
        return firstCampaign.campaignName.localeCompare(
          secondCampaign.campaignName
        );
      }

      return String(secondCampaign.id).localeCompare(String(firstCampaign.id));
    });
  }, [campaigns, searchText, sortBy, statusFilter]);

  function handleDelete(id) {
    const shouldDelete = window.confirm("Delete this campaign?");

    if (shouldDelete) {
      deleteCampaign(id);
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

      <div className="grid gap-3 rounded-lg border border-gray-200 bg-white p-4 shadow-sm md:grid-cols-[1fr_180px_180px]">
        <Input
          value={searchText}
          placeholder="Search campaigns"
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
          value={sortBy}
          onChange={(event) => setSortBy(event.target.value)}
        >
          <option value="newest">Newest</option>
          <option value="name">Name</option>
          <option value="budgetHigh">Budget High</option>
          <option value="budgetLow">Budget Low</option>
        </SelectField>
      </div>

      <CampaignTable
        campaigns={filteredCampaigns}
        onDelete={handleDelete}
        onEdit={(id) => navigate(`/campaigns/edit/${id}`)}
        onToggleStatus={toggleCampaignStatus}
      />
    </PageShell>
  );
}
