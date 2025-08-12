import { IconButton } from "../sub/iconButton";
import TitleSection from "./TitleSection";

interface DrawerHeaderProps {
  title: string;
}

const DrawerHeader = ({ title }: DrawerHeaderProps) => {
  return (
    <div className="flex w-full flex-col items-start gap-4">
      <div className="flex w-full items-center gap-2">
        <TitleSection title={title} formTitle />
        <IconButton
          disabled={false}
          variant="neutral-tertiary"
          size="medium"
          icon="FeatherX"
          loading={false}
        />
      </div>
      <div className="flex h-px w-full flex-none flex-col items-center gap-2 bg-neutral-border" />
    </div>
  );
};

export default DrawerHeader;
