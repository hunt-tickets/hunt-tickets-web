"use client";

import DisplayCards from "@/components/ui/display-cards";
import { Wallet, Mail, Smartphone } from "lucide-react";

const WhatsAppIcon = () => (
  <svg className="w-full h-full" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.893 3.488"/>
  </svg>
);

const GmailIcon = () => (
  <svg className="w-full h-full" viewBox="0 0 24 24" fill="none">
    <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z" fill="white"/>
  </svg>
);

const AppleIcon = () => (
  <svg className="w-full h-full" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"/>
  </svg>
);

const HuntLogo = () => (
  <img 
    src="https://jtfcfsnksywotlbsddqb.supabase.co/storage/v1/object/public/default/logo.png"
    alt="Hunt Logo"
    className="w-full h-full object-contain"
  />
);

const huntCards = [
  {
    icon: <AppleIcon />,
    title: "Apple Wallet",
    description: "Guarda tus entradas fácilmente",
    date: "Disponible ahora",
    iconClassName: "text-white",
    titleClassName: "text-white",
    className:
      "[grid-area:stack] hover:-translate-y-10 before:absolute before:w-[100%] before:outline-1 before:rounded-xl before:outline-border before:h-[100%] before:content-[''] before:bg-blend-overlay before:bg-black/70 grayscale-[100%] hover:before:opacity-0 before:transition-opacity before:duration-700 hover:grayscale-0 before:left-0 before:top-0",
  },
  {
    icon: <GmailIcon />,
    title: "Email",
    description: "Recibe confirmaciones al instante",
    date: "Automático",
    iconClassName: "text-white",
    titleClassName: "text-white",
    className:
      "[grid-area:stack] translate-x-[15%] translate-y-12 hover:-translate-y-1 before:absolute before:w-[100%] before:outline-1 before:rounded-xl before:outline-border before:h-[100%] before:content-[''] before:bg-blend-overlay before:bg-black/70 grayscale-[100%] hover:before:opacity-0 before:transition-opacity before:duration-700 hover:grayscale-0 before:left-0 before:top-0",
  },
  {
    icon: <HuntLogo />,
    title: "App HUNT",
    description: "Descarga la experiencia completa",
    date: "Proximamente",
    iconClassName: "text-white", 
    titleClassName: "text-white",
    className:
      "[grid-area:stack] translate-x-[30%] translate-y-24 hover:translate-y-12",
  },
  {
    icon: <WhatsAppIcon />,
    title: "WhatsApp",
    description: "Notificaciones instantáneas",
    date: "Nuevo",
    iconClassName: "text-white", 
    titleClassName: "text-white",
    className:
      "[grid-area:stack] translate-x-[45%] translate-y-36 hover:translate-y-24",
  },
];

function DisplayCardsDemo() {
  return (
    <div className="flex min-h-[500px] w-full items-center justify-center">
      <div className="w-full max-w-2xl">
        <DisplayCards cards={huntCards} />
      </div>
    </div>
  );
}

export { DisplayCardsDemo };