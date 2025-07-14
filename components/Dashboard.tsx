import React, { useState, useCallback } from 'react';
import URLAnalyzer from './URLAnalyzer';
import MetricCard from './MetricCard';
import ThreatsTable from './ThreatsTable';
import ThreatsOverTimeChart from './ThreatsOverTimeChart';
import ThreatTypeDistributionChart from './ThreatTypeDistributionChart';
import { INITIAL_METRICS } from '../constants';
import { ThreatLog, AnalysisResult } from '../types';
import { View, ExplorerFilters } from '../App';

interface DashboardProps {
  threatLogs: ThreatLog[];
  onNewAnalysis: (result: AnalysisResult) => void;
  onNavigateWithFilters: (view: View, filters: ExplorerFilters) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ threatLogs, onNewAnalysis, onNavigateWithFilters }) => {
  
  const handleChartBarClick = (threatType: string) => {
    onNavigateWithFilters('explorer', { threatType });
  };
  
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-text-primary">Security Dashboard</h1>
        <p className="text-text-secondary mt-1">
          Real-time monitoring of phishing threats and system performance.
        </p>
      </header>
      
      <URLAnalyzer onAnalysisComplete={onNewAnalysis} />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {INITIAL_METRICS.map((metric) => (
          <MetricCard key={metric.name} metric={metric} />
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 bg-surface rounded-xl shadow-lg p-6 border border-slate-700/50">
          <h2 className="text-xl font-semibold text-text-primary mb-4">Threats Over Time</h2>
          <ThreatsOverTimeChart />
        </div>
        <div className="lg:col-span-2 bg-surface rounded-xl shadow-lg p-6 border border-slate-700/50">
          <h2 className="text-xl font-semibold text-text-primary mb-4">Threat Type Distribution</h2>
          <ThreatTypeDistributionChart onBarClick={handleChartBarClick} />
        </div>
      </div>

      <div className="bg-surface rounded-xl shadow-lg border border-slate-700/50">
         <ThreatsTable 
            threatLogs={threatLogs} 
            onNavigateWithFilters={onNavigateWithFilters} 
            isPaginated={true}
            defaultPageSize={5}
         />
      </div>
    </div>
  );
};

export default Dashboard;