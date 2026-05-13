"use client";

import { useState, useEffect } from "react";
import { AdminModal, AdminModalContent, AdminModalHeader, AdminModalTitle, AdminModalDescription } from "./AdminModal";
import { PersonalForm } from "./forms/PersonalForm";
import { ProjectForm } from "./forms/ProjectForm";
import { ExperienceForm } from "./forms/ExperienceForm";
import { FocusForm } from "./forms/FocusForm";
import { NoteForm } from "./forms/NoteForm";
import { MetricForm } from "./forms/MetricForm";
import { TechStackForm } from "./forms/TechStackForm";
import { ExpertiseForm } from "./forms/ExpertiseForm";
import { EducationForm } from "./forms/EducationForm";
import { PhilosophyForm } from "./forms/PhilosophyForm";
import { LoginForm } from "./forms/LoginForm";
import { useAuth } from "./AdminProvider";

export type AdminView = "personal" | "project" | "experience" | "focus" | "note" | "metric" | "tech" | "expertise" | "education" | "philosophy" | "login";

export const AdminControls = () => {
  const [activeView, setActiveView] = useState<AdminView | null>(null);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    (window as any).openAdmin = (view: AdminView, item?: any) => {
      setActiveView(view);
      setSelectedItem(item || null);
    };
  }, []);

  const close = () => {
    setActiveView(null);
    setSelectedItem(null);
  };

  // If trying to access admin view but not authenticated, show login
  const currentView = (!isAuthenticated && activeView !== null) ? "login" : activeView;

  return (
    <AdminModal open={activeView !== null} onOpenChange={(open) => !open && close()}>
      <AdminModalContent>
        <AdminModalHeader>
          <AdminModalTitle>
            {currentView === "login" ? "Authentication" : `${selectedItem ? "Edit" : "Add"} ${activeView}`}
          </AdminModalTitle>
          <AdminModalDescription>
            {currentView === "login" 
              ? "Please sign in to access administrative controls." 
              : `Manage your portfolio ${activeView} details below.`}
          </AdminModalDescription>
        </AdminModalHeader>
        
        <div className="overflow-y-auto max-h-[80vh] no-scrollbar">
          {currentView === "login" && <LoginForm onSuccess={() => {}} />}
          {currentView === "personal" && <PersonalForm onClose={close} />}
          {currentView === "project" && <ProjectForm project={selectedItem} onClose={close} />}
          {currentView === "experience" && <ExperienceForm experience={selectedItem} onClose={close} />}
          {currentView === "focus" && <FocusForm area={selectedItem} onClose={close} />}
          {currentView === "note" && <NoteForm note={selectedItem} onClose={close} />}
          {currentView === "metric" && <MetricForm metric={selectedItem} onClose={close} />}
          {currentView === "tech" && <TechStackForm item={selectedItem} onClose={close} />}
          {currentView === "expertise" && <ExpertiseForm item={selectedItem} onClose={close} />}
          {currentView === "education" && <EducationForm education={selectedItem} onClose={close} />}
          {currentView === "philosophy" && <PhilosophyForm item={selectedItem} onClose={close} />}
        </div>
      </AdminModalContent>
    </AdminModal>
  );
};
