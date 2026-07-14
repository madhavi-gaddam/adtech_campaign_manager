// src/features/campaigns/campaignAnalytics.js

export function getCampaignSummary(campaigns) {
  const totalCampaigns = campaigns.length

  const activeCampaigns = campaigns.filter(
    (campaign) => campaign.status === 'Active',
  ).length

  const pausedCampaigns = campaigns.filter(
    (campaign) => campaign.status === 'Paused',
  ).length

  const totalBudget = campaigns.reduce((total, campaign) => {
    return total + Number(campaign.budget || 0)
  }, 0)

  return {
    totalCampaigns,
    activeCampaigns,
    pausedCampaigns,
    totalBudget,
  }
}
