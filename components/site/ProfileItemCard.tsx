import React from "react";

type ProfileItemCardProps = {
  image: string;
  title: string;
  subtitle?: string;
};

const ProfileItemCard: React.FC<ProfileItemCardProps> = ({
  image,
  title,
  subtitle,
}) => {
  return (
    <div className="flex grow shrink-0 basis-0 items-center gap-4 self-stretch overflow-hidden rounded-lg border border-solid border-neutral-border bg-default-background px-4 py-4 shadow-sm">
      <img
        className="h-12 w-12 flex-none rounded-md object-cover"
        src={
          `https://jtfcfsnksywotlbsddqb.supabase.co/storage/v1/object/public/${image}` ||
          "https://res.cloudinary.com/subframe/image/upload/v1723780741/uploads/302/iocrneldnziecxz0a86f.png"
        }
        alt={title || "Profile Item Image"}
      />
      <div className="flex grow shrink-0 basis-0 flex-col items-start justify-center gap-1">
        <span className="text-heading-3 font-heading-3 text-default-font">
          {title}
        </span>
        <span className="text-caption font-caption text-subtext-color">
          {subtitle}
        </span>
      </div>
    </div>
  );
};

export default ProfileItemCard;
