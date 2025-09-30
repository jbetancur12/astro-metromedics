import { axiosPublic } from '../utils/api'
import type {
  MaintenanceCreateRequest,
  MaintenanceTrackingResponse,
  MaintenanceTicket,
  BackendTimelineEntry
} from '../types/maintenance'
import { MaintenanceAction } from '../types/maintenance'

// Helper function to map backend type to frontend action
const mapBackendTypeToAction = (backendType: string): MaintenanceAction => {
  switch (backendType) {
    case 'ticket_created':
      return MaintenanceAction.CREATED
    case 'status_update':
    case 'status_changed':
      return MaintenanceAction.STATUS_CHANGED
    case 'assigned':
    case 'technician_assigned':
      return MaintenanceAction.ASSIGNED
    case 'priority_changed':
      return MaintenanceAction.PRIORITY_CHANGED
    case 'comment_added':
      return MaintenanceAction.COMMENT_ADDED
    case 'file_uploaded':
    case 'file_upload':
      return MaintenanceAction.FILE_UPLOADED
    case 'scheduled':
    case 'work_scheduled':
      return MaintenanceAction.SCHEDULED
    case 'completed':
    case 'work_completed':
      return MaintenanceAction.COMPLETED
    case 'cancelled':
    case 'ticket_cancelled':
      return MaintenanceAction.CANCELLED
    case 'cost_updated':
      return MaintenanceAction.COST_UPDATED
    case 'work_started':
      return MaintenanceAction.STATUS_CHANGED
    case 'customer_contacted':
      return MaintenanceAction.COMMENT_ADDED
    case 'parts_ordered':
      return MaintenanceAction.STATUS_CHANGED
    case 'timeline_updated':
      return MaintenanceAction.STATUS_CHANGED
    default:
      return MaintenanceAction.STATUS_CHANGED
  }
}

// Maintenance API service
export const maintenanceApi = {
  // Create a new maintenance ticket (public endpoint)
  async createTicket(data: MaintenanceCreateRequest): Promise<any> {
    const formData = new FormData()

    // Add text fields
    Object.entries(data).forEach(([key, value]) => {
      if (key !== 'files' && value !== undefined) {
        formData.append(key, String(value))
      }
    })

    // Add files
    if (data.files) {
      data.files.forEach((file) => {
        formData.append('files', file)
      })
    }

    const response = await axiosPublic.post<any>(
      `/public/maintenance/tickets`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    )
    return response.data
  },

  // Track a maintenance ticket by number (public endpoint)
  async trackTicket(ticketNumber: string): Promise<MaintenanceTrackingResponse> {
    try {
      const response = await axiosPublic.get<any>(
        `public/maintenance/tickets/${ticketNumber}`
      )

      // Map backend timeline format to frontend format
      const mappedTimeline =
        response.data.timeline?.map((entry: BackendTimelineEntry) => ({
          id: entry.id,
          ticketId: response.data.id,
          action: mapBackendTypeToAction(entry.type),
          description: entry.description || entry.title,
          performedBy: entry.author || 'Sistema',
          performedAt: entry.timestamp,
          metadata: {
            title: entry.title,
            icon: entry.icon,
            authorType: entry.authorType
          }
        })) || []

      const ticket: MaintenanceTicket = {
        ...response.data,
        timeline: mappedTimeline
      }

      return {
        ticket,
        found: true,
        message: 'Ticket encontrado'
      }
    } catch (error: any) {
      if (error.response?.status === 404) {
        return {
          ticket: null,
          found: false,
          message: 'Ticket no encontrado'
        }
      }
      throw error
    }
  }
}

export default maintenanceApi