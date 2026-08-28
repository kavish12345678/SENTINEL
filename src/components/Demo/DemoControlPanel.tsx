import { Play, Pause, RotateCcw, SkipForward } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useEffect, useRef } from 'react';

const stageLabels: Record<number, string> = {
  0: 'Ready',
  1: 'Normal Login',
  2: 'Unusual Login Time',
  3: 'Unusual Resource Access',
  4: 'Beneficiary Changed',
  5: 'Limit Increased',
  6: 'Large Payment',
  7: 'Threat Detected',
  8: 'Response Phase',
};

export default function DemoControlPanel() {
  const { demoState, pauseDemo, nextStep, resetDemo } = useApp();
  const autoPlayRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isRunning = demoState.isRunning;
  const isPaused = demoState.isPaused;
  const stage = demoState.stage;
  const scenarioType = demoState.scenarioType;

  // Auto-play
  useEffect(() => {
    if (isRunning && !isPaused && stage < 8) {
      autoPlayRef.current = setTimeout(() => {
        nextStep();
      }, 2500);
    }
    return () => {
      if (autoPlayRef.current) clearTimeout(autoPlayRef.current);
    };
  }, [isRunning, isPaused, stage, nextStep]);

  if (!isRunning && stage === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-10 right-6 z-50 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="bg-slate-900/95 border border-slate-700/80 rounded-2xl shadow-2xl p-4 w-80 backdrop-blur-md">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-pulse" />
          <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">Demo Control</span>
          {scenarioType && (
            <span className={`ml-auto text-xs px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
              scenarioType === 'suspicious'
                ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                : 'bg-green-500/20 text-green-400 border border-green-500/30'
            }`}>
              {scenarioType === 'suspicious' ? '⚠ Suspicious' : '✓ Legitimate'}
            </span>
          )}
        </div>

        {/* Progress */}
        <div className="mb-3">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
            <span className="font-semibold text-slate-300">Step {stage} of 8</span>
            <span className="text-blue-400 font-medium">{stageLabels[stage] || 'Complete'}</span>
          </div>
          <div className="h-2 bg-slate-800 rounded-full overflow-hidden p-0.5">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                scenarioType === 'legitimate' ? 'bg-green-500' : stage >= 6 ? 'bg-red-500' : 'bg-blue-500'
              }`}
              style={{ width: `${Math.min(100, (stage / 8) * 100)}%` }}
            />
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={pauseDemo}
            disabled={stage >= 8}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-xl text-xs font-semibold text-white transition-all disabled:opacity-40"
          >
            {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
            {isPaused ? 'Auto Play' : 'Pause'}
          </button>
          <button
            onClick={nextStep}
            disabled={stage >= 8}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 bg-blue-600 hover:bg-blue-500 rounded-xl text-xs font-semibold text-white transition-all disabled:opacity-40 shadow-sm"
          >
            <SkipForward className="w-3.5 h-3.5" />
            Next Event →
          </button>
          <button
            onClick={resetDemo}
            className="p-2 bg-slate-800 hover:bg-red-500/20 hover:text-red-400 border border-slate-600 rounded-xl text-slate-400 transition-all"
            title="Reset Demo"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        {stage >= 8 && (
          <div className="mt-2.5 text-center">
            <p className="text-xs text-green-400 font-semibold">✓ Demo Scenario Completed</p>
          </div>
        )}
      </div>
    </div>
  );
}
