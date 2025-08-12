"use client";

import { Button } from "@/components/sub/button";

interface BoxDetailsProps {
  box: {
    id: string;
    name: string;
    capacity: number;
    price: number;
    description?: string;
    sectionTitle?: string;
    sectionColor?: string;
  } | null;
  onConfirm: () => void;
}

const BoxDetails = ({ box, onConfirm }: BoxDetailsProps) => {
  if (!box) {
    return (
      <div className="w-full p-6 bg-white rounded-lg text-center border border-neutral-200">
        <p className="text-gray-600">
          Selecciona un palco en el mapa para ver los detalles
        </p>
      </div>
    );
  }

  return (
    <div className="w-full p-4 sm:p-6 bg-white rounded-lg space-y-4 border border-neutral-200">
      <div>
        <div className="flex items-center gap-2 mb-2">
          {box.sectionTitle && box.sectionColor && (
            <>
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: box.sectionColor }}
              />
              <span className="text-xs uppercase tracking-wider" style={{ color: box.sectionColor }}>
                {box.sectionTitle}
              </span>
            </>
          )}
        </div>
        <h3 className="text-heading-3 font-heading-3 text-gray-900">
          {box.name}
        </h3>
        <p className="text-body text-gray-600 mt-1">
          Para {box.capacity} personas
        </p>
      </div>

      <div className="border-t border-neutral-border pt-4">
        <div className="flex justify-between items-center mb-4">
          <span className="text-body text-gray-900">Precio del palco</span>
          <span className="text-heading-3 font-heading-3 text-brand-600">
            ${box.price.toLocaleString("es-CO")}
          </span>
        </div>

        {box.description && (
          <div className="mb-4">
            <p className="text-body-bold font-body-bold text-gray-900 mb-2">
              Incluye:
            </p>
            <p className="text-body text-gray-600">
              {box.description}
            </p>
          </div>
        )}

        <Button
          variant="brand-primary"
          size="large"
          className="w-full"
          onClick={onConfirm}
        >
          Seleccionar este palco
        </Button>
      </div>
    </div>
  );
};

export default BoxDetails;