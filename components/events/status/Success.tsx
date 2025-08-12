"use client";

import { IconWithBackground } from "@/components/sub/IconWithBackground";
import * as SubframeCore from "@subframe/core";
import Link from "next/link";

const Success = () => {
  return (
    <>
      <div className="flex h-[calc(100vh-100px)] w-full flex-col items-center justify-center gap-10 bg-default-background px-4 py-4">
        <div className="flex flex-col items-center justify-center gap-4">
          <IconWithBackground variant="success" size="large" />
          <div className="flex w-144 flex-col items-center gap-2">
            <span className="text-heading-2 font-heading-2 text-default-font text-center">
              Pago Aprobado
            </span>
            <span className="text-heading-3 font-heading-3 text-subtext-color text-center">
              Tu compra fue confirmada. Ya tienes una entrada lista para vivir
              la experiencia.
            </span>
            <span className="text-body font-body text-subtext-color text-center">
              Tu boleta ya está disponible en la app. Solo tienes que abrir la
              sección Wallet y ahí encontrarás todo lo que necesitas para entrar
              al evento.
            </span>
          </div>
        </div>
        <div className="flex w-144 flex-col items-start justify-center gap-4">
          <div className="hidden ">
            <span className="text-heading-3 font-heading-3 text-default-font">
              Detalles del pedido
            </span>
            <div className="flex w-full items-center gap-2">
              <span className="text-body font-body text-default-font">
                ID del pedido
              </span>
              <span className="grow shrink-0 basis-0 text-body font-body text-brand-400">
                . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
                . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
                . . . .
              </span>
              <span className="text-body font-body text-default-font">
                #000000000000
              </span>
            </div>
            <div className="flex w-full items-center gap-2">
              <span className="text-body font-body text-default-font">
                1x Nombre de la boleta{" "}
              </span>
              <span className="grow shrink-0 basis-0 text-body font-body text-brand-400">
                . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
                . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
                .
              </span>
              <span className="text-body font-body text-default-font">
                $35.000
              </span>
            </div>
            <div className="flex w-full items-center gap-2">
              <span className="text-body font-body text-default-font">
                Tarifa de servicio{" "}
              </span>
              <span className="grow shrink-0 basis-0 text-body font-body text-brand-400">
                . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
                . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
                . . . . . . . . .
              </span>
              <span className="text-body font-body text-default-font">
                $5.600
              </span>
            </div>
            <div className="flex w-full items-center gap-2">
              <span className="text-body font-body text-default-font">
                IVA (19%){" "}
              </span>
              <span className="grow shrink-0 basis-0 text-body font-body text-brand-400">
                . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
                . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
                . . . . . . . . . . . . . . . .
              </span>
              <span className="text-body font-body text-default-font">
                $1.064
              </span>
            </div>
            <div className="flex w-full items-center gap-2">
              <span className="text-heading-3 font-heading-3 text-default-font">
                TOTAL{" "}
              </span>
              <span className="grow shrink-0 basis-0 text-body font-body text-brand-400">
                . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
                . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
                . . . . . . . . . . . . . .
              </span>
              <span className="text-heading-3 font-heading-3 text-default-font">
                $41.664
              </span>
            </div>
          </div>
          <div className="flex w-144 items-start gap-4">
            <div className="flex grow shrink-0 basis-0 flex-col items-center justify-center gap-6 self-stretch overflow-hidden rounded-md border border-solid border-neutral-border bg-default-background px-6 py-6 shadow-sm">
              <div className="flex w-full items-center gap-4">
                <a
                  href="https://wa.me/573228597640"
                  className="flex w-full items-center gap-4"
                  target="_blank"
                >
                  <SubframeCore.Icon
                    className="text-heading-2 font-heading-2 text-default-font"
                    name="FeatherHeadphones"
                  />
                  <span className="line-clamp-2 grow shrink-0 basis-0 font-['Source_Sans_3'] text-[16px] font-[400] leading-[20px] text-default-font">
                    Contáctanos
                  </span>
                </a>
              </div>
            </div>
            <div className="flex grow shrink-0 basis-0 flex-col items-center justify-center gap-6 self-stretch overflow-hidden rounded-md border border-solid border-neutral-border bg-default-background px-6 py-6 shadow-sm">
              <div className="flex w-full items-center gap-4">
                <a
                  href="https://wa.me/573228597640"
                  className="flex w-full items-center gap-4"
                  target="_blank"
                >
                  <SubframeCore.Icon
                    className="text-heading-2 font-heading-2 text-default-font"
                    name="FeatherMessageCircle"
                  />
                  <span className="line-clamp-2 grow shrink-0 basis-0 font-['Source_Sans_3'] text-[16px] font-[400] leading-[20px] text-default-font">
                    Contáctanos por Whatsapp
                  </span>
                </a>
              </div>
            </div>
            <div className="flex grow shrink-0 basis-0 flex-col items-center justify-center gap-6 self-stretch overflow-hidden rounded-md border border-solid border-neutral-border bg-default-background px-6 py-6 shadow-sm">
              <div className="flex w-full items-center gap-4">
                <Link
                  href="https://zaap.bio/hunt"
                  target="_blank"
                  className="flex w-full items-center gap-4"
                >
                  <SubframeCore.Icon
                    className="text-heading-2 font-heading-2 text-default-font"
                    name="FeatherDownload"
                  />
                  <span className="line-clamp-2 grow shrink-0 basis-0 font-['Source_Sans_3'] text-[16px] font-[400] leading-[20px] text-default-font">
                    Descarga la app
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className="flex w-144 flex-col items-center gap-6">
          <div className="flex flex-col items-center justify-center gap-4">
            <div className="flex w-144 items-center gap-4">
              <SubframeCore.Icon
                className="text-body font-body text-default-font"
                name="FeatherSmartphone"
              />
              <span className="grow shrink-0 basis-0 text-body font-body text-default-font">
                Puedes encontrar tu boleta en la sección Wallet de tu app
              </span>
            </div>
            <div className="flex w-144 items-center gap-4">
              <SubframeCore.Icon
                className="text-body font-body text-default-font"
                name="FeatherMail"
              />
              <span className="grow shrink-0 basis-0 text-body font-body text-default-font">
                Te llegará a tu correo un PDF con la misma entrada, para que la
                tengas como respaldo.
              </span>
            </div>
            <div className="flex w-144 items-center gap-4">
              <SubframeCore.Icon
                className="text-body font-body text-default-font"
                name="FeatherMessageCircle"
              />
              <span className="grow shrink-0 basis-0 text-body font-body text-default-font">
                También te llegará una notificación a Whatsapp con la
                confirmación de tu compra
              </span>
            </div>
          </div>
          <span className="text-body-bold font-body-bold text-subtext-color text-center">
            Es la misma boleta enviada por diferentes medios, no necesitas
            usarlas todas. Puedes mostrarla desde cualquiera de ellos.
          </span>
        </div>
      </div>
    </>
  );
};

export default Success;
