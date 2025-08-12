import android from "@/assets/android.svg";
import ios from "@/assets/ios.svg";
import Link from "next/link";
import { IconButton } from "../sub/iconButton";
import { LinkButton } from "../sub/linkButton";
import { OAuthSocialButton } from "../sub/OAuthSocialButton";

const Footer = () => {
  return (
    <footer className="hidden lg:flex w-full grow shrink-0 basis-0 flex-col items-center justify-center gap-6 border-t border-solid border-neutral-100 px-6 pt-10 pb-24">
      <div className="flex items-center justify-center gap-6">
        <Link href="https://apps.apple.com/app/id1658242880" target="_blank">
          <OAuthSocialButton logo={ios.src} disabled={false} />
        </Link>
        <Link
          href="https://play.google.com/store/apps/details?id=com.hunt.ticket"
          target="_blank"
        >
          <OAuthSocialButton logo={android.src} disabled={false} />
        </Link>
      </div>
      <div className="flex w-full max-w-[1280px] flex-col items-center gap-12">
        <div className="flex w-full min-w-[144px] items-start gap-2">
          <img
            className="h-6 flex-none object-cover"
            src="https://res.cloudinary.com/subframe/image/upload/v1733254448/uploads/4760/jdot6rdprtl4kwxkfxqb.png"
          />
        </div>
        <div className="flex w-full flex-wrap items-start gap-6">
          <div className="flex min-w-[144px] grow shrink-0 basis-0 flex-col items-start gap-6">
            <span className="w-full font-montserrat text-[14px] font-[600] leading-[20px] text-default-font -tracking-[0.01em]">
              Producto
            </span>
            <div className="flex flex-col items-start gap-4">
              <Link href="/events">Eventos</Link>
              <LinkButton disabled={true}>Productores</LinkButton>
              <LinkButton disabled={true}>Artistas</LinkButton>
              <LinkButton disabled={true}>Venues</LinkButton>
            </div>
          </div>
          <div className="flex min-w-[144px] grow shrink-0 basis-0 flex-col items-start gap-6">
            <span className="w-full font-montserrat text-[14px] font-[600] leading-[20px] text-default-font -tracking-[0.01em]">
              HUNT
            </span>
            <div className="flex flex-col items-start gap-4">
              <Link href="/about-us">Sobre nosotros</Link>
              <LinkButton disabled={true}>Equipo</LinkButton>
              <LinkButton>
                <a href="https://wa.me/573228597640" target="_blank">
                  Contáctanos
                </a>
              </LinkButton>
              <LinkButton>
                <a href="https://zaap.bio/hunt" target="_blank">
                  Descarga la app
                </a>
              </LinkButton>
            </div>
          </div>
          <div className="flex min-w-[144px] grow shrink-0 basis-0 flex-col items-start gap-6">
            <span className="w-full font-montserrat text-[14px] font-[600] leading-[20px] text-default-font -tracking-[0.01em]">
              Recursos
            </span>
            <div className="flex flex-col items-start gap-4">
              <Link href="/resources/terms-and-conditions">
                Términos y condiciones
              </Link>
              <Link href="/resources/privacy">Política de privacidad</Link>
              <LinkButton disabled={true}>Ayuda</LinkButton>
              <Link href="https://wa.me/573228597640" target="_blank">
                Danos retroalimentación
              </Link>
              <LinkButton disabled={true}>Cookie policy</LinkButton>
            </div>
          </div>
          <div className="flex min-w-[144px] grow shrink-0 basis-0 flex-col items-start gap-4 self-stretch">
            <span className="w-full font-montserrat text-[14px] font-[600] leading-[20px] text-default-font -tracking-[0.01em]">
              Síguenos
            </span>
            <div className="flex w-full items-center gap-2">
              <Link
                href="https://www.instagram.com/hunt____tickets/"
                target="_blank"
              >
                <IconButton icon="FeatherInstagram" />
              </Link>
              <Link
                href="https://www.linkedin.com/company/hunt-tickets-co/"
                target="_blank"
              >
                <IconButton icon="FeatherLinkedin" />
              </Link>
              <Link href="https://wa.me/573228597640" target="_blank">
                <IconButton icon="FeatherMessageCircle" />
              </Link>
              {/* <Link href="https://www.facebook.com/hunt.ticket" target="_blank">
              <IconButton icon="FeatherFacebook" />
              </Link> */}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
