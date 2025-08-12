import Link from "next/link";

const LegalDisclarmer = () => {
  return (
    <div className="text-heading-2 font-heading-2 text-default-font text-center mt-10">
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
    </div>
  );
};

export default LegalDisclarmer;
