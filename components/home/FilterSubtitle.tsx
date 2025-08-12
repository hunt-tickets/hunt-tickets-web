import { City } from "@/types/site";
import { SelectMultiple } from "../site/SelectMultiple";
import { IconButton } from "../sub/iconButton";

const FilterSubtitle = ({
  title,
  cities,
  selectedCity,
  setSelectedCity,
}: {
  title: string;
  cities: City[];
  selectedCity: string;
  setSelectedCity: (city: string) => void;
}) => {
  return (
    <div className="flex items-center gap-2">
      <h3 className="flex items-center gap-2">
        <span className="text-heading-2 font-heading-2 text-subtext-color">
          {title}
        </span>
        <SelectMultiple
          items={cities.map((city) => ({
            label: city.name,
            value: city.name,
          }))}
          selectedValue={selectedCity}
          onValueChange={setSelectedCity}
        />
      </h3>
      <IconButton
        disabled={false}
        variant="neutral-tertiary"
        size="small"
        icon="FeatherChevronDown"
        loading={false}
      />
    </div>
  );
};

export default FilterSubtitle;
