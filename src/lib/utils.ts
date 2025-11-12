import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Prisma } from "@prisma/client";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function serializePrisma(obj: any): any {
  if (obj instanceof Prisma.Decimal) return obj.toNumber();
  if (obj instanceof Date) return obj.toISOString();

  if (Array.isArray(obj)) return obj.map(serializePrisma);

  if (obj && typeof obj === "object") {
    const result: any = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        result[key] = serializePrisma(obj[key]);
      }
    }
    return result;
  }

  return obj;
}

export function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, "+")
    .replace(/_/g, "/");
  const rawData = atob(base64);
  return new Uint8Array([...rawData].map((c) => c.charCodeAt(0)));
}
