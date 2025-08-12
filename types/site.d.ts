import * as SubframeCore from "@subframe/core";
/**
 * "id": "c2d80d9a-8e8e-4c6b-9c0d-f8e2b1f71b63",
    "created_at": "2025-03-26T14:32:15.123456Z",
    "updated_at": "2025-03-26T14:32:15.123456Z",
    "order": "ORD-123456",
    "user_id": "550e8400-e29b-41d4-a716-446655440000",
    "ticket_id": "550e8400-e29b-41d4-a716-446655440001",
    "price": 75.00,
    "variable_fee": 3.50,
    "tax": 5.25,
    "quantity": 2,
    "total": 162.75,
    "status": "pending"

 */
export interface PaymentData {
  id: string;
  order: string;
  user_id: string;
  ticket_id: string;
  price: number;
  variable_fee: number;
  tax: number;
  quantity: number;
  total: number;
  status: string;
}
/**
 * Representa un perfil de usuario dentro del sistema.
 * @property id - Identificador único del perfil.
 * @property updated_at - Fecha de actualización del perfil.
 * @property name - Nombre del perfil.
 * @property lastName - Apellido del perfil.
 * @property email - Correo electrónico del perfil.
 * @property phone - Teléfono del perfil.
 * @property birthdate - Fecha de nacimiento del perfil.
 * @property gender - Género del perfil.
 * @property document_id - Documento del perfil.
 * @property document_type_id - Tipo de documento del perfil.
 * @property alegra_id - ID de Alegra del perfil.
 * @property new - Indica si el perfil es nuevo.
 * @property tyc - Indica si el perfil ha aceptado los términos y condiciones.
 */
export interface Profile {
  id: string;
  updated_at: string;
  name: string;
  lastName: string;
  email: string;
  phone: string;
  birthdate: string;
  gender: string;
  document_id: string;
  document_type_id: string;
  alegra_id: string;
  new: boolean;
  tyc: boolean;
  admin: boolean;
  created_at: string;
}

/**
 *
 * @property name - Nombre de la ciudad.
 */
export interface City {
  id: string;
  name: string;
}

/**
 * Tipos globales para la aplicación.
 */
export interface TabContentItem {
  id: string;
  type: "create" | "event";
  icon?: string;
  text?: string;
  location?: string;
  name?: string;
  image?: string;
}

export interface Tab {
  id: string;
  value: string;
  label: string;
  content: TabContentItem[];
}

export interface InfoItem {
  icon: SubframeCore.IconName;
  label: string;
  value: string;
}

/**
 * Representa un productor dentro del sistema.
 *
 * @property id - Identificador único del productor.
 * @property name - Nombre del productor.
 * @property description - Descripción del productor.
 * @property email - Dirección de correo electrónico principal del productor.
 * @property public_email - Indica si el correo electrónico es público.
 */
export interface Producer {
  id: string;
  name: string;
  description: string;
  email: string;
  phone: string;
  logo?: string;
  banner?: string;
}

/**
 * Representa un filtro de productor dentro del sistema ranking.
 *
 * @property producer_id - Identificador único del productor.
 * @property producers - Nombre del productor.
 * producer_id === producer.id
 */
export interface ProducerView {
  producer_id: string;
  producers: {
    name: string;
    logo: string;
  };
}

export interface ProducerCategory {
  id: string;
  name: string;
  status: boolean;
  icon: string | null;
}

/** Representa un residente dentro del sistema
 * @property artist_id - Identificador único del residente.
 * @property name - Nombre del residente.
 * @property category - Categoría del residente.
 * @property logo - Logo del residente.
 */
export interface Resident {
  artist_id: string;
  name: string;
  category: string;
  logo: string;
}

/** Representa un venue dentro del sistema
 * @property venue_id - Identificador único del venue.
 * @property name - Nombre del venue.
 * @property city - Ciudad del venue.
 * @property logo - Logo del venue.
 */
export interface Venue {
  venue_id: string;
  name: string;
  city: string;
  logo: string;
}

/** Representa un technician dentro del sistema
 * @property technician_id - Identificador único del technician.
 * @property name - Nombre del technician.
 * @property category - Categoría del technician.
 * @property logo - Logo del technician.
 */
export interface Technician {
  technician_id: string;
  name: string;
  image: string;
}

/**Representa  un evento inactio o draft
 * @property id - Identificador único del evento.
 * @property name - Nombre del evento.
 * @property flyer - Imagen del evento.
 * @property venueName - Nombre del venue.
 * @property date - Fecha del evento.
 */
export interface Event {
  id: string;
  name: string;
  flyer: string;
  venue_name: string;
  date: string;
}
/**
 * Representa un productor dentro del sistema.
 * @property producer_name - Nombre del productor.
 * @property producer_logo - Logo del productor.
 * @property producer_document - Documento del productor.
 */
export interface Producer {
  producer_name: string;
  producer_logo: string;
  producer_document: string;
}
/**
 * Representa un evento completo dentro del sistema.
 * @property id - Identificador único del evento.
 * @property name - Nombre del evento.
 * @property flyer - Imagen del evento.
 * @property date - Fecha del evento.
 * @property hour - Hora del evento.
 * @property venue_id - Identificador único del venue.
 * @property venue_name - Nombre del venue.
 * @property venue_logo - Logo del venue.
 * @property venue_latitude - Latitud del venue.
 * @property venue_longitude - Longitud del venue.
 * @property venue_address - Dirección del venue.
 * @property venue_city - Ciudad del venue.
 * @property producers - Productores del evento.
 */
export interface EventFull {
  id: string;
  age: number | null;
  name: string;
  flyer: string;
  date: string;
  hour: string;
  end_date: string;
  end_hour: string;
  venue_id: string;
  venue_name: string;
  venue_logo: string;
  venue_latitude: number;
  venue_longitude: number;
  venue_address: string;
  venue_city: string;
  producers: Producer[];
  description: string;
  tickets: Ticket[];
}
export interface Ticket {
  id: string;
  name: string;
  price: number;
  available: number;
  description: string;
}

/**"link": "https://nuevoLinkDeEjemplo.com",
 * @property link - Enlace de la red social.
 */
export interface SocialLink {
  link: string;
}

/** redes sociales de un productor
 * @property id - Identificador único de la red social.
 * @property social_media_id - Identificador único de la red social.
 * @property producer_id - Identificador único del productor.
 * @property link - Enlace de la red social.
 */
export interface Social {
  id: string;
  social_media_id: string;
  producer_id: string;
  link: SocialLink;
  name: string;
  icon: string;
}
/**
 * "id": "123e4567-e89b-12d3-a456-426614174001",
    "link": "https://example.com/social2",
    "name": "Facebook",
    "icon": "Icon FB"
 */
export interface SocialMedia {
  id: string;
  social_media_id: string;
  link: SocialLink;
  name: string;
  icon: string;
}
/**
 * Representa una red social que se creará en el sistema.
 * @property social_media_id - Identificador único de la red social.
 * @property producer_id - Identificador único del productor.
 * @property link - Enlace de la red social.
 */
export interface SocialCreate {
  social_media_id: string;
  producer_id: string;
  link: string;
}

/**
 * Representa cuando se agrega una categoría a un productor.
 * @property producer_id - Identificador único del productor.
 * @property producer_category_id - Identificador único de la categoría de productor.
 */
export interface ProducerAddCategory {
  producer_id: string;
  producer_category_id: string;
}

/**
 * Representa la ordenación de categorías de un productor.
 * @property id - Identificador único de la categoría.
 * @property producer_id - Identificador único del productor.
 * @property position - Posición de la categoría.
 * @property status - Estado de la categoría.
 * @property producers_category - Categoría de productor.
 */
export interface ProducerCategoryOrder {
  id: string;
  producer_id: string;
  position: number;
  status: boolean;
  producers_category: {
    icon: string;
    name: string;
  };
}

/**
 * Representa los datos fiscales de un productor.
 * @property producer_id - Identificador único del productor.
 * @property document_type_id - Identificador único del tipo de documento.
 * @property document_id - Número de documento.
 * @property div - División del documento.
 * @property legal_name - Nombre legal de la empresa.
 * @property rut - Ruta del archivo del RUT.
 */
export interface ProducerTaxData {
  id?: string;
  producer_id: string;
  document_type_id: string;
  document_id: string;
  div: string | null;
  legal_name: string;
  rut: string;
}

/**
 * Representa un archivo de RUT dentro del sistema.
 * @property Key - Ruta del archivo de RUT.
 * @property Bucket - Nombre del bucket.
 */
export interface ProducerRut {
  Key: string;
  Bucket: string;
}

export interface KeyBucket {
  Key: string;
  Bucket: string;
}

export interface Logo {
  logo: string;
}

export interface Banner {
  banner: string;
}

/**
 * Representa un vendedor dentro del sistema.
 * @property id - Identificador único del vendedor.
 * @property producer_id - Identificador único del productor.
 * @property user_id - Identificador único del usuario.
 * @property full_name - Nombre completo del vendedor.
 */
export interface Seller {
  id: string;
  producer_id: string;
  user_id: string;
  full_name: string;
}

/**
 * Representa un usuario dentro del sistema.
 * @property id - Identificador único del usuario.
 * @property producer_id - Identificador único del productor.
 * @property user_id - Identificador único del usuario.
 */
export interface SellerUser {
  id: string;
  producer_id: string;
  user_id: string;
}

/**
 * Representa un tipo de documento dentro del sistema.
 * @property id - Identificador único del tipo de documento.
 * @property name - Nombre del tipo de documento.
 */
export interface DocumentType {
  id: string;
  name: string;
}

/**
 * Representa un evento dentro del sistema.
 * @property id - Identificador único del evento.
 * @property name - Nombre del evento.
 * @property flyer - Imagen del evento.
 * @property venue_name - Nombre del venue.
 * @property date - Fecha del evento.
 */
export interface Event {
  id: string;
  name: string;
  flyer: string;
  venue_name: string;
  date: string;
}

export interface EventVariabelFee {
  variable_fee: number;
}