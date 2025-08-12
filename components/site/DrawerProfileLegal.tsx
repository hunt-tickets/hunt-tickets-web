"use client";

import Drawer from "react-modern-drawer";
import DrawerHeader from "./DrawerHeader";

type DrawerProfileLegalProps = {
  open: boolean;
  close: () => void;
};

const DrawerProfileLegal = ({ open, close }: DrawerProfileLegalProps) => {
  return (
    <Drawer open={open} onClose={close} direction="right" size={450}>
      <div className="flex h-full w-full flex-col items-start gap-1 bg-default-background">
        <div
          className="flex w-full flex-col items-start gap-8 px-8 pt-8"
          onClick={close}
        >
          <DrawerHeader title="Información bancaria" />
        </div>
        <div className="flex w-full min-w-[450px] flex-col items-start gap-10 px-8 py-8">
          <div className="flex w-full flex-col items-start gap-4">
            {/* contenido del drawer */}
          </div>
        </div>
      </div>
    </Drawer>
  );
};

export default DrawerProfileLegal;
