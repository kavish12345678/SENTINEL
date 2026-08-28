import { Play, Pause, RotateCcw, SkipForward } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useEffect, useRef } from 'react';

const stageLabels: Record<number, string> = {
  0: 'READY',
  1: 'NORMAL LOGIN',
  2: 'UNUSUAL TIME',
  3: 'RESOURCE ACCESS',
  4: 'BENEFICIARY MODIFIED',
  5: 'LIMIT RAISED',
  6: 'PAYMENT DISPATCHED',
  7: 'THREAT DETECTED',
  8: 'RESPONSE ACTIVE',
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
      }, 2600);
    }
    return () => {
      if (autoPlayRef.current) clearTimeout(autoPlayRef.current);
    };
  }, [isRunning, isPaused, stage, nextStep]);

  if (!isRunning && stage === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-12 right-6 z-50 animate-in fade-in slide-in-from-bottom-3 duration-250">
      <div className="bg-[#151617]/95 border border-[#292B2D] rounded-xl shadow-[0_12px_32px_rgba(0,0,0,0.65)] p-4 w-80 backdrop-blur-md">
        <div className="flex items-center justify-between gap-2 mb-3 pb-2.5 border-b border-[#292B2D]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#C19A5A] animate-pulse" />
            <span className="text-[11px] font-mono font-bold tracking-widest text-[#F2F0EA]">
              DEMO ENGINE
            </span>
          </div>
          {scenarioType && (
            <span
              className={`text-[10px] font-mono px-2 py-0.5 rounded border uppercase tracking-wider ${
                scenarioType === 'suspicious'
                  ? 'bg-[#A64444]/15 text-[#A64444] border-[#A64444]/40'
                  : 'bg-[#5F8669]/15 text-[#5F8669] border-[#5F8669]/40'
              }`}
            >
              {scenarioType === 'suspicious' ? 'SUSPICIOUS' : 'LEGITIMATE'}
            </span>
          )}
        </div>

        {/* Progress Timeline */}
        <div className="mb-3.5 space-y-1.5 font-mono">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-[#9A9A96]">STAGE {stage}/8</span>
            <span className="text-[#C19A5A] font-semibold">{stageLabels[stage] || 'COMPLETE'}</span>
          </div>
          <div className="h-1.5 bg-[#191A1C] rounded-full overflow-hidden border border-[#292B2D]">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                scenarioType === 'legitimate'
                  ? 'bg-[#5F8669]'
                  : stage >= 6
                  ? 'bg-[#A64444]'
                  : 'bg-[#C19A5A]'
              }`}
              style={{ width: `${Math.min(100, (stage / 8) * 100)}%` }}
            />
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2 font-mono">
          <button
            onClick={pauseDemo}
            disabled={stage >= 8}
            className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 bg-[#191A1C] hover:bg-[#242628] border border-[#292B2D] rounded-lg text-xs text-[#F2F0EA] transition-all disabled:opacity-40 btn-tactile"
          >
            {isPaused ? <Play className="w-3 h-3 text-[#C19A5A]" /> : <Pause className="w-3 h-3 text-[#C19A5A]" />}
            <span>{isPaused ? 'RESUME' : 'PAUSE'}</span>
          </button>
          <button
            onClick={nextStep}
            disabled={stage >= 8}
            className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 bg-[#C19A5A]/20 hover:bg-[#C19A5A]/30 border border-[#C19A5A]/50 rounded-lg text-xs font-semibold text-[#F2F0EA] transition-all disabled:opacity-40 btn-tactile"
          >
            <SkipForward className="w-3 h-3 text-[#C19A5A]" />
            <span>NEXT →</span>
          </button>
          <button
            onClick={resetDemo}
            className="p-1.5 bg-[#191A1C] hover:bg-[#A64444]/20 hover:text-[#A64444] border border-[#292B2D] rounded-lg text-[#9A9A96] transition-all btn-tactile"
            title="Reset Demo State"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        {stage >= 8 && (
          <div className="mt-2 text-center pt-2 border-t border-[#292B2D]">
            <p className="text-[11px] font-mono text-[#5F8669] font-medium">✓ SEQUENCE COMPLETE</p>
          </div>
        )}
      </div>
    </div>
  );
}
