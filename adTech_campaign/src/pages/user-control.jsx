import { Trash2 } from "lucide-react";
import { useContext, useMemo, useState } from "react";
import { toast } from "react-toastify";

import { Button } from "../components/atoms/Button";
import { Input } from "../components/atoms/Input";
import { PageHeader } from "../components/molecules/PageHeader";
import { PageShell } from "../components/templates/PageShell";
import { AuthContext } from "../context/AuthContextValue";
import { CampaignContext } from "../context/CampaignContextValue";

export function UserControl() {
  const { users, updateUserRole, deleteUser } = useContext(AuthContext);
  const { deleteCampaignsByOwner } = useContext(CampaignContext);
  const [search, setSearch] = useState("");
  const [userToDelete, setUserToDelete] = useState(null);

  const visibleUsers = useMemo(() => users.filter((user) => {
    if (user.role === "Super Admin") return false;
    const query = search.trim().toLowerCase();
    if (!query) return true;
    return `${user.name} ${user.email} ${user.role}`.toLowerCase().includes(query);
  }), [search, users]);

  function changeManagedRole(user, role) {
    if (updateUserRole(user.id, role)) {
      toast.success(`${user.name} is now ${role}.`);
      return;
    }
    toast.error("Super Admin details cannot be changed.");
  }

  function removeManagedUser() {
    if (!userToDelete) return;
    const user = userToDelete;
    if (deleteUser(user.id)) {
      deleteCampaignsByOwner(user.id);
      toast.success(`${user.name} was deleted.`);
      setUserToDelete(null);
      return;
    }
    toast.error("You cannot delete yourself or a Super Admin account.");
    setUserToDelete(null);
  }

  return (
    <PageShell>
      <PageHeader
        eyebrow="Super Admin"
        title="User Control"
        description="Promote, demote, and delete user or admin accounts."
      />

      <section className="grid gap-3 rounded-lg border border-gray-200 bg-white p-3 shadow-sm sm:p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search users by name, email, or role" aria-label="Search users" className="sm:max-w-md" />
        </div>
      </section>

      <section className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="grid gap-3 p-3 sm:hidden">
          {visibleUsers.map((user) => (
            <article key={user.id} className="rounded-lg border border-gray-200 bg-gray-50 p-3">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h2 className="break-words text-base font-extrabold text-gray-900">{user.name}</h2>
                  <p className="mt-1 break-all text-sm text-gray-600">{user.email}</p>
                </div>
                <span className="shrink-0 rounded-md border border-blue-200 bg-blue-50 px-2 py-1 text-xs font-bold text-blue-700">
                  {user.role}
                </span>
              </div>
              <div className="mt-3 grid grid-cols-[1fr_auto] gap-2 border-t border-gray-200 pt-3">
                {user.role === "User" ? (
                  <Button type="button" variant="secondary" className="min-h-9 px-3 py-1.5" onClick={() => changeManagedRole(user, "Admin")}>Promote</Button>
                ) : (
                  <Button type="button" variant="secondary" className="min-h-9 px-3 py-1.5" onClick={() => changeManagedRole(user, "User")}>Demote</Button>
                )}
                <button type="button" aria-label={`Delete ${user.name}`} title="Delete account" onClick={() => setUserToDelete(user)} className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-rose-600 text-white transition hover:bg-rose-700">
                  <Trash2 size={16} aria-hidden="true" />
                </button>
              </div>
            </article>
          ))}
          {!visibleUsers.length && (
            <div className="rounded-lg border border-dashed border-gray-300 p-6 text-center text-sm font-medium text-gray-600">
              No users match your search.
            </div>
          )}
        </div>

        <div className="campaign-table-scroll hidden overflow-x-auto sm:block">
          <table className="w-full min-w-[760px] border-collapse text-left text-sm">
            <thead className="border-b border-gray-200 bg-gray-100 text-xs uppercase text-gray-500">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {visibleUsers.map((user) => (
                <tr key={user.id} className="border-b border-gray-200 last:border-0 hover:bg-gray-50">
                  <td className="px-4 py-4 font-bold text-gray-900">{user.name}</td>
                  <td className="px-4 py-4 text-gray-700">{user.email}</td>
                  <td className="px-4 py-4"><span className="inline-flex rounded-md border border-blue-200 bg-blue-50 px-2 py-1 text-xs font-bold text-blue-700">{user.role}</span></td>
                  <td className="px-4 py-4">
                    <div className="flex flex-wrap gap-2">
                      {user.role === "User" ? (
                        <Button type="button" variant="secondary" className="min-h-9 px-3 py-1.5" onClick={() => changeManagedRole(user, "Admin")}>Promote</Button>
                      ) : (
                        <Button type="button" variant="secondary" className="min-h-9 px-3 py-1.5" onClick={() => changeManagedRole(user, "User")}>Demote</Button>
                      )}
                      <button type="button" aria-label={`Delete ${user.name}`} title="Delete account" onClick={() => setUserToDelete(user)} className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-rose-600 text-white transition hover:bg-rose-700">
                        <Trash2 size={16} aria-hidden="true" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {!visibleUsers.length && (
                <tr><td colSpan={4} className="px-4 py-8 text-center text-gray-600">No users match your search.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {userToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div role="dialog" aria-modal="true" aria-labelledby="delete-user-dialog-title" aria-describedby="delete-user-dialog-description" className="w-full max-w-md rounded-lg bg-white p-4 shadow-xl sm:p-6">
            <h2 id="delete-user-dialog-title" className="text-lg font-bold text-gray-900">Delete user?</h2>
            <p id="delete-user-dialog-description" className="mt-2 text-sm text-gray-600">
              Delete <span className="font-bold">{userToDelete.name}</span>? Their campaigns will also be permanently removed.
            </p>
            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <Button variant="secondary" className="w-full sm:w-auto" onClick={() => setUserToDelete(null)}>Cancel</Button>
              <Button variant="danger" className="w-full sm:w-auto" onClick={removeManagedUser}>Delete User</Button>
            </div>
          </div>
        </div>
      )}
    </PageShell>
  );
}
