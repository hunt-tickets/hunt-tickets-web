import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ReactNode } from "react";

type BaseDialogProps = {
  open: boolean;
  close: () => void;
  title: string;
  children: ReactNode;
  footerActions?: ReactNode;
  isFooterActions?: boolean;
  disableClose?: boolean;
};

const BaseDialog = ({
  open,
  close,
  title,
  children,
  footerActions,
  isFooterActions = false,
  disableClose = false,
}: BaseDialogProps) => {
  return (
    <Dialog
      open={open}
      onOpenChange={(val) => {
        if (!disableClose) {
          close();
        }
      }}
    >
      <DialogContent
        className="sm:max-w-md"
        onInteractOutside={(e) => {
          if (disableClose) e.preventDefault();
        }}
        onEscapeKeyDown={(e) => {
          if (disableClose) e.preventDefault();
        }}
        disableClose={disableClose}
      >
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold">{title}</DialogTitle>
        </DialogHeader>
        <div className="p-4">{children}</div>
        {isFooterActions && (
          <DialogFooter>
            {footerActions}
            {!disableClose && (
              <DialogClose asChild>
                <Button variant="secondary">Cerrar</Button>
              </DialogClose>
            )}
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default BaseDialog;
