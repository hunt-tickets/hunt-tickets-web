import { supabase } from "@/lib/supabaseBrowser";
import {
  City,
  DocumentType,
  EventFull,
  EventVariabelFee,
  Producer,
  ProducerAddCategory,
  ProducerCategory,
  ProducerCategoryOrder,
  ProducerTaxData,
  ProducerView,
  Resident,
  Social,
  SocialCreate,
  Venue,
} from "@/types/site";

const supabaseUrl = "https://hunt-supabase-url";

interface GetProducersParams {
  searchTerm?: string;
  sortOrder?: "asc" | "desc";
  sortColumn?: keyof Producer;
}


/**
 * Obtiene los últimos 6 productores aprobados, ordenados por fecha de creación.
 */
export const getLatestProducers = async (): Promise<{
  data: Producer[] | null;
  error: string | null;
}> => {
  const { data, error } = await supabase
    .from("producers")
    .select("id, name, logo, banner")
    .order("name", { ascending: true })
    .eq("status", true);

  if (error) {
    console.log("Error fetching latest producers:", error.message);
    return { data: null, error: error.message };
  }

  if (!data) {
    return { data: null, error: "No data found" };
  }

  const transformedData = data.map((producer) => ({
    id: producer.id,
    name: producer.name,
    logo: producer.logo,
    description: "",
    email: "",
  }));

  return { data: transformedData as Producer[], error: null };
};

/**
 * Obtiene el crecimiento de productores.
 *
 */
export const getProducersGrowth = async (): Promise<{
  data: { total_count: number; growth_percentage: number } | null;
  error: string | null;
}> => {
  const { data, error } = await supabase.rpc("get_producers_growth");

  if (error) {
    console.log("Error fetching producers growth:", error.message);
    return { data: null, error: error.message };
  }

  return { data: data ? data[0] : null, error: null };
};

/**
 * Obtiene el crecimiento de productores en un resumen.
 */
export const getProducersGrowthSummary = async (): Promise<{
  data: { total_count: number; growth_percentage: number } | null;
  error: string | null;
}> => {
  const { data, error } = await supabase.rpc("get_producer_growth_summary");

  if (error) {
    console.log("Error fetching producers growth:", error.message);
    return { data: null, error: error.message };
  }

  return { data: data ? data[0] : null, error: null };
};

/**
 * Obtiene el crecimiento de vistas de perfil de productores.
 */
export const getProfileViewsGrowth = async (): Promise<{
  data: { total_count: number; growth_percentage: number } | null;
  error: string | null;
}> => {
  const { data, error } = await supabase.rpc("get_profile_views_growth");

  if (error) {
    console.log("Error fetching producers growth:", error.message);
    return { data: null, error: error.message };
  }

  return { data: data ? data[0] : null, error: null };
};

/**
 * Obtiene el conteo de productores por categoría.
 * @returns Un objeto con los datos de las categorías de productores o un error en caso de fallo.
 * @param category - Categoría de productores.
 * @param count - Cantidad de productores en la categoría.
 */
export const getProducerCategoryCounts = async (): Promise<{
  data: { category: string; count: number }[] | null;
  error: string | null;
}> => {
  const { data, error } = await supabase.rpc("get_producer_category_counts");

  if (error) {
    console.log("Error fetching producer category counts:", error.message);
    return { data: null, error: error.message };
  }
  return { data, error: null };
};

/**
 * Actualiza la posición de una categoría en la tabla producers_category_links.
 * @param id - ID único de la relación categoría-productor.
 * @param position - Nueva posición de la categoría.
 * @returns Un objeto con `success` si la actualización fue exitosa o `error` si falló.
 */
export const updateCategoryPosition = async (
  id: string,
  position: number
): Promise<{ success?: string; error?: string }> => {
  const { error } = await supabase
    .from("producers_category_links")
    .update({ position })
    .eq("id", id);

  if (error) {
    console.log("Error updating category position:", error.message);
    return { error: error.message };
  }

  return { success: "Category position updated successfully" };
};

/**
 * Obtiene todas las categorías de productores.
 * @returns Un objeto con los datos de las categorías de productores o un error en caso de fallo.
 * @param status - Estado de la categoría.
 * @param icon - Ícono de la categoría.
 * @param name - Nombre de la categoría.
 * @param id - Identificador de la categoría.
 */
export const getProducerCategories = async (): Promise<{
  data:
    | { id: string; name: string; status: boolean; icon: string | null }[]
    | null;
  error: string | null;
}> => {
  const { data, error } = await supabase
    .from("producers_category")
    .select("id, name, status, icon")
    .order("status", { ascending: false })
    .order("id", { ascending: true });

  if (error) {
    console.log("Error fetching producer categories:", error.message);
    return { data: null, error: error.message };
  }

  return { data, error: null };
};

/**
 * Crea una nueva categoría en `producers_category`
 * @param name Nombre de la categoría
 * @param icon Ícono asociado a la categoría
 * @returns Resultado de la operación
 */
export const createProducerCategory = async (
  name: string,
  icon: string
): Promise<{ data: ProducerCategory | null; error: string | null }> => {
  const { data, error } = await supabase
    .from("producers_category")
    .insert([{ name, icon, status: true }])
    .select()
    .single();

  if (error) {
    console.log("Error creating producer category:", error.message);
    return { data: null, error: error.message };
  }

  return { data, error: null };
};

/**
 * Asocia una categoría existente a un productor.
 * @param producer_id - ID del productor.
 * @param producer_category_id - ID de la categoría a asociar.
 * @returns Un objeto con `success` si la asociación fue exitosa, o `error` en caso de fallo.
 */
export const addCategoryToProducer = async ({
  producer_id,
  producer_category_id,
}: ProducerAddCategory): Promise<{ success?: string; error?: string }> => {
  const { error } = await supabase
    .from("producers_category_links")
    .insert([{ producer_id, producer_category_id }]);

  if (error) {
    console.log("Error adding category to producer:", error.message);
    return { error: error.message };
  }

  return { success: "Categoría agregada al productor exitosamente." };
};

/**
 * Actualiza el estado de una categoría de productor.
 */
export const updateProducerCategory = async (
  categoryId: string,
  newStatus: boolean
) => {
  const { data, error } = await supabase
    .from("producers_category")
    .update({ status: newStatus })
    .eq("id", categoryId)
    .select("*");

  if (error) {
    console.log("Error updating producer category status:", error.message);
    return { error: error.message };
  }

  return { success: "Category updated successfully", data };
};
/**
 * Obtiene la lista de artistas residentes de un productor específico.
 * @param producerUuid UUID del productor a consultar.
 * @returns Un objeto con los datos de los residentes o un error en caso de fallo.
 */
export const getProducerResidents = async (
  producerUuid: string
): Promise<{ data: Resident[] | null; error: string | null }> => {
  const { data, error } = await supabase.rpc("get_producer_residents", {
    producer_uuid: producerUuid,
  });

  if (error) {
    console.log("Error fetching producer residents:", error.message);
    return { data: null, error: error.message };
  }

  return { data, error: null };
};

/**
 * Obtiene todos los productores.
 * @param searchTerm - Término de búsqueda para filtrar los productores.
 * @param sortOrder - Orden de clasificación ("asc" o "desc").
 * @param sortColumn - Columna por la que se ordenará.
 * @returns Un objeto con los datos de los productores o un error en caso de fallo.
 */
export const getProducers = async ({
  searchTerm = "",
  sortOrder = "asc",
  sortColumn = "name",
}: GetProducersParams): Promise<{
  data: Producer[] | null;
  error: string | null;
}> => {
  let query = supabase.from("producers").select("*");

  if (searchTerm.length >= 4) {
    query = query.ilike(sortColumn, `%${searchTerm}%`);
  }

  query = query.order(sortColumn, { ascending: sortOrder === "asc" });
  
  // Si no hay término de búsqueda, ordenar por nombre por defecto
  if (!searchTerm || searchTerm.length < 4) {
    query = query.order("name", { ascending: true });
  }

  const { data, error } = await query;

  if (error) {
    console.log("Error fetching producers:", error.message);
    return { data: null, error: error.message };
  }

  return { data, error: null };
};

/**
 * Obtiene los venues asociados a un productor específico.
 * @param producer_uuid - UUID del productor.
 * @returns Lista de venues o error en caso de fallo.
 */
export const getProducerVenues = async (
  producer_uuid: string
): Promise<{
  data: Venue[] | null;
  error: string | null;
}> => {
  const { data, error } = await supabase.rpc("get_producer_venues", {
    producer_uuid,
  });

  if (error) {
    console.log("Error fetching producer venues:", error.message);
    return { data: null, error: error.message };
  }

  return { data, error: null };
};

/**
 * Obtiene los eventos inactivos organizados por un productor.
 * @param producer_uuid - UUID del productor.
 * @returns Lista de eventos inactivos o error en caso de fallo.
 */
export const getProducerInactiveEvents = async (
  producer_uuid: string
): Promise<{
  data: Event[] | null;
  error: string | null;
}> => {
  const { data, error } = await supabase.rpc("get_producer_inactive_events", {
    producer_uuid,
  });

  if (error) {
    console.log("Error fetching inactive events:", error.message);
    return { data: null, error: error.message };
  }

  return { data: data as Event[], error: null };
};

/**
 * Obtiene los eventos próximos de un productor.
 * @param producer_uuid ID del productor a buscar.
 * @returns Lista de eventos próximos o un error en caso de fallo.
 */
export const getProducerUpcomingEvents = async (
  producer_uuid: string
): Promise<{
  data: Event[] | null;
  error: string | null;
}> => {
  const { data, error } = await supabase.rpc("get_producer_upcoming_events", {
    producer_uuid,
  });

  if (error) {
    console.log("Error fetching upcoming events:", error.message);
    return { data: null, error: error.message };
  }

  return { data: data as Event[], error: null };
};

/**
 * Obtiene un productor por su ID.
 * @param id - Identificador único del productor.
 * @returns El productor encontrado o null en caso de error.
 */
export const getProducerById = async (id: string) => {
  const { data, error } = await supabase
    .from("producers")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.log("Error fetching producer by ID:", error.message);
    return null;
  }

  return data;
};

/**
 * Obtiene los eventos pasados de un productor.
 * @param producer_uuid ID del productor a buscar
 * @returns Lista de eventos pasados o un error en caso de fallo
 */
export const getProducerPastEvents = async (
  producer_uuid: string
): Promise<{
  data: Event[] | null;
  error: string | null;
}> => {
  const { data, error } = await supabase.rpc("get_producer_past_events", {
    producer_uuid,
  });

  if (error) {
    console.log("Error fetching past events:", error.message);
    return { data: null, error: error.message };
  }

  return { data: data as Event[], error: null };
};

/**
 * Obtiene los enlaces de redes sociales de un productor específico.
 * @param producerId - El identificador único del productor.
 * @returns {Promise<{ data: Social[] | null; error: string | null }>}
 */
export const getProducerLinks = async (
  producerId: string
): Promise<{ data: Social[] | null; error: string | null }> => {
  const { data, error } = await supabase
    .from("producers_links")
    .select("id, link, social_media_id, producer_id")
    .eq("producer_id", producerId);

  if (error) {
    console.log("Error fetching producer links:", error.message);
    return { data: null, error: error.message };
  }

  const { data: socialMediaData, error: socialMediaError } = await supabase
    .from("social_media")
    .select("id, name, icon")
    .in("id", data?.map((link) => link.social_media_id) || []);

  if (socialMediaError) {
    console.log("Error fetching social media data:", socialMediaError.message);
    return { data: null, error: socialMediaError.message };
  }

  const enrichedData = data?.map((link) => {
    const socialMedia = socialMediaData?.find(
      (sm) => sm.id === link.social_media_id
    );
    return {
      ...link,
      name: socialMedia?.name || "",
      icon: socialMedia?.icon || "",
    };
  });

  return { data: enrichedData, error: null };
};
/**
 * Agrega un nuevo enlace de red social a un productor.
 * @param socialData - Datos de la red social a asociar.
 * @returns {Promise<{ success: boolean; error: string | null }>}
 */
export const addProducerSocialLink = async (
  socialData: SocialCreate
): Promise<{ success: boolean; error: string | null }> => {
  const { error } = await supabase.from("producers_links").insert([socialData]);

  if (error) {
    console.log("Error adding social link:", error.message);
    return { success: false, error: error.message };
  }

  return { success: true, error: null };
};
/**
 * 📌 **Actualiza un enlace de red social existente**
 * @param linkId - ID del enlace a actualizar.
 * @param link - Nueva URL del enlace.
 */
export const updateProducerSocialLink = async (
  id: string, // ID del link en la tabla producers_links
  link: string
): Promise<{ success: boolean; error: string | null }> => {
  const { error } = await supabase
    .from("producers_links")
    .update({ link })
    .eq("id", id);

  if (error) {
    console.log("Error updating social link:", error.message);
    return { success: false, error: error.message };
  }

  return { success: true, error: null };
};

/**
 * 📌 **Obtiene los enlaces de redes sociales de un productor**
 * @param producerId - ID del productor.
 * @returns Lista de redes sociales con `id`, `link`, `name`, `icon`
 */
export const getProducerSocialLinks = async (producerId: string) => {
  try {
    const { data, error } = await supabase.rpc("get_producer_social_links", {
      p_producer_id: producerId,
    });

    if (error) {
      console.log("Error obteniendo redes sociales:", error.message);
      return { data: [], error: error.message };
    }

    return { data, error: null };
  } catch (err) {
    console.log("Error inesperado obteniendo redes sociales:", err);
    return { data: [], error: "Error inesperado" };
  }
};

/**
 * Obtiene todas las categorías activas vinculadas a un productor específico.
 * @param producer_id - Identificador del productor.
 * @returns Lista de categorías activas con sus detalles o un error en caso de fallo.
 */
export const getProducerCategoryLinks = async (
  producer_id: string
): Promise<{ data: ProducerCategoryOrder[] | null; error: string | null }> => {
  const { data, error } = await supabase
    .from("producers_category_links")
    .select("id, producer_id, position, status, producers_category(name, icon)")
    .eq("producer_id", producer_id)
    .eq("status", true) // Solo categorías activas
    .order("position", { ascending: true }); // Ordenar por posición

  if (error) {
    console.log("Error fetching producer category links:", error.message);
    return { data: null, error: error.message };
  }
  const formattedData = data.map((item) => ({
    id: item.id,
    producer_id: item.producer_id,
    position: item.position,
    status: item.status,
    producers_category: Array.isArray(item.producers_category)
      ? item.producers_category[0] || { name: "", icon: "" } // Evitar errores si está vacío
      : item.producers_category,
  }));

  return { data: formattedData, error: null };
};

/**
 * Elimina una categoría asociada a un productor en la tabla producers_category_links.
 * @param id - Identificador único de la asociación a eliminar.
 * @returns Un objeto con `success` si la operación fue exitosa o un `error` si falló.
 */
export const deleteProducerCategoryLink = async (
  id: string
): Promise<{ success?: string; error?: string }> => {
  const { error } = await supabase
    .from("producers_category_links")
    .delete()
    .eq("id", id);

  if (error) {
    console.log("Error deleting producer category link:", error.message);
    return { error: error.message };
  }

  return { success: "Category link deleted successfully" };
};

/**
 * 🔼 **Sube el archivo PDF del RUT al bucket de Supabase Storage**
 * @param producerId - ID del productor.
 * @param file - Archivo PDF del RUT.
 * @returns URL del archivo subido o un error.
 */
export const uploadProducerRut = async (
  producerId: string,
  file: File
): Promise<{ url?: string; error?: string }> => {
  try {
    const filePath = `producers/rut/${producerId}.pdf`;
    const { error } = await supabase.storage
      .from("producers")
      .upload(filePath, file, {
        upsert: true,
        contentType: "application/pdf",
      });

    if (error) {
      console.log("Error uploading file:", error.message);
      return { error: error.message };
    }

    const url = `${supabaseUrl}/storage/v1/object/public/producers/${filePath}`;
    return { url };
  } catch (err) {
    console.log("Unexpected error uploading file:", err);
    return { error: "Error inesperado al subir el archivo." };
  }
};

/**
 * 📌 **Guarda la información fiscal del productor en `producers_tax_data`**
 * @param data - Datos fiscales del productor.
 * @returns Confirmación de éxito o error.
 */
export const addProducerTaxData = async (
  data: ProducerTaxData
): Promise<{ success?: string; error?: string }> => {
  const { error } = await supabase.from("producers_tax_data").insert([data]);

  if (error) {
    console.log("Error inserting tax data:", error.message);
    return { error: error.message };
  }

  return { success: "Datos fiscales agregados correctamente." };
};

/**
 * Verifica si un `producer_id` tiene datos fiscales en la tabla `producers_tax_data`
 * @param producer_id - ID del productor
 * @returns Un array con los datos fiscales si existen, o un array vacío si no
 */
export const getProducerTaxData = async (
  producer_id: string
): Promise<{
  data: ProducerTaxData[] | null;
  error: string | null;
}> => {
  const { data, error } = await supabase
    .from("producers_tax_data")
    .select("*")
    .eq("producer_id", producer_id);

  if (error) {
    console.log("Error fetching producer tax data:", error.message);
    return { data: null, error: error.message };
  }

  return { data, error: null };
};

/**
 * Actualiza los datos fiscales de un productor en la tabla `producers_tax_data`.
 * @param id - ID del registro en `producers_tax_data`
 * @param taxData - Datos a actualizar
 * @returns Un objeto con `success` si la operación fue exitosa o `error` si falló.
 */
export const updateProducerTaxData = async (
  id: string,
  taxData: Partial<ProducerTaxData>
): Promise<{ success?: string; error?: string }> => {
  const { error } = await supabase
    .from("producers_tax_data")
    .update(taxData)
    .eq("id", id);

  if (error) {
    console.log("❌ Error updating producer tax data:", error.message);
    return { error: error.message };
  }

  return { success: "✅ Producer tax data updated successfully" };
};

/**
 * Obtiene todos los tipos de documento de la tabla `document_type`
 * @returns Un array de objetos con `id` y `name` o un error
 */
export const getDocumentTypes = async (): Promise<{
  data: DocumentType[] | null;
  error: string | null;
}> => {
  const { data, error } = await supabase
    .from("document_type")
    .select("id, name");

  if (error) {
    console.log("Error fetching document types:", error.message);
    return { data: null, error: error.message };
  }

  return { data, error: null };
};
/**
 * 📌 **Sube el logo del productor al bucket de Supabase Storage**
 * @param producerId - ID del productor.
 * @param file - Archivo PNG del logo.
 * @returns URL del archivo subido o un error.
 */
export const uploadProducerLogo = async (
  producerId: string,
  file: File
): Promise<{ url?: string; error?: string }> => {
  try {
    const filePath = `producers/logos/${producerId}.png`;
    const { data, error } = await supabase.storage
      .from("producers")
      .upload(filePath, file, { upsert: true });

    if (error) {
      console.log("Error al subir el logo:", error.message);
      return { error: error.message };
    }

    const publicUrl = supabase.storage.from("producers").getPublicUrl(filePath)
      .data.publicUrl;
    return { url: publicUrl };
  } catch (err) {
    console.log("Error inesperado al subir el logo:", err);
    return { error: "Error inesperado al subir el logo." };
  }
};
/**
 * 📌 **Actualiza el logo del productor en la tabla `producers`**
 * @param producerId - ID del productor.
 * @param logoUrl - URL del logo.
 * @returns Confirmación de éxito o error.
 */
export const updateProducerLogo = async (
  producerId: string,
  logoUrl: string
): Promise<{ success?: string; error?: string }> => {
  try {
    const versionedUrl = `${logoUrl}?v=${Date.now()}`;

    const { error } = await supabase
      .from("producers")
      .update({ logo: versionedUrl })
      .eq("id", producerId);

    if (error) {
      console.log("Error al actualizar el logo:", error.message);
      return { error: error.message };
    }

    return { success: versionedUrl };
  } catch (err) {
    console.log("Error inesperado al actualizar el logo:", err);
    return { error: "Error inesperado al actualizar el logo." };
  }
};
/**
 * 📌 **Sube el banner del productor al bucket de Supabase Storage**
 * @param producerId - ID del productor.
 * @param file - Archivo PNG del banner.
 * @returns URL del archivo subido o un error.
 */
export const uploadProducerBanner = async (
  producerId: string,
  file: File
): Promise<{ url?: string; error?: string }> => {
  try {
    const filePath = `producers/banners/${producerId}.png`;
    const { data, error } = await supabase.storage
      .from("producers")
      .upload(filePath, file, { upsert: true });

    if (error) {
      console.log("Error al subir el banner:", error.message);
      return { error: error.message };
    }

    const publicUrl = supabase.storage.from("producers").getPublicUrl(filePath)
      .data.publicUrl;
    return { url: publicUrl };
  } catch (err) {
    console.log("Error inesperado al subir el banner:", err);
    return { error: "Error inesperado al subir el banner." };
  }
};

/**
 * 📌 **Actualiza el banner del productor en la tabla `producers`**
 * @param producerId - ID del productor.
 * @param bannerUrl - URL del banner.
 * @returns Confirmación de éxito o error.
 */
export const updateProducerBanner = async (
  producerId: string,
  bannerUrl: string
): Promise<{ success?: string; error?: string }> => {
  try {
    const versionedUrl = `${bannerUrl}?v=${Date.now()}`;
    const { error } = await supabase
      .from("producers")
      .update({ banner: versionedUrl })
      .eq("id", producerId);

    if (error) {
      console.log("Error al actualizar el banner:", error.message);
      return { error: error.message };
    }

    return { success: versionedUrl };
  } catch (err) {
    console.log("Error inesperado al actualizar el banner:", err);
    return { error: "Error inesperado al actualizar el banner." };
  }
};

/**
 * 📌 **Obtiene todos los vendedores asociados a un productor**
 * @param producerId - ID del productor.
 * @returns Lista de vendedores con `id`, `producer_id`, `user_id`, `full_name`
 */
export const getSellersByProducer = async (producerId: string) => {
  try {
    const { data, error } = await supabase.rpc("get_sellers_by_producer", {
      producer_id: producerId,
    });

    if (error) {
      console.log("Error obteniendo vendedores:", error.message);
      return { data: [], error: error.message };
    }

    return { data, error: null };
  } catch (err) {
    console.log("Error inesperado obteniendo vendedores:", err);
    return { data: [], error: "Error inesperado" };
  }
};

/**
 * 📌 **Crea un nuevo vendedor asignándolo a un productor**
 * @param producerId - ID del productor.
 * @param phone - Teléfono del vendedor (debe existir en profiles).
 * @returns Información del nuevo vendedor o un error.
 */
export const createSeller = async (producerId: string, phone: string) => {
  try {
    const { data, error } = await supabase.rpc("create_seller", {
      producer_id: producerId,
      phone,
    });

    if (error) {
      console.log("Error creando vendedor:", error.message);
      return { data: null, error: error.message };
    }

    return { data, error: null };
  } catch (err) {
    console.log("Error inesperado creando vendedor:", err);
    return { data: null, error: "Error inesperado" };
  }
};

/**
 * 📌 **Elimina un vendedor por su ID**
 * @param sellerId - ID del vendedor a eliminar.
 * @returns Éxito o error.
 */
export const deleteSeller = async (sellerId: string) => {
  try {
    const { error } = await supabase
      .from("sellers")
      .delete()
      .eq("id", sellerId);

    if (error) {
      console.log("Error eliminando vendedor:", error.message);
      return { success: false, error: error.message };
    }

    return { success: true, error: null };
  } catch (err) {
    console.log("Error inesperado eliminando vendedor:", err);
    return { success: false, error: "Error inesperado" };
  }
};

/**
 * Crea un nuevo productor.
 */
export const createProducer = async (producerData: {
  name: string;
  description: string;
  email: string;
  phone: string;
}) => {
  const { data, error } = await supabase
    .from("producers")
    .insert([producerData]);

  if (error) {
    console.log("Error creating producer:", error.message);
    return { error: error.message };
  }

  return { data, success: "Producer created successfully!" };
};

/**
 * Actualiza un productor existente.
 */
export const updateProducer = async (updates: {
  id: string;
  name: string;
  description: string;
  email: string;
  phone: string;
}) => {
  const { data, error } = await supabase
    .from("producers")
    .update({
      name: updates.name,
      description: updates.description,
      email: updates.email,
      phone: updates.phone,
    })
    .eq("id", updates.id);

  if (error) {
    console.log(error.message);
    return { error: "Error al actualizar el productor" };
  }

  return { success: "Productor actualizado con éxito", data };
};

/**
 * Obtiene todas las ciudades de la tabla `cities`
 * @returns Un array de objetos con `id` y `name` o un error
 */
export const getCities = async (): Promise<City[]> => {
  const { data, error } = await supabase.from("cities").select("name");

  if (error) {
    console.log("Error fetching cities:", error.message);
    return [];
  }

  return data as City[];
};

/**
 * Obtiene los eventos populares de una ciudad.
 * @param cityId - ID de la ciudad.
 * @returns Lista de eventos populares o un error.
 */
export const getPopularEvents = async (cityId: string): Promise<Event[]> => {
  const { data, error } = await supabase.rpc("get_popular_events", {
    uuid_input: cityId,
  });

  if (error) {
    console.log("Error fetching popular events:", error.message);
    return [];
  }

  return data as Event[];
};

/**
 * Obtiene un evento completo por su ID usando la Edge Function.
 * @param eventId - ID del evento.
 * @param userId - ID del usuario.
 * @returns Evento completo o un error.
 */
export const getEventById = async (eventId: string, userId: string) => {
  try {
    const edgeFunctionUrl = `https://jtfcfsnksywotlbsddqb.supabase.co/functions/v1/event_details`;

    const response = await fetch(
      `${edgeFunctionUrl}?event_id=${eventId}&user_id=${userId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.log("Error fetching event:", errorData);
      return {
        error: errorData.msg || "Failed to fetch event. Please try again.",
      };
    }

    const data = await response.json();
    return data as EventFull;
  } catch (err) {
    console.log("Unexpected error fetching event:", err);
    return { error: "Unexpected error occurred. Please try again." };
  }
};
/**
 * Obtiene los detalles de un evento usando la Edge Function.
 * @param eventId - ID del evento.
 * @returns Detalles del evento o un error.
 */
export const getEventDetails = async (eventId: string) => {
  const edgeFunctionUrl = `https://jtfcfsnksywotlbsddqb.supabase.co/functions/v1/web_event_details`;
  const response = await fetch(`${edgeFunctionUrl}?event_id=${eventId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
      apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Error: ${response.statusText}`);
  }

  return response.json();
};

/**
 * 📌 **Obtiene el fee variable de un evento**
 * @param eventId - ID del evento.
 *
 */
export const getEventVariableFee = async (
  eventId: string
): Promise<EventVariabelFee | { error: string }> => {
  const edgeFunctionUrl = `https://jtfcfsnksywotlbsddqb.supabase.co/functions/v1/get_event_variable_fee`;

  try {
    // Usar Authorization header solamente (quitar apikey)
    const response = await fetch(`${edgeFunctionUrl}?event_id=${eventId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.msg || "Failed to fetch variable fee.");
    }

    const data = await response.json();
    return data as EventVariabelFee;
  } catch (error: any) {
    console.log("❌ Error:", error.message);
    return { error: error.message };
  }
};

/**
 * 📌 **Crea una transacción web**
 * @param data - Datos de la transacción.
 * @returns Transacción creada o un error.
 */

export const createTransactionWeb = async (data: {
  p_order: string;
  p_user_id: string;
  p_ticket_id: string;
  p_price: number;
  p_variable_fee: number;
  p_tax: number;
  p_quantity: number;
  p_total: number;
  p_seller_uid: string | null;
}) => {
  const { data: result, error } = await supabase.rpc(
    "create_transaction_web",
    data
  );

  if (error) {
    console.error("❌ Error creando la transacción:", error.message);
    throw new Error("No se pudo guardar la transacción");
  }

  return result;
};
/**
 * 📌 **Actualiza el estado de una transacción web**
 * @param orderId - ID de la transacción.
 * @param status - Estado de la transacción.
 * @returns Transacción actualizada o un error.
 */
export const updateTransactionStatus = async (
  orderId: string,
  status: string
): Promise<{ success?: boolean; error?: string }> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/rpc/update_transaction_status`,
      {
        method: "POST",
        headers: {
          apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
          "Content-Type": "application/json",
          Prefer: "return=representation",
        },
        body: JSON.stringify({
          p_order: orderId,
          p_status: status,
        }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      return { error: error.message || "Error al actualizar la transacción." };
    }

    return { success: true };
  } catch (error) {
    return { error: "Error inesperado al actualizar la transacción." };
  }
};
