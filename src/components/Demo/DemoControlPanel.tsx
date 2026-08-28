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
  const autoPlayRef = useRef<any>(null);

  const isRunning = demoState.isRunning;
  const isPaused = demoState.isPaused;
  const stage = demoState.stage;
  const scenarioType = demoState.scenarioType;

  // Auto-play
  useEffect(() => {
    if (isRunning && !isPaused && stage < 8) {
      autoPlayRef.current = setTimeout(() => {
        nextStep();
      }, 3000);
    }
    return () => {
      if (autoPlayRef.current) clearTimeout(autoPlayRef.current);
    };
  }, [isRunning, isPaused, stage, nextStep]);

  if (!isRunning && stage === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-6 z-40 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="bg-white border border-[#E5E3DE] rounded-xl shadow-xl p-4 w-80 text-[#171717]">
        {/* Header */}
        <div className="flex items-center justify-between pb-2 mb-3 border-b border-[#E5E3DE]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#171717] animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#171717]">
              Simulation Control
            </span>
          </div>

          {scenarioType && (
            <span
              className={`text-[10px] px-2 py-0.5 rounded font-semibold uppercase tracking-wider ${
                scenarioType === 'suspicious'
                  ? 'bg-[#C62828]/10 text-[#C62828] border border-[#C62828]/20'
                  : 'bg-[#26734D]/10 text-[#26734D] border border-[#26734D]/20'
              }`}
            >
              {scenarioType === 'suspicious' ? 'Suspicious' : 'Legitimate'}
            </span>
          )}
        </div>

        {/* Progress Strip */}
        <div className="mb-3.5 space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#6B6B6B]">Step {stage} of 8</span>
            <span className="font-semibold text-[#171717] truncate max-w-[140px]">
              {stageLabels[stage]}
            </span>
          </div>
          <div className="h-1.5 bg-[#F0EFEA] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#171717] rounded-full transition-all duration-500"
              style={{ width: `${(stage / 8) * 100}%` }}
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={pauseDemo}
            disabled={stage >= 8}
            className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 bg-[#F6F5F2] hover:bg-[#EBE9E4] border border-[#E5E3DE] rounded-lg text-xs font-semibold text-[#171717] transition-all disabled:opacity-40"
          >
            {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
            <span>{isPaused ? 'Resume' : 'Pause'}</span>
          </button>

          <button
            onClick={nextStep}
            disabled={stage >= 8}
            className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 bg-[#171717] hover:bg-[#2E2E2E] rounded-lg text-xs font-semibold text-white transition-all disabled:opacity-40 shadow-sm"
          >
            <SkipForward className="w-3.5 h-3.5" />
            <span>Next Step</span>
          </button>

          <button
            onClick={resetDemo}
            className="p-2 bg-[#F6F5F2] hover:bg-[#C62828]/10 hover:text-[#C62828] border border-[#E5E3DE] rounded-lg text-[#6B6B6B] transition-all"
            title="Reset Simulation"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        {stage >= 8 && (
          <div className="mt-2.5 pt-2 border-t border-[#E5E3DE] text-center">
            <p className="text-xs font-semibold text-[#26734D]">✓ Simulation Sequence Complete</p>
          </div>
        )}
      </div>
    </div>
  );
}
