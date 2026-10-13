import React, { useState } from 'react';
import { AdminProvider, useAdmin } from './context/AdminContext';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { ToastContainer } from './components/common/ToastContainer';
import { OverviewView } from './components/views/OverviewView';
import { UserManagementView } from './components/views/UserManagementView';
import { ContentManagementView } from './components/views/ContentManagementView';
import { PaymentTransactionView } from './components/views/PaymentTransactionView';
import { UpdatesOffersView } from './components/views/UpdatesOffersView';
import { BusinessReportsView } from './components/views/BusinessReportsView';
import { RolesPermissionsView } from './components/views/RolesPermissionsView';

const DashboardContent: React.FC = () => {
  const { activeTab } = useAdmin();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const renderActiveView = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewView />;
      case 'users':
        return <UserManagementView />;
      case 'content':
        return <ContentManagementView />;
      case 'payments':
        return <PaymentTransactionView />;
      case 'updates':
        return <UpdatesOffersView />;
      case 'reports':
        return <BusinessReportsView />;
      case 'roles':
        return <RolesPermissionsView />;
      default:
        return <OverviewView />;
    }
  };

  return (
    <div className="admin-app-layout">
      {/* Sidebar Navigation */}
      <Sidebar
        isOpen={sidebarOpen}
        onCloseMobile={() => setSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="admin-main-wrapper">
        <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <main className="admin-content-viewport">{renderActiveView()}</main>
      </div>

      {/* Global Toast Notifications */}
      <ToastContainer />
    </div>
  );
};

export function App() {
  return (
    <AdminProvider>
      <DashboardContent />
    </AdminProvider>
  );
}

export default App;
