import { createI18n } from 'vue-i18n'

export type SupportedLocale = 'es' | 'en'

const STORAGE_KEY = 'viajaya_locale'

const messages = {
	es: {
		whatsapp: {
			defaultMessage:
				'Hola, cordial saludo. Me interesa conocer más sobre los viajes y experiencias de Viaja Ya. ¿Podrían ayudarme?'
		},
		store: {
			pickup: {
				title: 'Edificio Víctor Melo · Local 07',
				addressLine: 'Cl. 12 #6-10 · La Candelaria, Bogotá',
				hoursTitle: 'Horarios de atención',
				hours: {
					weekday: 'Lunes a Viernes: 9:00 AM - 6:00 PM',
					saturday: 'Sábados: 9:00 AM - 2:00 PM',
					sunday: 'Domingos y festivos: Cerrado'
				}
			}
		},
		social: {
			instagramLabel: 'Instagram'
		},
		terms: {
			back: 'Volver',
			title: 'Términos y Condiciones',
			updated: 'Última actualización',
			accept: 'He leído y acepto'
		},
		termsPage: {
			sections: [
				{
					title: '1. Información general',
					paragraphs: [
						'Estos Términos y Condiciones regulan el uso del sitio web y la contratación de viajes, paquetes turísticos y experiencias ofrecidas por Viaja Ya.',
						'Al navegar, registrarte o contratar nuestros servicios, aceptas estos términos. Si no estás de acuerdo, por favor no uses el sitio.',
						'Podemos actualizar estos términos cuando sea necesario. La versión vigente será la publicada en esta página.'
					]
				},
				{
					title: '2. Servicios',
					paragraphs: [
						'Ofrecemos venta de paquetes turísticos, tours, experiencias de viaje y el Fondo Viajero para personas y organizaciones.',
						'La disponibilidad de servicios puede cambiar sin previo aviso. En caso de limitaciones, te contactaremos para ofrecer alternativas.'
					],
					bullets: [
						'Los servicios se describen con el mayor detalle posible, pero pueden tener variaciones según las condiciones del destino y la temporada.',
						'Los itinerarios y fechas son estimados y pueden variar según condiciones climáticas, operativas o de terceros proveedores.'
					]
				},
				{
					title: '3. Cotizaciones y pagos',
					paragraphs: [
						'Las cotizaciones se muestran en pesos colombianos (COP) e incluyen los impuestos aplicables cuando corresponda.',
						'El pago puede procesarse mediante pasarelas de pago y/o medios habilitados. La confirmación del servicio depende de la validación del pago.'
					],
					bullets: [
						'Las cotizaciones confirmadas respetan el precio mostrado al momento del pago.',
						'Podemos rechazar o anular pedidos por sospecha de fraude o inconsistencias en la información.'
					]
				},
				{
					title: '4. Confirmación y documentos de viaje',
					paragraphs: [
						'Una vez confirmado y pagado el servicio, recibirás tus documentos de viaje (vouchers, tiquetes, itinerario) por correo electrónico u otros canales habilitados.',
						'Es tu responsabilidad revisar cuidadosamente tus datos de contacto y los datos de los viajeros para evitar retrasos o inconsistencias.'
					],
					bullets: [
						'Revisa que nombre, número de documento y fechas coincidan con tus documentos oficiales de viaje.',
						'En caso de inconvenientes con los datos de contacto, los costos asociados pueden aplicar.'
					]
				},
				{
					title: '5. Cambios y cancelaciones',
					paragraphs: [
						'Si necesitas gestionar un cambio o cancelación, contáctanos por nuestros canales oficiales para validar el caso, políticas del proveedor y los pasos a seguir.',
						'Algunos servicios pueden no ser elegibles para cancelación una vez iniciada la ejecución, salvo por incumplimiento de Viaja Ya.'
					],
					bullets: [
						'Para cambios/cancelaciones, la solicitud debe hacerse por escrito.',
						'Los costos asociados pueden variar según las políticas del proveedor y el estado del servicio.'
					]
				},
				{
					title: '6. Responsabilidad del viajero',
					paragraphs: [
						'El viajero es responsable de contar con los documentos de identidad, visados, vacunas y requisitos de ingreso exigidos por los destinos visitados.',
						'Viaja Ya no se hace responsable por gastos o consecuencias derivados de la falta de documentación exigida por autoridades.'
					]
				},
				{
					title: '7. Datos personales',
					paragraphs: [
						'Usamos tus datos (por ejemplo, nombre, correo, dirección y teléfono) para procesar reservas, coordinar viajes, soporte y comunicaciones relacionadas con nuestros servicios.',
						'No compartimos información personal con terceros salvo cuando sea necesario para la prestación del servicio (aerolíneas, hoteles, operadores) o por obligación legal.'
					]
				},
				{
					title: '8. Responsabilidad y uso del sitio',
					paragraphs: [
						'No garantizamos disponibilidad ininterrumpida del sitio. Podemos realizar mantenimientos o ajustes técnicos.',
						'La responsabilidad máxima relacionada con un servicio no excederá el valor efectivamente pagado, salvo donde la ley indique lo contrario.'
					]
				}
			],
			contactTitle: 'Contacto',
			contactSubtitle: 'Si tienes preguntas sobre nuestros viajes o servicios, contáctanos por nuestros canales oficiales.',
			pickupTitle: 'Oficinas'
		}
	},
	en: {
		whatsapp: {
			defaultMessage: 'Hello, I am interested in learning more about Viaja Ya trips and experiences. Could you help me?'
		},
		store: {
			pickup: {
				title: 'Víctor Melo Building · Store 07',
				addressLine: 'Calle 12 #6-10 · La Candelaria, Bogotá',
				hoursTitle: 'Office hours',
				hours: {
					weekday: 'Mon - Fri: 9:00 AM - 6:00 PM',
					saturday: 'Saturdays: 9:00 AM - 2:00 PM',
					sunday: 'Sundays & holidays: Closed'
				}
			}
		},
		social: {
			instagramLabel: 'Instagram'
		},
		terms: {
			back: 'Back',
			title: 'Terms & Conditions',
			updated: 'Last updated',
			accept: 'I have read and accept'
		},
		termsPage: {
			sections: [
				{
					title: '1. General information',
					paragraphs: [
						'These Terms & Conditions govern the use of the website and the hiring of trips, tourist packages and experiences offered by Viaja Ya.',
						'By browsing, signing up, or hiring our services, you agree to these terms. If you do not agree, please do not use the site.',
						'We may update these terms when needed. The current version is the one published on this page.'
					]
				},
				{
					title: '2. Services',
					paragraphs: [
						'We offer tourist packages, tours, travel experiences and the Travel Fund for individuals and organizations.',
						'Availability of services may change without notice. If there are limitations, we will contact you to offer alternatives.'
					],
					bullets: [
						'Services are described in as much detail as possible, but may vary according to destination conditions and the season.',
						'Itineraries and dates are estimates and may change due to weather, operational conditions or third-party providers.'
					]
				},
				{
					title: '3. Quotes and payments',
					paragraphs: [
						'Quotes are shown in Colombian pesos (COP) and include applicable taxes when relevant.',
						'Payment may be processed through payment gateways and/or enabled methods. Service confirmation depends on payment validation.'
					],
					bullets: [
						'Confirmed quotes keep the price displayed at the time of payment.',
						'We may reject or cancel orders due to suspected fraud or inconsistent information.'
					]
				},
				{
					title: '4. Booking confirmation and travel documents',
					paragraphs: [
						'Once the service is confirmed and paid, you will receive your travel documents (vouchers, tickets, itinerary) by email or other enabled channels.',
						'It is your responsibility to carefully review your contact details and traveler data to avoid delays or inconsistencies.'
					],
					bullets: [
						'Please verify that name, ID number and dates match your official travel documents.',
						'If there are issues with contact information, related costs may apply.'
					]
				},
				{
					title: '5. Changes and cancellations',
					paragraphs: [
						'If you need to manage a change or cancellation, contact us through our official channels so we can validate the case, provider policies and next steps.',
						'Some services may not be eligible for cancellation once execution has begun, except in case of Viaja Ya non-compliance.'
					],
					bullets: [
						'For changes/cancellations, the request must be made in writing.',
						'Related costs may vary according to provider policies and the service status.'
					]
				},
				{
					title: '6. Traveler responsibility',
					paragraphs: [
						'The traveler is responsible for having the identity documents, visas, vaccines and entry requirements required by the visited destinations.',
						'Viaja Ya is not responsible for expenses or consequences arising from missing documentation required by authorities.'
					]
				},
				{
					title: '7. Personal data',
					paragraphs: [
						'We use your data (for example name, email, address and phone) to process bookings, coordinate trips, provide support and service-related communications.',
						'We do not share personal information with third parties except when necessary for service provision (airlines, hotels, operators) or where required by law.'
					]
				},
				{
					title: '8. Liability and site usage',
					paragraphs: [
						'We do not guarantee uninterrupted availability of the site. Maintenance or technical updates may occur.',
						'Maximum liability related to a service will not exceed the amount actually paid, unless the law provides otherwise.'
					]
				}
			],
			contactTitle: 'Contact',
			contactSubtitle: 'If you have questions about our trips or services, contact us through our official channels.',
			pickupTitle: 'Offices'
		}
	}
} as const

function normalizeLocale(input: string | null | undefined): SupportedLocale {
	if (!input) return 'es'
	const value = input.toLowerCase()
	if (value.startsWith('en')) return 'en'
	return 'es'
}

export function getInitialLocale(): SupportedLocale {
	const storedRaw = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null
	if (storedRaw) return normalizeLocale(storedRaw)
	const browserRaw = typeof navigator !== 'undefined' ? navigator.language : null
	return normalizeLocale(browserRaw)
}

export function persistLocale(locale: SupportedLocale) {
	localStorage.setItem(STORAGE_KEY, locale)
}

export const i18n = createI18n({
	legacy: false,
	globalInjection: true,
	locale: getInitialLocale(),
	fallbackLocale: 'es',
	messages
})
