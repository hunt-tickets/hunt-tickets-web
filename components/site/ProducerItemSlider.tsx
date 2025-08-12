import React, { ReactNode } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";

type ProducerItemSliderProps = {
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

const ProducerItemSlider: React.FC<ProducerItemSliderProps> = ({
  children,
  settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 6,
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
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
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

export default ProducerItemSlider;
