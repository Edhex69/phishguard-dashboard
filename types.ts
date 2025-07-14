export interface AnalysisDetail {
  module: string;
  reason: string;
  triggeredRules: string[];
}

export interface AnalysisResult {
  id: string;
  url: string;
  isPhishing: boolean;
  confidenceScore: number;
  analysisDetails: AnalysisDetail[];
  visualSimilarityScore: number;
  suggestedLegitimateSite?: string;
  timestamp: string;
}

export interface Metric {
  name: string;
  value: string;
  change?: string;
  changeType?: 'increase' | 'decrease';
  comparisonPeriod?: string;
}

export interface ThreatLog extends AnalysisResult {}

export interface ChartData {
  name: string;
  value: number;
}

export type ModelStatus = 'Active' | 'Training' | 'Inactive';

export interface Model {
    id: string;
    name: string;
    version: string;
    status: ModelStatus;
    accuracy: number;
    lastTrained: string;
    performanceMetrics: {
        precision: number;
        recall: number;
        f1Score: number;
        confusionMatrix: {
            truePositive: number;
            falsePositive: number;
            trueNegative: number;
            falseNegative: number;
        };
    };
}