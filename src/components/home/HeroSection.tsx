"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";

import {
  ArrowRight,
  BadgeCheck,
  IndianRupee,
  Leaf,
  MapPin,
  Search,
} from "lucide-react";

const desktopHeroCarousel = [
  {
    id: 1,
    image: "/images/home/seller_image_desktop.webp",
    action: "",
    title: "For farmers/sellers",
  },
  {
    id: 2,
    image: "/images/home/buyer_image_desktop.webp",
    action: "",
    title: "For buyers",
  },
];

const mobileHeroCarousel = [
  {
    id: 1,
    image: "/images/home/seller_image_mobile.webp",
    action: "",
    title: "For farmers/sellers",
  },
  {
    id: 2,
    image: "/images/home/buyer_image_mobile.webp",
    action: "",
    title: "For buyers",
  },
];

export default function HeroSection() {
  const router = useRouter();

  const t = useTranslations("Home.hero");

  const mobileBenefits = [
    {
      icon: MapPin,
      title: t("benefits.local.title"),
      variant: "green",
    },
    {
      icon: Leaf,
      title: t("benefits.availability.title"),
      variant: "green",
    },
    {
      icon: IndianRupee,
      title: t("benefits.prices.title"),
      variant: "warm",
    },
    {
      icon: BadgeCheck,
      title: t("benefits.verified.title"),
      variant: "green",
    },
  ];

  const desktopBenefits = [
    {
      icon: MapPin,
      title: t("benefits.local.title"),
    },
    {
      icon: Leaf,
      title: t("benefits.availability.title"),
    },
    {
      icon: IndianRupee,
      title: t("benefits.prices.title"),
    },
    {
      icon: BadgeCheck,
      title: t("benefits.verified.title"),
    },
  ];

  return (
    <section
      className="
        w-full
        border-b
        border-[#e7d8b9]
        bg-[#f7f7ef]
      "
    >
      <div
        className="
          relative
          overflow-hidden
          h-[calc(100vh-12rem)]
        "
      >
        <HeroCarousel data={desktopHeroCarousel} />
      </div>
    </section>
  );
}

function HeroCarousel({
  data,
}: {
  data: { id: number; image: string; action: string; title: string }[];
}) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval>>(null);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % data.length);
    }, 4000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [data]);

  const handleSlideHover = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };

  const handleSlideLeave = () => {
    timerRef.current = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % data.length);
    }, 4000);
  };

  return (
    <div className="relative w-full h-full" onMouseEnter={handleSlideHover} onMouseLeave={handleSlideLeave}>
      <div
        className="
        hidden
        lg:flex
        h-full
        w-full
    "
      >
        {desktopHeroCarousel.map((slide) => (
          <div key={slide.id} className="relative h-full w-full shrink-0">
            <Image
              src={slide.image}
              alt=""
              fill
              priority
              sizes="50vw"
              className={`transition-transform duration-2000`}
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            />
          </div>
        ))}
      </div>
      <div className="lg:hidden flex h-full w-full">
        {mobileHeroCarousel.map((slide) => (
          <div key={slide.id} className="relative h-full w-full shrink-0">
            <Image
              src={slide.image}
              alt=""
              fill
              priority
              sizes="50vw"
              className={`transition-transform duration-2000`}
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
