import Tooltip from "./Tooltip";

type SubTitleSectionProps = {
  title: string;
};
const SubTitleSection = ({ title }: SubTitleSectionProps) => {
  return (
    <div className="flex items-center gap-2 pl-2">
      <h3 className="text-heading-3 font-heading-3 text-default-font">
        {title}
      </h3>
      <Tooltip />
    </div>
  );
};

export default SubTitleSection;
