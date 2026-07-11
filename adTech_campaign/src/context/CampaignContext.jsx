import { useCallback, useMemo, useState } from "react";
import { CampaignContext } from "./CampaignContextValue";

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
      status: campaign.status === "Paused" ? "Paused" : "Active",
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
  const [campaigns, setCampaigns] = useState(loadStoredCampaigns);

  const saveCampaigns = useCallback((nextCampaigns) => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(nextCampaigns));
      setCampaigns(nextCampaigns);
    } catch {
      throw new Error("Campaigns could not be saved. Browser storage may be unavailable or full.");
    }
  }, []);

  const addCampaign = useCallback((campaign) => {
    const now = new Date().toISOString();
    saveCampaigns([
      ...campaigns,
      { ...campaign, id: createCampaignId(new Set(campaigns.map((item) => item.id))), status: "Active", createdAt: now, updatedAt: now },
    ]);
  }, [campaigns, saveCampaigns]);

  const updateCampaign = useCallback((id, updatedCampaign) => {
    saveCampaigns(campaigns.map((campaign) =>
      campaign.id === id
        ? { ...campaign, ...updatedCampaign, updatedAt: new Date().toISOString() }
        : campaign
    ));
  }, [campaigns, saveCampaigns]);

  const toggleCampaignStatus = useCallback((id) => {
    saveCampaigns(campaigns.map((campaign) =>
      campaign.id === id
        ? {
            ...campaign,
            status: campaign.status === "Active" ? "Paused" : "Active",
            updatedAt: new Date().toISOString(),
          }
        : campaign
    ));
  }, [campaigns, saveCampaigns]);

  const deleteCampaign = useCallback((id) => {
    saveCampaigns(campaigns.filter((campaign) => campaign.id !== id));
  }, [campaigns, saveCampaigns]);

  const value = useMemo(() => ({
    campaigns,
    addCampaign,
    updateCampaign,
    toggleCampaignStatus,
    deleteCampaign,
  }), [campaigns, addCampaign, updateCampaign, toggleCampaignStatus, deleteCampaign]);

  return <CampaignContext.Provider value={value}>{children}</CampaignContext.Provider>;
}
