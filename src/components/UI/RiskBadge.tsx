import { getRiskLevel, getRiskBgColor } from '../../utils/riskEngine';

interface RiskBadgeProps {
  score: number;
  showScore?: boolean;
  size?: 'xs' | 'sm' | 'md' | 'lg';
}

export default function RiskBadge({ score, showScore = true, size = 'md' }: RiskBadgeProps) {
  const level = getRiskLevel(score);
  const colorClass = getRiskBgColor(score);

  const sizeClass = {
    xs: 'text-[10px] px-1.5 py-0.5',
    sm: 'text-[11px] px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
    lg: 'text-sm px-3 py-1.5',
  }[size];

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-md border font-medium uppercase tracking-wider font-mono ${colorClass} ${sizeClass}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />
      <span>{level}</span>
      {showScore && <span className="opacity-90 font-semibold">{score}</span>}
    </span>
  );
}
