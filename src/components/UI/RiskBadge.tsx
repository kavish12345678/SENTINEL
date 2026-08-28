import { getRiskLevel, getRiskBgColor } from '../../utils/riskEngine';

interface RiskBadgeProps {
  score: number;
  showScore?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export default function RiskBadge({ score, showScore = true, size = 'md' }: RiskBadgeProps) {
  const level = getRiskLevel(score);
  const colorClass = getRiskBgColor(score);

  const sizeClass = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
    lg: 'text-sm px-3 py-1.5',
  }[size];

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border font-semibold ${colorClass} ${sizeClass}`}>
      {level}
      {showScore && <span className="opacity-75">· {score}</span>}
    </span>
  );
}
