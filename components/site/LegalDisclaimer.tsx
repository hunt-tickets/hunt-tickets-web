import Link from "next/link";

const LegalDisclarmer = () => {
  return (
    <div className="text-center mt-12">
      <div className="flex flex-wrap items-center justify-center gap-0.5 text-sm">
        <span className="text-body text-sm text-subtext-color">
          Al continuar aceptas nuestros
        </span>
        <Link href="https://twitter.com/" passHref>
          <b>Terminos &amp; Condiciones</b>
        </Link>
        <span className="text-body text-sm text-subtext-color">y nuestra</span>
        <Link href="https://twitter.com/" passHref></Link>
        <Link href="https://twitter.com/" passHref>
          <b>Política de privacidad</b>
        </Link>
      </div>
      
      {/* Support contact button */}
      <div className="mt-8">
        <button className="text-white/60 hover:text-white/90 text-base font-light transition-all duration-300 px-6 py-2 border border-white/20 hover:border-white/40 hover:bg-white/5 hover:shadow-lg rounded-full mx-auto">
          Contactar Soporte
        </button>
      </div>
    </div>
  );
};

export default LegalDisclarmer;
