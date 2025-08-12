import { Resident, Technician, Venue } from "@/types/site";
import React from "react";
import { ButtonPlaceholder } from "../sub/ButtonPlaceholder";
import ProducerItemSlider from "./ProducerItemSlider";
import ProfileItemCard from "./ProfileItemCard";

type ProfileItemListProps = {
  title: string;
  resident?: Resident[];
  venue?: Venue[];
  technician?: Technician[];
  type: "resident" | "venue" | "technician";
  onAddResident?: () => void;
  onAddVenue?: () => void;
  onAddTechnician?: () => void;
};

const ProfileItemList: React.FC<ProfileItemListProps> = ({
  title,
  resident,
  venue,
  technician,
  type,
  onAddResident,
  onAddVenue,
  onAddTechnician,
}) => {
  return (
    <div className="flex w-full grow shrink-0 basis-0 flex-col items-center gap-3">
      <span className="w-full grow shrink-0 basis-0 text-heading-3 font-heading-3 text-default-font">
        {title}
      </span>
      <div className="flex w-full flex-wrap items-start gap-4">
        {type === "resident" && (
          <>
            {resident && resident.length <= 6 ? (
              <>
                {resident.map((item) => (
                  <ProfileItemCard
                    key={item.artist_id}
                    image={item.logo}
                    title={item.name}
                    subtitle={item.category}
                  />
                ))}
              </>
            ) : (
              <div className="w-10/12">
                <ProducerItemSlider>
                  {resident?.map((item) => (
                    <div key={item.artist_id} className="px-2">
                      <ProfileItemCard
                        image={item.logo}
                        title={item.name}
                        subtitle={item.category}
                      />
                    </div>
                  ))}
                </ProducerItemSlider>
              </div>
            )}
          </>
        )}
        {type === "venue" &&
          venue?.map((item) => (
            <ProfileItemCard
              key={item.venue_id}
              image={item.logo}
              title={item.name}
              subtitle={item.city}
            />
          ))}
        {type === "technician" &&
          technician?.map((item) => (
            <ProfileItemCard
              key={item.technician_id}
              image={item.image}
              title={item.name}
            />
          ))}
        <ButtonPlaceholder
          className="h-auto w-auto flex-none self-stretch"
          icon="FeatherPlus"
          onClick={
            type === "resident"
              ? onAddResident
              : type === "venue"
              ? onAddVenue
              : onAddTechnician
          }
        >
          Agregar{" "}
          {type === "resident"
            ? "residentes"
            : type === "venue"
            ? "venues"
            : "tecnicos"}
        </ButtonPlaceholder>
      </div>
    </div>
  );
};

export default ProfileItemList;
