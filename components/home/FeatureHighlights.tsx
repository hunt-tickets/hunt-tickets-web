import { IconWithBackground } from "../sub/IconWithBackground";

const FeatureHighlights = () => {
  return (
    <div className="hidden lg:flex lg:h-28 w-full flex-none items-center justify-center gap-4 px-6 py-0 lg:py-24">
      <div className="flex max-w-[1280px] grow shrink-0 basis-0 flex-wrap items-center justify-center gap-12">
        <div className="flex min-w-[240px] grow shrink-0 basis-0 items-center gap-4">
          <div className="w-[64px] h-[64px]">
          <IconWithBackground size="x-large" icon="FeatherCalendarCheck" />
          </div>
          <p className="text-body-bold font-body-bold text-default-font">
            Elige fechas y agrega eventos a tu calendario para no perderte nada
          </p>
        </div>
        <div className="flex min-w-[240px] grow shrink-0 basis-0 items-center gap-4">
          <div className="w-[64px] h-[64px]">
          <IconWithBackground size="x-large" icon="FeatherMusic" />
          </div>

          <p className="text-body-bold font-body-bold text-default-font">
            Encuentra fiestas, conciertos, expos y todo tipo de actividades de
            entretenimiento
          </p>
        </div>
        <div className="flex min-w-[240px] grow shrink-0 basis-0 items-center gap-4">
          <IconWithBackground size="x-large" icon="FeatherUsers" />
          <p className="text-body-bold font-body-bold text-default-font">
            Descubre a dónde van tus amigos
          </p>
        </div>
      </div>
    </div>
  );
};

export default FeatureHighlights;
