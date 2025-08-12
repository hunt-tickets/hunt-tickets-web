import Link from "next/link";
import { Button } from "../sub/button";
import { IconWithBackground } from "../sub/IconWithBackground";

const CallToAction = () => {
  return (
    <div 
      className="w-full max-w-[1280px] rounded-2xl p-6 md:p-16 text-center"
      style={{
        background: 'linear-gradient(135deg, rgba(10, 10, 10, 0.95) 0%, rgba(20, 20, 20, 0.95) 100%)',
        boxShadow: '0 12px 40px rgba(0,0,0,0.4), 0 4px 12px rgba(0,0,0,0.2)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
      }}
    >
      <div className="flex flex-col items-center gap-8">
        
        {/* Sección de iconos integrada - Solo móvil */}
        <div className="block lg:hidden w-full">
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-4 text-left">
              <div className="w-[48px] h-[48px] flex-shrink-0">
                <IconWithBackground size="large" icon="FeatherCalendarCheck" />
              </div>
              <p className="text-body-bold font-body-bold text-white/90 flex-1">
                Elige fechas y agrega eventos a tu calendario para no perderte nada
              </p>
            </div>
            <div className="flex items-center gap-4 text-left">
              <div className="w-[48px] h-[48px] flex-shrink-0">
                <IconWithBackground size="large" icon="FeatherMusic" />
              </div>
              <p className="text-body-bold font-body-bold text-white/90 flex-1">
                Encuentra fiestas, conciertos, expos y todo tipo de actividades de entretenimiento
              </p>
            </div>
            <div className="flex items-center gap-4 text-left">
              <div className="w-[48px] h-[48px] flex-shrink-0">
                <IconWithBackground size="large" icon="FeatherUsers" />
              </div>
              <p className="text-body-bold font-body-bold text-white/90 flex-1">
                Descubre a dónde van tus amigos
              </p>
            </div>
          </div>
        </div>

        <h2 className="hidden lg:block max-w-4xl text-heading-1 font-heading-1 text-white leading-tight">
          Hay un evento para cada vibra, ¿cuál es la tuya?
        </h2>
        <Link href="https://zaap.bio/hunt" target="_blank" className="hidden lg:block">
          <Button 
            className="px-10 py-5 h-auto min-h-[56px] rounded-xl font-semibold bg-white text-black hover:bg-neutral-100 transition-all duration-200 text-lg"
            style={{ boxShadow: '0 6px 24px rgba(255,255,255,0.3)', border: 'none' }}
          >
            Descarga la app
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default CallToAction;
