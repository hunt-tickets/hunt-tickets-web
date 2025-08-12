import InputSearch from "./InputSearch";

type ToolbarProps = {
  title: string;
  onSearch: (value: string) => void;
};
const Toolbar = ({
  title,
  onSearch,
}: ToolbarProps) => {
  return (
    <div className="flex w-full">
      <InputSearch onSearch={onSearch} />
    </div>
  );
};

export default Toolbar;
