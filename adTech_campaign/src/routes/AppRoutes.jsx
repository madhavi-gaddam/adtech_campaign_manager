import { Route, Routes } from 'react-router-dom'

import { DashboardPage } from '../pages/dashboard'
import Campaigns from '../pages/campaigns'
import {CreateCampaign} from '../pages/create-campaign';
import CampaignDetails from "../pages/campaign-details";
import NotFound from '../pages/not-found'
import Login from '../pages/login'
import Signup from '../pages/signup'
import { AdminDashboard } from '../pages/admin-dashboard'
import { SuperAdminDashboard } from '../pages/super-admin-dashboard'
import { UserDetails } from '../pages/user-details'
import { ProtectedRoute } from './protected-route'

function AppRoutes() {
  return (
    <Routes>
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/campaigns" element={<Campaigns />} />
        <Route path="/campaigns/create" element={<CreateCampaign />} />
        <Route path="/campaigns/:id" element={<CampaignDetails />}/>
        <Route path="/campaigns/edit/:id" element={<CreateCampaign />} />
      </Route>
      <Route element={<ProtectedRoute roles={["Admin", "Super Admin"]} />}>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/users/:userId" element={<UserDetails />} />
        <Route path="/admin/users/:userId/campaigns/create" element={<CreateCampaign />} />
        <Route path="/admin/users/:userId/campaigns/edit/:id" element={<CreateCampaign />} />
      </Route>
      <Route element={<ProtectedRoute roles={["Super Admin"]} />}>
        <Route path="/super-admin" element={<SuperAdminDashboard />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default AppRoutes;
