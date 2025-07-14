import { Metric, ThreatLog, ChartData, Model } from './types';

export const INITIAL_METRICS: Metric[] = [
  { name: 'Accuracy', value: '99.4%', change: '+0.2%', changeType: 'increase', comparisonPeriod: 'vs. last 24h' },
  { name: 'Precision', value: '98.9%', change: '-0.1%', changeType: 'decrease', comparisonPeriod: 'vs. last 24h' },
  { name: 'Recall', value: '99.1%', change: '+0.3%', changeType: 'increase', comparisonPeriod: 'vs. last 24h' },
  { name: 'F1-Score', value: '99.0%', change: '+0.1%', changeType: 'increase', comparisonPeriod: 'vs. last 24h' },
];

export const INITIAL_THREAT_LOGS: ThreatLog[] = [
  {
    id: '1',
    url: 'http://login.microsft-online.com/auth',
    isPhishing: true,
    confidenceScore: 0.98,
    analysisDetails: [
      { module: "Heuristic Analysis", reason: "URL contains typosquatting domain 'microsft-online.com'.", triggeredRules: ["Typosquatting", "Keyword 'login'"] },
      { module: "Content Analysis", reason: "Form action submits credentials to a third-party domain.", triggeredRules: ["External Form Action"] }
    ],
    visualSimilarityScore: 0.92,
    suggestedLegitimateSite: 'login.microsoftonline.com',
    timestamp: new Date(Date.now() - 3 * 60 * 1000).toISOString()
  },
  {
    id: '2',
    url: 'http://bankofamerica-secure.com/update',
    isPhishing: true,
    confidenceScore: 0.95,
    analysisDetails: [{ module: "Heuristic Analysis", reason: "URL uses combosquatting domain.", triggeredRules: ["Combosquatting", "Keyword 'secure'", "Keyword 'update'"] }],
    visualSimilarityScore: 0.88,
    suggestedLegitimateSite: 'bankofamerica.com',
    timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString()
  },
  {
    id: '3',
    url: 'https://react.dev',
    isPhishing: false,
    confidenceScore: 0.01,
    analysisDetails: [{ module: "Heuristic Analysis", reason: "URL matches known safe domains list.", triggeredRules: ["Safe List Match"] }],
    visualSimilarityScore: 1.0,
    timestamp: new Date(Date.now() - 62 * 60 * 1000).toISOString()
  },
   {
    id: '4',
    url: 'http://gooogle.com/search?q=cute+cats',
    isPhishing: true,
    confidenceScore: 0.85,
    analysisDetails: [{ module: "Heuristic Analysis", reason: "URL uses a homograph of a popular domain.", triggeredRules: ["Homograph"] }],
    visualSimilarityScore: 0.3,
    suggestedLegitimateSite: 'google.com',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '5',
    url: 'http://tinyurl.com/dangerous-link',
    isPhishing: true,
    confidenceScore: 0.78,
    analysisDetails: [{ module: "Heuristic Analysis", reason: "URL uses a known URL shortener which can hide malicious destinations.", triggeredRules: ["URL Shortener"] }],
    visualSimilarityScore: 0.1,
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '6',
    url: 'https://github.com',
    isPhishing: false,
    confidenceScore: 0.02,
    analysisDetails: [{ module: "Heuristic Analysis", reason: "URL is on a global allow list.", triggeredRules: ["Safe List Match"] }],
    visualSimilarityScore: 1.0,
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '7',
    url: 'http://amazn-support.net/user/verify',
    isPhishing: true,
    confidenceScore: 0.99,
    analysisDetails: [{ module: "Heuristic Analysis", reason: "URL contains typosquatting and suspicious keywords.", triggeredRules: ["Typosquatting", "Keyword 'support'", "Keyword 'verify'"] }],
    visualSimilarityScore: 0.94,
    suggestedLegitimateSite: 'amazon.com',
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '8',
    url: 'https://wellsfargo-com-details.info/',
    isPhishing: true,
    confidenceScore: 0.93,
    analysisDetails: [{ module: "Heuristic Analysis", reason: "URL structure is designed to mislead users (combosquatting).", triggeredRules: ["Combosquatting"] }],
    visualSimilarityScore: 0.85,
    suggestedLegitimateSite: 'wellsfargo.com',
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString()
  },
   {
    id: '9',
    url: 'https://en.wikipedia.org/wiki/Phishing',
    isPhishing: false,
    confidenceScore: 0.0,
    analysisDetails: [{ module: "Heuristic Analysis", reason: "URL is a known informational and safe domain.", triggeredRules: ["Safe List Match"] }],
    visualSimilarityScore: 1.0,
    timestamp: new Date(Date.now() - 25 * 60 * 60 * 1000).toISOString()
  },
];


export const THREATS_OVER_TIME_DATA: ChartData[] = [
  { name: '3h ago', value: 5 },
  { name: '2h ago', value: 8 },
  { name: '1h ago', value: 12 },
  { name: '30m ago', value: 7 },
  { name: 'Now', value: 15 },
];

export const THREAT_TYPE_DATA: ChartData[] = [
    { name: 'Typosquatting', value: 45 },
    { name: 'Combosquatting', value: 25 },
    { name: 'Homograph', value: 10 },
    { name: 'Malicious Content', value: 15 },
    { name: 'URL Shortener', value: 5 },
];

export const MODEL_MANAGEMENT_DATA: Model[] = [
  {
    id: 'model-1',
    name: 'CNN-URL-Detector',
    version: 'v2.1.3',
    status: 'Active',
    accuracy: 0.994,
    lastTrained: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    performanceMetrics: {
        precision: 0.989,
        recall: 0.991,
        f1Score: 0.990,
        confusionMatrix: { truePositive: 2108, falsePositive: 23, trueNegative: 5432, falseNegative: 19 }
    }
  },
  {
    id: 'model-2',
    name: 'GNN-Ethereum-Fraud',
    version: 'v1.5.0',
    status: 'Active',
    accuracy: 0.978,
    lastTrained: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
     performanceMetrics: {
        precision: 0.981,
        recall: 0.975,
        f1Score: 0.978,
        confusionMatrix: { truePositive: 850, falsePositive: 16, trueNegative: 10500, falseNegative: 21 }
    }
  },
  {
    id: 'model-3',
    name: 'BERT-Email-Analyzer',
    version: 'v1.8.2',
    status: 'Inactive',
    accuracy: 0.985,
    lastTrained: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
     performanceMetrics: {
        precision: 0.980,
        recall: 0.990,
        f1Score: 0.985,
        confusionMatrix: { truePositive: 4530, falsePositive: 91, trueNegative: 12432, falseNegative: 45 }
    }
  },
    {
    id: 'model-4',
    name: 'Visual-Similarity-Engine',
    version: 'v3.0.1-beta',
    status: 'Training',
    accuracy: 0.962,
    lastTrained: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
     performanceMetrics: {
        precision: 0.950,
        recall: 0.971,
        f1Score: 0.960,
        confusionMatrix: { truePositive: 980, falsePositive: 51, trueNegative: 4100, falseNegative: 29 }
    }
  },
];