import React, { useState, useMemo } from 'react';
import { ThreatLog } from '../types';
import { ChevronDownIcon, ChevronUpIcon, AlertTriangleIcon, ShieldCheckIcon } from './icons';
import { View, ExplorerFilters } from '../App';
import Pagination from './Pagination';

const getThreatType = (log: ThreatLog): string => {
    if (log.isPhishing) {
        return log.analysisDetails[0]?.triggeredRules[0] || 'Unknown';
    }
    return 'Safe';
};

interface ThreatRowProps {
    log: ThreatLog;
    onNavigateWithFilters: (view: View, filters: ExplorerFilters) => void;
}

const ThreatRow: React.FC<ThreatRowProps> = ({ log, onNavigateWithFilters }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleRuleClick = (rule: string) => {
    onNavigateWithFilters('explorer', { rule });
  };

  return (
    <>
      <tr className="border-b border-slate-700/50 hover:bg-slate-800/50 transition-colors">
        <td className="p-4">
            <button onClick={() => setIsExpanded(!isExpanded)} className="p-1 rounded-full hover:bg-slate-600" aria-label={isExpanded ? 'Collapse row' : 'Expand row'}>
                {isExpanded ? <ChevronUpIcon className="h-4 w-4 text-text-secondary" /> : <ChevronDownIcon className="h-4 w-4 text-text-secondary" />}
            </button>
        </td>
        <td className="p-4 max-w-xs xl:max-w-md truncate">
            <div className="flex items-center">
                {log.isPhishing ? 
                    <AlertTriangleIcon className="h-5 w-5 text-red-400 mr-3 flex-shrink-0" /> : 
                    <ShieldCheckIcon className="h-5 w-5 text-green-400 mr-3 flex-shrink-0" />
                }
                <span className="font-mono text-sm text-text-primary">{log.url}</span>
            </div>
        </td>
        <td className="p-4 text-center">
          <span className={`px-3 py-1 text-xs font-semibold rounded-full ${log.isPhishing ? 'bg-red-500/20 text-red-300' : 'bg-green-500/20 text-green-300'}`}>
            {log.isPhishing ? 'Phishing' : 'Safe'}
          </span>
        </td>
        <td className="p-4 text-sm text-text-secondary hidden md:table-cell">{getThreatType(log)}</td>
        <td className="p-4 text-center text-sm text-text-secondary font-mono">{(log.confidenceScore * 100).toFixed(1)}%</td>
        <td className="p-4 text-sm text-text-secondary hidden lg:table-cell">{new Date(log.timestamp).toLocaleTimeString()}</td>
      </tr>
      {isExpanded && (
        <tr className="bg-slate-800/30">
          <td colSpan={6} className="p-4">
            <div className="p-4 bg-background rounded-lg border border-slate-700/50">
              <h4 className="font-bold text-text-primary mb-3">Analysis Breakdown</h4>
              <div className="space-y-4">
                {log.analysisDetails.map((detail, index) => (
                   <div key={index} className="text-sm">
                        <p className="font-semibold text-accent">{detail.module}</p>
                        <p className="text-text-secondary mt-1">{detail.reason}</p>
                        <div className="mt-2 flex flex-wrap gap-2">
                        {detail.triggeredRules.map(rule => (
                            <button key={rule} onClick={() => handleRuleClick(rule)} className="text-xs bg-slate-700 text-text-secondary px-2 py-1 rounded-full hover:bg-accent hover:text-white transition-colors">{rule}</button>
                        ))}
                        </div>
                  </div>
                ))}
                {log.suggestedLegitimateSite && (
                    <p className="text-sm text-text-secondary pt-2">
                        Suggested legitimate site: <a href={`https://${log.suggestedLegitimateSite}`} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">{log.suggestedLegitimateSite}</a>
                    </p>
                )}
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
};

interface ThreatsTableProps {
    threatLogs: ThreatLog[];
    onNavigateWithFilters: (view: View, filters: ExplorerFilters) => void;
    isPaginated?: boolean;
    defaultPageSize?: number;
    title?: string;
    subtitle?: string;
}

const ThreatsTable: React.FC<ThreatsTableProps> = ({ 
    threatLogs, 
    onNavigateWithFilters,
    isPaginated = false, 
    defaultPageSize = 10,
    title = "Recent Threat Logs",
    subtitle = "Detailed log of recently analyzed URLs." 
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = defaultPageSize;

  const paginatedLogs = useMemo(() => {
    if (!isPaginated) return threatLogs;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return threatLogs.slice(startIndex, endIndex);
  }, [threatLogs, currentPage, itemsPerPage, isPaginated]);

  return (
    <div className="overflow-x-auto">
      <div className="p-6">
        <h2 className="text-xl font-semibold text-text-primary">{title}</h2>
        <p className="text-text-secondary mt-1">{subtitle}</p>
      </div>
      <table className="w-full text-left">
        <thead className="bg-slate-800/50">
          <tr>
            <th className="p-4 w-12"></th>
            <th className="p-4 font-semibold text-sm text-text-secondary uppercase tracking-wider">URL</th>
            <th className="p-4 font-semibold text-sm text-text-secondary uppercase tracking-wider text-center">Status</th>
            <th className="p-4 font-semibold text-sm text-text-secondary uppercase tracking-wider hidden md:table-cell">Threat Type</th>
            <th className="p-4 font-semibold text-sm text-text-secondary uppercase tracking-wider text-center">Confidence</th>
            <th className="p-4 font-semibold text-sm text-text-secondary uppercase tracking-wider hidden lg:table-cell">Time</th>
          </tr>
        </thead>
        <tbody>
          {paginatedLogs.map((log) => (
            <ThreatRow key={log.id} log={log} onNavigateWithFilters={onNavigateWithFilters} />
          ))}
        </tbody>
      </table>
      {isPaginated && threatLogs.length > itemsPerPage && (
        <div className="p-4 border-t border-slate-700/50">
          <Pagination
            currentPage={currentPage}
            totalItems={threatLogs.length}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </div>
  );
};

export default ThreatsTable;