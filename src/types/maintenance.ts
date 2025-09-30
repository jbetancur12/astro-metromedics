// Maintenance ticket interfaces and types
export interface MaintenanceTicket {
  id: string
  ticketCode: string
  customerName: string
  customerEmail: string
  customerPhone: string
  equipmentType: string
  equipmentBrand: string
  equipmentModel: string
  equipmentSerial: string
  issueDescription: string
  priority: MaintenancePriority
  status: MaintenanceStatus
  assignedTechnician?: MaintenanceTechnician
  technicianId?: string
  scheduledDate?: string
  completedDate?: string
  estimatedCost?: number
  actualCost?: number
  customerSatisfaction?: number
  location: string
  createdAt: string
  updatedAt: string
  comments: MaintenanceComment[]
  files: MaintenanceFile[]
  timeline: MaintenanceTimelineEntry[]
}

export interface MaintenanceTicketCreateResponse {
  message: string
  ticket: MaintenanceTicket
  ticketNumber: string
}

export interface MaintenanceComment {
  id: string
  ticketId: string
  userId: string
  userName: string
  userRole: string
  authorName: string
  authorType: string
  content: string
  commentType: string
  isInternal: boolean
  createdAt: string
}

export interface MaintenanceFile {
  id: string
  ticketId: string
  fileName: string
  originalName: string
  fileType: string
  fileSize: number
  filePath: string
  uploadedBy: string
  uploadedAt: string
  isImage: boolean
  isVideo: boolean
}

export interface MaintenanceTimelineEntry {
  id: string
  ticketId: string
  action: MaintenanceAction
  description: string
  performedBy: string
  performedAt: string
  metadata?: Record<string, any>
}

export interface MaintenanceTechnician {
  id: string
  name: string
  email: string
  phone: string
  specialization: string
  certifications: string
  status: 'active' | 'inactive' | 'on_leave'
  employeeId: string
  hireDate: string
  workload: number
  rating: number
  totalTicketsCompleted: number
  isAvailable: boolean
  maxWorkload: number
  notes: string
  createdAt: string
  updatedAt: string
  metrics?: {
    activeTickets: number
    monthlyCompleted: number
    workloadPercentage: number
    efficiency: number
  }
}

export interface MaintenanceCreateRequest {
  customerName: string
  customerEmail: string
  customerPhone: string
  equipmentType: string
  equipmentBrand: string
  equipmentModel: string
  equipmentSerial: string
  issueDescription: string
  priority?: MaintenancePriority
  location: string
  files?: File[]
}

export interface MaintenanceTrackingResponse {
  ticket: MaintenanceTicket | null
  found: boolean
  message?: string
}

// Enums
export enum MaintenanceStatus {
  PENDING = 'new',
  ASSIGNED = 'assigned',
  IN_PROGRESS = 'in_progress',
  ON_HOLD = 'on_hold',
  WAITING_PARTS = 'waiting_parts',
  WAITING_CUSTOMER = 'waiting_customer',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

export enum MaintenancePriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent'
}

export enum MaintenanceAction {
  CREATED = 'created',
  ASSIGNED = 'assigned',
  STATUS_CHANGED = 'status_changed',
  PRIORITY_CHANGED = 'priority_changed',
  COMMENT_ADDED = 'comment_added',
  FILE_UPLOADED = 'file_uploaded',
  SCHEDULED = 'scheduled',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  COST_UPDATED = 'cost_updated'
}

// Form validation interface
export interface MaintenanceFormErrors {
  customerName?: string
  customerEmail?: string
  customerPhone?: string
  equipmentType?: string
  equipmentBrand?: string
  equipmentModel?: string
  equipmentSerial?: string
  issueDescription?: string
  priority?: string
  location?: string
  files?: string
}

// API Response types
export interface MaintenanceApiResponse<T = any> {
  success: boolean
  data: T
  message?: string
  error?: string
}

// Backend timeline response types
export interface BackendTimelineEntry {
  id: string
  type: string
  title: string
  description: string
  timestamp: string
  author: string
  authorType?: string
  icon: string
}

// Equipment types list
export const EQUIPMENT_TYPES = [
  'Monitor de Signos Vitales',
  'Ventilador Mecánico',
  'Desfibrilador',
  'Electrocardiografo',
  'Bomba de Infusión',
  'Oxímetro de Pulso',
  'Aspirador',
  'Autoclave',
  'Microscopio',
  'Centrífuga',
  'Incubadora',
  'Lámpara Quirúrgica',
  'Mesa Quirúrgica',
  'Equipo de Rayos X',
  'Ecógrafo',
  'Otro'
] as const

// Priority and Status labels for UI
export const PRIORITY_LABELS: Record<MaintenancePriority, string> = {
  [MaintenancePriority.LOW]: 'Baja',
  [MaintenancePriority.MEDIUM]: 'Media',
  [MaintenancePriority.HIGH]: 'Alta',
  [MaintenancePriority.URGENT]: 'Urgente'
}

export const STATUS_LABELS: Record<MaintenanceStatus, string> = {
  [MaintenanceStatus.PENDING]: 'Pendiente',
  [MaintenanceStatus.ASSIGNED]: 'Asignado',
  [MaintenanceStatus.IN_PROGRESS]: 'En Progreso',
  [MaintenanceStatus.ON_HOLD]: 'En Espera',
  [MaintenanceStatus.WAITING_PARTS]: 'Esperando Repuestos',
  [MaintenanceStatus.WAITING_CUSTOMER]: 'Esperando Cliente',
  [MaintenanceStatus.COMPLETED]: 'Completado',
  [MaintenanceStatus.CANCELLED]: 'Cancelado'
}

// Priority colors for badges
export const PRIORITY_COLORS: Record<MaintenancePriority, string> = {
  [MaintenancePriority.LOW]: 'green',
  [MaintenancePriority.MEDIUM]: 'yellow',
  [MaintenancePriority.HIGH]: 'orange',
  [MaintenancePriority.URGENT]: 'red'
}

// Status colors for badges
export const STATUS_COLORS: Record<MaintenanceStatus, string> = {
  [MaintenanceStatus.PENDING]: 'gray',
  [MaintenanceStatus.ASSIGNED]: 'blue',
  [MaintenanceStatus.IN_PROGRESS]: 'purple',
  [MaintenanceStatus.ON_HOLD]: 'orange',
  [MaintenanceStatus.WAITING_PARTS]: 'yellow',
  [MaintenanceStatus.WAITING_CUSTOMER]: 'cyan',
  [MaintenanceStatus.COMPLETED]: 'green',
  [MaintenanceStatus.CANCELLED]: 'red'
}