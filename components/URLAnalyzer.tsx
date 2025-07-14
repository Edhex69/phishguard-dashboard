
import React, { useState } from 'react';
import { analyzeUrl } from '../services/geminiService';
import { AnalysisResult } from '../types';
import { SearchIcon, ShieldCheckIcon, AlertTriangleIcon } from './icons';

interface URLAnalyzerProps {
  onAnalysisComplete: (result: AnalysisResult) => void;
}

const URLAnalyzer: React.FC<URLAnalyzerProps> = ({ onAnalysisComplete }) => {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const analysisResult = await analyzeUrl(url);
      setResult(analysisResult);
      onAnalysisComplete(analysisResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const ResultDisplay: React.FC<{ result: AnalysisResult }> = ({ result }) => (
    <div className="mt-4 p-4 rounded-lg bg-slate-800 border border-slate-700">
      <div className="flex items-center mb-3">
        {result.isPhishing ? (
          <AlertTriangleIcon className="h-8 w-8 text-red-500 mr-3 flex-shrink-0" />
        ) : (
          <ShieldCheckIcon className="h-8 w-8 text-green-500 mr-3 flex-shrink-0" />
        )}
        <div>
          <h3 className={`text-xl font-bold ${result.isPhishing ? 'text-red-400' : 'text-green-400'}`}>
            {result.isPhishing ? 'Phishing Detected' : 'URL is Safe'}
          </h3>
          <p className="text-text-secondary truncate">{result.url}</p>
        </div>
        <div className="ml-auto text-right">
            <p className="text-sm text-text-secondary">Confidence</p>
            <p className={`font-bold text-lg ${result.isPhishing ? 'text-red-400' : 'text-green-400'}`}>
                {(result.confidenceScore * 100).toFixed(1)}%
            </p>
        </div>
      </div>
      <div className="space-y-2 mt-4 pl-1">
        <h4 className="font-semibold text-text-primary">Analysis Details:</h4>
        {result.analysisDetails.map((detail, index) => (
          <div key={index} className="text-sm p-3 rounded-md bg-background border border-slate-700/50">
            <p className="font-bold text-accent">{detail.module}</p>
            <p className="text-text-primary mt-1">{detail.reason}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {detail.triggeredRules.map(rule => (
                <span key={rule} className="text-xs bg-slate-700 text-text-secondary px-2 py-1 rounded-full">{rule}</span>
              ))}
            </div>
          </div>
        ))}
         {result.suggestedLegitimateSite && (
            <p className="text-sm text-text-secondary pt-2">
                Suggested legitimate site: <a href={`https://${result.suggestedLegitimateSite}`} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">{result.suggestedLegitimateSite}</a>
            </p>
        )}
      </div>
    </div>
  );


  return (
    <div className="bg-surface p-6 rounded-xl shadow-lg border border-slate-700/50">
      <h2 className="text-xl font-semibold text-text-primary mb-3">Real-Time URL Analysis</h2>
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-text-secondary" />
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter a URL to analyze (e.g., http://example-login.com)"
            className="w-full bg-background border border-slate-600 rounded-lg py-3 pl-12 pr-32 text-text-primary focus:ring-2 focus:ring-accent focus:outline-none"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-accent text-white font-semibold py-2 px-4 rounded-md hover:bg-primary-600 disabled:bg-slate-500 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? 'Analyzing...' : 'Analyze'}
          </button>
        </div>
      </form>
      {error && <p className="mt-4 text-red-400">{error}</p>}
      {result && <ResultDisplay result={result} />}
    </div>
  );
};

export default URLAnalyzer;
