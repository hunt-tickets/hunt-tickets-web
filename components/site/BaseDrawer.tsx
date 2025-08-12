"use client";

import Drawer from "react-modern-drawer";
import DrawerHeader from "./DrawerHeader";

type BaseDrawerProps = {
  open: boolean;
  close: () => void;
  title: string;
  children: React.ReactNode;
  zIndex?: number;
};

const BaseDrawer = ({ open, close, title, children, zIndex = 10 }: BaseDrawerProps) => {
  return (
    <Drawer
      zIndex={zIndex === undefined ? 10 : zIndex}
      open={open}
      onClose={close}
      direction="right"
      size={450}
    >
      <div className="flex h-full w-full flex-col items-start gap-1 bg-default-background">
        <div
          className="flex w-full flex-col items-start gap-8 px-8 pt-8"
          onClick={close}
        >
          <DrawerHeader title={title} />
        </div>
        <div className="flex w-full min-w-[450px] flex-col items-start gap-10 px-8 py-8">
          <div className="flex w-full flex-col items-start gap-4">
            {children}
          </div>
        </div>
      </div>
    </Drawer>
  );
};

export default BaseDrawer;
