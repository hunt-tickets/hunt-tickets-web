interface VenueCardProps {
  imageUrl: string;
  name: string;
  address: string;
}

const VenueCard: React.FC<VenueCardProps> = ({ imageUrl, name, address }) => {
  return (
    <div className="flex w-full md:w-48 mx-auto flex-none items-center gap-4 self-stretch overflow-hidden rounded-lg border border-solid border-neutral-border bg-default-background px-4 py-4">
      <div className="flex flex-row grow shrink-0 basis-0 md:flex-col items-start justify-center gap-2 self-stretch">
        <img
          className="w-[100px] md:w-full max-h-[60px] md:max-h-[175px] mr-4 md:mr-0 grow shrink-0 basis-0 rounded-md object-cover"
          src={imageUrl}
          alt={name}
        />
        <div className="w-full md:w-full flex flex-col items-start justify-center gap-1">
          <span className="text-heading-3 font-heading-3 text-default-font">
            {name}
          </span>
          <span className="text-caption font-caption text-subtext-color">
            {address}
          </span>
        </div>
      </div>
    </div>
  );
};

export default VenueCard;
