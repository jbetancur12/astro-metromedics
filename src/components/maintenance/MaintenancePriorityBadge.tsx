import React from 'react'
import { MaintenancePriority, PRIORITY_LABELS, PRIORITY_COLORS } from '../../types/maintenance'

interface MaintenancePriorityBadgeProps {
  priority: MaintenancePriority
  size?: 'sm' | 'md' | 'lg'
}

const MaintenancePriorityBadge: React.FC<MaintenancePriorityBadgeProps> = ({
  priority,
  size = 'md'
}) => {
  const label = PRIORITY_LABELS[priority] || priority
  const colorClass = PRIORITY_COLORS[priority] || 'gray'

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-2 text-base'
  }

  const colorClasses: Record<string, string> = {
    green: 'bg-green-100 text-green-800 border-green-200',
    yellow: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    orange: 'bg-orange-100 text-orange-800 border-orange-200',
    red: 'bg-red-100 text-red-800 border-red-200'
  }

  return (
    <span
      className={`
        inline-flex items-center font-medium rounded-full border
        ${sizeClasses[size]}
        ${colorClasses[colorClass]}
      `}
    >
      <span
        className={`
          w-2 h-2 rounded-full mr-2
          ${colorClass === 'green' ? 'bg-green-400' : ''}
          ${colorClass === 'yellow' ? 'bg-yellow-400' : ''}
          ${colorClass === 'orange' ? 'bg-orange-400' : ''}
          ${colorClass === 'red' ? 'bg-red-400' : ''}
        `}
      />
      {label}
    </span>
  )
}

export default MaintenancePriorityBadge