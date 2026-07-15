import { useState } from "react";
import { AuthContext } from "./AuthContextValue";

const usersKey = "adtech-users";
const sessionKey = "adtech-session";
const roles = ["User", "Admin", "Super Admin"];
const manageableRoles = ["User", "Admin"];

const defaultSuperAdmin = {
  id: "default-super-admin",
  name: "Madhavi",
  email: "superadmin@gmail.com",
  password: "12345",
  role: "Super Admin",
};

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

function ensureSingleSuperAdmin(users) {
  let hasSuperAdmin = false;
  return users.map((user) => {
    if (user.role !== "Super Admin") return user;
    if (!hasSuperAdmin) {
      hasSuperAdmin = true;
      return user;
    }
    return { ...user, role: "User" };
  });
}

export function AuthProvider({ children }) {
  const [users, setUsers] = useState(() => {
    const storedUsers = readStorage(usersKey, []);
    const savedUsers = storedUsers.length ? storedUsers : [{
      ...defaultSuperAdmin,
      createdAt: new Date().toISOString(),
    }];
    const normalizedUsers = ensureSingleSuperAdmin(savedUsers);
    if (JSON.stringify(storedUsers) !== JSON.stringify(normalizedUsers)) {
      localStorage.setItem(usersKey, JSON.stringify(normalizedUsers));
    }
    return normalizedUsers;
  });
  const [currentUser, setCurrentUser] = useState(() => {
    const savedSession = readStorage(sessionKey, null);
    return users.find((user) => user.id === savedSession?.id) || null;
  });

  function saveUsers(nextUsers) {
    const normalizedUsers = ensureSingleSuperAdmin(nextUsers);
    localStorage.setItem(usersKey, JSON.stringify(normalizedUsers));
    setUsers(normalizedUsers);
  }

  function login({ email, password }) {
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
  }

  function signup({ name, email, password, role }) {
    const normalizedEmail = email.trim().toLowerCase();
    const latestUsers = ensureSingleSuperAdmin(readStorage(usersKey, users));
    const hasSuperAdmin = latestUsers.some((user) => user.role === "Super Admin");

    if (!name.trim() || !/^\S+@\S+\.\S+$/.test(normalizedEmail) || password.length < 4) {
      throw new Error("Enter a name, valid email, and password of at least 4 characters.");
    }

    if (latestUsers.some((user) => user.email === normalizedEmail)) {
      throw new Error("A user with this email already exists. Please log in.");
    }
    if (role === "Super Admin" && hasSuperAdmin) {
      throw new Error("Only one Super Admin account is allowed.");
    }

    const user = {
      id: createId(),
      name: name.trim(),
      email: normalizedEmail,
      password,
      role: roles.includes(role) ? role : "User",
      createdAt: new Date().toISOString(),
    };

    saveUsers([...latestUsers, user]);
    localStorage.setItem(sessionKey, JSON.stringify(user));
    setCurrentUser(user);
    return user;
  }

  function logout() {
    localStorage.removeItem(sessionKey);
    setCurrentUser(null);
  }

  function updateUserRole(id, role) {
    if (currentUser?.role !== "Super Admin" || !manageableRoles.includes(role)) return false;
    const targetUser = users.find((user) => user.id === id);
    if (!targetUser || targetUser.role === "Super Admin") return false;
    const nextUsers = users.map((user) => user.id === id ? { ...user, role } : user);
    saveUsers(nextUsers);
    return true;
  }

  function createManagedUser({ name, email, password, role }) {
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
  }

  function updateManagedUser(id, updates) {
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
  }

  function deleteUser(id) {
    const targetUser = users.find((user) => user.id === id);
    if (id === currentUser?.id) return false;
    if (targetUser?.role === "Super Admin") return false;
    saveUsers(users.filter((user) => user.id !== id));
    return true;
  }

  const value = {
    users,
    currentUser,
    login,
    signup,
    logout,
    createManagedUser,
    updateManagedUser,
    updateUserRole,
    deleteUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
