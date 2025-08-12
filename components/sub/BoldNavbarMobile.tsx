"use client";

import { supabase } from "@/lib/supabaseBrowser";
import * as SubframeCore from "@subframe/core";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import { Button } from "./button";
import { IconButton } from "./iconButton";

interface NavItemProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  selected?: boolean;
  className?: string;
  disabled?: boolean;
}

const NavItem = React.forwardRef<HTMLElement, NavItemProps>(function NavItem(
  {
    children,
    selected = false,
    className,
    disabled = false,
    ...otherProps
  }: NavItemProps,
  ref
) {
  return (
    <div
      className={SubframeCore.twClassNames(
        "group/0a1c836c flex h-8 cursor-pointer flex-col items-center justify-center gap-4 rounded-full px-4",
        { "bg-brand-200": selected },
        className,
        { "cursor-not-allowed": disabled }
      )}
      ref={ref as any}
      {...otherProps}
    >
      {children ? (
        <span className="font-montserrat text-[15px] font-[600] leading-[20px] text-brand-900">
          {children}
        </span>
      ) : null}
    </div>
  );
});

interface BoldNavbarMobileRootProps
  extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  user?: any;
  profile?: any;
}

const BoldNavbarMobileRoot = React.forwardRef<
  HTMLElement,
  BoldNavbarMobileRootProps
>(function BoldNavbarMobileRoot(
  { className, user, profile, ...otherProps }: BoldNavbarMobileRootProps,
  ref
) {
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
        "flex w-full max-w-[1280px] flex-wrap items-center justify-between",
        className
      )}
      ref={ref as any}
      {...otherProps}
    >
      <div className="flex h-12 flex-col items-start justify-center gap-2 px-4">
        <Link href="/">
          <img
            className="h-6 w-h6 flex-none object-cover"
            src="https://res.cloudinary.com/subframe/image/upload/v1733254448/uploads/4760/jdot6rdprtl4kwxkfxqb.png"
          />
        </Link>
      </div>
      <div className="flex flex-row items-center gap-2 px-2">
        {user?.id ? (
          <>
            <div className="flex items-center gap-2 px-2">
              <Button
                variant="brand-tertiary"
                icon="FeatherUser"
                onClick={handleProfile}
              >
                Perfil
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
          <>
            <Link href="/sign-mail">
              <Button variant="brand-tertiary">Ingresar</Button>
            </Link>
            <Link href="/sign-mail">
              <Button>Registrarse</Button>
            </Link>
          </>
        )}
        <SubframeCore.Popover.Root>
          <SubframeCore.Popover.Trigger asChild={true}>
            <IconButton icon="FeatherMenu" />
          </SubframeCore.Popover.Trigger>
          <SubframeCore.Popover.Portal>
            <SubframeCore.Popover.Content
              side="bottom"
              align="end"
              sideOffset={4}
              asChild={true}
            >
              <div className="flex min-w-[320px] flex-col items-start gap-2 rounded-md border border-solid border-neutral-border bg-default-background px-3 py-3 shadow-lg">
                <Link href="/events">
                  <NavItem className="h-8 w-full flex-none">Eventos</NavItem>
                </Link>
                <Link href="#">
                  <NavItem className="hidden h-8 w-full flex-none" disabled={true}>
                    Productores
                  </NavItem>
                </Link>
                <Link href="/about-us">
                  <NavItem className="h-8 w-full flex-none">
                    Sobre nosotros
                  </NavItem>
                </Link>
              </div>
            </SubframeCore.Popover.Content>
          </SubframeCore.Popover.Portal>
        </SubframeCore.Popover.Root>
      </div>
    </div>
  );
});

export const BoldNavbarMobile = Object.assign(BoldNavbarMobileRoot, {
  NavItem,
});
