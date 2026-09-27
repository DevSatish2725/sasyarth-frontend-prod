import Image from "next/image";

import {
  BarChart3,
  Package,
} from "lucide-react";

interface VegetableCardProps {
  vegetable: {
    itemId: string;
    vegetableName: string;
    image?: string;
    imageUrl?: string;
    sellerPrice: number;
    marketPrice?: number;
    unit: string;
    availableQty: number;
  };
}

export default function VegetableCard({
  vegetable,
}: VegetableCardProps) {
  const unit =
    vegetable.unit.toLowerCase();

  return (
    <article
      className="
        group
        overflow-hidden
        rounded-2xl
        border
        border-[#E1EAE3]
        bg-white
        shadow-[0_1px_4px_rgba(0,0,0,0.04)]
        transition-all
        duration-200

        sm:shadow-[0_2px_8px_rgba(0,0,0,0.05)]

        sm:hover:-translate-y-0.5
        sm:hover:border-primary/20
        sm:hover:shadow-[0_6px_18px_rgba(0,0,0,0.08)]
      "
    >
      <div className="flex h-full sm:block">

        <div
          className="
            relative
            h-[118px]
            w-[112px]
            shrink-0
            overflow-hidden
            bg-[#f8faf7]

            sm:aspect-16/10
            sm:h-auto
            sm:w-full
            sm:bg-white
          "
        >
          {vegetable.imageUrl ? (
            <Image
              src={
                vegetable.imageUrl
              }
              alt={
                vegetable.vegetableName
              }
              fill
              sizes="
                (max-width: 639px) 112px,
                (max-width: 1024px) 50vw,
                33vw
              "
              className="
                object-contain
                p-2
                transition-transform
                duration-300

                sm:group-hover:scale-[1.03]
              "
            />
          ) : (
            <div
              className="
                flex
                h-full
                w-full
                items-center
                justify-center
                text-4xl

                sm:text-5xl
              "
            >
              🥬
            </div>
          )}
        </div>

        <div
          className="
            flex
            min-w-0
            flex-1
            flex-col
            justify-center
            p-3

            sm:p-4
          "
        >

          <h3
            title={
              vegetable.vegetableName
            }
            className="
              truncate
              text-sm
              font-extrabold
              leading-tight
              text-text-primary

              sm:text-lg
              sm:font-bold
            "
          >
            {vegetable.vegetableName}
          </h3>

          <div
            className="
              mt-1
              flex
              items-baseline
            "
          >
            <span
              className="
                text-lg
                font-extrabold
                leading-none
                text-primary

                sm:text-2xl
              "
            >
              ₹{vegetable.sellerPrice}
            </span>

            <span
              className="
                ml-0.5
                text-[11px]
                font-medium
                text-text-secondary

                sm:text-sm
              "
            >
              /{unit}
            </span>
          </div>

          <div
            className="
              mt-2
              flex
              items-center
              gap-1.5
              text-[11px]
              text-text-secondary

              sm:mt-4
              sm:gap-2.5
              sm:rounded-xl
              sm:bg-primary-light
              sm:px-2.5
              sm:py-2
              sm:text-sm
            "
          >
            <div
              className="
                flex
                h-6
                w-6
                shrink-0
                items-center
                justify-center
                rounded-full
                bg-primary-light
                text-primary

                sm:h-8
                sm:w-8
                sm:bg-white
              "
            >
              <Package
                className="
                  h-3.5
                  w-3.5

                  sm:h-4
                  sm:w-4
                "
                strokeWidth={2}
              />
            </div>

            <span className="truncate">
              <span
                className="
                  font-semibold
                  text-text-primary
                "
              >
                {vegetable.availableQty}{" "}
                {unit}
              </span>{" "}
              available
            </span>
          </div>

          {vegetable.marketPrice !==
            undefined && (
            <div
              className="
                mt-1.5
                flex
                items-center
                gap-1
                text-[10px]
                text-text-secondary

                sm:mt-2
                sm:px-1
                sm:text-xs
              "
            >
              <BarChart3
                className="
                  h-3
                  w-3
                  shrink-0
                  text-text-muted

                  sm:h-3.5
                  sm:w-3.5
                "
              />

              <span className="truncate">
                Market ₹
                {vegetable.marketPrice}/
                {unit}
              </span>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}