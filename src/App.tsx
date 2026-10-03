import React, { useState, useEffect } from 'react';
import { Persona, UserRole } from './types';
import { store } from './services/store';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { ProviderDashboard } from './components/ProviderDashboard';
import { NgoDashboard } from './components/NgoDashboard';
import { VolunteerDashboard } from './components/VolunteerDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { N8nWorkflowViewer } from './components/N8nWorkflowViewer';
import { AuthModal } from './components/AuthModal';

export const App: React.FC = () => {
  const [currentPersona, setCurrentPersona] = useState<Persona>('landing');
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Store data with live subscription
  const [donations, setDonations] = useState(store.getDonations());
  const [organizations, setOrganizations] = useState(store.getOrganizations());
  const [volunteer, setVolunteer] = useState(store.getVolunteer());
  const [automationLogs, setAutomationLogs] = useState(store.getAutomationLogs());

  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      setDonations(store.getDonations());
      setOrganizations(store.getOrganizations());
      setVolunteer(store.getVolunteer());
      setAutomationLogs(store.getAutomationLogs());
    });
    return () => unsubscribe();
  }, []);

  const urgentCount = donations.filter(d => 
    (d.status === 'OPEN' || d.status === 'PICKUP_PENDING') &&
    (d.urgency === 'CRITICAL' || d.urgency === 'URGENT')
  ).length;

  const handleRoleSelectedFromAuth = (role: UserRole) => {
    if (role === 'provider') setCurrentPersona('provider');
    else if (role === 'ngo') setCurrentPersona('ngo');
    else if (role === 'volunteer') setCurrentPersona('volunteer');
    else if (role === 'admin') setCurrentPersona('admin');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans selection:bg-brand-500 selection:text-white text-slate-900">
      
      {/* Top Navigation */}
      <Navbar
        currentPersona={currentPersona}
        onSelectPersona={setCurrentPersona}
        onOpenAuth={() => setIsAuthOpen(true)}
        urgentCount={urgentCount}
      />

      {/* Main Content Router */}
      <main className="flex-1">
        {currentPersona === 'landing' && (
          <LandingPage
            onSelectPersona={setCurrentPersona}
            onOpenCreateDonation={() => {
              setCurrentPersona('provider');
              setIsCreateModalOpen(true);
            }}
          />
        )}

        {currentPersona === 'provider' && (
          <ProviderDashboard
            donations={donations}
            organizations={organizations}
            isCreateModalOpen={isCreateModalOpen}
            setIsCreateModalOpen={setIsCreateModalOpen}
          />
        )}

        {currentPersona === 'ngo' && (
          <NgoDashboard
            donations={donations}
            organizations={organizations}
            volunteer={volunteer}
          />
        )}

        {currentPersona === 'volunteer' && (
          <VolunteerDashboard
            donations={donations}
            organizations={organizations}
            volunteer={volunteer}
          />
        )}

        {currentPersona === 'admin' && (
          <AdminDashboard
            donations={donations}
            organizations={organizations}
          />
        )}

        {currentPersona === 'workflows' && (
          <N8nWorkflowViewer
            logs={automationLogs}
          />
        )}
      </main>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onSelectRole={handleRoleSelectedFromAuth}
      />

    </div>
  );
};

export default App;
