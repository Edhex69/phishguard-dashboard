import React from 'react';
import { Metric } from '../types';
import { ChevronUpIcon, ChevronDownIcon } from './icons';

interface MetricCardProps {
  metric: Metric;
}

const MetricCard: React.FC<MetricCardProps> = ({ metric }) => {
  const isIncrease = metric.changeType === 'increase';
  const changeColor = isIncrease ? 'text-green-400' : 'text-red-400';

  return (
    <div className="bg-surface p-5 rounded-xl shadow-lg border border-slate-700/50 flex flex-col justify-between">
      <div>
        <p className="text-sm font-medium text-text-secondary">{metric.name}</p>
        <p className="text-2xl font-semibold text-text-primary mt-1">{metric.value}</p>
      </div>
      {metric.change && (
        <div className="flex items-center text-sm mt-2">
            <div className={`flex items-center font-semibold ${changeColor}`}>
                {isIncrease ? 
                    <ChevronUpIcon className="h-4 w-4" /> : 
                    <ChevronDownIcon className="h-4 w-4" />
                }
                <span>{metric.change}</span>
            </div>
            {metric.comparisonPeriod && (
                <span className="ml-2 text-xs text-text-secondary">{metric.comparisonPeriod}</span>
            )}
        </div>
      )}
    </div>
  );
};

export default MetricCard;