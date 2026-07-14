import { useCallback, useMemo, useState } from "react";
import { AuthContext } from "./AuthContextValue";

const usersKey = "adtech-users";
const sessionKey = "adtech-session";
const roles = ["User", "Admin", "Super Admin"];
const manageableRoles = ["User", "Admin"];

function readStorage(key, fallback) {
  try {
    const value = JSON.parse(localStorage.getItem(key));
    return value ?? fallback;
  } catch {
    return fallback;
  }
}

function createId() {
  return crypto.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function AuthProvider({ children }) {
  const [users, setUsers] = useState(() => readStorage(usersKey, []));
  const [currentUser, setCurrentUser] = useState(() => readStorage(sessionKey, null));

  const saveUsers = useCallback((nextUsers) => {
    localStorage.setItem(usersKey, JSON.stringify(nextUsers));
    setUsers(nextUsers);
  }, []);

  const login = useCallback(({ email, password, role }) => {
    const normalizedEmail = email.trim().toLowerCase();
    const existingUser = users.find((user) => user.email === normalizedEmail);
    if (!existingUser) {
      throw new Error("Account not found. Please sign up first.");
    }
    if (existingUser?.password && existingUser.password !== password) {
      throw new Error("Incorrect email or password.");
    }

    if (!existingUser.password) {
      const updatedUser = { ...existingUser, password };
      saveUsers(users.map((item) => item.id === existingUser.id ? updatedUser : item));
      localStorage.setItem(sessionKey, JSON.stringify(updatedUser));
      setCurrentUser(updatedUser);
      return updatedUser;
    }

    localStorage.setItem(sessionKey, JSON.stringify(existingUser));
    setCurrentUser(existingUser);
    return existingUser;
  }, [saveUsers, users]);

  const signup = useCallback(({ name, email, password, role }) => {
    const normalizedEmail = email.trim().toLowerCase();
    const hasSuperAdmin = users.some((user) => user.role === "Super Admin");

    if (!name.trim() || !/^\S+@\S+\.\S+$/.test(normalizedEmail) || password.length < 4) {
      throw new Error("Enter a name, valid email, and password of at least 4 characters.");
    }

    if (users.some((user) => user.email === normalizedEmail)) {
      throw new Error("A user with this email already exists. Please log in.");
    }

    const user = {
      id: createId(),
      name: name.trim(),
      email: normalizedEmail,
      password,
      role: role === "Super Admin" && hasSuperAdmin ? "User" : roles.includes(role) ? role : "User",
      createdAt: new Date().toISOString(),
    };

    saveUsers([...users, user]);
    localStorage.setItem(sessionKey, JSON.stringify(user));
    setCurrentUser(user);
    return user;
  }, [saveUsers, users]);

  const logout = useCallback(() => {
    localStorage.removeItem(sessionKey);
    setCurrentUser(null);
  }, []);

  const updateUserRole = useCallback((id, role) => {
    if (currentUser?.role !== "Super Admin" || !manageableRoles.includes(role)) return false;
    const targetUser = users.find((user) => user.id === id);
    if (!targetUser || targetUser.role === "Super Admin") return false;
    const nextUsers = users.map((user) => user.id === id ? { ...user, role } : user);
    saveUsers(nextUsers);
    return true;
  }, [currentUser?.role, saveUsers, users]);

  const createManagedUser = useCallback(({ name, email, password, role }) => {
    if (currentUser?.role !== "Super Admin" || !manageableRoles.includes(role)) return false;
    const normalizedEmail = email.trim().toLowerCase();
    if (!name.trim() || !/^\S+@\S+\.\S+$/.test(normalizedEmail) || password.length < 4) {
      throw new Error("Enter a name, valid email, and password of at least 4 characters.");
    }
    if (users.some((user) => user.email === normalizedEmail)) {
      throw new Error("A user with this email already exists.");
    }

    saveUsers([
      ...users,
      {
        id: createId(),
        name: name.trim(),
        email: normalizedEmail,
        password,
        role,
        createdAt: new Date().toISOString(),
      },
    ]);
    return true;
  }, [currentUser?.role, saveUsers, users]);

  const updateManagedUser = useCallback((id, updates) => {
    if (currentUser?.role !== "Super Admin") return false;
    const targetUser = users.find((user) => user.id === id);
    if (!targetUser || targetUser.role === "Super Admin" || !manageableRoles.includes(updates.role)) return false;

    const normalizedEmail = updates.email.trim().toLowerCase();
    if (!updates.name.trim() || !/^\S+@\S+\.\S+$/.test(normalizedEmail)) {
      throw new Error("Enter a name and valid email.");
    }
    if (updates.password && updates.password.length < 4) {
      throw new Error("Password must be at least 4 characters.");
    }
    if (users.some((user) => user.id !== id && user.email === normalizedEmail)) {
      throw new Error("A user with this email already exists.");
    }

    const nextUsers = users.map((user) => user.id === id ? {
      ...user,
      name: updates.name.trim(),
      email: normalizedEmail,
      role: updates.role,
      ...(updates.password ? { password: updates.password } : {}),
    } : user);
    saveUsers(nextUsers);
    if (currentUser?.id === id) {
      const nextCurrentUser = nextUsers.find((user) => user.id === id);
      localStorage.setItem(sessionKey, JSON.stringify(nextCurrentUser));
      setCurrentUser(nextCurrentUser);
    }
    return true;
  }, [currentUser?.id, currentUser?.role, saveUsers, users]);

  const deleteUser = useCallback((id) => {
    const targetUser = users.find((user) => user.id === id);
    if (id === currentUser?.id) return false;
    if (targetUser?.role === "Super Admin") return false;
    saveUsers(users.filter((user) => user.id !== id));
    return true;
  }, [currentUser?.id, saveUsers, users]);

  const value = useMemo(() => ({
    users,
    currentUser,
    login,
    signup,
    logout,
    createManagedUser,
    updateManagedUser,
    updateUserRole,
    deleteUser,
  }), [users, currentUser, login, signup, logout, createManagedUser, updateManagedUser, updateUserRole, deleteUser]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
