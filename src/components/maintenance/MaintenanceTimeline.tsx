import React from 'react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import {
  Build,
  Person,
  CheckCircle,
  Schedule,
  Comment,
  AttachFile,
  Cancel,
  Assignment,
  Update,
  MonetizationOn
} from '@mui/icons-material'
import type { MaintenanceTimelineEntry } from '../../types/maintenance'
import { MaintenanceAction } from '../../types/maintenance'

interface MaintenanceTimelineProps {
  timeline: MaintenanceTimelineEntry[]
}

const MaintenanceTimeline: React.FC<MaintenanceTimelineProps> = ({ timeline }) => {
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd/MM/yyyy HH:mm', { locale: es })
    } catch {
      return 'Fecha inválida'
    }
  }

  const getActionIcon = (action: MaintenanceAction) => {
    switch (action) {
      case MaintenanceAction.CREATED:
        return <Build className="w-5 h-5" />
      case MaintenanceAction.ASSIGNED:
        return <Person className="w-5 h-5" />
      case MaintenanceAction.STATUS_CHANGED:
        return <Update className="w-5 h-5" />
      case MaintenanceAction.PRIORITY_CHANGED:
        return <Assignment className="w-5 h-5" />
      case MaintenanceAction.COMMENT_ADDED:
        return <Comment className="w-5 h-5" />
      case MaintenanceAction.FILE_UPLOADED:
        return <AttachFile className="w-5 h-5" />
      case MaintenanceAction.SCHEDULED:
        return <Schedule className="w-5 h-5" />
      case MaintenanceAction.COMPLETED:
        return <CheckCircle className="w-5 h-5" />
      case MaintenanceAction.CANCELLED:
        return <Cancel className="w-5 h-5" />
      case MaintenanceAction.COST_UPDATED:
        return <MonetizationOn className="w-5 h-5" />
      default:
        return <Update className="w-5 h-5" />
    }
  }

  const getActionColor = (action: MaintenanceAction) => {
    switch (action) {
      case MaintenanceAction.CREATED:
        return 'text-blue-600 bg-blue-100'
      case MaintenanceAction.ASSIGNED:
        return 'text-purple-600 bg-purple-100'
      case MaintenanceAction.STATUS_CHANGED:
        return 'text-gray-600 bg-gray-100'
      case MaintenanceAction.PRIORITY_CHANGED:
        return 'text-orange-600 bg-orange-100'
      case MaintenanceAction.COMMENT_ADDED:
        return 'text-cyan-600 bg-cyan-100'
      case MaintenanceAction.FILE_UPLOADED:
        return 'text-indigo-600 bg-indigo-100'
      case MaintenanceAction.SCHEDULED:
        return 'text-yellow-600 bg-yellow-100'
      case MaintenanceAction.COMPLETED:
        return 'text-green-600 bg-green-100'
      case MaintenanceAction.CANCELLED:
        return 'text-red-600 bg-red-100'
      case MaintenanceAction.COST_UPDATED:
        return 'text-emerald-600 bg-emerald-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  if (!timeline || timeline.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Historial del Ticket
        </h3>
        <p className="text-gray-500 text-center py-8">
          No hay eventos en el historial
        </p>
      </div>
    )
  }

  // Sort timeline by date (newest first)
  const sortedTimeline = [...timeline].sort(
    (a, b) => new Date(b.performedAt).getTime() - new Date(a.performedAt).getTime()
  )

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-6">
        Historial del Ticket
      </h3>

      <div className="flow-root">
        <ul className="-mb-8">
          {sortedTimeline.map((entry, entryIdx) => (
            <li key={entry.id}>
              <div className="relative pb-8">
                {entryIdx !== sortedTimeline.length - 1 ? (
                  <span
                    className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                    aria-hidden="true"
                  />
                ) : null}

                <div className="relative flex space-x-3">
                  <div>
                    <span
                      className={`
                        h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white
                        ${getActionColor(entry.action)}
                      `}
                    >
                      {getActionIcon(entry.action)}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0 pt-1.5">
                    <div>
                      <p className="text-sm text-gray-900 font-medium">
                        {entry.description}
                      </p>
                      <div className="mt-1 flex items-center space-x-2 text-xs text-gray-500">
                        <span>
                          Por: <span className="font-medium">{entry.performedBy}</span>
                        </span>
                        <span>•</span>
                        <time dateTime={entry.performedAt}>
                          {formatDate(entry.performedAt)}
                        </time>
                      </div>

                      {/* Additional metadata */}
                      {entry.metadata?.title && entry.metadata.title !== entry.description && (
                        <p className="mt-2 text-sm text-gray-600">
                          {entry.metadata.title}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Legend */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Leyenda de Estados</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-blue-100 flex items-center justify-center">
              <Build className="w-2 h-2 text-blue-600" />
            </div>
            <span className="text-gray-600">Creado</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-purple-100 flex items-center justify-center">
              <Person className="w-2 h-2 text-purple-600" />
            </div>
            <span className="text-gray-600">Asignado</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-yellow-100 flex items-center justify-center">
              <Schedule className="w-2 h-2 text-yellow-600" />
            </div>
            <span className="text-gray-600">Programado</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle className="w-2 h-2 text-green-600" />
            </div>
            <span className="text-gray-600">Completado</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MaintenanceTimeline