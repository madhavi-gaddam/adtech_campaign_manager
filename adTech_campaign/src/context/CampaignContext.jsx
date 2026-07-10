import { createContext, useEffect, useState } from "react";


export const CampaignContext = createContext();

const storageKey = "adtech-created-campaigns";

function getNextCampaignId(campaigns) {
  const lastNumber = campaigns.reduce((highestNumber, campaign) => {
    const idNumber = Number(String(campaign.id).replace("C", ""));
    return Number.isNaN(idNumber) ? highestNumber : Math.max(highestNumber, idNumber);
  }, 0);

  return `C${String(lastNumber + 1).padStart(3, "0")}`;
}

function normalizeCampaignIds(campaigns) {
  if (!Array.isArray(campaigns)) {
    return [];
  }

  return campaigns.map((campaign, index) => ({
    ...campaign,
    campaignName: campaign.campaignName || campaign.name || "Untitled Campaign",
    id: /^C\d{3}$/.test(String(campaign.id))
      ? campaign.id
      : `C${String(index + 1).padStart(3, "0")}`,
  }));
}

export function CampaignProvider({ children }) {
  const [campaigns, setCampaigns] = useState([]);

  useEffect(() => {
    const savedCampaigns = localStorage.getItem(storageKey);

    if (savedCampaigns) {
      try {
        const parsedCampaigns = JSON.parse(savedCampaigns);
        const normalizedCampaigns = normalizeCampaignIds(parsedCampaigns);

        setCampaigns(normalizedCampaigns);
        localStorage.setItem(storageKey, JSON.stringify(normalizedCampaigns));
      } catch {
        localStorage.removeItem(storageKey);
      }
    }
  }, []);

  function saveCampaigns(nextCampaigns) {
    setCampaigns(nextCampaigns);
    localStorage.setItem(storageKey, JSON.stringify(nextCampaigns));
  }

  function addCampaign(campaign) {
    const newCampaign = {
      ...campaign,
      id: getNextCampaignId(campaigns),
      status: "Active",
       createdAt: new Date().toISOString(),
    };

    saveCampaigns([...campaigns, newCampaign]);
  }

  function updateCampaign(id, updatedCampaign) {
    const updatedCampaigns = campaigns.map((campaign) =>
      campaign.id === id
        ? {
            ...campaign,
            ...updatedCampaign,
          }
        : campaign
    );

    saveCampaigns(updatedCampaigns);
  }

  function toggleCampaignStatus(id) {
    const updatedCampaigns = campaigns.map((campaign) =>
      campaign.id === id
        ? {
            ...campaign,
            status: campaign.status === "Active" ? "Paused" : "Active",
          }
        : campaign
    );

    saveCampaigns(updatedCampaigns);
  }

  
  function deleteCampaign(id) {
    const updatedCampaigns = campaigns.filter(
      (campaign) => campaign.id !== id
    );

    saveCampaigns(updatedCampaigns);
  }

  return (
    <CampaignContext.Provider
      value={{
        campaigns,
        addCampaign,
        updateCampaign,
        toggleCampaignStatus,
        deleteCampaign,
      }}
    >
      {children}
    </CampaignContext.Provider>
  );
}
