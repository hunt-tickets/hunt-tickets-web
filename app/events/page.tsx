import { Metadata } from "next";
import EventsClient from "./eventsClient";
import { getPopularEvents } from "@/services/eventService";

export const generateMetadata = async (): Promise<Metadata> => {
  return {
    title: "Eventos destacados | Hunt Tickets",
    description: "Descubre los eventos más populares y destacados en Hunt Tickets",
    openGraph: {
      title: "Eventos destacados | Hunt Tickets",
      description: "Descubre los eventos más populares y destacados en Hunt Tickets",
      type: "website",
    },
  };
};

export default async function EventsPage() {
  return <EventsClient />;
}

