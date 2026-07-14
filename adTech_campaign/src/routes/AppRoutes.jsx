import { Route, Routes } from 'react-router-dom'

import { DashboardPage } from '../pages/Dashboard'
import Campaigns from '../pages/Campaigns'
import {CreateCampaign} from '../pages/CreateCampaign';
import CampaignDetails from "../pages/CampaignDetails";
import NotFound from '../pages/NotFound'
import Login from '../pages/Login'
import Signup from '../pages/Signup'
import { AdminDashboard } from '../pages/AdminDashboard'
import { SuperAdminDashboard } from '../pages/SuperAdminDashboard'
import { UserDetails } from '../pages/UserDetails'
import { UserControl } from '../pages/UserControl'
import { RequireAuth } from '../components/auth/RequireAuth'

function AppRoutes() {
  return (
    <Routes>
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<RequireAuth><DashboardPage /></RequireAuth>} />
      <Route path="/campaigns" element={<RequireAuth><Campaigns /></RequireAuth>} />
      <Route path="/campaigns/create" element={<RequireAuth><CreateCampaign /></RequireAuth>} />
      <Route path="/campaigns/:id" element={<RequireAuth><CampaignDetails /></RequireAuth>}/>
      <Route path="/campaigns/edit/:id" element={<RequireAuth><CreateCampaign /></RequireAuth>} />
      <Route path="/admin" element={<RequireAuth roles={["Admin", "Super Admin"]}><AdminDashboard /></RequireAuth>} />
      <Route path="/admin/users/:userId" element={<RequireAuth roles={["Admin", "Super Admin"]}><UserDetails /></RequireAuth>} />
      <Route path="/admin/users/:userId/campaigns/create" element={<RequireAuth roles={["Admin", "Super Admin"]}><CreateCampaign /></RequireAuth>} />
      <Route path="/admin/users/:userId/campaigns/edit/:id" element={<RequireAuth roles={["Admin", "Super Admin"]}><CreateCampaign /></RequireAuth>} />
      <Route path="/super-admin" element={<RequireAuth roles={["Super Admin"]}><SuperAdminDashboard /></RequireAuth>} />
      <Route path="/user-control" element={<RequireAuth roles={["Super Admin"]}><UserControl /></RequireAuth>} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default AppRoutes;
