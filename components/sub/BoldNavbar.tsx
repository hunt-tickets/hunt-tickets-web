import { supabase } from "@/lib/supabaseBrowser";
import * as SubframeCore from "@subframe/core";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Badge } from "../sub/Badge";
import { Button } from "./button";
import { LinkButton } from "./linkButton";

interface BoldNavbarProps {
  className?: string;
  user: any;
  profile: any;
}

const BoldNavbar = ({
  className,
  user = null,
  profile = null,
}: BoldNavbarProps) => {
  const router = useRouter();

  const handleProfile = () => {
    if (profile?.admin) {
      router.push("/dashboard");
    } else {
      router.push("/register");
    }
  };

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        console.log("Error al cerrar sesión:", error.message);
        return;
      }

      router.push("/");
    } catch (err) {
      console.log("Error inesperado:", err);
    }
  };
  return (
    <div
      className={SubframeCore.twClassNames(
        "flex w-full flex-wrap items-center gap-4",
        className
      )}
    >
      <div className="flex h-12 flex-col items-start justify-center gap-2 px-4">
        <Link href="/">
          <img
            className="h-6 w-full flex-none object-cover"
            src="https://res.cloudinary.com/subframe/image/upload/v1733254448/uploads/4760/jdot6rdprtl4kwxkfxqb.png"
          />
        </Link>
      </div>
      <ul className="hidden md:flex px-4 mr-auto font-semibold font-heading space-x-12">
        <li>
          <Link href="/events">
            <LinkButton size="large" variant="brand">
              Eventos
            </LinkButton>
          </Link>
        </li>
        <li className="hidden">
          <Link href="/producers">
            <LinkButton size="large" variant="brand" disabled={true}>
              Productores
            </LinkButton>
          </Link>
        </li>
        <li>
          <Link href="/about-us">
            <LinkButton size="large" variant="brand">
              Sobre nosotros
            </LinkButton>
          </Link>
        </li>
      </ul>
      <div className="hidden">
        <LinkButton icon="FeatherSearch">Buscar</LinkButton>
        <LinkButton>Help</LinkButton>
      </div>
      <div className="hidden md:flex items-center gap-2 px-2">
        {user?.id ? (
          <>
            <div className="flex items-center gap-2 px-2">
              <Button
                variant="brand-tertiary"
                icon="FeatherUser"
                onClick={handleProfile}
              >
                <span>
                  <Badge>
                    <b>{profile?.name || user?.email}</b>
                  </Badge>
                </span>
              </Button>
              <Button
                variant="brand-tertiary"
                icon="FeatherLogOut"
                onClick={handleLogout}
              >
                Log out
              </Button>
            </div>
          </>
        ) : (
          <Link href="/sign-mail">
            <div className="relative group">
              <div className="px-6 py-2.5 bg-white/5 border border-white/10 rounded-full backdrop-blur-sm hover:bg-white/10 transition-all duration-200">
                <span className="text-white/80 text-sm font-medium hover:text-white transition-colors">
                  Iniciar sesión
                </span>
              </div>
            </div>
          </Link>
        )}
      </div>
    </div>
  );
};

export default BoldNavbar;
