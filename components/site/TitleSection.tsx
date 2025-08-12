import { cn } from "@/lib/utils";

type TitleSectionProps = {
  title: string;
  formTitle?: boolean;
};
const TitleSection = ({ title, formTitle = false }: TitleSectionProps) => {
  return (
    <h2
      className={cn(
        `${
          formTitle
            ? "grow shrink-0 basis-0 text-heading-1 text-2xl font-bold font-heading-1 text-default-font"
            : "text-heading-2 text-2xl font-bold font-heading-1 text-default-font"
        }`
      )}
    >
      {title}
    </h2>
  );
};

export default TitleSection;
