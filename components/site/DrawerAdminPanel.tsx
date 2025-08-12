import {
  getProducerCategories,
  getProducerCategoryCounts,
  getProducersGrowth,
  getProducersGrowthSummary,
  getProfileViewsGrowth,
  updateProducerCategory,
} from "@/supabase/producersService";
import React, { useEffect, useState } from "react";
import CategoryCreate from "../form/CategoryCreate";
import { ActionCard } from "../sub/ActionCard";
import { Button } from "../sub/button";
import { Input } from "../ui/input";
import AvatarActionItem from "./AvatarActionItem";
import { BarChart } from "./BarChart";
import CategorySwitchItem from "./CategorySwitchItem";
import DrawerHeader from "./DrawerHeader";
import { DrawerLayout } from "./DrawerLayout";
import StatCard from "./StatCard";


type DrawerAdminPanelProps = {
  open: boolean;
  close: () => void;
  onNewProducer: () => void;
  typeData: "producers" | "categories" | "events";
};

type Category = {
  id: string;
  name: string;
  status: boolean;
  icon: string;
};

const DrawerAdminPanel: React.FC<DrawerAdminPanelProps> = ({
  open,
  close,
  onNewProducer,
}) => {
  const [growthData, setGrowthData] = useState<{
    total_count: number;
    growth_percentage: number;
  } | null>(null);

  const [growthSummary, setGrowthSummary] = useState<{
    total_count: number;
    growth_percentage: number;
  } | null>(null);

  const [profileViewsGrowth, setProfileViewsGrowth] = useState<{
    total_count: number;
    growth_percentage: number;
  } | null>(null);

  const [categoryCounts, setCategoryCounts] = useState<
    { category: string; count: number }[]
  >([]);

  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategory, setNewCategory] = useState<boolean>(false);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducersGrowth = async () => {
      const { data, error } = await getProducersGrowth();
      if (error) {
        console.log("Error fetching producers growth:", error);
        setGrowthData(null);
      } else {
        setGrowthData(data);
      }
      setLoading(false);
    };
    fetchProducersGrowth();
  }, []);

  useEffect(() => {
    const fetchProducersGrowthSummary = async () => {
      const { data, error } = await getProducersGrowthSummary();
      if (error) {
        console.log("Error fetching producers growth summary:", error);
        setGrowthSummary(null);
      } else {
        setGrowthSummary(data);
      }
      setLoading(false);
    };
    fetchProducersGrowthSummary();
  }, []);

  useEffect(() => {
    const fetchProfileViewsGrowth = async () => {
      const { data, error } = await getProfileViewsGrowth();
      if (error) {
        console.log("Error fetching profile views growth:", error);
        setProfileViewsGrowth(null);
      } else {
        setProfileViewsGrowth(data);
      }
      setLoading(false);
    };
    fetchProfileViewsGrowth();
  }, []);

  useEffect(() => {
    const fetchCategoryCounts = async () => {
      const { data, error } = await getProducerCategoryCounts();
      if (error) {
        console.log("Error fetching category counts:", error);
        setCategoryCounts([]);
      } else {
        setCategoryCounts(data || []);
      }
      setLoading(false);
    };
    fetchCategoryCounts();
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      const { data, error } = await getProducerCategories();
      if (error) {
        console.log("Error fetching categories:", error);
        setCategories([]);
      } else {
        setCategories(
          data?.map((category) => ({
            ...category,
            icon: category.icon || "",
          })) || []
        );
      }
      setLoading(false);
    };

    fetchCategories();
  }, []);

  const handleSwitchChange = async (id: string, checked: boolean) => {
    setLoading(true);
    const { success, error } = await updateProducerCategory(id, checked);
    if (error) {
      console.log("Error updating category:", error);
    } else if (success) {
      setCategories((prevCategories) =>
        prevCategories.map((category) =>
          category.id === id ? { ...category, status: checked } : category
        )
      );
    }
    setLoading(false);
  };

  const items = [
    {
      avatarImage:
        "https://res.cloudinary.com/subframe/image/upload/v1711417507/shared/fychrij7dzl8wgq2zjq9.avif",
      label: "Rumba",
      icons: [
        { icon: "FeatherUser", variant: "brand" },
        { icon: "FeatherX", variant: "brand" },
        { icon: "FeatherCheck" },
      ],
    },
  ];

  const handleNewCategory = () => {
    setNewCategory(!newCategory);
  };

  return (
    <DrawerLayout open={open} onOpenChange={close}>
      <div className="flex h-full w-full flex-col items-start gap-1 bg-default-background">
        <div
          className="flex w-full flex-col items-start gap-8 px-8 pt-8"
          onClick={close}
        >
          <DrawerHeader title="Admin Panel" />
        </div>
      </div>
      <div className="flex w-full flex-col items-start gap-8 px-8 pb-8">
        <div className="flex w-full flex-wrap items-start gap-2">
          <StatCard
            title="Productores"
            value={growthData?.total_count || 0}
            percentage={growthData?.growth_percentage || 0}
            badgeVariant="success"
            badgeIcon="FeatherArrowUp"
          />
          <StatCard
            title="Productores"
            value={growthSummary?.total_count || 0}
            percentage={growthSummary?.growth_percentage || 0}
            badgeVariant="neutral"
            badgeIcon="FeatherMinus"
          />
          <StatCard
            title="Productores"
            value={profileViewsGrowth?.total_count || 0}
            percentage={profileViewsGrowth?.growth_percentage || 0}
            badgeVariant="error"
            badgeIcon="FeatherArrowDown"
          />
        </div>
        <div className="flex w-full grow shrink-0 basis-0 items-center gap-4">
          <ActionCard
            icon="FeatherPaintbrush"
            title="Nueva categoría"
            desc="Crea una nueva categoría "
            onClick={handleNewCategory}
          />
          <ActionCard
            icon="FeatherFactory"
            title="Nuevo productor"
            desc="Crea un nuevo perfil de productor"
            onClick={onNewProducer}
          />
        </div>
        <CategoryCreate visible={newCategory} onCategoryCreated={() => {}} />
        <div className="flex w-full items-center">
          <BarChart
            stacked={false}
            categories={["Deporte", "Arte", "Photo"]}
            data={[
              { Year: "2023", Deporte: 25, Arte: 12, Photo: 6 },
              { Year: "2024", Deporte: 12, Arte: 6, Photo: 8 },
              { Year: "2025", Deporte: 2, Arte: 4, Photo: 1 },
            ]}
            index={"Year"}
          />
        </div>
        <div className="flex w-full flex-col items-start rounded-md border border-solid border-neutral-border bg-default-background px-4 py-4 shadow-sm">
          <div className="flex w-full items-end justify-end gap-2">
            <Input
              className="h-auto grow shrink-0 basis-0"
              disabled={false}
              placeholder="correo@hunt-tickets.com"
            />
            <Button
              disabled={false}
              variant="neutral-primary"
              size="medium"
              icon={null}
              iconRight="FeatherSendHorizontal"
              loading={false}
              onClick={(event: React.MouseEvent<HTMLButtonElement>) => {}}
            />
          </div>
        </div>
        <div className="flex w-full flex-col items-start gap-8 rounded-md border border-solid border-neutral-border bg-default-background px-6 py-6 shadow-sm">
          <div className="flex w-full flex-col items-start gap-6">
            {categories.map((category) => (
              <CategorySwitchItem
                key={category.id}
                icon={category.icon}
                label={category.name}
                checked={category.status}
                onCheckedChange={(checked) =>
                  handleSwitchChange(category.id, checked)
                }
              />
            ))}
          </div>
        </div>
        <div className="hidden flex w-full flex-col items-start gap-8 rounded-md border border-solid border-neutral-border bg-default-background px-6 py-6 shadow-sm">
          {items.map((item, index) => (
            <AvatarActionItem
              key={index}
              avatarImage={item.avatarImage}
              label={item.label}
              icons={item.icons}
            />
          ))}
        </div>
        <div className="flex h-px w-full flex-none flex-col items-center gap-2 bg-neutral-border" />
      </div>
    </DrawerLayout>
  );
};

export default DrawerAdminPanel;
