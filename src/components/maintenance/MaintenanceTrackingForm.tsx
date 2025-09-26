import React, { useState } from 'react'
import { Search, Person, LocationOn, Phone, Email, AttachFile, Schedule } from '@mui/icons-material'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import MaintenanceStatusBadge from './MaintenanceStatusBadge'
import MaintenancePriorityBadge from './MaintenancePriorityBadge'
import MaintenanceTimeline from './MaintenanceTimeline'
import { maintenanceApi } from '../../services/maintenanceApi'
import type { MaintenanceTrackingResponse } from '../../types/maintenance'

const MaintenanceTrackingForm: React.FC = () => {
  const [ticketNumber, setTicketNumber] = useState('')
  const [searchedTicketNumber, setSearchedTicketNumber] = useState('')
  const [trackingData, setTrackingData] = useState<MaintenanceTrackingResponse | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!ticketNumber.trim()) return

    setIsLoading(true)
    setError(null)
    setSearchedTicketNumber(ticketNumber.trim())

    try {
      const result = await maintenanceApi.trackTicket(ticketNumber.trim())
      setTrackingData(result)
    } catch (err: any) {
      console.error('Error tracking ticket:', err)
      setError('Error al buscar el ticket. Verifique el número e intente nuevamente.')
      setTrackingData(null)
    } finally {
      setIsLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd/MM/yyyy HH:mm', { locale: es })
    } catch {
      return 'Fecha inválida'
    }
  }

  const getInitials = (name: string) => {
    if (!name) return '??'
    return name
      .split(' ')
      .map((n) => n?.[0] || '')
      .join('')
      .toUpperCase()
      .slice(0, 2) || '??'
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header and Search */}
      <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
        <div className="text-center mb-8">
          <Search className="w-12 h-12 text-blue-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Seguimiento de Mantenimiento
          </h1>
          <p className="text-lg text-gray-600">
            Ingrese su número de ticket para ver el estado actual de su solicitud
          </p>
        </div>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="max-w-md mx-auto">
          <div className="flex gap-3">
            <div className="flex-1">
              <input
                type="text"
                value={ticketNumber}
                onChange={(e) => setTicketNumber(e.target.value)}
                placeholder="Ej: MTN-2024-001"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={isLoading}
              />
            </div>
            <button
              type="submit"
              disabled={!ticketNumber.trim() || isLoading}
              className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              <Search className="w-5 h-5 mr-2" />
              Buscar
            </button>
          </div>
        </form>

        {/* Loading indicator */}
        {isLoading && (
          <div className="mt-6 text-center">
            <div className="inline-flex items-center text-blue-600">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 mr-3"></div>
              <span className="font-medium">Buscando ticket...</span>
            </div>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-center">{error}</p>
          </div>
        )}

        {/* No results message */}
        {trackingData && !trackingData.found && (
          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-yellow-800 text-center">
              No se encontró un ticket con el número "{searchedTicketNumber}".
              Verifique que el número sea correcto.
            </p>
          </div>
        )}
      </div>

      {/* Ticket Details */}
      {trackingData?.found && trackingData.ticket && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Ticket Header */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  Ticket #{trackingData.ticket.ticketCode}
                </h2>
                <div className="flex gap-2">
                  <MaintenanceStatusBadge status={trackingData.ticket.status} />
                  <MaintenancePriorityBadge priority={trackingData.ticket.priority} />
                </div>
              </div>

              {/* Customer Information */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Información del Cliente
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center text-gray-600">
                    <Person className="w-5 h-5 mr-3 text-gray-400" />
                    <div>
                      <span className="font-medium">Nombre:</span>
                      <p className="text-gray-800">{trackingData.ticket.customerName}</p>
                    </div>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Email className="w-5 h-5 mr-3 text-gray-400" />
                    <div>
                      <span className="font-medium">Email:</span>
                      <p className="text-gray-800">{trackingData.ticket.customerEmail}</p>
                    </div>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Phone className="w-5 h-5 mr-3 text-gray-400" />
                    <div>
                      <span className="font-medium">Teléfono:</span>
                      <p className="text-gray-800">{trackingData.ticket.customerPhone}</p>
                    </div>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <LocationOn className="w-5 h-5 mr-3 text-gray-400" />
                    <div>
                      <span className="font-medium">Ubicación:</span>
                      <p className="text-gray-800">{trackingData.ticket.location}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Equipment Information */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Información del Equipo
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-600">
                  <div>
                    <span className="font-medium">Tipo:</span>
                    <p className="text-gray-800">{trackingData.ticket.equipmentType}</p>
                  </div>
                  <div>
                    <span className="font-medium">Marca:</span>
                    <p className="text-gray-800">{trackingData.ticket.equipmentBrand}</p>
                  </div>
                  <div>
                    <span className="font-medium">Modelo:</span>
                    <p className="text-gray-800">{trackingData.ticket.equipmentModel}</p>
                  </div>
                  <div>
                    <span className="font-medium">Serie:</span>
                    <p className="text-gray-800">{trackingData.ticket.equipmentSerial}</p>
                  </div>
                </div>
              </div>

              {/* Issue Description */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Descripción del Problema
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {trackingData.ticket.issueDescription}
                </p>
              </div>

              {/* Assigned Technician */}
              {trackingData.ticket.assignedTechnician && (
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Técnico Asignado
                  </h3>
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-lg mr-4">
                      {getInitials(trackingData.ticket.assignedTechnician.name)}
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">
                        {trackingData.ticket.assignedTechnician.name}
                      </p>
                      {trackingData.ticket.assignedTechnician.email && (
                        <p className="text-gray-600 text-sm">
                          {trackingData.ticket.assignedTechnician.email}
                        </p>
                      )}
                      {trackingData.ticket.assignedTechnician.specialization && (
                        <span className="inline-block mt-2 px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                          {trackingData.ticket.assignedTechnician.specialization}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Files */}
              {trackingData.ticket.files && trackingData.ticket.files.length > 0 && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Archivos Adjuntos
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {trackingData.ticket.files.map((file) => (
                      <div
                        key={file.id}
                        className="flex items-center p-3 bg-white rounded-lg border"
                      >
                        <AttachFile className="w-5 h-5 text-gray-400 mr-3" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {file.originalName}
                          </p>
                          <p className="text-xs text-gray-500">
                            {Math.round(file.fileSize / 1024)} KB
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Important Dates */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Fechas Importantes
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-700">Creado:</p>
                  <p className="text-gray-600">{formatDate(trackingData.ticket.createdAt)}</p>
                </div>

                {trackingData.ticket.scheduledDate && (
                  <div>
                    <p className="text-sm font-medium text-gray-700">Fecha Programada:</p>
                    <div className="flex items-center text-gray-600">
                      <Schedule className="w-4 h-4 mr-2" />
                      <span>{formatDate(trackingData.ticket.scheduledDate)}</span>
                    </div>
                  </div>
                )}

                {trackingData.ticket.completedDate && (
                  <div>
                    <p className="text-sm font-medium text-gray-700">Completado:</p>
                    <p className="text-gray-600">{formatDate(trackingData.ticket.completedDate)}</p>
                  </div>
                )}

                <div>
                  <p className="text-sm font-medium text-gray-700">Última Actualización:</p>
                  <p className="text-gray-600">{formatDate(trackingData.ticket.updatedAt)}</p>
                </div>
              </div>
            </div>

            {/* Customer Satisfaction */}
            {trackingData.ticket.customerSatisfaction && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Calificación del Servicio
                </h3>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    {trackingData.ticket.customerSatisfaction}/5
                  </div>
                  <p className="text-gray-600">estrellas</p>
                </div>
              </div>
            )}
          </div>

          {/* Timeline */}
          <div className="lg:col-span-3">
            <MaintenanceTimeline timeline={trackingData.ticket.timeline || []} />
          </div>
        </div>
      )}

      {/* Help Section */}
      <div className="mt-8 bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          ¿Necesita Ayuda?
        </h3>
        <p className="text-gray-600 mb-4">
          Si tiene preguntas sobre su solicitud de mantenimiento o necesita
          asistencia adicional, puede contactarnos a través de:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="font-medium text-gray-700">Email:</span>
            <p className="text-gray-600">mantenimiento@metromedicslab.com.co</p>
          </div>
          <div>
            <span className="font-medium text-gray-700">Teléfono:</span>
            <p className="text-gray-600">(601) 123-4567</p>
          </div>
          <div>
            <span className="font-medium text-gray-700">Horario:</span>
            <p className="text-gray-600">Lunes a Viernes, 8:00 AM - 6:00 PM</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MaintenanceTrackingForm