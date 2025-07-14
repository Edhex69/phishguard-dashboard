import React, { useState, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import ThreatExplorer from './components/ThreatExplorer';
import ModelManagement from './components/ModelManagement';
import { INITIAL_THREAT_LOGS } from './constants';
import { ThreatLog, AnalysisResult } from './types';

export type View = 'dashboard' | 'explorer' | 'models';
export type ExplorerFilters = {
    threatType?: string;
    rule?: string;
};

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<View>('dashboard');
  const [threatLogs, setThreatLogs] = useState<ThreatLog[]>(INITIAL_THREAT_LOGS);
  const [explorerFilters, setExplorerFilters] = useState<ExplorerFilters>({});

  const handleNewAnalysis = useCallback((result: AnalysisResult) => {
    setThreatLogs(prevLogs => [result, ...prevLogs]);
  }, []);

  const handleNavigate = (view: View) => {
    setActiveView(view);
    setExplorerFilters({}); // Reset filters when navigating directly
  };

  const handleNavigateWithFilters = (view: View, filters: ExplorerFilters) => {
      setExplorerFilters(filters);
      setActiveView(view);
  };

  const renderView = () => {
    switch (activeView) {
      case 'explorer':
        return <ThreatExplorer allLogs={threatLogs} initialFilters={explorerFilters} onNavigateWithFilters={handleNavigateWithFilters} />;
      case 'models':
        return <ModelManagement />;
      case 'dashboard':
      default:
        return <Dashboard threatLogs={threatLogs} onNewAnalysis={handleNewAnalysis} onNavigateWithFilters={handleNavigateWithFilters} />;
    }
  };

  return (
    <div className="dark flex h-screen bg-background font-sans">
      <Sidebar activeView={activeView} onNavigate={handleNavigate} />
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
        {renderView()}
      </main>
    </div>
  );
};

export default App;