import { Route, Routes } from 'react-router-dom'

import { DashboardPage } from '../pages/Dashboard'
import Campaigns from '../pages/Campaigns'
import CreateCampaign from '../pages/CreateCampaign'
import NotFound from '../pages/NotFound'

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<DashboardPage />} />
      <Route path="/campaigns" element={<Campaigns />} />
      <Route path="/campaigns/new" element={<CreateCampaign />} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default AppRoutes
