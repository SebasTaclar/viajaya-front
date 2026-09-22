import type { Cliente, Proyecto, Cotizacion, Evento, Colaborador, Licitacion } from '@/types/crmTypes'

function daysFromNow(days: number, hour = 10, minute = 0): string {
  const d = new Date()
  d.setDate(d.getDate() + days)
  d.setHours(hour, minute, 0, 0)
  return d.toISOString()
}

function monthsAgo(months: number, day = 15): string {
  const d = new Date()
  d.setMonth(d.getMonth() - months)
  d.setDate(day)
  d.setHours(10, 0, 0, 0)
  return d.toISOString()
}

function monthDate(months: number, day = 15): string {
  const d = new Date()
  d.setMonth(d.getMonth() - months)
  d.setDate(day)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

const nowIso = () => new Date().toISOString()

export function createMockClientes(): Cliente[] {
  const estado = 'activo' as const
  const updatedAt = nowIso()
  const baseExtras = {
    departamento: 'Bogotá D.C.',
    telefono: '+57 601 745 1200',
    paginaWeb: 'https://somosviajaya.com',
    estado,
    isActive: true,
    isProspect: false,
    updatedAt,
  }
  return [
    { id: 1, razonSocial: 'Corporación Turística del Caribe S.A.S', nit: '901458723-1', codigo: 'VY-001', tipoOrganizacion: 'Operador turístico', ciudad: 'Cartagena', direccion: 'Calle 100 # 71-21', correo: 'gerencia@turismocaribe.co', createdAt: monthsAgo(0, 8), contactosCount: 3, proyectosCount: 2, ...baseExtras },
    { id: 2, razonSocial: 'Andes Travel Group', nit: '830112456-9', codigo: 'VY-002', tipoOrganizacion: 'Agencia de viajes', ciudad: 'Medellín', direccion: 'Cra 43A # 1-50', correo: 'contacto@andestravel.com', createdAt: monthsAgo(0, 18), contactosCount: 2, proyectosCount: 1, ...baseExtras },
    { id: 3, razonSocial: 'Ministerio de Turismo - Regional Andina', nit: '899999101-2', codigo: 'VY-003', tipoOrganizacion: 'Ente público', ciudad: 'Bogotá D.C.', direccion: 'Calle 100 # 71-21', correo: 'turismo.region@mincitur.gov.co', createdAt: monthsAgo(1, 12), contactosCount: 4, proyectosCount: 2, ...baseExtras },
    { id: 4, razonSocial: 'Hotel Costa Azul Internacional', nit: '900334521-8', codigo: 'VY-004', tipoOrganizacion: 'Hotelería', ciudad: 'Santa Marta', direccion: 'Blvd del Zona Grau 3-21', correo: 'reservas@costaazul.co', createdAt: monthsAgo(1, 25), contactosCount: 2, proyectosCount: 1, ...baseExtras },
    { id: 5, razonSocial: 'Aventuras Colombianas Ltda', nit: '811045678-3', codigo: 'VY-005', tipoOrganizacion: 'Turismo de aventura', ciudad: 'San Gil', direccion: 'Cra 7 # 12-40', correo: 'info@aventurascol.co', createdAt: monthsAgo(2, 10), contactosCount: 1, proyectosCount: 1, ...baseExtras },
    { id: 6, razonSocial: 'Universidad del Turismo y Hospitalidad', nit: '860033112-5', codigo: 'VY-006', tipoOrganizacion: 'Educación', ciudad: 'Cali', direccion: 'Av. 6N # 23-15', correo: 'decanatura@udt.edu.co', createdAt: monthsAgo(3, 5), contactosCount: 3, proyectosCount: 1, ...baseExtras },
    { id: 7, razonSocial: 'Panorama Tours Bogotá', nit: '901112334-6', codigo: 'VY-007', tipoOrganizacion: 'Agencia receptiva', ciudad: 'Bogotá D.C.', direccion: 'Cra 11 # 93-52', correo: 'ventas@panoramatours.co', createdAt: monthsAgo(4, 20), contactosCount: 2, proyectosCount: 1, ...baseExtras },
    { id: 8, razonSocial: 'Exportadora de Experiencias Sur', nit: '901778899-0', codigo: 'VY-008', tipoOrganizacion: 'DMC', ciudad: 'Leticia', direccion: 'Cl 15 # 5-40', correo: 'hello@experienciassur.co', createdAt: monthsAgo(5, 14), contactosCount: 2, proyectosCount: 1, ...baseExtras },
  ]
}

function travelServices(margin: number) {
  const base = 45000000
  const total = base
  const provider = Math.round(base * (1 - margin))
  return [
    {
      name: 'Paquete corporativo todo incluido',
      norm: 'SERVICIOS TURÍSTICOS',
      quantity: 1,
      unitPrice: total,
      discount: 0,
      subtotal: total,
      subtotalWithDiscount: total,
      iva: Math.round(total * 0.19),
      totalPrice: Math.round(total * 1.19),
      collaborator: 'Operador local',
      providerTotalPrice: provider,
      providerRole: 'Proveedor',
      pretaxProfit: total - provider,
      ica: 0,
      simpleTax: 0,
    },
  ]
}

export function createMockProyectos(): Proyecto[] {
  return [
    { id: 1, consecutive: 1, abbreviation: 'VY', code: 'VY-P-001', clientId: 1, client: { id: 1, name: 'Corporación Turística del Caribe S.A.S' }, projectType: 'Paquete corporativo', serviceType: 'Operación', norm: 'Turismo', status: 'En Ejecucion', responsible: 'Laura Gómez', startDate: monthDate(1, 5), endDate: monthDate(0, 28), description: 'Inauguración sede Cartagena con 80 colaboradores', createdAt: monthsAgo(1, 5), updatedAt: nowIso(), totalCost: 45000000, services: travelServices(0.32) },
    { id: 2, consecutive: 2, abbreviation: 'VY', code: 'VY-P-002', clientId: 2, client: { id: 2, name: 'Andes Travel Group' }, projectType: 'Congreso', serviceType: 'Logística', norm: 'Turismo', status: 'En Ejecucion', responsible: 'Carlos Mejía', startDate: monthDate(0, 10), endDate: monthDate(-1, 5), description: 'Congreso anual Medellín - 250 asistentes', createdAt: monthsAgo(0, 12), updatedAt: nowIso(), totalCost: 82000000, services: travelServices(0.28) },
    { id: 3, consecutive: 3, abbreviation: 'VY', code: 'VY-P-003', clientId: 3, client: { id: 3, name: 'Ministerio de Turismo - Regional Andina' }, projectType: 'Viaje incentive', serviceType: 'Operación', norm: 'Turismo', status: 'Finalizado', responsible: 'Ana Restrepo', startDate: monthDate(2, 1), endDate: monthDate(1, 20), description: 'Incentive equipo regional a Santa Marta', createdAt: monthsAgo(2, 1), updatedAt: monthsAgo(1, 20), totalCost: 36000000, services: travelServices(0.25) },
    { id: 4, consecutive: 4, abbreviation: 'VY', code: 'VY-P-004', clientId: 5, client: { id: 5, name: 'Aventuras Colombianas Ltda' }, projectType: 'Tour ecológico', serviceType: 'Diseño de ruta', norm: 'Turismo', status: 'Cotizacion', responsible: 'Laura Gómez', startDate: monthDate(-1, 1), description: 'Ruta 5 días Eje Cafetero para 30 personas', createdAt: monthsAgo(0, 22), updatedAt: nowIso(), totalCost: 28000000, services: travelServices(0.3) },
    { id: 5, consecutive: 5, abbreviation: 'VY', code: 'VY-P-005', clientId: 4, client: { id: 4, name: 'Hotel Costa Azul Internacional' }, projectType: 'Plan corporativo', serviceType: 'Paquetes', norm: 'Turismo', status: 'Aprobado', responsible: 'Diego Torres', startDate: monthDate(0, 5), endDate: monthDate(-2, 15), description: 'Bloque de habitaciones Q4 para clientes premium', createdAt: monthsAgo(1, 28), updatedAt: nowIso(), totalCost: 54000000, services: travelServices(0.35) },
    { id: 6, consecutive: 6, abbreviation: 'VY', code: 'VY-P-006', clientId: 7, client: { id: 7, name: 'Panorama Tours Bogotá' }, projectType: 'Feria', serviceType: 'Stand y activaciones', norm: 'Turismo', status: 'En Ejecucion', responsible: 'Carlos Mejía', startDate: monthDate(0, 2), endDate: monthDate(-1, 10), description: 'Participación Feria Internacional de Turismo Bogotá', createdAt: monthsAgo(0, 3), updatedAt: nowIso(), totalCost: 61000000, services: travelServices(0.22) },
    { id: 7, consecutive: 7, abbreviation: 'VY', code: 'VY-P-007', clientId: 6, client: { id: 6, name: 'Universidad del Turismo y Hospitalidad' }, projectType: 'Retiro ejecutivo', serviceType: 'Operación', norm: 'Turismo', status: 'Finalizado', responsible: 'Ana Restrepo', startDate: monthDate(3, 10), endDate: monthDate(3, 14), description: 'Retiro de equipo directivo a San Andrés', createdAt: monthsAgo(3, 10), updatedAt: monthsAgo(3, 15), totalCost: 41000000, services: travelServices(0.27) },
    { id: 8, consecutive: 8, abbreviation: 'VY', code: 'VY-P-008', clientId: 5, client: { id: 5, name: 'Aventuras Colombianas Ltda' }, projectType: 'Capacitación', serviceType: 'Taller', norm: 'Turismo', status: 'Suspendido', responsible: 'Diego Torres', startDate: monthDate(2, 18), endDate: monthDate(2, 19), description: 'Taller de guías para circuito Tayrona (suspendido)', createdAt: monthsAgo(2, 18), updatedAt: monthsAgo(2, 25), totalCost: 12000000, services: [] },
    { id: 9, consecutive: 9, abbreviation: 'VY', code: 'VY-P-009', clientId: 8, client: { id: 8, name: 'Exportadora de Experiencias Sur' }, projectType: 'Ruta gastronómica', serviceType: 'Diseño', norm: 'Turismo', status: 'En Ejecucion', responsible: 'Laura Gómez', startDate: monthDate(0, 1), endDate: monthDate(-2, 20), description: 'Ruta gastronómica Popayán - 3 días', createdAt: monthsAgo(4, 14), updatedAt: nowIso(), totalCost: 19000000, services: travelServices(0.31) },
    { id: 10, consecutive: 10, abbreviation: 'VY', code: 'VY-P-010', clientId: 8, client: { id: 8, name: 'Exportadora de Experiencias Sur' }, projectType: 'Expedición', serviceType: 'Operación', norm: 'Turismo', status: 'Cotizacion', responsible: 'Carlos Mejía', startDate: monthDate(-2, 1), description: 'Expedición Amazonas 7 días - cuadruple', createdAt: monthsAgo(5, 14), updatedAt: nowIso(), totalCost: 73000000, services: travelServices(0.26) },
  ]
}

export function createMockCotizaciones(): Cotizacion[] {
  return [
    { id: 1, code: 'COT-VY-0241', clientId: 2, client: { id: 2, name: 'Andes Travel Group', email: 'contacto@andestravel.com' }, status: 'pendiente', totalAmount: 97600000, validUntil: daysFromNow(10), createdAt: daysFromNow(-1, 9, 30), updatedAt: nowIso(), services: [{ name: 'Congreso Medellín', quantity: 1, billingType: 'ONETIME', value: 82000000 }] },
    { id: 2, code: 'COT-VY-0240', clientId: 1, client: { id: 1, name: 'Corporación Turística del Caribe S.A.S' }, status: 'enviada', totalAmount: 53550000, validUntil: daysFromNow(7), createdAt: daysFromNow(-2, 15, 10), updatedAt: nowIso() },
    { id: 3, code: 'COT-VY-0239', clientId: 5, client: { id: 5, name: 'Aventuras Colombianas Ltda' }, status: 'pendiente', totalAmount: 33320000, validUntil: daysFromNow(14), createdAt: daysFromNow(-3, 11, 0), updatedAt: nowIso() },
    { id: 4, code: 'COT-VY-0238', clientId: 4, client: { id: 4, name: 'Hotel Costa Azul Internacional' }, status: 'aprobada', totalAmount: 64260000, validUntil: daysFromNow(-5), createdAt: daysFromNow(-8, 10, 0), updatedAt: daysFromNow(-5) },
    { id: 5, code: 'COT-VY-0237', clientId: 7, client: { id: 7, name: 'Panorama Tours Bogotá' }, status: 'aprobada', totalAmount: 72590000, validUntil: daysFromNow(-12), createdAt: daysFromNow(-15, 14, 0), updatedAt: daysFromNow(-12) },
    { id: 6, code: 'COT-VY-0236', clientId: 3, client: { id: 3, name: 'Ministerio de Turismo - Regional Andina' }, status: 'rechazada', totalAmount: 42840000, validUntil: daysFromNow(-20), createdAt: daysFromNow(-25, 9, 0), updatedAt: daysFromNow(-20) },
    { id: 7, code: 'COT-VY-0235', clientId: 6, client: { id: 6, name: 'Universidad del Turismo y Hospitalidad' }, status: 'vencida', totalAmount: 48790000, validUntil: daysFromNow(-30), createdAt: daysFromNow(-35, 16, 0), updatedAt: daysFromNow(-30) },
    { id: 8, code: 'COT-VY-0234', clientId: 8, client: { id: 8, name: 'Exportadora de Experiencias Sur' }, status: 'enviada', totalAmount: 86870000, validUntil: daysFromNow(21), createdAt: daysFromNow(-5, 8, 45), updatedAt: nowIso() },
  ]
}

export function createMockEventos(): Evento[] {
  return [
    { id: 1, entityType: 'project', entityId: 2, type: 'Reunión', title: 'Kickoff congreso Medellín', client: 'Andes Travel Group', modalidad: 'Presencial', location: 'Medellín', description: 'Alcance, agenda y proveedores del congreso', user: 'Carlos Mejía', date: daysFromNow(3, 9, 0), endDate: daysFromNow(3, 11, 0), createdAt: nowIso() },
    { id: 2, entityType: 'client', entityId: 1, type: 'Asesoría Presencial', title: 'Ajuste paquete inauguración', client: 'Corporación Turística del Caribe S.A.S', modalidad: 'Presencial', location: 'Cartagena', description: 'Revisión de itinerario y menús especiales', user: 'Laura Gómez', date: daysFromNow(5, 14, 0), endDate: daysFromNow(5, 16, 0), createdAt: nowIso() },
    { id: 3, entityType: 'quote', entityId: 3, type: 'Asesoría Virtual', title: 'Seguimiento cotización Eje Cafetero', client: 'Aventuras Colombianas Ltda', modalidad: 'Virtual', location: 'Zoom', description: 'Presentar opciones de hospedaje boutique', user: 'Ana Restrepo', date: daysFromNow(8, 10, 30), endDate: daysFromNow(8, 11, 30), createdAt: nowIso() },
    { id: 4, entityType: 'project', entityId: 6, type: 'Compromiso', title: 'Montaje stand feria Bogotá', client: 'Panorama Tours Bogotá', modalidad: 'Presencial', location: 'Corferias', description: 'Coordinar logística de montaje', user: 'Diego Torres', date: daysFromNow(12, 7, 0), endDate: daysFromNow(12, 18, 0), createdAt: nowIso() },
    { id: 5, entityType: 'client', entityId: 4, type: 'Reunión', title: 'Bloque hotelero trimestral', client: 'Hotel Costa Azul Internacional', modalidad: 'Virtual', location: 'Meet', description: 'Confirmar cupos y tarifas bloque', user: 'Laura Gómez', date: daysFromNow(16, 15, 0), endDate: daysFromNow(16, 16, 0), createdAt: nowIso() },
    { id: 6, entityType: 'project', entityId: 1, type: 'Capacitación', title: 'Briefing guías inauguración', client: 'Corporación Turística del Caribe S.A.S', modalidad: 'Presencial', location: 'Cartagena', description: 'Protocolo de bienvenida y protocolo VIP', user: 'Ana Restrepo', date: daysFromNow(20, 8, 0), endDate: daysFromNow(20, 12, 0), createdAt: nowIso() },
    { id: 7, entityType: 'project', entityId: 3, type: 'Reunión', title: 'Cierre incentive Santa Marta', client: 'Ministerio de Turismo - Regional Andina', modalidad: 'Presencial', location: 'Santa Marta', description: 'Entrega de informe final y lecciones aprendidas', user: 'Carlos Mejía', date: daysFromNow(-4, 10, 0), endDate: daysFromNow(-4, 12, 0), createdAt: daysFromNow(-6) },
    { id: 8, entityType: 'quote', entityId: 4, type: 'Asesoría Virtual', title: 'Aprobación plan corporativo', client: 'Hotel Costa Azul Internacional', modalidad: 'Virtual', location: 'Meet', description: 'Viabilizar descuentos y condiciones', user: 'Diego Torres', date: daysFromNow(-9, 11, 0), endDate: daysFromNow(-9, 12, 0), createdAt: daysFromNow(-10) },
    { id: 9, entityType: 'project', entityId: 7, type: 'Compromiso', title: 'Post-mortem retiro San Andrés', client: 'Universidad del Turismo y Hospitalidad', modalidad: 'Presencial', location: 'Cali', description: 'Encuesta NPS y retro del equipo', user: 'Laura Gómez', date: daysFromNow(-14, 16, 0), endDate: daysFromNow(-14, 17, 0), createdAt: daysFromNow(-15) },
    { id: 10, entityType: 'client', entityId: 8, type: 'Reunión', title: 'Propuesta expedición Amazonas', client: 'Exportadora de Experiencias Sur', modalidad: 'Virtual', location: 'Zoom', description: 'Alcance logístico y permisos', user: 'Ana Restrepo', date: daysFromNow(1, 9, 30), endDate: daysFromNow(1, 10, 30), createdAt: nowIso() },
  ]
}

export function createMockColaboradores(): Colaborador[] {
  return [
    { id: 1, nombre: 'María Fernanda Ríos', estudios: 'Tecnóloga en Gestión Turística', areaPrincipal: 'Operación de tours', normasCount: 3, ciudad: 'Cartagena', estado: 'asignado', celular: '300 555 1201', correo: 'mrios@somosviajaya.com', competencias: [{ id: 1, area: 'Operación', norma: 'Guía local', descripcion: 'Rutas históricas y culturales Cartagena' }], documentos: [{ id: 1, nombre: 'Hoja de vida', tipo: 'hoja_de_vida', estado: 'completo' }] },
    { id: 2, nombre: 'Andrés Felipe Castaño', estudios: 'Administrador de Empresas Turísticas', areaPrincipal: 'Logística de eventos', normasCount: 2, ciudad: 'Medellín', estado: 'disponible', celular: '310 555 2202', correo: 'acastano@somosviajaya.com', competencias: [{ id: 2, area: 'Eventos', norma: 'Congresos', descripcion: 'Coordinación de aforos y proveedores' }], documentos: [{ id: 2, nombre: 'Hoja de vida', tipo: 'hoja_de_vida', estado: 'completo' }] },
    { id: 3, nombre: 'Juliana Vargas Peña', estudios: 'Ing. Industrial - Turismo', areaPrincipal: 'Atención al viajero', normasCount: 4, ciudad: 'Bogotá D.C.', estado: 'disponible', celular: '320 555 3303', correo: 'jvargas@somosviajaya.com', competencias: [{ id: 3, area: 'Servicio', norma: 'CX', descripcion: 'Atención premium y reclamos' }], documentos: [{ id: 3, nombre: 'Hoja de vida', tipo: 'hoja_de_vida', estado: 'completo' }] },
    { id: 4, nombre: 'Sebastián Ortiz León', estudios: 'Guía de turismo', areaPrincipal: 'Guianza', normasCount: 2, ciudad: 'Santa Marta', estado: 'asignado', celular: '301 555 4404', correo: 'sortiz@somosviajaya.com', competencias: [{ id: 4, area: 'Guianza', norma: 'Tayrona', descripcion: 'Senderos y interpretación ambiental' }], documentos: [{ id: 4, nombre: 'Hoja de vida', tipo: 'hoja_de_vida', estado: 'pendiente' }] },
    { id: 5, nombre: 'Paola Andrea Méndez', estudios: 'Hotelería y alojamiento', areaPrincipal: 'Bloque hotelero', normasCount: 3, ciudad: 'Cali', estado: 'documentacion_pendiente', celular: '315 555 5505', correo: 'pmendez@somosviajaya.com', competencias: [{ id: 5, area: 'Alojamiento', norma: 'Negociación', descripcion: 'Tarifas y cupos temporada alta' }], documentos: [{ id: 5, nombre: 'Hoja de vida', tipo: 'hoja_de_vida', estado: 'completo' }, { id: 6, nombre: 'Certificados', tipo: 'certificado', estado: 'faltante' }] },
    { id: 6, nombre: 'Ricardo Salazar Vega', estudios: 'Contador - Turismo', areaPrincipal: 'Facturación y costos', normasCount: 1, ciudad: 'Bogotá D.C.', estado: 'disponible', celular: '317 555 6606', correo: 'rsalazar@somosviajaya.com', competencias: [{ id: 6, area: 'Finanzas', norma: 'Costos', descripcion: 'Margen por programa y liquidación' }], documentos: [{ id: 7, nombre: 'Hoja de vida', tipo: 'hoja_de_vida', estado: 'completo' }] },
  ]
}

export function createMockLicitaciones(): Licitacion[] {
  return [
    { id: 1, oferta: 'OF-VY-011', tipo: 'minima_cuantia', tipoLabel: 'Mínima Cuantía', numeroProceso: 'MC-TUR-088-2026', clienteNombre: 'GOBERNACIÓN DEL MAGDALENA', servicio: 'Viaje de incentivo funcionarios', norma: 'Contratación estatal', estado: 'en_curso', fechaPublicacion: monthDate(0, 5), createdAt: monthsAgo(0, 5) },
    { id: 2, oferta: 'OF-VY-010', tipo: 'publica', tipoLabel: 'Licitación Pública', numeroProceso: 'LP-0452-2026', clienteNombre: 'UNIVERSIDAD NACIONAL - SEDE MEDELLÍN', servicio: 'Logística congreso académico', norma: 'Calidad de servicio', estado: 'publicada', fechaPublicacion: monthDate(1, 12), createdAt: monthsAgo(1, 12) },
    { id: 3, oferta: 'OF-VY-009', tipo: 'contratacion_especial', tipoLabel: 'Contratación especial', numeroProceso: 'CE-DICT-019-2026', clienteNombre: 'DIRECCIÓN DE TURISMO DE BOGOTÁ', servicio: 'Ruta receptiva visitantes internacionales', norma: 'Sostenibilidad turística', estado: 'adjudicada', fechaPublicacion: monthDate(3, 20), createdAt: monthsAgo(3, 20) },
  ]
}

export function createMockEntityNames(): Record<string, string> {
  const map: Record<string, string> = {}
  createMockClientes().forEach(c => { map[`client:${c.id}`] = c.razonSocial })
  createMockProyectos().forEach(p => { map[`project:${p.id}`] = p.code })
  createMockCotizaciones().forEach(q => { map[`quote:${q.id}`] = q.code })
  createMockLicitaciones().forEach(t => { map[`tender:${t.id}`] = t.oferta || t.numeroProceso })
  return map
}
