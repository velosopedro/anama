interface ProgressBarProps {
  value: number;
}

export function ProgressBar({ value }: ProgressBarProps) {
  const safeValue = Math.min(100, Math.max(0, value));

  return (
    <div className="progress">
      <div className="progress-track">
        <div
          className="progress-value"
          style={{
            width: `${safeValue}%`,
          }}
        />
      </div>

      <span className="progress-label">{safeValue.toFixed(0)}%</span>
    </div>
  );
}
