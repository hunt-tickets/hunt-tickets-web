import Link from "next/link";
import { Button } from "../sub/button";

const Ready = () => {
  return (
    <div className="flex w-full max-w-[1280px] grow shrink-0 basis-0 flex-wrap items-center justify-center gap-12">
      <div className="flex grow shrink-0 basis-0 flex-col items-center justify-center gap-2 self-stretch order-2 md:order-2">
        <div 
          className="w-full min-w-[240px] max-w-[576px] h-[400px] md:h-[500px] rounded-xl overflow-hidden"
          style={{
            boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
          }}
        >
          <img
            className="w-full h-full object-cover"
            src="https://res.cloudinary.com/subframe/image/upload/v1733815663/uploads/4760/gipjyh1hlqcvvbz29rlp.gif"
            alt="Listo para hoy"
          />
        </div>
      </div>
      <div className="flex min-w-[320px] grow shrink-0 basis-0 flex-col items-start justify-center gap-10 self-stretch order-1 md:order-2">
        <div className="flex max-w-[448px] flex-col items-start justify-center gap-4">
          <h2 className="text-heading-1 font-heading-1 text-default-font">
            ¿LISTO PARA HOY?
          </h2>
          <p className="text-body font-body text-subtext-color">
            Si tienes ganas de salir, nosotros tenemos el plan. Arma tu noche con un par de clics, alíneate con las vibras de tu ciudad y vive nuevas historias.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Link href="/events">
            <Button 
              className="px-8 py-4 h-auto min-h-[52px] rounded-xl font-semibold bg-white text-black hover:bg-neutral-100 transition-all duration-200"
              style={{ boxShadow: '0 4px 20px rgba(255,255,255,0.2)', border: 'none' }}
            >
              Ver otros eventos
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Ready;
