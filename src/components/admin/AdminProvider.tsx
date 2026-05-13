"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/supabase/supabase";
import { User } from "@supabase/supabase-js";
import { DeleteConfirmModal } from "./DeleteConfirmModal";

type DeleteConfig = {
  title: string;
  label?: string;
  onConfirm: () => void | Promise<void>;
} | null;

type AdminContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  logout: () => Promise<void>;
  confirmDelete: (config: DeleteConfig) => void;
};

const AdminContext = createContext<AdminContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  logout: async () => {},
  confirmDelete: () => {},
});

export const AdminProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteConfig, setDeleteConfig] = useState<DeleteConfig>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    // Check current session
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setIsLoading(false);
    };

    checkUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const handleConfirm = async () => {
    if (!deleteConfig) return;
    setIsDeleting(true);
    try {
      await deleteConfig.onConfirm();
      setDeleteConfig(null);
    } catch (err) {
      console.error(err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AdminContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        logout,
        confirmDelete: (config) => setDeleteConfig(config),
      }}
    >
      {children}
      <DeleteConfirmModal
        isOpen={!!deleteConfig}
        onClose={() => setDeleteConfig(null)}
        onConfirm={handleConfirm}
        title={deleteConfig?.title || "Confirm Deletion"}
        itemLabel={deleteConfig?.label}
        isLoading={isDeleting}
      />
    </AdminContext.Provider>
  );
};

export const useAuth = () => useContext(AdminContext);
