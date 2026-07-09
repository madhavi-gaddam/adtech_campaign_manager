import { NavLink } from "react-router-dom";

function Sidebar() {
  return (
    <aside className="w-64 border-r p-4">
      <nav className="flex flex-col gap-3">
        <NavLink to="/">Dashboard</NavLink>

        <NavLink to="/campaigns">
          Campaigns
        </NavLink>

        <NavLink to="/campaigns/new">
          Create Campaign
        </NavLink>

        <NavLink to="/analytics">
          Analytics
        </NavLink>

        <NavLink to="/settings">
          Settings
        </NavLink>
      </nav>
    </aside>
  );
}

export default Sidebar;