import { getEventById } from "@/services/eventService";
import { Metadata, ResolvingMetadata } from "next";
import EventDetailsClient from "./eventDetailsClient";

type Params = Promise<{ id: string }>;
type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export async function generateMetadata(
  props: { params: Params; searchParams: SearchParams },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const params = await props.params;
  const rawParam = decodeURIComponent(params.id);
  const [eventId] = rawParam.split("&");

  try {
    const event = await getEventById(eventId);

    if (!event) {
      return {
        title: "Evento no encontrado | Hunt Tickets",
        description: "El evento solicitado no existe o ha sido eliminado.",
      };
    }
    return {
      title: `${event.name} | Hunt Tickets`,
      description:
        event.description ||
        `Evento ${event.name} en ${event.venue_name}, ${event.venue_city}`,
      openGraph: {
        title: `${event.name} | Hunt Tickets`,
        description:
          event.description ||
          `Evento ${event.name} en ${event.venue_name}, ${event.venue_city}`,
        type: "website",
        images: [
          {
            url: event.flyer || "",
            width: 1200,
            height: 630,
            alt: event.name,
          },
        ],
      },
    };
  } catch (error) {
    console.log("Error al obtener datos para metadata:", error);
    return {
      title: "Evento | Hunt Tickets",
      description: "Descubre y compra entradas para los mejores eventos",
    };
  }
}

export default async function Page(props: {
  params: Params;
  searchParams: SearchParams;
}) {
  const params = await props.params;
  return <EventDetailsClient otherParams={params} />;
}
