import { useContext, useState } from "react";
import { CampaignContext } from "./CampaignContextValue";
import { AuthContext } from "./AuthContextValue";

const storageKey = "adtech-created-campaigns";

function createCampaignId(usedIds = new Set()) {
  const highestNumber = [...usedIds].reduce((highest, id) => {
    const value = Number(id);
    return Number.isInteger(value) && value > 0 ? Math.max(highest, value) : highest;
  }, 0);

  return String(highestNumber + 1);
}

function normalizeCampaigns(value) {
  if (!Array.isArray(value)) return [];

  const usedIds = new Set();
  return value.map((campaign) => {
    const budget = Number(campaign.budget);
    const storedId = String(campaign.id || "").toUpperCase();
    const id = /^[1-9]\d*$/.test(storedId) && !usedIds.has(storedId)
      ? storedId
      : createCampaignId(usedIds);
    usedIds.add(id);
    return {
      ...campaign,
      id,
      campaignName: String(campaign.campaignName || campaign.name || "Untitled Campaign").trim(),
      budget: Number.isFinite(budget) && budget >= 0 ? budget : 0,
      status: ["Active", "Paused", "Completed"].includes(campaign.status) ? campaign.status : "Active",
    };
  });
}

function loadStoredCampaigns() {
  try {
    const savedCampaigns = localStorage.getItem(storageKey);
    if (!savedCampaigns) return [];

    const campaigns = normalizeCampaigns(JSON.parse(savedCampaigns));
    localStorage.setItem(storageKey, JSON.stringify(campaigns));
    return campaigns;
  } catch {
    return [];
  }
}

export function CampaignProvider({ children }) {
  const [allCampaigns, setAllCampaigns] = useState(loadStoredCampaigns);
  const { currentUser } = useContext(AuthContext);

  function canAdminManageCampaign(campaign) {
    return currentUser?.role === "Super Admin" ||
      (currentUser?.role === "Admin" && campaign?.createdById === currentUser.id);
  }

  function saveCampaigns(nextCampaigns) {
    try {
      localStorage.setItem(storageKey, JSON.stringify(nextCampaigns));
      setAllCampaigns(nextCampaigns);
    } catch {
      throw new Error("Campaigns could not be saved. Browser storage may be unavailable or full.");
    }
  }

  function addCampaign(campaign) {
    const now = new Date().toISOString();
    saveCampaigns([
      ...allCampaigns,
      { ...campaign, id: createCampaignId(new Set(allCampaigns.map((item) => item.id))), ownerId: currentUser?.id, ownerName: currentUser?.name, createdById: currentUser?.id, createdByName: currentUser?.name, status: "Active", createdAt: now, updatedAt: now },
    ]);
  }

  function addCampaignAsAdmin(owner, campaign) {
    if (!["Admin", "Super Admin"].includes(currentUser?.role) || !owner?.id) return false;

    const now = new Date().toISOString();
    saveCampaigns([
      ...allCampaigns,
      {
        ...campaign,
        id: createCampaignId(new Set(allCampaigns.map((item) => item.id))),
        ownerId: owner.id,
        ownerName: owner.name,
        createdById: currentUser.id,
        createdByName: currentUser.name,
        status: "Active",
        createdAt: now,
        updatedAt: now,
      },
    ]);
    return true;
  }

  function updateCampaign(id, updatedCampaign) {
    saveCampaigns(allCampaigns.map((campaign) =>
      campaign.id === id && campaign.ownerId === currentUser?.id
        ? { ...campaign, ...updatedCampaign, updatedAt: new Date().toISOString() }
        : campaign
    ));
  }

  function setCampaignStatus(id, status) {
    saveCampaigns(allCampaigns.map((campaign) =>
      campaign.id === id && campaign.ownerId === currentUser?.id
        ? {
            ...campaign,
            status: ["Active", "Paused", "Completed"].includes(status) ? status : campaign.status,
            updatedAt: new Date().toISOString(),
          }
        : campaign
    ));
  }

  function updateCampaignAsAdmin(id, updatedCampaign) {
    const campaignToUpdate = allCampaigns.find((campaign) => campaign.id === id);
    if (!canAdminManageCampaign(campaignToUpdate)) return false;
    saveCampaigns(allCampaigns.map((campaign) =>
      campaign.id === id
        ? { ...campaign, ...updatedCampaign, updatedAt: new Date().toISOString() }
        : campaign
    ));
    return true;
  }

  function setCampaignStatusAsAdmin(id, status) {
    const campaignToUpdate = allCampaigns.find((campaign) => campaign.id === id);
    if (!canAdminManageCampaign(campaignToUpdate)) return false;
    saveCampaigns(allCampaigns.map((campaign) =>
      campaign.id === id
        ? {
            ...campaign,
            status: ["Active", "Paused", "Completed"].includes(status) ? status : campaign.status,
            updatedAt: new Date().toISOString(),
          }
        : campaign
    ));
    return true;
  }

  function deleteCampaign(id) {
    saveCampaigns(allCampaigns.filter((campaign) => !(campaign.id === id && campaign.ownerId === currentUser?.id)));
  }

  function deleteCampaignAsAdmin(id) {
    const campaignToDelete = allCampaigns.find((campaign) => campaign.id === id);
    if (!canAdminManageCampaign(campaignToDelete)) return false;
    saveCampaigns(allCampaigns.filter((campaign) => campaign.id !== id));
    return true;
  }

  function deleteCampaignsByOwner(ownerId) {
    if (currentUser?.role !== "Super Admin") return;
    saveCampaigns(allCampaigns.filter((campaign) => campaign.ownerId !== ownerId));
  }

  const campaigns = currentUser
    ? allCampaigns.filter((campaign) => campaign.ownerId === currentUser.id)
    : [];

  const value = {
    campaigns,
    allCampaigns,
    addCampaign,
    addCampaignAsAdmin,
    updateCampaign,
    setCampaignStatus,
    updateCampaignAsAdmin,
    setCampaignStatusAsAdmin,
    deleteCampaign,
    deleteCampaignAsAdmin,
    deleteCampaignsByOwner,
  };

  return <CampaignContext.Provider value={value}>{children}</CampaignContext.Provider>;
}
