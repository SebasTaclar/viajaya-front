import { ref } from 'vue'

export interface MockUser {
  id: number
  name: string
  email: string
  cedula: string
  celular: string
  ubicacion: string
  periodicidad: 'diario' | 'mensual' | 'quincenal' | 'semanal'
  role: 'user' | 'admin' | 'superadmin'
  consentLey1581: boolean
  consentDate?: string
}

export const usuarios = ref<MockUser[]>([
  { id: 1, name: 'María Fernanda López', email: 'maria.lopez@correo.com', cedula: '1032456789', celular: '300 123 4567', ubicacion: 'Bogotá, Cundinamarca', periodicidad: 'mensual', role: 'user', consentLey1581: true, consentDate: '15/03/2026' },
  { id: 2, name: 'Carlos Andrés Gómez', email: 'carlos.gomez@correo.com', cedula: '80123456', celular: '310 987 6543', ubicacion: 'Medellín, Antioquia', periodicidad: 'quincenal', role: 'user', consentLey1581: true, consentDate: '02/04/2026' },
  { id: 3, name: 'Laura Valentina Ruiz', email: 'laura.ruiz@correo.com', cedula: '1098765432', celular: '320 456 7890', ubicacion: 'Cali, Valle del Cauca', periodicidad: 'semanal', role: 'user', consentLey1581: true, consentDate: '20/04/2026' },
  { id: 4, name: 'Jorge Eduardo Martínez', email: 'jorge.martinez@correo.com', cedula: '79876543', celular: '315 222 3344', ubicacion: 'Barranquilla, Atlántico', periodicidad: 'mensual', role: 'user', consentLey1581: false },
  { id: 5, name: 'Ana Sofía Hernández', email: 'ana.hernandez@correo.com', cedula: '1122334455', celular: '301 555 6677', ubicacion: 'Bucaramanga, Santander', periodicidad: 'quincenal', role: 'user', consentLey1581: true, consentDate: '10/05/2026' },
  { id: 6, name: 'Pedro Pablo Díaz', email: 'pedro.diaz@correo.com', cedula: '98765432', celular: '318 888 9900', ubicacion: 'Santa Marta, Magdalena', periodicidad: 'mensual', role: 'user', consentLey1581: true, consentDate: '28/05/2026' },
  { id: 7, name: 'Camila Restrepo', email: 'camila.restrepo@viajaya.com', cedula: '1055667788', celular: '312 111 2233', ubicacion: 'Bogotá, Cundinamarca', periodicidad: 'mensual', role: 'admin', consentLey1581: true, consentDate: '01/01/2026' },
  { id: 8, name: 'Diego Alberto Sánchez', email: 'diego.sanchez@viajaya.com', cedula: '81112223', celular: '304 444 5566', ubicacion: 'Medellín, Antioquia', periodicidad: 'quincenal', role: 'admin', consentLey1581: true, consentDate: '15/01/2026' },
  { id: 9, name: 'Valentina Ocampo', email: 'val.ocampo@correo.com', cedula: '1066778899', celular: '316 777 8899', ubicacion: 'Pereira, Risaralda', periodicidad: 'semanal', role: 'user', consentLey1581: true, consentDate: '03/06/2026' },
  { id: 10, name: 'Andrés Felipe Castro', email: 'andres.castro@correo.com', cedula: '72223334', celular: '319 000 1122', ubicacion: 'Manizales, Caldas', periodicidad: 'mensual', role: 'user', consentLey1581: false },
])
