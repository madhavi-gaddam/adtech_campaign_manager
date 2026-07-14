import { Activity, Banknote, Megaphone, PauseCircle, Plus, Users } from 'lucide-react'
import { useContext } from 'react'
import { Link } from 'react-router-dom'

import { Button } from '../components/atoms/Button'
import { MetricCard } from '../components/atoms/MetricCard'
import { PageHeader } from '../components/molecules/PageHeader'
import { PageShell } from '../components/templates/PageShell'
import { BudgetBarChart } from "../components/organisms/BudgetBarChart";
import { formatCurrency } from '../utils/formatCurrency'
import { getCampaignSummary } from '../features/campaigns/campaignAnalytics'
import { CampaignContext } from '../context/CampaignContextValue'
import { PlatformPieChart } from "../components/organisms/PlatformPieChart";
import { AuthContext } from '../context/AuthContextValue'

export function DashboardPage() {
  const { currentUser, users } = useContext(AuthContext)
  const { campaigns, allCampaigns } = useContext(CampaignContext)
  const hasAdminAnalytics = currentUser?.role === 'Admin' || currentUser?.role === 'Super Admin'
  const dashboardCampaigns = hasAdminAnalytics ? allCampaigns : campaigns
  const summary = getCampaignSummary(dashboardCampaigns)

  return (
    <PageShell rows="dashboard">
      <PageHeader
        eyebrow="Overview"
        title={hasAdminAnalytics ? `${currentUser.role} Analytics Dashboard` : "Analytics Dashboard"}
        actions={
          <>
            <Button as={Link} to="/campaigns/create">
              <Plus size={18} aria-hidden="true" />
              New Campaign
            </Button>
          </>
        }
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
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
          icon={<PauseCircle size={21} aria-hidden="true" />}
          label="Paused Campaigns"
          value={summary.pausedCampaigns.toString()}
        />

        <MetricCard
          icon={<Banknote size={21} aria-hidden="true" />}
          label="Total Budget"
          value={formatCurrency(summary.totalBudget)}
        />

        {hasAdminAnalytics && (
          <MetricCard
            icon={<Users size={21} aria-hidden="true" />}
            label="Total Users"
            value={users.length.toString()}
          />
        )}
      </div>

      <div className="grid min-h-0 grid-cols-1 gap-4 lg:grid-cols-2">
        <BudgetBarChart campaigns={dashboardCampaigns} />
        <PlatformPieChart campaigns={dashboardCampaigns} />
      </div>
    </PageShell>
  )
}
