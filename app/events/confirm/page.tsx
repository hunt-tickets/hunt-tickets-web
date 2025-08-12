import ConfirmSearchHandler from "@/components/events/ConfirmSearchHandler";
import { Suspense } from "react";

export default function ConfirmPage() {
  return (
    <div className="w-full h-screen flex items-center justify-center">
      <Suspense fallback={<p className="text-lg">Cargando resultado...</p>}>
        <ConfirmSearchHandler />
      </Suspense>
    </div>
  );
}
