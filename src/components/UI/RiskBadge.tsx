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
    LOW: 'bg-[#26734D]/10 text-[#26734D] border-[#26734D]/25',
    MEDIUM: 'bg-[#A87516]/10 text-[#A87516] border-[#A87516]/25',
    HIGH: 'bg-[#C65D21]/10 text-[#C65D21] border-[#C65D21]/25',
    CRITICAL: 'bg-[#C62828]/10 text-[#C62828] border-[#C62828]/25 font-semibold',
  };

  const dotStyles: Record<RiskLevel, string> = {
    LOW: 'bg-[#26734D]',
    MEDIUM: 'bg-[#A87516]',
    HIGH: 'bg-[#C65D21]',
    CRITICAL: 'bg-[#C62828]',
  };

  const sizeClasses = {
    sm: 'text-[11px] px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
    lg: 'text-sm px-3 py-1.5',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md border font-medium uppercase tracking-wider ${badgeStyles[level]} ${sizeClasses[size]} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dotStyles[level]}`} />
      <span>{level}</span>
      {showScore && score !== undefined && (
        <span className="opacity-75 font-mono">({score})</span>
      )}
    </span>
  );
}
