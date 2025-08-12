import { LargeBadge } from "@/components/sub/LargeBadge";
import { IconName } from "@subframe/core";

type ProfileBadgesProps = {
  onAddCategory: () => void;
  categories?: any[];
  loading: boolean;
};

const ProfileBadges = ({
  onAddCategory,
  categories,
  loading,
}: ProfileBadgesProps) => {
  return (
    <div className="flex grow shrink-0 basis-0 flex-wrap items-start gap-2">
      <LargeBadge onClick={onAddCategory}>Agrega una catgeoría</LargeBadge>
      {loading ? (
        <p>Cargando...</p>
      ) : (
        categories?.map((category) => {
          const name = category.producers_category.name;
          const icon = category.producers_category.icon;
          return (
            <LargeBadge
              key={category.id}
              icon={(icon as IconName) || "FeatherDumbbell"}
            >
              {name}
            </LargeBadge>
          );
        })
      )}
    </div>
  );
};

export default ProfileBadges;
