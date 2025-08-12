import blurImage from "@/assets/other.png";
import CardEvent from "@/components/site/CardEvent";
import { CardCreateNew } from "@/components/sub/CardCreateNew";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tab, TabContentItem } from "@/types/site";
import { IconName } from "@subframe/core";
import ProducerTabsSlider from "./ProducerTabsSlider";

interface ProfileTabsProps {
  tabs: Tab[];
  onEventClick: (event: TabContentItem) => void;
}

const ProfileTabs: React.FC<ProfileTabsProps> = ({ tabs, onEventClick }) => {
  return (
    <Tabs defaultValue="drafts" className="w-full">
      <TabsList>
        {tabs.map((tab) => (
          <TabsTrigger key={tab.value} value={tab.value}>
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {tabs.map((tab) => {
        const events = tab.content.filter((item) => item.type === "event");
        const createItems = tab.content.filter(
          (item) => item.type === "create"
        );

        return (
          <TabsContent key={tab.value} value={tab.value}>
            <div className="flex max-h-[576px] min-h-[320px] w-full items-start gap-4">
              {/* Renderiza los botones de creación primero */}
              {createItems.map((item, index) => (
                <div key={`create-${index}`} className="flex min-w-[250px]">
                  <CardCreateNew
                    icon={item.icon! as IconName}
                    text={item.text!}
                    onClick={() => onEventClick(item)}
                  />
                </div>
              ))}

              {/* Si hay 5 o más eventos, usa el slider */}
              {events.length >= 5 ? (
                <div className="w-full">
                  <ProducerTabsSlider>
                    {events.map((item, index) => (
                      <div key={`event-${index}`} className="px-2">
                        <CardEvent
                          location={item.location!}
                          name={item.name!}
                          image={item.image!}
                          blurImage={blurImage.src}
                          id={item.id!}
                        />
                      </div>
                    ))}
                  </ProducerTabsSlider>
                </div>
              ) : (
                events.map((item, index) => (
                  <div key={`event-${index}`} className="flex max-w-[300px]">
                    <CardEvent
                      location={item.location!}
                      name={item.name!}
                      image={item.image!}
                      blurImage={blurImage.src}
                      id={item.id!}
                    />
                  </div>
                ))
              )}
            </div>
          </TabsContent>
        );
      })}
    </Tabs>
  );
};

export default ProfileTabs;
