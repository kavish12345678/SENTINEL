import type { RiskLevel } from '../../types';

interface RiskBadgeProps {
  level: RiskLevel;
  score?: number;
  showScore?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function RiskBadge({
  level,
  score,
  showScore = false,
  className = '',
  size = 'md',
}: RiskBadgeProps) {
  const badgeStyles: Record<RiskLevel, string> = {
    LOW: 'bg-[#20201a] text-[#c7c7bf] border-[#464742]',
    MEDIUM: 'bg-[#5f4504]/30 text-[#e8c178] border-[#e8c178]/40',
    HIGH: 'bg-[#812627]/30 text-[#ffb3af] border-[#ffb3af]/40',
    CRITICAL: 'bg-[#93000a]/40 text-[#ffb4ab] border-[#ffb4ab] font-bold shadow-[0_0_8px_rgba(255,180,171,0.2)]',
  };

  const dotStyles: Record<RiskLevel, string> = {
    LOW: 'bg-[#91918a]',
    MEDIUM: 'bg-[#e8c178]',
    HIGH: 'bg-[#ffb3af]',
    CRITICAL: 'bg-[#ffb4ab] animate-pulse',
  };

  const sizeClasses = {
    sm: 'text-[10px] px-2 py-0.5 font-mono',
    md: 'text-xs px-2.5 py-1 font-mono',
    lg: 'text-sm px-3 py-1.5 font-mono',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-xs border uppercase tracking-wider ${badgeStyles[level]} ${sizeClasses[size]} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dotStyles[level]}`} />
      <span>{level}</span>
      {showScore && score !== undefined && (
        <span className="opacity-80">({score})</span>
      )}
    </span>
  );
}
