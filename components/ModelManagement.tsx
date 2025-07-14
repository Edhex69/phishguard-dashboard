import React, { useState } from 'react';
import { Model, ModelStatus } from '../types';
import { MODEL_MANAGEMENT_DATA } from '../constants';
import { XIcon } from './icons';

const getStatusColor = (status: ModelStatus) => {
    switch (status) {
        case 'Active': return 'bg-green-500/20 text-green-300';
        case 'Training': return 'bg-blue-500/20 text-blue-300';
        case 'Inactive': return 'bg-slate-500/20 text-slate-300';
    }
}

const ModelDetailsModal: React.FC<{ model: Model; onClose: () => void }> = ({ model, onClose }) => {
    const { confusionMatrix: cm } = model.performanceMetrics;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50" role="dialog" aria-modal="true" aria-labelledby="modal-title">
            <div className="bg-surface rounded-xl shadow-2xl border border-slate-700/50 w-full max-w-2xl transform transition-all">
                <div className="p-6 border-b border-slate-700/50 flex justify-between items-center">
                    <h2 id="modal-title" className="text-xl font-bold text-text-primary">{model.name} - v{model.version}</h2>
                    <button onClick={onClose} className="p-1 rounded-full text-text-secondary hover:bg-slate-700" aria-label="Close modal">
                        <XIcon className="h-6 w-6"/>
                    </button>
                </div>
                <div className="p-6 space-y-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                        <div>
                            <p className="text-sm text-text-secondary">Accuracy</p>
                            <p className="text-2xl font-semibold text-accent">{(model.accuracy * 100).toFixed(2)}%</p>
                        </div>
                         <div>
                            <p className="text-sm text-text-secondary">Precision</p>
                            <p className="text-2xl font-semibold text-accent">{(model.performanceMetrics.precision * 100).toFixed(2)}%</p>
                        </div>
                         <div>
                            <p className="text-sm text-text-secondary">Recall</p>
                            <p className="text-2xl font-semibold text-accent">{(model.performanceMetrics.recall * 100).toFixed(2)}%</p>
                        </div>
                         <div>
                            <p className="text-sm text-text-secondary">F1-Score</p>
                            <p className="text-2xl font-semibold text-accent">{(model.performanceMetrics.f1Score * 100).toFixed(2)}%</p>
                        </div>
                    </div>
                     <div>
                        <h3 className="font-semibold text-text-primary mb-3">Confusion Matrix</h3>
                        <div className="grid grid-cols-2 gap-2 text-sm text-center">
                           <div className="bg-background p-3 rounded-lg border border-slate-700">
                                <p>True Positive</p>
                                <p className="font-bold text-green-400 text-lg mt-1">{cm.truePositive.toLocaleString()}</p>
                           </div>
                           <div className="bg-background p-3 rounded-lg border border-slate-700">
                                <p>False Positive</p>
                                <p className="font-bold text-red-400 text-lg mt-1">{cm.falsePositive.toLocaleString()}</p>
                           </div>
                           <div className="bg-background p-3 rounded-lg border border-slate-700">
                                <p>False Negative</p>
                                <p className="font-bold text-orange-400 text-lg mt-1">{cm.falseNegative.toLocaleString()}</p>
                           </div>
                           <div className="bg-background p-3 rounded-lg border border-slate-700">
                                <p>True Negative</p>
                                <p className="font-bold text-green-400 text-lg mt-1">{cm.trueNegative.toLocaleString()}</p>
                           </div>
                        </div>
                    </div>
                </div>
                 <div className="p-4 bg-slate-800/50 rounded-b-xl text-right">
                    <button onClick={onClose} className="px-4 py-2 text-sm font-medium bg-slate-700 text-text-primary rounded-md hover:bg-slate-600">
                      Close
                    </button>
                </div>
            </div>
        </div>
    );
};

const ModelManagement: React.FC = () => {
    const [models] = useState<Model[]>(MODEL_MANAGEMENT_DATA);
    const [selectedModel, setSelectedModel] = useState<Model | null>(null);

    return (
        <div className="space-y-6">
            <header>
                <h1 className="text-3xl font-bold text-text-primary">Model Management</h1>
                <p className="text-text-secondary mt-1">
                    Monitor, manage, and retrain AI detection models.
                </p>
            </header>

            <div className="bg-surface rounded-xl shadow-lg border border-slate-700/50 overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-slate-800/50">
                        <tr>
                            <th className="p-4 font-semibold text-sm text-text-secondary uppercase tracking-wider">Model Name</th>
                            <th className="p-4 font-semibold text-sm text-text-secondary uppercase tracking-wider">Version</th>
                            <th className="p-4 font-semibold text-sm text-text-secondary uppercase tracking-wider">Status</th>
                            <th className="p-4 font-semibold text-sm text-text-secondary uppercase tracking-wider">Accuracy</th>
                            <th className="p-4 font-semibold text-sm text-text-secondary uppercase tracking-wider">Last Trained</th>
                            <th className="p-4 font-semibold text-sm text-text-secondary uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {models.map(model => (
                            <tr key={model.id} className="border-b border-slate-700/50 hover:bg-slate-800/50 transition-colors">
                                <td className="p-4 text-text-primary font-medium">{model.name}</td>
                                <td className="p-4 text-text-secondary font-mono text-sm">{model.version}</td>
                                <td className="p-4">
                                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(model.status)}`}>
                                        {model.status}
                                    </span>
                                </td>
                                <td className="p-4 text-accent font-semibold">{(model.accuracy * 100).toFixed(2)}%</td>
                                <td className="p-4 text-text-secondary">{new Date(model.lastTrained).toLocaleDateString()}</td>
                                <td className="p-4">
                                    <div className="flex items-center gap-2">
                                        <button onClick={() => setSelectedModel(model)} className="px-3 py-1 text-sm font-medium bg-slate-700 text-text-primary rounded-md hover:bg-slate-600">Details</button>
                                        <button disabled className="px-3 py-1 text-sm font-medium bg-slate-600 text-text-secondary rounded-md cursor-not-allowed">Retrain</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {selectedModel && <ModelDetailsModal model={selectedModel} onClose={() => setSelectedModel(null)} />}
        </div>
    );
};

export default ModelManagement;
