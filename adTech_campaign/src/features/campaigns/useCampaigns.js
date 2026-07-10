// src/features/campaigns/useCampaigns.js

import { useEffect, useState } from 'react'

const storageKey = 'adtech-campaigns'

const sampleCampaigns = [
  {
    id: '1',
    name: 'Summer Sale Awareness',
    platform: 'Facebook',
    status: 'Active',
    ageGroup: '18-24',
    budget: 12000,
  },
  {
    id: '2',
    name: 'Retargeting Campaign',
    platform: 'Google Ads',
    status: 'Paused',
    ageGroup: '25-34',
    budget: 8500,
  },
  {
    id: '3',
    name: 'Brand Launch',
    platform: 'Instagram',
    status: 'Active',
    ageGroup: '35-44',
    budget: 15000,
  },
]

export function useCampaigns() {
  const [campaigns, setCampaigns] = useState([])

  useEffect(() => {
    const savedCampaigns = localStorage.getItem(storageKey)

    if (savedCampaigns) {
      setCampaigns(JSON.parse(savedCampaigns))
    }
  }, [])

  const saveCampaigns = (nextCampaigns) => {
    setCampaigns(nextCampaigns)
    localStorage.setItem(storageKey, JSON.stringify(nextCampaigns))
  }

  const loadSampleCampaigns = () => {
    saveCampaigns(sampleCampaigns)
  }

  return {
    campaigns,
    loadSampleCampaigns,
  }
}