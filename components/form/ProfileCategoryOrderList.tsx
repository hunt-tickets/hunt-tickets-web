import CategoryProfileAction from "../site/CategoryProfileAction";
import { Button } from "../sub/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

type ProfileCategoryOrderListProps = {
  close: () => void;
};

const categories = [
  {
    id: "1",
    icon: "FeatherBeer",
    name: "Cerveza",
  },
  {
    id: "2",
    icon: "FeatherAlertCircle",
    name: "Alcohol",
  },
];

const ProfileCategoryOrderList = ({ close }: ProfileCategoryOrderListProps) => {
  return (
    <>
      <div className="flex w-full flex-col items-start gap-8 rounded-md border border-solid border-neutral-border bg-default-background px-6 py-6 mb-6 shadow-sm">
        <div className="flex w-full flex-col items-start gap-6">
          {categories.map((category) => (
            <CategoryProfileAction
              key={category.id}
              icon={category.icon}
              label={category.name}
              onDelete={() => {}}
            />
          ))}
        </div>
      </div>
      <div className="flex w-full flex-col items-end gap-2">
        <div className="flex w-full flex-wrap items-center justify-between">
          <div className="flex grow shrink-0 basis-0 flex-wrap items-center justify-end gap-2">
            <Button variant="neutral-secondary" onClick={close}>
              Cancelar
            </Button>
            <div className="flex items-center justify-end gap-2">
              <Button type="submit">Confirmar</Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfileCategoryOrderList;
