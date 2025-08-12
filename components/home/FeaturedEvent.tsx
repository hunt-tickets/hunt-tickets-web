import blurImage from "@/assets/other.png";
import CardEvent from "../site/CardEvent";
import EventsHomeSlider from "../site/EventsHomeSlider";

type FeaturedEventsProps = {
  events: any[];
};

const FeaturedEvents = ({ events }: FeaturedEventsProps) => {
  return (
    <>
      <div className="w-full">
        {events.length >= 3 ? (
          /* Grid layout for all screen sizes */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6 w-full">
            {events.map((event) => (
              <div key={`event-${event.id}`} className="mx-auto">
                <CardEvent
                  location={event.venue_name!}
                  name={event.name!}
                  image={event.flyer!}
                  blurImage={blurImage.src}
                  id={event.id}
                  date={event.date || event.event_date}
                  price={event.min_price || event.price || Math.floor(Math.random() * 80000) + 20000}
                />
              </div>
            ))}
          </div>
        ) : (
          events.length > 0 && (
            <EventsHomeSlider>
              {events.map((event, index) => (
                <div key={`event-${index}`} className="px-2">
                  <CardEvent
                    id={event.id.toString()}
                    location={event.venue_name || event.location!}
                    name={event.name!}
                    image={event.flyer!}
                    blurImage={blurImage.src}
                    date={event.date || event.event_date}
                    price={event.min_price || event.price || Math.floor(Math.random() * 80000) + 20000}
                  />
                </div>
              ))}
            </EventsHomeSlider>
          )
        )}
      </div>
    </>
  );
};

export default FeaturedEvents;
