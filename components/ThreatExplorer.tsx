import React, { useState, useMemo, useEffect } from 'react';
import { ThreatLog } from '../types';
import ThreatsTable from './ThreatsTable';
import { THREAT_TYPE_DATA } from '../constants';
import { ExplorerFilters, View } from '../App';
import { FilterIcon, SearchIcon } from './icons';


interface ThreatExplorerProps {
  allLogs: ThreatLog[];
  initialFilters: ExplorerFilters;
  onNavigateWithFilters: (view: View, filters: ExplorerFilters) => void;
}

const threatTypes = THREAT_TYPE_DATA.map(t => t.name);

const ThreatExplorer: React.FC<ThreatExplorerProps> = ({ allLogs, initialFilters, onNavigateWithFilters }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all'); // 'all', 'phishing', 'safe'
    const [typeFilter, setTypeFilter] = useState<string[]>([]);
    const [confidenceRange, setConfidenceRange] = useState({ min: 0, max: 100 });

    useEffect(() => {
        if (initialFilters.threatType) {
            setTypeFilter([initialFilters.threatType]);
        }
        if (initialFilters.rule) {
            setTypeFilter([initialFilters.rule]);
        }
    }, [initialFilters]);

    const filteredLogs = useMemo(() => {
        return allLogs.filter(log => {
            const getThreatType = (log: ThreatLog): string => {
                if (log.isPhishing) return log.analysisDetails[0]?.triggeredRules[0] || 'Unknown';
                return 'Safe';
            };
            
            const threatType = getThreatType(log);

            if (searchTerm && !log.url.toLowerCase().includes(searchTerm.toLowerCase())) {
                return false;
            }
            if (statusFilter !== 'all') {
                if ((statusFilter === 'phishing' && !log.isPhishing) || (statusFilter === 'safe' && log.isPhishing)) {
                    return false;
                }
            }
            if (typeFilter.length > 0) {
                const logTypes = log.analysisDetails.flatMap(d => d.triggeredRules);
                if (!typeFilter.some(filterType => logTypes.includes(filterType) || threatType === filterType)) {
                    return false;
                }
            }
            if (log.confidenceScore * 100 < confidenceRange.min || log.confidenceScore * 100 > confidenceRange.max) {
                return false;
            }
            return true;
        });
    }, [allLogs, searchTerm, statusFilter, typeFilter, confidenceRange]);
    
    const handleTypeFilterChange = (type: string) => {
        setTypeFilter(prev => 
            prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
        );
    };

    return (
        <div className="space-y-6">
            <header>
                <h1 className="text-3xl font-bold text-text-primary">Threat Explorer</h1>
                <p className="text-text-secondary mt-1">
                    Search, filter, and investigate all analyzed URLs.
                </p>
            </header>

            <div className="bg-surface p-4 sm:p-6 rounded-xl shadow-lg border border-slate-700/50 space-y-4">
                <div className="flex items-center gap-2 text-lg font-semibold">
                    <FilterIcon className="h-5 w-5 text-accent"/>
                    <span>Filters</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Search */}
                    <div className="relative">
                        <label htmlFor="search-url" className="text-sm font-medium text-text-secondary mb-1 block">Search URL</label>
                        <SearchIcon className="absolute left-3 top-9 h-5 w-5 text-text-secondary"/>
                        <input
                            id="search-url"
                            type="text"
                            placeholder="e.g., microsft-online"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-background border border-slate-600 rounded-lg py-2 pl-10 pr-4 text-text-primary focus:ring-2 focus:ring-accent focus:outline-none"
                        />
                    </div>
                    {/* Status */}
                    <div>
                        <label htmlFor="status-filter" className="text-sm font-medium text-text-secondary mb-1 block">Status</label>
                        <select id="status-filter" value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="w-full bg-background border border-slate-600 rounded-lg py-2 px-3 text-text-primary focus:ring-2 focus:ring-accent focus:outline-none">
                            <option value="all">All</option>
                            <option value="phishing">Phishing</option>
                            <option value="safe">Safe</option>
                        </select>
                    </div>
                    {/* Confidence */}
                    <div className="lg:col-span-2">
                         <label htmlFor="confidence-range" className="text-sm font-medium text-text-secondary mb-1 block">Confidence Score</label>
                         <div className="flex items-center gap-4">
                            <span className="text-sm text-text-secondary">{confidenceRange.min}%</span>
                            <input
                                id="confidence-range"
                                type="range"
                                min="0"
                                max="100"
                                value={confidenceRange.min}
                                onChange={(e) => setConfidenceRange(prev => ({ ...prev, min: Number(e.target.value) }))}
                                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                            />
                             <span className="text-sm text-text-secondary">{confidenceRange.max}%</span>
                         </div>
                    </div>
                </div>
                {/* Threat Types */}
                <div>
                     <label className="text-sm font-medium text-text-secondary mb-2 block">Threat Types</label>
                     <div className="flex flex-wrap gap-2">
                        {threatTypes.map(type => (
                             <button
                                key={type}
                                onClick={() => handleTypeFilterChange(type)}
                                className={`px-3 py-1 text-xs font-semibold rounded-full transition-colors ${
                                    typeFilter.includes(type)
                                    ? 'bg-accent text-white'
                                    : 'bg-slate-700 text-text-secondary hover:bg-slate-600'
                                }`}
                             >
                                {type}
                            </button>
                        ))}
                     </div>
                </div>
            </div>

            <div className="bg-surface rounded-xl shadow-lg border border-slate-700/50">
                <ThreatsTable 
                    threatLogs={filteredLogs} 
                    onNavigateWithFilters={onNavigateWithFilters}
                    isPaginated={true} 
                    defaultPageSize={10}
                    title="Filtered Results"
                    subtitle={`${filteredLogs.length} threats found matching your criteria.`}
                />
            </div>
        </div>
    );
};

export default ThreatExplorer;
