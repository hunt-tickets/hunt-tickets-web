import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPercentage(number: number) {
  return number.toFixed(1) + "%";
}

export function sanitizeEventName(name = "") {
  return name
    .toLowerCase() // convertir a minúsculas
    .normalize("NFD") // descomponer caracteres acentuados
    .replace(/[\u0300-\u036f]/g, "") // eliminar tildes
    .replace(/ñ/g, "n") // reemplazar ñ por n
    .replace(/&/g, "and") // opcional: reemplazar & por "and"
    .replace(/[^a-z0-9]/g, "-")       // reemplazar caracteres no permitidos por guiones
    .replace(/-+/g, "-")              // eliminar guiones duplicados
    .replace(/^-|-$/g, "");           // quitar guiones al inicio o al final
};