"use client";
import { Reorder } from "framer-motion";
import { useEffect, useState } from "react";
import { Button } from "../sub/button";
import ProfileActionList from "./ProfileActionList";
import ProfileActionOrderMyList from "./ProfileActionOrderMyList";
import { Switch } from "./Switch";
type ProfileOrderListProps = {
  close: () => void;
  items: any[];
  onDelete: (id: string) => void;
  loading: boolean;
  onConfirmOrder: (updatedItems: any[]) => void;
};

const ProfileOrderList = ({
  close,
  items,
  onDelete,
  loading,
  onConfirmOrder,
}: ProfileOrderListProps) => {
  const [orderedItems, setOrderedItems] = useState<any[]>(items);
  const [isChecked, setIsChecked] = useState(false);
  const [hasChanged, setHasChanged] = useState(false);

  useEffect(() => {
    setOrderedItems(items);
    setHasChanged(false);
  }, [items]);

  const handleDelete = (id: string) => {
    onDelete(id);
  };

  const handleCheckedChange = (checked: boolean) => {
    setIsChecked(checked);
  };

  const handleReorder = (newOrder: any[]) => {
    setOrderedItems(newOrder);
    setHasChanged(true);
  };

  const handleConfirm = async () => {
    if (hasChanged) {
      const updatedOrder = orderedItems.map((item, index) => ({
        ...item,
        position: index,
      }));
      console.log("updatedOrder", updatedOrder);
      onConfirmOrder(updatedOrder);
    }
    setIsChecked(false);
  };

  if (loading) {
    return <p>Cargando...</p>;
  }

  return (
    <>
      <div className="flex w-full flex-col items-start gap-8 rounded-md border border-solid border-neutral-border bg-default-background px-6 py-6 mb-6 shadow-sm">
        <div className="flex w-full items-start gap-6">
          <Switch checked={isChecked} onCheckedChange={handleCheckedChange} />
          <p className="eco">Activa y Ordena la lista</p>
        </div>
        <div className="flex w-full flex-col items-start">
          {isChecked ? (
            <Reorder.Group
              axis="y"
              values={orderedItems}
              onReorder={handleReorder}
              className="w-full"
            >
              {orderedItems.map((item) => (
                <ProfileActionOrderMyList
                  key={item.id}
                  label={item.producers_category.name}
                  item={item}
                  position={item.position}
                />
              ))}
            </Reorder.Group>
          ) : (
            <>
              {items.map((item) => (
                <ProfileActionList
                  key={item.id}
                  icon={item.producers_category.icon}
                  label={item.producers_category.name}
                  onDelete={() => handleDelete(item.id)}
                />
              ))}
            </>
          )}
        </div>
      </div>
      <div className="flex w-full flex-col items-end gap-2">
        <div className="flex w-full flex-wrap items-center justify-between">
          <div className="flex grow shrink-0 basis-0 flex-wrap items-center justify-end gap-2">
            <Button variant="neutral-secondary" onClick={close}>
              Cancelar
            </Button>
            <div className="flex items-center justify-end gap-2">
              <Button disabled={!hasChanged} onClick={handleConfirm}>
                Confirmar
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfileOrderList;
