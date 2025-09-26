import React from 'react'
import { MaintenanceStatus, STATUS_LABELS, STATUS_COLORS } from '../../types/maintenance'

interface MaintenanceStatusBadgeProps {
  status: MaintenanceStatus
  size?: 'sm' | 'md' | 'lg'
}

const MaintenanceStatusBadge: React.FC<MaintenanceStatusBadgeProps> = ({
  status,
  size = 'md'
}) => {
  const label = STATUS_LABELS[status] || status
  const colorClass = STATUS_COLORS[status] || 'gray'

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-2 text-base'
  }

  const colorClasses: Record<string, string> = {
    gray: 'bg-gray-100 text-gray-800 border-gray-200',
    blue: 'bg-blue-100 text-blue-800 border-blue-200',
    purple: 'bg-purple-100 text-purple-800 border-purple-200',
    orange: 'bg-orange-100 text-orange-800 border-orange-200',
    yellow: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    cyan: 'bg-cyan-100 text-cyan-800 border-cyan-200',
    green: 'bg-green-100 text-green-800 border-green-200',
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
          ${colorClass === 'gray' ? 'bg-gray-400' : ''}
          ${colorClass === 'blue' ? 'bg-blue-400' : ''}
          ${colorClass === 'purple' ? 'bg-purple-400' : ''}
          ${colorClass === 'orange' ? 'bg-orange-400' : ''}
          ${colorClass === 'yellow' ? 'bg-yellow-400' : ''}
          ${colorClass === 'cyan' ? 'bg-cyan-400' : ''}
          ${colorClass === 'green' ? 'bg-green-400' : ''}
          ${colorClass === 'red' ? 'bg-red-400' : ''}
        `}
      />
      {label}
    </span>
  )
}

export default MaintenanceStatusBadge