'use client'

interface ProgressRingProps {
  progress: number // 0-100
  size?: number
  strokeWidth?: number
  className?: string
  showPercentage?: boolean
  color?: string
}

export function ProgressRing({
  progress,
  size = 120,
  strokeWidth = 8,
  className = '',
  showPercentage = true,
  color = '#6366f1' // indigo-500
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (progress / 100) * circumference

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          className="text-slate-200 dark:text-slate-700"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      {showPercentage && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-black text-slate-900 dark:text-white">
            {Math.round(progress)}%
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Hotovo
          </span>
        </div>
      )}
    </div>
  )
}
