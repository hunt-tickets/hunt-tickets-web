"use client";

import { menuAdminData } from "@/lib/mockup/menuAdminData";
import * as SubframeCore from "@subframe/core";
import { IconName } from "@subframe/core";
import Link from "next/link";
import { SidebarRailWithIcons } from "../sub/SidebarRailWithIcons";
import { Avatar } from "../sub/avatar";
import { DropdownMenu } from "../sub/dropdownMenu";
import ImgLogo from "./ImgLogo";

function SidebarRailWithIconsExample() {
  return (
    <SidebarRailWithIcons
      style={{
        background: 'rgba(0, 0, 0, 0.2)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderRight: '1px solid rgba(255, 255, 255, 0.1)',
      }}
      header={
        <div className="flex flex-col items-center justify-center gap-2 px-1 py-1">
          <ImgLogo />
        </div>
      }
      footer={
        <>
          <SidebarRailWithIcons.NavItem icon="FeatherBell">
            Notificaciones
          </SidebarRailWithIcons.NavItem>
          <SidebarRailWithIcons.NavItem icon="FeatherSettings">
            Configuraciones
          </SidebarRailWithIcons.NavItem>
          <div className="flex flex-col items-center justify-end gap-1 px-1 py-1">
            <SubframeCore.DropdownMenu.Root>
              <SubframeCore.DropdownMenu.Trigger asChild={true}>
                <Avatar variant="neutral" size="medium" image="" square={false}>
                  A
                </Avatar>
              </SubframeCore.DropdownMenu.Trigger>
              <SubframeCore.DropdownMenu.Portal>
                <SubframeCore.DropdownMenu.Content
                  side="bottom"
                  align="start"
                  sideOffset={4}
                  asChild={true}
                >
                  <DropdownMenu 
                    style={{
                      background: 'rgba(0, 0, 0, 0.8)',
                      backdropFilter: 'blur(20px)',
                      WebkitBackdropFilter: 'blur(20px)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                    }}
                  >
                    <DropdownMenu.DropdownItem icon="FeatherUser">
                      Profile
                    </DropdownMenu.DropdownItem>
                    <DropdownMenu.DropdownItem icon="FeatherSettings">
                      Settings
                    </DropdownMenu.DropdownItem>
                    <DropdownMenu.DropdownItem icon="FeatherLogOut">
                      Log out
                    </DropdownMenu.DropdownItem>
                  </DropdownMenu>
                </SubframeCore.DropdownMenu.Content>
              </SubframeCore.DropdownMenu.Portal>
            </SubframeCore.DropdownMenu.Root>
          </div>
        </>
      }
    >
      {menuAdminData.map((item, index) => (
        <Link key={item.label + index} href={item.href}>
          <SidebarRailWithIcons.NavItem 
            icon={item.icon as IconName}
          >
            {item.label}
          </SidebarRailWithIcons.NavItem>
        </Link>
      ))}
    </SidebarRailWithIcons>
  );
}

export default SidebarRailWithIconsExample;
