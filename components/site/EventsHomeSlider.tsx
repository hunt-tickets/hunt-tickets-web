import React, { ReactNode } from "react";
import Slider from "react-slick";

type EventsHomeSliderProps = {
  children: ReactNode;
  settings?: {
    dots?: boolean;
    infinite?: boolean;
    speed?: number;
    slidesToShow?: number;
    slidesToScroll?: number;
    autoplay?: boolean;
    autoplaySpeed?: number;
    arrows?: boolean;
    centerMode?: boolean;
    centerPadding?: string;
    responsive?: {
      breakpoint: number;
      settings: {
        slidesToShow: number;
        slidesToScroll: number;
      };
    }[];
  };
};

const EventsHomeSlider: React.FC<EventsHomeSliderProps> = ({
  children,
  settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    centerMode: false,
    arrows: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
        },
      },
      {
        breakpoint: 864,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: true,
        },
      },
    ],
  },
}) => {
  return (
    <Slider {...settings} className="custom-slider">
      {children}
    </Slider>
  );
};

export default EventsHomeSlider;
