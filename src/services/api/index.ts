// Exportar configuración de API
export * from './apiConfig'

// Exportar servicios activos
export * from './authService'
export { clientAuthService } from './clientAuthService'
export { userService } from './userService'
export type { User, CreateUserRequest, UpdateUserRequest, UserListResponse } from './userService'
export * from './categoryService'
export * from './productService'

// Exportar servicios CRM
export { clientService } from './clientService'
export type { ClientListParams } from './clientService'
export { viajeroService } from './viajeroService'
export type {
  Viajero,
  Periodicidad,
  CreateViajeroRequest,
  UpdateViajeroRequest,
  ViajeroListParams,
  ViajeroListResponse,
} from './viajeroService'
export { projectService } from './projectService'
export { catalogService } from './catalogService'

// Exportar servicios nuevos
export { quoteService } from './quoteService'
export { tenderService } from './tenderService'
export { eventService } from './eventService'
export { collaboratorService } from './collaboratorService'
export { documentService } from './documentService'
export { paymentService } from './paymentService'
export { orderService } from './orderService'
export { portalService } from './portalService'
export { recaudoService } from './recaudoService'
export type {
  RecaudoRow,
  RecaudoClient,
  RecaudoListParams,
  RecaudoListResponse,
  CreateRecaudoRequest,
  UpdateRecaudoRequest,
} from './recaudoService'
export { auditService } from './auditService'
export type { AuditLog, AuditLogData, AuditListParams, AuditListResponse } from './auditService'
export { dashboardService, LIMITE_DIAS_POR_PERIODICIDAD } from './dashboardService'
export type { DashboardKpis, DashboardAlert } from './dashboardService'
export { messageService } from './messageService'

// Exportar tipos comunes
export type { ApiResponse, ApiError } from './apiConfig'
export type { LoginCredentials, LoginResponse, DecodedToken, UserInfo } from './authService'
export type {
  Category,
  CreateCategoryRequest,
  CreateCategoryResponse,
  GetCategoriesResponse,
} from '@/types/CategoryType'

// Exportar tipos CRM
export type {
  Cliente,
  Client,
  ClientContact,
  ClientResource,
  CreateClienteRequest,
  UpdateClienteRequest,
  CreateClientRequest,
  UpdateClientRequest,
  Contacto,
  CreateContactoRequest,
  Proyecto,
  CreateProyectoRequest,
  UpdateProyectoRequest,
  Seguimiento,
  CreateSeguimientoRequest,
  TipoSeguimiento,
  Documento,
  EventoCronologia,
  EntidadTipo,
  TipoProyecto,
  Norma,
  EstadoProyecto,
  TipoServicio,
  CRMStats,
  FiltroEstado,
  CRMFilters,
  PaginatedResponse,
  PaginationParams,
  Cotizacion,
  CreateCotizacionRequest,
  UpdateCotizacionRequest,
  Licitacion,
  Tender,
  CreateTenderRequest,
  UpdateTenderRequest,
  TenderServiceItem,
  Evento,
  CreateEventoRequest,
  EventEntityType,
  EventType,
  DocumentoEntity,
  DocumentEntityType,
  DocumentType,
  Pago,
  CreatePagoRequest,
  Orden,
  Colaborador,
  CreateColaboradorRequest,
  UpdateColaboradorRequest,
  CompetenciaColaborador,
  DocumentoColaborador,
  EstadoColaborador,
} from '@/types/crmTypes'
