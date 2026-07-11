import { Activity, Banknote, Megaphone, Plus } from 'lucide-react'
import { useContext } from 'react'
import { Link } from 'react-router-dom'

import { Button } from '../components/atoms/Button'
import { MetricCard } from '../components/atoms/MetricCard'
import { PageHeader } from '../components/molecules/PageHeader'
import { PageShell } from '../components/templates/PageShell'
import { BudgetBarChart } from "../components/organisms/BudgetBarChart";
import { formatCurrency } from '../domain/campaign'
import { getCampaignSummary } from '../features/campaigns/campaignAnalytics'
import { CampaignContext } from '../context/CampaignContextValue'
import { PlatformPieChart } from "../components/organisms/PlatformPieChart";
export function DashboardPage() {
  const { campaigns } = useContext(CampaignContext)
  const summary = getCampaignSummary(campaigns)

  return (
    <PageShell rows="dashboard">
      <PageHeader
        eyebrow="Overview"
        title="Analytics Dashboard"
        description="View your campaign count, active campaigns, and total budget."
        actions={
          <>
            <Button as={Link} to="/campaigns/create">
              <Plus size={18} aria-hidden="true" />
              New Campaign
            </Button>
          </>
        }
      />

      <div className="grid gap-3 sm:grid-cols-3">
        <MetricCard
          icon={<Megaphone size={21} aria-hidden="true" />}
          label="Total Campaigns"
          value={summary.totalCampaigns.toString()}
        />

        <MetricCard
          icon={<Activity size={21} aria-hidden="true" />}
          label="Active Campaigns"
          value={summary.activeCampaigns.toString()}
        />

        <MetricCard
          icon={<Banknote size={21} aria-hidden="true" />}
          label="Total Budget"
          value={formatCurrency(summary.totalBudget)}
        />
      </div>

      <div className="grid min-h-0 grid-cols-1 gap-4 lg:grid-cols-2">
        <BudgetBarChart campaigns={campaigns} />
        <PlatformPieChart campaigns={campaigns} />
      </div>
    </PageShell>
  )
}
