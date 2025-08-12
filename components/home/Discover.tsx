import Link from "next/link";
import { Button } from "../sub/button";

const Discover = () => {
  return (
    <div className="flex w-full max-w-[1280px] grow shrink-0 basis-0 flex-wrap items-center justify-center gap-12">
      <div className="flex min-w-[320px] grow shrink-0 basis-0 flex-col items-start justify-center gap-10 self-stretch">
        <div className="flex max-w-[448px] flex-col items-start justify-center gap-4">
          <h2 className="text-heading-1 font-heading-1 text-default-font">
            Descubre los mejores eventos en tu ciudad
          </h2>
          <p className="text-body font-body text-subtext-color">
            Te recomendamos planes a tu medida, basados en tus gustos y tu forma de vivir la ciudad. Encontrar qué hacer nunca fue tan fácil.
          </p>
        </div>
        <Link href="https://zaap.bio/hunt" target="_blank">
          <Button 
            className="px-8 py-4 h-auto min-h-[52px] rounded-xl font-semibold bg-white text-black hover:bg-neutral-100 transition-all duration-200"
            style={{ boxShadow: '0 4px 20px rgba(255,255,255,0.2)', border: 'none' }}
          >
            Descarga la app
          </Button>
        </Link>
      </div>
      <div className="flex grow shrink-0 basis-0 flex-col items-center justify-center gap-2 self-stretch">
        <div 
          className="w-full min-w-[240px] max-w-[576px] h-[400px] md:h-[500px] rounded-xl overflow-hidden"
          style={{
            boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
          }}
        >
          <img
            className="w-full h-full object-cover"
            src="https://res.cloudinary.com/subframe/image/upload/v1733866993/uploads/4760/dw0mmjxttduahp4wzfyx.gif"
            alt="Descubre eventos"
          />
        </div>
      </div>
    </div>
  );
};

export default Discover;
